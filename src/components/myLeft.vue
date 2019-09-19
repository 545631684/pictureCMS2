<template>
	<div>
		<el-menu :default-active="isdefaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" background-color="#252a2f" text-color="#fff" active-text-color="#ffd04b" style="height:90vh;">
			<div v-for="(item, index) in userGroups.rules" :key="index">
				<div v-if="item.cityOptions === '[]' && item.checkAll === 'true'">
					<el-menu-item :index="item.index" @click="urlpage(item.urlKeyword,$event)" >
						<i :class="item.icon"></i>
						<span slot="title">{{item.name}}</span>
					</el-menu-item>
				</div>
				<div v-else-if="item.cityOptions.length >= 0 && item.cityOptions !== '[]'">
					<el-submenu :index="item.index" >
						<template slot="title">
							<i :class="item.icon"></i>
							<span slot="title">{{item.name}}</span>
						</template>
						<el-menu-item v-for="(time2, index) in item.rules" :key="index" :index="time2.index" @click="urlpage(time2.urlKeyword,$event)">
							<i :class="time2.icon"></i>
							<span slot="title">{{time2.name}}</span>
						</el-menu-item>
					</el-submenu>
				</div>
			</div>
		</el-menu>
	</div>
</template>

<script>
	export default {
		inject: ['reload'],
		name: 'myLeft',
		data() {
			return {
				isCollapse: false,
				isdefaultActive: '',
				userGroups: this.$store.state.user.auth
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			// 通过给定关键字跳转相应页面， $event在点击事件里加入函数写event可以调用当前元素的所有值
			urlpage(type, event) {
				switch(type) {
					case "img":
						this.$router.push("/backstage/img");
						this.localStorageSet(event.index)
						break;
					case "psd":
						this.$router.push("/backstage/psd");
						this.localStorageSet(event.index)
						break;
					case "video":
						this.$router.push("/backstage/video");
						this.localStorageSet(event.index)
						break;
					case "articlRecovery":
						this.$router.push("/backstage/articleRecovery");
						this.localStorageSet(event.index)
						break;
					case "statistics":
						this.$router.push("/backstage/statistics");
						this.localStorageSet(event.index)
						break;
					case "userInfo":
						this.$router.push("/backstage/userInfo");
						this.localStorageSet(event.index)
						break;
					case "userPw":
						this.$router.push("/backstage/userUpdatePassword");
						this.localStorageSet(event.index)
						break;
					case "userAuthorize":
						this.$router.push("/backstage/authorizeList");
						this.localStorageSet(event.index)
						break;
					case "userAdd":
						this.$router.push("/backstage/userAdd");
						this.localStorageSet(event.index)
						break;
					case "userList":
						this.$router.push("/backstage/userList");
						this.localStorageSet(event.index)
						break;
					case "userRecovery":
						this.$router.push("/backstage/userRecovery");
						this.localStorageSet(event.index)
						break;
					case "item":
						this.$router.push("/backstage/itemList");
						this.localStorageSet(event.index)
						break;
					case "type":
						this.$router.push("/backstage/typeList");
						this.localStorageSet(event.index)
						break;
					case "typeMin":
						this.$router.push("/backstage/typeMinList");
						this.localStorageSet(event.index)
						break;
					case "seeArticle":
						this.$router.push("/backstage/seeArticle");
						this.localStorageSet(event.index)
						break;
					case "userGroup":
						this.$router.push("/backstage/userGroup");
						this.localStorageSet(event.index)
						break;
				}
			},
			// 把导航值赋值给isdefaultActive并本地储存
			localStorageSet(index) {
				this.isdefaultActive = index
				localStorage.setItem("navigationIndex", index);
			},
			// 本地获取导航值，赋值给isdefaultActive
			localStorageGet() {
				this.isdefaultActive = localStorage.getItem("navigationIndex") || ''
			}
		},
		created() {
			// 从本地存储里获取当前导航位置并复制给isdefaultActive
			this.localStorageGet()
		}
	}
</script>

<style scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse){width:200px;min-height:400px}
	.tishi{display:inline-block;float:inherit;background-color:red;border-radius:10px;padding:2px 5px;height:15px;line-height:15px;color:#ffff!important;font-size:14px;font-weight:700;font-style:inherit;margin:-5px 0 0 5px}
</style>


// WEBPACK FOOTER //
// src/components/myLeft.vue