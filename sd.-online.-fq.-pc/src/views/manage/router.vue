<template>
  <div class="app-container">
    <div class="button">
      <el-button
        type="primary"
        @click="handleAddRole"
        style="position:absolute;right:30px;top:10px;background-color:#ee392f;border:0"
      >新建路由</el-button>
    </div>
    <el-table
      :data="routes"
      class="roles-table"
      border
      row-key="route_Id"
      :tree-props="{children: 'route_Chidren'}"
    >
      >
      <el-table-column
        align="center"
        label="路由ID"
        width="220"
      >
        <template #default="scope">
          {{ scope.row.route_Id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="路由名"
        width="220"
      >
        <template #default="scope">
          {{ scope.row.route_Name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="路由路径"
        width="220"
      >
        <template #default="scope">
          {{ scope.row.route_Url }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.route_Chidren != undefined"
            type="text"
            style="color:#ee392f"
            @click="handleNewChildRoute(scope)"
          >新建</el-button>
          <el-button
            type="text"
            style="color:#ee392f"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            type="text"
            style="color:#ee392f"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType==='edit'?'编辑路由':'新建路由'"
    >
      <el-form
        :model="route"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="路由名"
          label-width="100px"
        >
          <el-input
            v-model="route.route_Name"
            placeholder="请输入路由名"
          />
        </el-form-item>
        <el-form-item
          label="路由路径"
          label-width="100px"
        >
          <el-input
            v-model="route.route_Url"
            placeholder="请输入路由路径"
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
import { getRoute, newRoute, updateRoute, deleteRoute } from '@/api/route'

const defaultRole = {
  route_Url: '',
  route_Name: '',
  parent_Id: ''
}
export default {
  setup () {
    const { proxy } = getCurrentInstance()
    const dialogVisible = ref(false)
    const dialogType = ref('new')
    const rolesList = ref([])
    const routes = ref([])
    const checkedKeys = ref([])
    const parent = ref({})
    const isRoot = ref(false)
    onBeforeMount(async () => {
      getRoutes()
    })
    const route = ref(Object.assign({}, defaultRole))
    function handleAddRole () {
      route.value = Object.assign({}, defaultRole)
      checkedKeys.value = []
      if (proxy.$refs.tree) {
        proxy.$refs.tree.setCheckedNodes([])
      }
      dialogType.value = 'new'
      dialogVisible.value = true
      parent_Id.value = 0
      isRoot.value = true
    }
    function handleEdit (scope) {
      dialogType.value = 'edit'
      dialogVisible.value = true
      route.value = scope.row
      var route_Id
      routes.value.forEach((item) => {
        //判断该行是否有子节点
        if ("route_Chidren" in item) {
          //遍历子节点
          item.route_Chidren.forEach((item2) => {
            //判断该节点是否为我点击的节点
            if (item2.route_Id == scope.row.route_Id) {
              route_Id = item.route_Id
            }
          });
        }
      });
      parent.value.route_Id = route_Id
    }
    async function getRoutes () {
      const res = await getRoute()
      routes.value = res.data
    }
    async function confirmRole () {
      if (route.value.route_Name == '' || route.value.route_Url == '') {
        proxy.$alert('请填写内容', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
        return
      }
      const isEdit = dialogType.value === 'edit'
      if (isEdit) {
        let res = await updateRoute({ route_Url: route.value.route_Url, route_Name: route.value.route_Name, route_Id: route.value.route_Id, parent_Id: parent.value.route_Id })
        if (res.code != 200) return
        for (let index = 0; index < rolesList.length; index++) {
          if (routes.value[index].route_Id === route.value.route_Id) {
            routes.value.splice(index, 1, Object.assign({}, route.value))
            break
          }
        }
      } else {
        if (isRoot.value) {
          let res = await newRoute({ route_Name: route.value.route_Name, route_Url: route.value.route_Url, parent_Id: 0 })
          let res1 = await newRoute({ route_Name: route.value.route_Name, route_Url: route.value.route_Url, parent_Id: res.parent_Id })
          if (res1.code != 200) return
        } else {
          let res = await newRoute({ route_Name: route.value.route_Name, route_Url: parent.value.route_Url + route.value.route_Url, parent_Id: parent.value.route_Id })
          if (res.code != 200) return
        }
      }
      await getRoutes()
      const { route_Name } = route.value
      dialogVisible.value = false
      proxy.$notify({
        title: '修改成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>路由名: ${route_Name}</div>
          `,
        type: 'success'
      })
    }
    function handleDelete ({ $index, row }) {
      proxy.$confirm('是否删除该路由？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRoute(row.route_Id)
          getRoutes()
          proxy.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    }
    async function handleNewChildRoute (scope) {
      console.log(scope)
      dialogType.value = 'new'
      dialogVisible.value = true
      parent.value = scope.row
      isRoot.value = false
    }
    return {
      dialogVisible,
      handleAddRole,
      handleEdit,
      confirmRole,
      handleDelete,
      rolesList,
      routes,
      checkedKeys,
      route,
      handleNewChildRoute,
      parent
    }
  }
}
</script>