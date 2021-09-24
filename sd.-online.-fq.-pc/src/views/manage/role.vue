<template>
  <div class="app-container">
    <div class="button">
      <el-button
        type="primary"
        @click="handleAddRole"
        style="position:absolute;right:30px;top:10px;background-color:#ee392f;border:0"
      >新建角色</el-button>
    </div>
    <el-table
      :data="rolesList"
      class="roles-table"
      border
    >
      <el-table-column
        align="center"
        label="角色ID"
        width="220"
      >
        <template #default="scope">
          {{ scope.row.role_Id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="角色名"
        width="220"
      >
        <template #default="scope">
          {{ scope.row.role_Name }}
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
            v-if="scope.row.role_Id != 1"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType==='edit'?'编辑角色':'新建角色'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="角色名"
          label-width="100px"
        >
          <el-input
            v-model="role.role_Name"
            placeholder="请输入角色名"
          />
        </el-form-item>
        <el-form-item
          label="可访问页面"
          label-width="100px"
        >
          <el-tree
            ref="tree"
            :data="routes"
            :props="defaultProps"
            show-checkbox
            class="permission-tree"
            node-key="route_Id"
            :default-checked-keys="checkedKeys"
          />
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
import { getRoles, addRole, deleteRole, updateRole, getRoleRoute } from '@/api/role'
import { getRoute } from '@/api/route'

const defaultRole = {
  role_Id: '',
  role_Name: '',
  routes: []
}
export default {
  setup () {
    const { proxy } = getCurrentInstance()
    const dialogVisible = ref(false)
    const role = ref(Object.assign({}, defaultRole))
    const dialogType = ref('new')
    const rolesList = ref([])
    const routes = ref([])
    const defaultProps = ref({
      children: 'route_Chidren',
      label: 'route_Name'
    })
    const checkedKeys = ref([])
    onBeforeMount(async () => {
      getRoutes()
      getRole()
    })

    function handleAddRole () {
      role.value = Object.assign({}, defaultRole)
      checkedKeys.value = []
      if (proxy.$refs.tree) {
        proxy.$refs.tree.setCheckedNodes([])
      }
      dialogType.value = 'new'
      dialogVisible.value = true
    }
    function handleEdit (scope) {
      dialogType.value = 'edit'
      dialogVisible.value = true
      role.value = scope.row
    }
    async function getRoutes () {
      const res = await getRoute()
      routes.value = res.data
    }
    async function getRole () {
      const res = await getRoles()
      rolesList.value = res.data
      rolesList.value.forEach(async (val) => {
        let res1 = await getRoleRoute(val.role_Id)
        res1.data.forEach((val) => {
          checkedKeys.value.push(val.route_Id)
          val.route_Chidren.forEach((childVal) => {
            checkedKeys.value.push(childVal.route_Id)
          })
        })
      })
    }
    async function confirmRole () {
      const checkedKeys = proxy.$refs.tree.getCheckedKeys()
      if (role.value.role_Name == '' || checkedKeys.value == []) {
        proxy.$alert('请填写内容', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
        return
      }
      const isEdit = dialogType.value === 'edit'
      console.log(checkedKeys)
      if (isEdit) {
        let res = await updateRole({ role_Id: role.value.role_Id, role_Name: role.value.role_Name, route_Ids: checkedKeys.join(',') })
        if (res.code != 200) return
        for (let index = 0; index < rolesList.length; index++) {
          if (rolesList.value[index].role_Id === role.value.role_Id) {
            rolesList.value.splice(index, 1, Object.assign({}, role.value))
            break
          }
        }
      } else {
        let res = await addRole({ role_Name: role.value.role_Name, route_Ids: checkedKeys.join(',') })
        if (res.code != 200) return
      }
      const res = await getRoles()
      rolesList.value = res.data
      const { role_Id, role_Name } = role.value
      dialogVisible.value = false
      proxy.$notify({
        title: '修改成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色名: ${role_Name}</div>
          `,
        type: 'success'
      })
    }
    function handleDelete ({ $index, row }) {
      proxy.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row.role_Id)
          rolesList.value.splice($index, 1)
          proxy.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    }
    return {
      dialogVisible,
      handleAddRole,
      handleEdit,
      confirmRole,
      handleDelete,
      role,
      rolesList,
      routes,
      defaultProps,
      checkedKeys
    }
  }
}
</script>