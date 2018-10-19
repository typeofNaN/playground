<template>
  <div id="signin">
    <form ref="loginform">
      <label>用户名：</label>
      <input v-model="loginform.username" type="text" />
      <label>密码：</label>
      <input v-model="loginform.password" type="text" />
      <button @click="login">登录</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loginform: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      let {username, password} = this.loginform
      axios.post('url', {
        username: username,
        password: password
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
