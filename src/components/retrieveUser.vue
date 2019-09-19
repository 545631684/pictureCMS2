<template>
  <el-container class="login">
    <el-main>
      <div class="body">
        <h1>赛奇<br /><span>因你而精彩</span></h1>
        <div class="mk1">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="top" class="" >
            <el-form-item label="" prop="email">
              <el-input v-model="ruleForm.email" type="email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="" prop="pw">
              <el-input v-model="ruleForm.pw" type="password" placeholder="请输入修改密码"></el-input>
            </el-form-item>
            <el-form-item label="" prop="pw2">
              <el-input v-model="ruleForm.pw2" type="password" placeholder="请输入二次修改密码"></el-input>
            </el-form-item>
            <el-form-item label="" prop="yzm" inline="true">
              <el-input v-model="ruleForm.yzm" type="text" placeholder="请输入验证码" style="width: 65%; margin-right: 5%; float: left;" @keyup.enter.native="submitForm('ruleForm')"></el-input>
              <el-button type="primary" :disabled="yzmbr" @click="gitVerification" style="width: 30%; float: right;padding: 12px 0px;">{{yzmHtml}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">提交</el-button>
            </el-form-item>
          </el-form>
          <router-link class="mk1_a1" tag="a" :to="{path:'/login'}">已有账号？<b>登录</b></router-link>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { mailboxVerification, forgetpass } from '../assets/js/api'
  export default {
  	inject: ['reload'],
    name: 'retrieveUser',
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        returnTime: {},
        yzmbr: false,
        yzmHtml: "获取验证码",
        verificationServer: '',
        ruleForm: {
          email: '',
          pw: '',
          pw2: '',
          yzm: ''
        },
        rules: {
          email: [{
              required: true,
              message: '请输入邮箱地址',
              trigger: ['blur', 'change']
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            },
            {
              max: 50,
              message: '你是在逗我玩么？输入这么多！？',
              trigger: ['blur', 'change']
            }
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
          ],
          pw2: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              max: 50,
              message: '你是在逗我玩么？输入这么多！？',
              trigger: ['blur', 'change']
            },
            {
              validator: validatePass2,
              trigger: 'change'
            }
          ],
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
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 找回密码方法
            forgetpass(this)
          } else {
            this.$alert('请输入完整信息后再提交', '警告', {confirmButtonText: '确定'})
            return false;
          }
        })
      },
      gitVerification() {
        if(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.ruleForm.email)){
          this.countdown(59)
          mailboxVerification(this, this.ruleForm.email)
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
            localStorage.setItem("retrieveUserWait", wait)
          } else {
            _this.yzmbr = false
            _this.yzmHtml = '获取验证码'
            window.clearInterval(_this.returnTime)
            localStorage.setItem("retrieveUserWait", 0)
          }
        }, 1000)
      }
    },
    created () {
      if(localStorage.getItem("retrieveUserWait") > 1) {
        this.yzmbr = true
        this.yzmHtml = '重新发送(' + localStorage.getItem("retrieveUserWait") + ')'
        this.countdown(localStorage.getItem("retrieveUserWait"))
      }
    },
    beforeDestroy () {
      window.clearInterval(this.returnTime)
      this.returnTime = null
    }
  }
</script>

<style scoped>
  .login{height:100vh;background:url(../assets/images/beiji.jpg) no-repeat}
	.el-main{position:relative}
	.body{width:432px;height:504px;background:#FFF;border-radius:5px;position:absolute;top:50%;left:50%;margin-left:-216px;margin-top:-252px}
	.body h1{color:#0084FF;padding:20px 0;text-align:center;font-size:50px}
	.body h1 span{margin-top:15px;color:#0084FF;font-size:22px;text-indent:22px;letter-spacing:20px;display:block;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Microsoft YaHei','Source Han Sans SC','Noto Sans CJK SC','WenQuanYi Micro Hei',sans-serif}
	.mk1{padding:0 40px}
	.mk1_a1{align-items:center;justify-content:center;width:100%;font-size:16px;display:block;text-align:center;margin-top:25px}
	.mk1_a1 b{color:#0077E6}
</style>


// WEBPACK FOOTER //
// src/components/retrieveUser.vue