<template>
  <div class="usrtAdd">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="left" label-width="80px" class="">
      <el-form-item label="用户名" prop="email">
        <el-input v-model="ruleForm.email" type="email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pw">
        <el-input v-model="ruleForm.pw" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" style="display: block;width: 60%; margin:20px auto 0;">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { judgeName, guanliAddUser } from '../assets/js/api'
export default {
		inject: ['reload'],
    name: 'myUserAdd',
    data() {
      // 通过接口查询当前创建的用户邮箱有没有被注册
      var userNameRepeat = (rule, value, callback) => {
        /**
         * this.clearValidate(formName) // 清除整个表单的校验
         * callback: 语法：callback(new Error('XXX'))，如果验证全部通过可以这样写callback()
         * */
        if (this.ruleForm.email.length === 0) {
          callback(new Error('请输入邮箱地址'))
        } else if (this.ruleForm.email.length > 50) {
          callback(new Error('你是在逗我玩么？输入这么多！？'))
        } else if (!(/^[A-Za-z0-9/\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.ruleForm.email))) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          judgeName(this, callback)
        }
        
      }
      return {
        loading: false,
        ruleForm: {
          email: '',
          pw: '',
          type: this.$store.state.user.setPasswordStyle
        },
        rules: { // 邮箱和密码的判断条件
          email: [{
              validator: userNameRepeat,
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 按钮状态值更新
            this.loading = true
            // 注册接口
            guanliAddUser(this, formName)
          } else {
            this.$alert('请输入邮箱和密码', '警告', {confirmButtonText: '确定'})
            return false;
          }
        })
      }
    }
}
</script>

<style scoped>
.usrtAdd{width: 300px; height: auto; margin: 50px 100px;}
</style>


// WEBPACK FOOTER //
// src/components/myUserAdd.vue