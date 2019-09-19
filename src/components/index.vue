<template>
	<div>
		<!-- 头部组件 -->
		<myWebHeader></myWebHeader>
		<!-- 搜索组件 -->
		<myWebSearch></myWebSearch>
		<!-- 查看文章组件 -->
		<myWebSeeArticle></myWebSeeArticle>
		<!-- 底部 -->
		<myWebFooter></myWebFooter>
	</div>
</template>

<script>
	import myWebHeader from '../components/myWebHeader'
	import myWebSearch from '../components/myWebSearch'
	import myWebFooter from '../components/myWebFooter'
	import myWebSeeArticle from '../components/myWebSeeArticle'
	export default {
		inject: ['reload'],
		name: 'index',
		data() {
			return {
			}
		},
		methods: {
		},
		created() {
		},
		components: {
	        myWebHeader,
	        myWebSearch,
	        myWebFooter,
	        myWebSeeArticle
	    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>


// WEBPACK FOOTER //
// src/components/index.vue