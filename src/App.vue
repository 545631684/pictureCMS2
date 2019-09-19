<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
  	return {
  		reload: this.reload
  	}
  },
  data () {
  	return {
  		isRouterAlive: true
  	}
  },
  methods: {
  	// 用于提交数据后台需要更新页面的需要
  	reload () {
  		this.isRouterAlive = false
  		this.$nextTick(function () {
  			this.isRouterAlive = true
  		})
  	}
  }
}
</script>

<style>
@import 'assets/css/styles.css';
</style>