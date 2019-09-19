import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

/**
 * 正常加载模板方式
 */
//import Index from '@/components/index'
//import Backstage from '@/components/backstage'
//import MyImages from '@/components/myImages'
//import MyImagesUpdate from '@/components/myImagesUpdate'
//import MyPsd from '@/components/myPsd'
//import MyPsdUpdate from '@/components/myPsdUpdate'
//import MyVideo from '@/components/myVideo'
//import MyVideoUpdate from '@/components/myVideoUpdate'
//import MyArticleRecovery from '@/components/myArticleRecovery'
//import MyStatistics from '@/components/myStatistics'
//import MyUserInfo from '@/components/myUserInfo'
//import MyUserUpdatePassword from '@/components/myUserUpdatePassword'
//import MyAuthorizeList from '@/components/myAuthorizeList'
//import MyUserAdd from '@/components/myUserAdd'
//import MyUserList from '@/components/myUserList'
//import MyUserRecovery from '@/components/myUserRecovery'
//import MyItemList from '@/components/myItemList'
//import MyTypeList from '@/components/myTypeList'
//import MyTypeMinList from '@/components/myTypeMinList'
//import MySeeArticle from '@/components/mySeeArticle'
//import MyUserGroup from '@/components/myUserGroup'
//import Login from '@/components/login'
//import RetrieveUser from '@/components/retrieveUser'
//import EnrollUser from '@/components/enrollUser'

/**
 * 懒加载模板方式
 */
const Index = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/index.vue')
const Backstage = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/backstage.vue')
const MyImages = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myImages.vue')
const MyImagesUpdate = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myImagesUpdate.vue')
const MyPsd = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myPsd.vue')
const MyPsdUpdate = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myPsdUpdate.vue')
const MyVideo = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myVideo.vue')
const MyVideoUpdate = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myVideoUpdate.vue')
const MyArticleRecovery = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myArticleRecovery.vue')
const MyStatistics = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myStatistics.vue')
const MyUserInfo = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myUserInfo.vue')
const MyUserUpdatePassword = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myUserUpdatePassword.vue')
const MyAuthorizeList = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myAuthorizeList.vue')
const MyUserAdd = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myUserAdd.vue')
const MyUserList = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myUserList.vue')
const MyUserRecovery = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myUserRecovery.vue')
const MyItemList = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myItemList.vue')
const MyTypeList = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myTypeList.vue')
const MyTypeMinList = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myTypeMinList.vue')
const MySeeArticle = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/mySeeArticle.vue')
const MyUserGroup = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/myUserGroup.vue')
const Login = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/login.vue')
const RetrieveUser = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/retrieveUser.vue')
const EnrollUser = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/enrollUser.vue')
const Search = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/search.vue')
const Article = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/article.vue')
const ArticleVideo = () =>
	import( /* webpackChunkName: "group-foo" */ '@/components/articleVideo.vue')

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			name: 'Index',
			component: Index
		},
		{
			// 登录
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			// 找回密码
			path: '/retrieveUser',
			name: 'RetrieveUser',
			component: RetrieveUser
		},
		{
			// 注册用户
			path: '/enrollUser',
			name: 'EnrollUser',
			component: EnrollUser
		},
		{
			// 文章页（图片、psd）
			path: '/article/:id/:name/:tid/:searchTerms',
			name: 'article',
			component: Article,
			beforeEnter: (to, from, next) => {
				// 判断是否登录,没有登录不能查看所有页面
				store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
				if(store.state.user.userName !== '' || store.state.userName.length !== null) {
					if(store.state.user.state === '1') {
						next()
					} else {
						next('/login')
					}
				} else {
					next('/login')
				}
			}
		},
		{
			// 视频页
			path: '/articleVideo/:id/:name/:tid/:searchTerms',
			name: 'articleVideo',
			component: ArticleVideo,
			beforeEnter: (to, from, next) => {
				// 判断是否登录,没有登录不能查看所有页面
				store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
				if(store.state.user.userName !== '' || store.state.userName.length !== null) {
					if(store.state.user.state === '1') {
						next()
					} else {
						next('/login')
					}
				} else {
					next('/login')
				}
			}
		},
		{
			// 前台用户搜索
			path: '/search/:searchTerms',
			name: 'Search',
			component: Search,
			beforeEnter: (to, from, next) => {
				// 判断是否登录,没有登录不能查看所有页面
				store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
				if(store.state.user.userName !== '' || store.state.userName.length !== null) {
					if(store.state.user.state === '1') {
						next()
					} else {
						next('/login')
					}
				} else {
					next('/login')
				}
			}
		},
		{
			// 后台
			path: '/backstage',
			name: '',
			component: Backstage,
			beforeEnter: (to, from, next) => {
				// 判断是否登录,没有登录不能查看所有页面
				store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
				if(store.state.user.userName !== '' || store.state.userName.length !== null) {
					if(store.state.user.state === '1') {
						next()
					} else {
						next('/login')
					}
				} else {
					next('/login')
				}
			},
			children: [{
					// 默认页
					path: '/',
					name: 'mren',
					component: MyUserInfo,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// img图片上传
					path: 'img',
					name: 'MyImages',
					component: MyImages,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// img图片修改
					path: 'imgUpdate/:id',
					name: 'MyImagesUpdate',
					component: MyImagesUpdate,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// psd文件上传
					path: 'psd',
					name: 'MyPsd',
					component: MyPsd,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// psd文件修改
					path: 'psdUpdate/:id',
					name: 'MyPsdUpdate',
					component: MyPsdUpdate,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 视频上传
					path: 'video',
					name: 'MyVideo',
					component: MyVideo,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 视频文件修改
					path: 'videoUpdate/:id',
					name: 'MyVideoUpdate',
					component: MyVideoUpdate,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 文章查看
					path: 'seeArticle',
					name: 'MySeeArticle',
					component: MySeeArticle,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 文章回收站
					path: 'articleRecovery',
					name: 'MyArticleRecovery',
					component: MyArticleRecovery,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 统计页面
					path: 'statistics',
					name: 'MyStatistics',
					component: MyStatistics,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户信息
					path: 'userInfo',
					name: 'MyUserInfo',
					component: MyUserInfo,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户密码修改
					path: 'userUpdatePassword',
					name: 'MyUserUpdatePassword',
					component: MyUserUpdatePassword,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户授权下载请求
					path: 'authorizeList',
					name: 'MyAuthorizeList',
					component: MyAuthorizeList,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户添加
					path: 'userAdd',
					name: 'MyUserAdd',
					component: MyUserAdd,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户列表
					path: 'userList',
					name: 'MyUserList',
					component: MyUserList,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户回收站
					path: 'userRecovery',
					name: 'MyUserRecovery',
					component: MyUserRecovery,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 用户组管理
					path: 'userGroup',
					name: 'MyUserGroup',
					component: MyUserGroup,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 项目管理
					path: 'itemList',
					name: 'MyItemList',
					component: MyItemList,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 类型管理
					path: 'typeList',
					name: 'MyTypeList',
					component: MyTypeList,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
				{
					// 小类型管理
					path: 'typeMinList',
					name: 'MyTypeMinList',
					component: MyTypeMinList,
					beforeEnter: (to, from, next) => {
						// 判断是否登录,没有登录不能查看所有页面
						store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
						if(store.state.user.userName !== '' || store.state.userName.length !== null) {
							if(store.state.user.state === '1') {
								next()
							} else {
								next('/login')
							}
						} else {
							next('/login')
						}
					}
				},
			]
		},
		{
			// 404
			path: '*',
			name: 'Index',
			component: Index
		}
	]
})