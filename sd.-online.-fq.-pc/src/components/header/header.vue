<template>
  <div class="header">
    <div class="header-body">
      <div
        class="menu"
        @click="handleClick"
      >
        <el-image
          class="logo"
          :src="menuIcon"
        ></el-image>
      </div>
      <div style="float:left;display:flex;width:50%">
        <el-image
          class="logo"
          :src="logo"
        ></el-image>
      </div>
      <el-tooltip
        class="item"
        effect="light"
        :content="connectionStatus == 0?'未连接':connectionStatus == 1?'重连中':'已连接'"
        placement="left"
      >
        <div
          class="status"
          v-if="canVideo"
          :style="{backgroundColor:connectionStatus == 0?'#909399':connectionStatus == 1?'#409EFF':'#67C23A'}"
        ></div>
      </el-tooltip>
      <div class="dropdown">
        <el-dropdown
          trigger="hover"
          class="dropdown"
        >
          <span
            class="el-dropdown-link"
            style="line-height:16px;vertical-align: middle;"
          >
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                icon="el-icon-close"
                @click="logout"
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <Menu
      v-show="showMenu"
      @hideMenu="hideMenu"
    />
  </div>
</template>
<style lang='scss' scoped>
.header {
  background-color: white;
  width: 100%;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  .header-body {
    height: 59px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    position: relative;
    border-bottom: 1px solid #dcdfe6;
    z-index: 2000;
    .menu {
      background: #ee392f;
      display: flex;
      flex-direction: column;
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      position: relative;
      .logo {
        width: 24px;
        height: 22px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        flex-shrink: 0;
        user-select: none;
      }
    }
    .menu:active {
      background: #c43129;
    }
    .logo {
      width: 220px;
      height: 40px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      left: 40px;
      flex-shrink: 0;
      user-select: none;
    }
    .status {
      width: 14px;
      height: 14px;
      background-color: #909399;
      border-radius: 50%;
      margin-left: 8px;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      right: 110px;
    }
    .dropdown {
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
      right: 40px;
      flex-shrink: 0;
      position: absolute;
    }
  }
}
</style>
<style>
.el-dropdown-menu__item:hover {
  background-color: #ee382f11 !important;
  color: #ee392f;
}
</style>
<script>
import { ref, getCurrentInstance, watch, computed } from 'vue'
import { useStore } from 'vuex'
import router from '../../router'
import logo from '@/assets/logo.png'
import Menu from '../menu/menu.vue'
import menuIcon from '@/assets/icon/menu.png'

export default {
  components: { Menu },
  setup () {
    let { ctx, proxy } = getCurrentInstance();
    const store = useStore()
    const showMenu = ref(false)
    const userName = ref(store.getters.name)
    const canVideo = ref(store.getters.canVideo)
    const connectionStatus = computed(() => store.getters.connectionStatus)
    watch(connectionStatus, (val) => {
    })
    function hideMenu () {
      showMenu.value = false
    }
    function handleClick () {
      showMenu.value = !showMenu.value
    }
    function logout () {
      proxy.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout')
          .then(() => {
            console.log('注销成功')
            router.push('/login')
          })
      })
    }
    return {
      showMenu,
      hideMenu,
      logout,
      userName,
      canVideo,
      connectionStatus,
      logo,
      menuIcon,
      handleClick
    }
  }
}
</script>