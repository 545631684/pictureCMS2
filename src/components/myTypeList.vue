<template>
    <el-tabs style="height: 86vh;" v-model="activeName" @tab-click="handleClick">
		  <el-tab-pane>
		    <span slot="label" name="xm"><i class="iconfont icon-fenleiguanli"></i> 项目（一级）</span>
		    <myColumnOne></myColumnOne>
		  </el-tab-pane>
		  <el-tab-pane>
		  	<span slot="label" name="lx"><i class="iconfont icon-xuanzeleixing"></i> 类型（二级）</span>
		  	<myColumnTwo></myColumnTwo>
		  </el-tab-pane>
		  <el-tab-pane>
		  	<span slot="label" name="fl"><i class="iconfont icon-fenleiguanli1"></i> 分类（三级）</span>
		  	<myColumnThree></myColumnThree>
		  </el-tab-pane>
		  <el-tab-pane>
		  	<span slot="label" name="bqz"><i class="iconfont icon-biaoqian"></i> 标签组（四级）</span>
		  	<myColumnFour></myColumnFour>
		  </el-tab-pane>
		  <el-tab-pane>
		  	<span slot="label" name="bq"><i class="iconfont icon-biaoqian"></i> 标签（四级）</span>
		  	<myColumnFive></myColumnFive>
		  </el-tab-pane>
		</el-tabs>
</template>

<script>
import myColumnOne from '../components/myColumnOne'
import myColumnTwo from '../components/myColumnTwo'
import myColumnThree from '../components/myColumnThree'
import myColumnFour from '../components/myColumnFour'
import myColumnFive from '../components/myColumnFive'
export default {
    name: 'myAuthorizeList',
    data() {
      return {
      	activeName: JSON.parse(sessionStorage.getItem("backstageActiveName")) || "0"
      }
    },
    watch: {
    	// 监听activeName值得变化并存储到本地存储中
      	activeName: function(newQuestion, oldQuestion) {
			sessionStorage.setItem("backstageActiveName", JSON.stringify(this.activeName))
		},
    },
    methods: {
    	// 获取本地存储选项卡参数
    	localStorageGet () {
    		this.activeName = JSON.parse(sessionStorage.getItem("backstageActiveName")) || "0"
    	},
    	// 点击选项卡事件
    	handleClick(tab, event) {
//	        console.log(tab, event);
      	}
    },
	components: {
	    myColumnOne,
	    myColumnTwo,
	    myColumnThree,
	    myColumnFour,
	    myColumnFive
   	},
   	created() {
  		// 获取本地存储选项卡参数
  		let _this = this
  		window.setTimeout(() => {_this.localStorageGet()}, 2000)
   	}
}
</script>

<style scoped>
</style>


// WEBPACK FOOTER //
// src/components/myTypeList.vue