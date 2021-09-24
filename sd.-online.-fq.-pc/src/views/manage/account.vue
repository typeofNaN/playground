<template>
  <div class="app-container">
    <div class="button">
      <el-button
        type="primary"
        @click="handleAddAccount"
        style="position:absolute;right:30px;top:10px;background-color:#ee392f;border:0"
      >新建用户</el-button>
    </div>
    <el-table
      :data="accounts"
      class="roles-table"
      border
    >
      >
      <el-table-column
        align="center"
        label="用户ID"
      >
        <template #default="scope">
          {{ scope.row.account_Id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名"
      >
        <template #default="scope">
          {{ scope.row.account_Name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="角色ID"
      >
        <template #default="scope">
          {{ scope.row.role_Id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="角色名"
      >
        <template #default="scope">
          {{ scope.row.role_Name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
      >
        <template #default="scope">
          {{ dayjs(scope.row.create_Time).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template #default="scope">
          <el-button
            type="text"
            style="color:#ee392f"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            type="text"
            style="color:#ee392f"
            v-if="scope.row.account_Id != 1"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType==='edit'?'编辑用户':'新建用户'"
    >
      <el-form
        :model="account"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="用户名"
          label-width="100px"
        >
          <el-input
            v-model="account.account_Name"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          label-width="100px"
        >
          <el-input
            v-model="account.account_Password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          label="角色"
          label-width="100px"
        >
          <el-select
            v-model="account.role_Id"
            placeholder="请选择角色"
            :disabled="account.account_Id == 1"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.role_Id"
              :label="item.role_Name"
              :value="item.role_Id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmRole"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  .button {
    position: relative;
  }
  .roles-table {
    width: 80%;
    margin: 60px auto 0 auto;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
<script>
import { computed, ref, getCurrentInstance, onBeforeMount } from 'vue'
import { getAccount, newAccount, updateAccount, deleteAccount } from '@/api/account'
import { getRoles } from '@/api/role'
import dayjs from 'dayjs'

const defaultAccount = {
  account_Id: '',
  account_Name: '',
  account_Password: '',
  role_Id: ''
}
export default {
  setup () {
    const { proxy } = getCurrentInstance()
    const dialogVisible = ref(false)
    const dialogType = ref('new')
    const rolesList = ref([])
    const accounts = ref([])
    onBeforeMount(async () => {
      getAccounts()
      getRoleList()
    })
    async function getRoleList () {
      let res = await getRoles()
      rolesList.value = res.data
    }
    const account = ref(Object.assign({}, defaultAccount))
    function handleAddAccount () {
      account.value = Object.assign({}, defaultAccount)
      dialogType.value = 'new'
      dialogVisible.value = true
    }
    function handleEdit (scope) {
      dialogType.value = 'edit'
      dialogVisible.value = true
      account.value = scope.row
    }
    async function getAccounts () {
      const res = await getAccount()
      accounts.value = res.data
    }
    async function confirmRole () {
      if (account.value.account_Name == '' || account.value.account_Password == '') {
        proxy.$alert('请填写内容', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
        return
      }
      const isEdit = dialogType.value === 'edit'
      if (isEdit) {
        let res = await updateAccount({ account_Id: account.value.account_Id, account_Name: account.value.account_Name, account_Password: account.value.account_Password, role_Id: account.value.role_Id })
        if (res.code != 200) return
      } else {
        let res = await newAccount({ account_Name: account.value.account_Name, account_Password: account.value.account_Password, role_Id: account.value.role_Id })
        if (res.code != 200) return
      }
      await getAccounts()
      const { account_Name } = account.value
      dialogVisible.value = false
      proxy.$notify({
        title: '修改成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>用户名: ${account_Name}</div>
          `,
        type: 'success'
      })
    }
    function handleDelete ({ $index, row }) {
      proxy.$confirm('是否删除该用户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteAccount(row.account_Id)
          getAccounts()
          proxy.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    }
    return {
      dialogVisible,
      handleAddAccount,
      handleEdit,
      confirmRole,
      handleDelete,
      rolesList,
      accounts,
      account,
      dayjs
    }
  }
}
</script>