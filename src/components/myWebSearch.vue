<template>
	<el-container>
		<el-main>
			<div class="w910">
				<el-popover style="float: left; margin-right: 20px; padding: 0;" placement="bottom-start" width="900" trigger="hover">
					<div class="label">
						<div class="clearfix" >
							<el-tabs :tab-position="tabPosition" style="">
							    <el-tab-pane :label="item.name" v-for="(item, index) in groupLabel" :key="index" @mouseenter="leave()" v-if="item.status === '1' && item.webShow === '1'">
							    	<samp class="label_samp" v-for="(label, index) in item.lid" :key="index" @click="searchLabel(label.lname)" v-if="label.status === '1' && label.webShow === '1'">{{label.lname}}</samp>
							    </el-tab-pane>
							</el-tabs>
						</div>
					</div>
					<el-button slot="reference" icon="el-icon-document-copy">标签</el-button>
				</el-popover>
				<el-input placeholder="请输入要搜索的关键词" v-model="searchTerms" class="input-with-select" @keyup.enter.native="search" style="float: left; width: 800px; float: left;">
				    <el-button slot="append" icon="el-icon-search" @click="search" style="background: #50b998;color: #fff;"></el-button>
				</el-input>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import { typeList3, labelAlllist } from '../assets/js/api'
	export default {
		inject: ['reload'],
		name: 'search',
		data() {
			return {
				options: [],
				typeId: '1',
				searchTerms: '',
				labelAll: [],
				groupLabel: [],
				tabPosition: 'left'
			}
		},
		methods: {
			// 查询方法
			search () {
				if (this.$router.history.current.name === 'Search') {
					// 如果是搜索页直接传递参数后刷新页面
					this.$router.push("/search/" + this.searchTerms)
					this.reload()
				} else if (this.searchTerms.length === 0) {
					this.$alert('请填写需要查找的关键词', '警告', {
						confirmButtonText: '确定'
					})
				} else {
					this.$router.push("/search/" + this.searchTerms)
					this.reload()
				}
			},
			// 关键词点击搜索
			searchLabel (terms) {
				this.searchTerms = terms
				this.$router.push("/search/" + this.searchTerms)
				this.reload()
			},
			leave () {
				console.log('11654')
			}
		},
		created() {
			// 获取所有类型数据
			typeList3(this)
			// 获取所有标签组和标签
			labelAlllist(this)
			// 在搜索页时 把搜索参数重新赋值显示在页面
			if (this.$router.history.current.name === 'Search') {
				this.typeId = this.$router.history.current.params.tid
				this.searchTerms = this.$router.history.current.params.searchTerms
			}
		},
		components: {}
	}
</script>

<style scoped>
.w910{ width: 950px; height: 40px; margin: 0 auto; border-radius: 10px;}
.w910 .el-select{float: left;}
.w910 .searchInput{float: left; border: none; line-height: 40px; height: 40px; width: 870px; text-indent: 1em; color: #999999;}
.w910 .searchInput:hover{border: none !important;}
.w910 .anniu{width: 130px; float: left; background: #50b998; border-radius:0 10px 10px  0;}
.w910 .anniu img{display: block; margin: 5px auto;}
.label p{font-size: 15px; color: #a6a9ad; line-height: 1.5; padding: 5px 0; text-align: justify;}
.label p:hover{ font-weight: bold; color: #F56C6C;}
.label p:hover samp{ font-weight: bold; color: #F56C6C; cursor: pointer;}
.label p samp:nth-child(1){padding-left: 0;}
.label p samp{padding: 0 10px;}
.label dl{}
.label dl dt{font-size: 16px; font-weight: bold; line-height: 1.5; color: #409EFF; float: left; width: 148px; border-right: 1px solid #C0C4CC; }
.label dl dt samp{display: block;text-align: center; font-weight: bold; font-size: 16px; padding: 10px;cursor:pointer;}
.label dl dt samp:hover{background: #C0C4CC; color: #F56C6C;}
.label dl dd{padding:10px 5px; float: left; width: 720px; margin-left: 20px;}
.label_samp{display: block; float: left; padding: 0 10px;cursor:pointer;padding:10px 5px; font-size: 16px;}
.label_samp:hover{color: #F56C6C;}
</style>


// WEBPACK FOOTER //
// src/components/myWebSearch.vue