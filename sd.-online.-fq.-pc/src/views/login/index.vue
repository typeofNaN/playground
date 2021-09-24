<template>
  <div class="login-container">
    <div class="bg1"></div>
    <div class="bg2"></div>
    <el-row class="row">
      <el-col
        :span="8"
        :offset="4"
        class="row-leftCol"
      >
        <div style="position: relative;top: 50%;transform: translateY(-50%);">
          <el-image
            class="logo"
            :src="logo"
            :fit="fit"
          ></el-image>
          <div class="title">线上赋强 • 云上公证</div>
          <div class="divider"></div>
          <div
            class="content"
            v-html="space"
          ></div>
          <div
            class="foot"
            v-html="foot1"
          ></div>
        </div>
      </el-col>
      <el-col
        :span="10"
        class="row-rightCol"
      >
        <div class="login-form">
          <div class="title">登录</div>
          <div class="form">
            <div class="box">
              <div style="height:100%;margin:0 10px">
                <el-image
                  :src="account"
                  style="height:20px;width:20px;top: 50%;transform: translateY(-50%);"
                ></el-image>
              </div>
              <input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                class="input"
              />
            </div>
            <div class="box">
              <div style="height:100%;margin:0 10px">
                <el-image
                  :src="pwd"
                  style="height:20px;width:20px;top: 50%;transform: translateY(-50%);"
                ></el-image>
              </div>
              <input
                ref="password"
                v-model="loginForm.password"
                type="password"
                show-password
                placeholder="密码"
                name="password"
                @keyup.enter="handleLogin"
                class="input"
              />
            </div>
            <div class="box">
              <div style="height:100%;margin:0 10px">
                <el-image
                  :src="valid"
                  style="height:20px;width:20px;top: 50%;transform: translateY(-50%);"
                ></el-image>
              </div>
              <input
                ref="validcode"
                v-model="loginForm.validcode"
                type="text"
                placeholder="验证码"
                name="validcode"
                @keyup.enter="handleLogin"
                class="input"
              />
              <ValidCode
                ref="ValidCode"
                :value.sync="code"
                @update:value="code = $event"
                :height="84"
              ></ValidCode>
            </div>
            <el-button
              :loading="loading"
              type="primary"
              @click.prevent="handleLogin"
              class="login-button"
            >登录</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { ref, computed, nextTick, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ValidCode from '../../components/validCode/validCode.vue'
import logo from '@/assets/logo.png'
import account from '@/assets/icon/account.png'
import pwd from '@/assets/icon/password.png'
import valid from '@/assets/icon/valid.png'

export default {
  components: {
    ValidCode
  },
  data () {
    return {
      space: '&emsp;&emsp;顺德公证处与顺德农商银行合作，在普惠金融平台下建设线上赋强公证模块；使申请人在签订贷款合同时进行线上赋强公证；优化金融贷款营商环境，降低金融债权实现成本，保护银行权益。',
      foot1: '使用线上赋强前必读&emsp;&emsp;&emsp;法律声明与隐私政策&emsp;&emsp;&emsp;帮助文档'
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    let { ctx, proxy } = getCurrentInstance();
    const loginForm = ref({
      username: '',
      password: '',
      validcode: ''
    })
    const loading = ref(false)
    const code = ref('')
    async function handleLogin () {
      //if (loginForm.value.username == '' && loginForm.value.password == '' && loginForm.value.validcode == '') {
      if (loginForm.value.username == '' && loginForm.value.password == '') {
        proxy.$alert('请输入用户名和密码！', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
        return
      }
      //将验证码转换为小写后再比较
      /*       if (loginForm.value.validcode.toLowerCase() != code.value.toLowerCase()) {
              proxy.$alert('验证码错误！', '提示', {
                confirmButtonText: '确定',
                type: 'error'
              });
              proxy.$refs.ValidCode.createdCode()
              loginForm.value.validcode = ''
              return
            } */
      loading.value = true
      await nextTick()
      store.dispatch('user/login', {
        username: loginForm.value.username,
        password: loginForm.value.password
      })
        .then(() => {
          console.log('登录成功跳转')
          router.push('/')
          loading.value = false
        })
        .catch((err) => {
          loading.value = false
          proxy.$alert('登录失败', '提示', {
            confirmButtonText: '确定',
          });

        })
    }
    return {
      handleLogin,
      loginForm,
      loading,
      code,
      account,
      logo,
      pwd,
      valid
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  background-color: $bg;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .bg1 {
    position: absolute;
    left: 0;
    width: 118px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(254, 189, 186, 0.3) 0%,
      #ffffff 27%,
      #ffffff 100%
    );
    opacity: 1;
  }
  .bg2 {
    position: absolute;
    right: 0;
    width: 471px;
    height: 100%;
    background: #ee392f;
    opacity: 1;
  }
  .row {
    height: 100%;
    .row-leftCol {
      .logo {
        width: 219px;
        height: 42px;
        margin: 0 0 0 0;
      }
      .title {
        width: 300px;
        margin: 60px 0 0 0;
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 51px;
        color: #3b3b3b;
        letter-spacing: 2px;
      }
      .divider {
        margin: 30px 0 0 0;
        width: 399px;
        height: 0px;
        border: 1px solid #d4d4d4;
      }
      .content {
        margin: 30px 0 0 0;
        width: 399px;
        font-size: 14px;
        font-weight: 400;
        line-height: 36px;
        color: #848484;
        letter-spacing: 1px;
      }
      .foot {
        margin: 125px 0 0 0;
        width: 586px;
        height: 16px;
        font-size: 12px;
        font-weight: 400;
        color: #c4c4c4;
      }
    }
    .row-rightCol {
      .login-form {
        margin: 0 auto;
        width: 437px;
        height: 440px;
        background: #ffffff;
        box-shadow: 0px 6px 12px rgba(120, 46, 46, 0.2);
        border-radius: 10px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
      .title {
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        font-size: 22px;
        color: #ee392f;
        text-align: center;
        font-weight: bold;
      }
      .form {
        position: absolute;
        left: 0;
        right: 0;
        top: 70px;
        display: flex;
        flex-direction: column;
        .box {
          margin-top: 40px;
          box-sizing: border-box;
          width: 360px;
          height: 44px;
          border: 1px solid #c2c2c2;
          border-radius: 10px;
          margin-top: 27px;
          margin-left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: row;
          .input {
            width: 310px;
            height: 42px;
            background: #ffffff;
            outline-style: none;
            box-sizing: border-box;
            outline: none;
            border: 0;
            font-size: 18px;
          }
        }
        .input::placeholder {
          font-size: 14px;
          font-weight: 300;
          color: #9a9aa7;
        }
        .svg-container {
          padding: 6px 5px 6px 15px;
          color: $dark_gray;
          vertical-align: middle;
          width: 30px;
          height: 30px;
          display: inline-block;
        }
        .login-button {
          margin: 60px auto 0 auto;
          width: 360px;
          height: 44px;
          background: #ee392f;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
          color: #ffffff;
          border: 0;
          outline: none;
        }
      }
    }
  }
}
</style>