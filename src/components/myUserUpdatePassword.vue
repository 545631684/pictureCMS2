<template>
    <el-container style="margin: 200px 200px 0;">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="left" label-width="80px" class="" >
        <el-form-item label="新密码" prop="pw">
          <el-input v-model="ruleForm.pw" type="password" placeholder="请输入修改密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="yzm" inline="true">
          <el-input v-model="ruleForm.yzm" type="text" placeholder="请输入验证码" style="width: 65%; margin-right: 5%; float: left;"></el-input>
          <el-button type="primary" :disabled="yzmbr" @click="gitVerification" style="width: 30%; float: right;padding: 12px 0px;">{{yzmHtml}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')" style="display: block;width: 50%;  float: left;">提交</el-button>
        </el-form-item>
      </el-form>
    </el-container>
</template>

<script>
import { judgeName, mailboxVerification, updatePwd } from '../assets/js/api'
export default {
		inject: ['reload'],
    name: 'myUserUpdatePassword',
    data() {
      return {
        loading: false,
        returnTime: {},
        yzmbr: false,
        yzmHtml: "获取验证码",
        verificationServer: '',
        ruleForm: {
          pw: '',
          yzm: ''
        },
        rules: { // 密码、验证码的判断条件
          yzm: [{
              required: true,
              message: '请输入验证码',
              trigger: 'blur'
            },
            {
              max: 6,
              message: '验证码为6位数，请重新输入',
              trigger: ['blur', 'change']
            },
            {
              pattern: /^[0-9]*$/,
              message: '请正确输入验证码',
              trigger: ['blur', 'change']
            },
          ],
          pw: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,}$/,
              message: '输入密码过于简单请重新输入（数字、首字母大写、字母三选二）',
              trigger: ['blur', 'change']
            },
            {
              max: 50,
              message: '你是在逗我玩么？输入这么多！？',
              trigger: ['blur', 'change']
            }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) { // 登录提交
      	console.log()
      	if (this.$store.state.user.userName === 'admin') {
      		this.$alert('最高管理员请通过数据库直接修改！', '警告', {confirmButtonText: '确定'})
      	} else {
      		this.$refs[formName].validate((valid) => {
      		  if (valid) {
      		    // 按钮状态值更新
      		    this.loading = true
      		    // 修改密码
      		    updatePwd(this, formName)
      		  } else {
      		    this.$alert('请输入密码和验证码后再提交！', '警告', {confirmButtonText: '确定'})
      		    return false;
      		  }
      		})
      	}
      },
      gitVerification() {
      	if (this.$store.state.user.userName === 'admin') {
      		this.$alert('最高管理员无法获取邮箱验证码！', '警告', {confirmButtonText: '确定'})
      	} else if(this.$store.state.user.userName.length > 1){
          this.countdown(59)
          mailboxVerification(this, this.$store.state.user.userName)
        } else {
          this.$alert('请输入邮箱', '警告', {confirmButtonText: '确定'})
        }
        
      },
      countdown (wait) {
        var _this = this
        this.returnTime = {}
        this.returnTime = setInterval(function () {
          if (wait !== 1) {
            _this.yzmbr = true
            _this.yzmHtml = '重新发送(' + wait + ')'
            wait--
            localStorage.setItem("myUserUpdatePasswordWait", wait)
          } else {
            _this.yzmbr = false
            _this.yzmHtml = '获取验证码'
            window.clearInterval(_this.returnTime)
            localStorage.setItem("myUserUpdatePasswordWait", 0)
          }
        }, 1000)
      }
    },
    created () {
      if(localStorage.getItem("myUserUpdatePasswordWait") > 1) {
        this.yzmbr = true
        this.yzmHtml = '重新发送(' + localStorage.getItem("myUserUpdatePasswordWait") + ')'
        this.countdown(localStorage.getItem("myUserUpdatePasswordWait"))
      }
    },
    beforeDestroy () {
      window.clearInterval(this.returnTime)
      this.returnTime = null
    }
}
</script>

<style scoped>
</style>


// WEBPACK FOOTER //
// src/components/myUserUpdatePassword.vue