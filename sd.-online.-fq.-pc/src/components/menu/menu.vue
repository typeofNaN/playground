<template>
  <transition
    name="fade"
    enter-active-class="animate__animated animate__fadeIn animate__faster"
    leave-active-class="animate__animated animate__fadeOut animate__faster"
    :duration="500"
  >

    <div class="container">
      <div class="menu">
        <el-menu
          :default-active="currentPageIndex"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          :router="true"
          :collapse="false"
        >
          <template v-for="item in routes">
            <div v-if="item.name != 'redirect'">
              <el-menu-item
                v-if="!item.children || item.children.length === 0"
                :index="item.path"
              >
                <i :class="item.meta.icon"></i>
                <template #title>{{item.meta.title}}</template>
              </el-menu-item>
              <template v-else-if="item.children.length === 1">
                <el-menu-item
                  v-for="e in item.children"
                  :key="e.path"
                  :index="e.path"
                >
                  <i :class="e.meta.icon"></i>
                  <template #title>{{e.meta.title}}</template>
                </el-menu-item>
              </template>
              <el-submenu
                v-else
                :index="item.path"
              >
                <template #title>
                  <i :class="item.meta.icon"></i>
                  <span>{{item.meta.title}}</span>
                </template>
                <div v-for="subItem in item.children">
                  <el-menu-item :index="subItem.path">{{ subItem.meta.title }}</el-menu-item>
                </div>
              </el-submenu>
            </div>
          </template>
        </el-menu>
      </div>
      <div
        class="shade"
        @click="$emit('hideMenu')"
      ></div>
    </div>
  </transition>
</template>
<script>
import { ref, getCurrentInstance, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup () {
    const store = useStore()
    let { ctx, proxy } = getCurrentInstance();
    const router = useRouter()
    const route = useRoute()
    const currentPageIndex = ref(router.currentRoute.value.path)

    // 获取权限路由
    const routes = computed(
      () => store.getters.permission_routes.filter((item) => !item.hidden) || []
    )
    watch(currentPageIndex, () => {

    })
    async function handleSelect (val) {
      proxy.$emit('hideMenu')
    }
    function activeMenu () {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (path.indexOf('/') == -1) {
        return path
      } else {
        return path
      }
    }
    return {
      currentPageIndex,
      handleSelect,
      routes,
      activeMenu
    }
  }
}
</script>
<style>
.el-menu-item.is-active {
  color: #ee392f;
  background-color: #ee382f11;
}
.el-menu-item:hover {
  background: #ee382f11 !important;
}
</style>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100% - 60px);
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 100;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  top: 60px;
  .menu {
    width: 200px;
    height: 100%;
    background: #ffffff;
    opacity: 1 !important;
    .el-menu-vertical-demo {
      height: 100%;
      border: 0;
    }
  }
  .shade {
    width: calc(100% - 200px);
    height: 100%;
  }
}
</style>