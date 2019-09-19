// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// elementUI 框架样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 本地存储
import VueLocalStorage from 'vue-localstorage'
// 图片懒加载
import VueLazyLoad from 'vue-lazyload'
// 阿里云字体图标
import './assets/fonts/3/iconfont.css'
import './assets/fonts/3/iconfont.js'
// 统计图标
import echarts from 'echarts'
// 前台图片查看组件
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// 视频播放组件
import VideoPlayer from 'vue-video-player'



Vue.config.productionTip = false
// 视频播放组件
require('video.js/dist/video-js.css') 
require('vue-video-player/src/custom-theme.css') 
Vue.use(VideoPlayer)
// 前台页面图片查看组件包括 import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
// 图片懒加载设置
Vue.use(VueLazyLoad, {
  error:'../static/loading.gif',
	loading:'../static/loading.gif',
  attempt: 1
})
// 饿了么前端框架导入包括上面的"element-ui/lib/theme-chalk/index.css"、element-ui的引入
Vue.use(ElementUI)
// 本地存储插件
Vue.use(VueLocalStorage)
// 开发和生产环境的域名切换
// Vue.prototype.URLS = ''
Vue.prototype.URLS = '/api'
Vue.prototype.URLS2 = 'http://192.168.0.130:81/'
// echarts图表统计插件
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})



// WEBPACK FOOTER //
// ./src/main.js