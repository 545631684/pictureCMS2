<template>
	<el-container>
		<el-main>
			<div>
				<p>
					<span><img src="/static/footerLog.png" alt="" /></span>
					<span @click='top'><img src="/static/ReturnTop.png" alt="" /></span>
				</p>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	export default {
		inject: ['reload'],
		name: 'footers',
		data() {
			return {}
		},
		methods: {
			// 返回顶部
			top() {
		        // 获取当前最外围document的scrollTop，返回顶部
		        var timer = setInterval(function() {
		          var top = document.body.scrollTop || document.documentElement.scrollTop
		          var speed = Math.ceil(top / 10)
		          document.body.scrollTop = document.documentElement.scrollTop = top - speed
		          if (top === 0) {
		            clearInterval(timer)
		          }
		        }, 20)
		    }
		},
		created() {},
		components: {}
	}
</script>

<style scoped>
.el-main{background: #082033;}
.el-main div{ width: 1200px; margin: 0 auto; padding: 50px 0;}
.el-main div p{ width: 580px; height: 109px; margin: 0 auto;}
.el-main div p span{display: block; float: left;}
.el-main div p span:nth-child(1){border-right: 1px solid #124d7c; padding: 10px 50px;}
.el-main div p span:nth-child(2){padding: 10px 50px;}
</style>


// WEBPACK FOOTER //
// src/components/myWebFooter.vue