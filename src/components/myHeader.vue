<template>
  <div class="header">
    <h1 class="header-title"><img src="@/assets/images/logo.png" alt="" style="width: 5%; margin-right: 1vw;"/>赛奇医健</h1>
    <div class="header-right">
      <el-dropdown @command="urlpage($event)">
        <span class="el-dropdown-link" style="color: #FFFFFF;">
    			用户名称：{{name}}<i class="el-icon-arrow-down el-icon--right"></i>
      	</span>
        <el-dropdown-menu split-button slot="dropdown" >
          <el-dropdown-item command="index">返回前台</el-dropdown-item>
          <el-dropdown-item command="quit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { cancellationUser } from '../assets/js/api'
  export default {
  	inject: ['reload'],
    name: 'myHeader',
    data() {
      return {
      	name: this.$store.state.user.nickname || this.$store.state.user.userName
      }
    },
    methods: {
      urlpage(command) {
        switch(command) {
          case "index":
            this.$router.push("/");
            break;
          case "quit":
            cancellationUser(this)
            break;
        }
      }
    }
  }
</script>

<style scoped>
	.header .header-title{font-size:30px;color:#FFF;width:40%;height:auto;float:left;line-height:10vh}
	.header .header-right{float:right;width:10%;text-align:center;position:absolute;bottom:10px;right:0;color:#fff}
  .header .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {background-color: #51b998;color: #FFFFFF;}
</style>


// WEBPACK FOOTER //
// src/components/myHeader.vue