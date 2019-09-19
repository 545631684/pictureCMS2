<template>
  <el-container class="login">
    <el-main>
      <div class="body">
        <h1>赛奇<br /><span>因你而精彩</span></h1>
        <div class="mk1">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="top" class="" >
            <el-form-item label="" prop="email">
              <el-input v-model="ruleForm.email" type="email" placeholder="请输入邮箱/用户名"></el-input>
            </el-form-item>
            <el-form-item label="" prop="pw">
              <el-input v-model="ruleForm.pw" type="password" placeholder="请输入密码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item label="" prop="type">
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox label="记住密码" name="type"></el-checkbox>
                <router-link class="" tag="a" :to="{path:'/retrieveUser'}"><el-button type="text" style="float: right;">忘记密码？</el-button></router-link>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">登录</el-button>
            </el-form-item>
          </el-form>
          <router-link class="mk1_a1" tag="a" :to="{path:'/enrollUser'}">没有账号？<b>注册</b></router-link>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { loginLand} from '@/assets/js/api'
  export default {
    name: 'login',
    data() {
      return {
        ruleForm: {
          email: '',
          pw: '',
          type: this.$store.state.user.setPasswordStyle
        },
        rules: { // 邮箱和密码的判断条件
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
          ]
        }
      }
    },
    methods: {
      submitForm (formName) { // 登录提交
      	if (this.ruleForm.email === 'admin' && this.ruleForm.pw.length !== 0) {
      		// 登录方法
        	loginLand(this)
      	} else {
      		this.$refs[formName].validate((valid) => {
      		  if (valid) {
      		    // 登录方法
      		    loginLand(this)
      		  } else {
      		    this.$alert('请输入邮箱和密码', '警告', {confirmButtonText: '确定'})
      		    return false;
      		  }
      		})
      	}
      }
    },
    created () {
      // 获取本地存储数据
      this.$store.dispatch('getLocalStorage')
      // 判断vuex中setPasswordStyle（记住密码）的值做页面显示
      if (this.$store.state.user.setPasswordStyle === 'true') {
        this.ruleForm.email = this.$store.state.user.userName
        this.ruleForm.pw = this.$store.state.user.Password
        this.ruleForm.type = true
      } else {
        this.ruleForm.email = ''
        this.ruleForm.pw = ''
        this.ruleForm.type = false
      }
      
    }
  }
</script>

<style scoped>
  .login{height:100vh;background:url(../assets/images/beiji.jpg) 100% no-repeat}
	.el-main{position:relative}
	.body{width:432px;height:504px;background:#FFF;border-radius:5px;position:absolute;top:50%;left:50%;margin-left:-216px;margin-top:-252px}
	.body h1{color:#0084FF;padding:20px 0;text-align:center;font-size:50px}
	.body h1 span{margin-top:15px;color:#0084FF;font-size:22px;text-indent:22px;letter-spacing:20px;display:block;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Microsoft YaHei','Source Han Sans SC','Noto Sans CJK SC','WenQuanYi Micro Hei',sans-serif}
	.mk1{padding:0 40px}
	.mk1_a1{align-items:center;justify-content:center;width:100%;height:58px;font-size:16px;display:block;text-align:center;line-height:58px;margin-top:65px}
	.mk1_a1 b{color:#0077E6}
</style>


// WEBPACK FOOTER //
// src/components/login.vue