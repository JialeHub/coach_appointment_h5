<template>
  <v-container fluid class="login">
    <!--登录注册框-->
    <v-row no-gutters>
      <v-sheet class="loginSheet w100" elevation="2">
        <transition name="fade" mode="out-in">
          <!--登录-->
          <v-form ref="loginForm" key="loginForm" v-model="formRules.formValid" :lazy-validation="true">
            <v-text-field v-model="form.username" label="账号（手机号）" required error-count="0" ref="username"
                          @keyup.enter.native="passFocus"
                          :rules="formRules.usernameRules"></v-text-field>
            <v-text-field v-model="form.password" label="密码（真实姓名）" required :rules="formRules.passRules" error-count="0"
                          :type="'text'" ref="password"
            ></v-text-field>
            <v-row no-gutters justify="space-between" align="center">
              <v-checkbox v-model="form.rememberMe" label="记住我的登录信息" :ripple="false"
                          :disabled="!cookieEnabled"></v-checkbox>
            </v-row>
            <v-row justify="space-between" align="center">
              <v-btn depressed  color="primary" @click="submit" block large :loading="loginLoading">登录</v-btn>
            </v-row>
          </v-form>
        </transition>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>

import Cookies from "js-cookie"
import {login} from "@/utils/auth";
import {notEmpty} from "@/utils/globalMethod";

export default {
  name: 'Login',
  data() {
    return {
      cookieEnabled: true,
      loginLoading: false,
      formRules: {
        autoValid: true,
        formValid: true,
        usernameRules: [v => this.formRules.autoValid || /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/.test(v) || '请输入正确的手机号'],
        // passRules: [v => this.formRules.autoValid || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v) || '请输入正确的身份证号'],
        passRules: [v => this.formRules.autoValid || !!v || '请输入密码'],
      },
      form: {
        username: '',
        password: '',
        uuid: '',
        phrase: '',
        rememberMe: false,
        showPass: false
      },
      visibilityChangeFun:null
    };
  },
  mounted() {
    this.init();
    this.form.username = this.$storeGet.username;
    this.form.rememberMe = this.$storeGet.rememberMe;
    if (this.form.username === '' && this.mode === 0) {
      this.$refs.username.focus()
    } else if (this.form.password === '' && this.mode === 0) {
      this.$refs.password.focus()
    }
    this.visibilityChangeFun = ()=>{
      if(!document.hidden){
        let token = Cookies.get("token")
        if(token){
          window.location.reload()
        }
      }
    }
    document.addEventListener("visibilitychange", this.visibilityChangeFun);
  },
  props: {
    comStatus: { // 组件状态
      type: String,
      default: ''
    },
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.visibilityChangeFun)
    this.$emit('close-login-dialog')
  },
  methods: {
    passFocus() {
      this.$refs.password.focus()
    },
    init() {
      Cookies.remove(`TOKEN`);
      let lastLogin = {
        rememberMe:this.$storeGet.rememberMe,
        username:this.$storeGet.username
      }
      this.$resetStore();
      this.$storeSet('setRememberMe', lastLogin)
      if (this.comStatus === 'expireLogin') this.$storeSet('setExpireLogin', true);
    },
    async submit() {
      this.formRules.autoValid = false
      if (this.$refs.loginForm.validate()) {
        this.loginLoading = true;
        //登录
        let data = {...this.form};
        data.phrase = data.phrase.toLowerCase();
        let res = await login(data).catch(err => err);

        if (res.status === 200) {
          // 判断当前
          if (this.comStatus === 'expireLogin') {
            this.$emit('close-login-dialog')
            window.location.reload()
          } else {
            if(this.$route.query.redirect){
              window.location.href = this.$route.query.redirect
            }else{
              window.location.href = '/'
            }
          }
        } else if (res.status === 401.1) {
          alert(res['msg'] ? res['msg'] : '用户名或密码不正确。')
        } else if (notEmpty(res['msg'])) {
          alert(res['msg'])
        } else {
          alert('发生未知错误')
        }
        this.loginLoading = false;
      } else {
        alert('请输入正确的手机号或身份证号')
      }
      this.formRules.autoValid = true
    },
  },
  computed: {},
  components: {}
}
;
</script>

<style lang="scss">
.login {
  .loginSheet {
    padding: 36px 24px 38px;
  }

}

</style>
