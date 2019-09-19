<template>
	<el-container>
		<el-header class="head">
			<div class="div">
				<router-link tag="a" class="" to="/"><img src="/static/sqlog.png" alt="" /></router-link>
				<dl>
					<dd v-if="!show">
	  				<router-link tag="a" class="" to="/login">登陆</router-link> | <router-link tag="a" class="" to="/enrollUser">注册</router-link>
	  			</dd>
					<dd v-if="show">
						<el-dropdown @command="urlpage($event)">
							<span class="el-dropdown-link omit" style="color: #FFFFFF;">
			    			<img :src="HeadPortraitSrc" alt="" /><span>{{name}}</span>
			      	</span>
							<el-dropdown-menu split-button slot="dropdown">
								<el-dropdown-item command="backstage">返回后台</el-dropdown-item>
								<el-dropdown-item command="quit">退出登录</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</dd>
				</dl>
			</div>
		</el-header>
	</el-container>
</template>

<script>
	import { cancellationUser } from '../assets/js/api'
	export default {
		inject: ['reload'],
		name: 'index',
		data() {
			return {
				HeadPortraitSrc: '',
				name: '',
				show: false
			}
		},
		methods: {
			// 登录状态下 下拉菜单点击跳转链接
			urlpage(command) {
				switch(command) {
					case "backstage":
						this.$router.push("/backstage");
						break;
					case "quit":
						cancellationUser(this)
						break;
				}
			}
		},
		created() {
			// 获取本地存储用户信息
			this.$store.dispatch('getLocalStorage', this.$store.state.user)
		    if (this.$store.state.user.state === '1') {
		      this.name = this.$store.state.user.nickname || this.$store.state.user.name
		      this.HeadPortraitSrc = this.URLS + this.$store.state.user.HeadPortraitSrc
		      this.show = true
		    } else {
		      this.show = false
		    }
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.head{background: #252a2e; height: auto !important;}
	.head .div{width: 1200px; margin: 15px auto; height: 60px;}
	.head .div img{display: block; float: left;}
	.head .div dl{display: block; float: right;height: 60px; width: 15%;}
	.head .div dl dd{height: 60px;color: #FFFFFF; line-height: 60px; font-size: 20px; cursor:pointer}
	.head .div dl dd a{ color: #FFFFFF; line-height: 60px; font-size: 20px; padding: 0 15px;}
	.head .div dl dd .el-dropdown-link span{ display: block; float: left; width: 39%;}
	.head .div dl dd .el-dropdown-link img{display: block; float: left;width: 44px;height: 44px;border-radius: 50px;margin: 8px 10px;}
	.head .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {background-color: #51b998;color: #FFFFFF;}
</style>


// WEBPACK FOOTER //
// src/components/myWebHeader.vue