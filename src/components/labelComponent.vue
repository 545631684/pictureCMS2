<template>
	<div class="title">
		<samp>标签：</samp>
		<div>
			<el-tag style="float: left;" :key="tag" v-for="tag in dynamicTags" :title="tag" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
			<el-popover
				style="margin-left: 10px;"
			  	placement="right"
			  	@hide="labelPopover"
			  	width="800"
			  	trigger="click">
			  	<p class="clearfix">
			  		已选：<el-tag style="" :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)" :title="tag">{{tag}}</el-tag><span style="padding-right: 20px;"></span>
			  	</p>
			  	<p class="clearfix" style="margin-top: 10px; margin-bottom: -10px; "><span style="display: block; float: right;">手动添加： <el-input  placeholder="回车添加标签" suffix-icon="el-icon-thumb" v-model="manual_label" @keyup.enter.native="addLabel()"></el-input><el-button style="margin-left: 10px;" type="primary" v-on:click.stop="addLabel">添加</el-button></span></p>
			  	<el-divider></el-divider>
			  	<p>
			  		标签组：
			  		<el-select v-model="groupLabelName" placeholder="标签组" @change="search()" filterable clearable style="width:200px; color: #409eff; margin-right: 20px;">
						<el-option v-for="item in groupLabel" :key="item.gid" :label="item.name" :value="item.name" >
						</el-option>
					</el-select>
					关键词：<el-input  placeholder="搜索关键词" suffix-icon="el-icon-thumb" v-model="Keyword_label" @keyup.enter.native="search()"></el-input>
					<el-button type="primary" v-on:click.stop="search()">搜索</el-button>
			  	</p>
			  	<div style="width: 95%; height: 200px; margin-top: 30px; border: 1px solid #DCDFE6; border-radius: 10px 0 0 10px; padding: 20px;  overflow-y:scroll; overflow-x:hidden;table-layout: fixed;word-wrap:break-word;word-break:break-all;">
			  		<el-checkbox-group v-model="dynamicTags" :max="6" v-if="label2.length !== 0">
				      	<el-checkbox class="omit" v-for="item in label2" :key="item.lid" :label="item.name" :value="item.name" :title="item.name" style="width: 20%; margin-bottom: 5px;"></el-checkbox>
				    </el-checkbox-group>
				    <p v-else style="text-align: center; line-height: 100px;">{{searchHTML}}</p>
			  	</div>
			  	
			  <el-button slot="reference" class="button-new-tag" size="small" :style="marginLeft">+ 点击添加</el-button>
			</el-popover>
		</div>
	</div>
</template>

<script>
	import { labelslist, labellist, deleteTemporaryFile, addImgsFile, queryTitle, deleteTemporaryFile2 } from '../assets/js/api'
	import { getProjectID, getProjectName, getTypesID, getTypesName, getMinTypesID, getMinTypesName } from '../assets/js/publicAPI'
	export default {
		props: {
			dynamicTags2: {
				type: Array,
      			default: []
			}
		},
		inject: ['reload'],
		name: 'myImages',
		data() {
			return {
				dynamicTags: this.dynamicTags2,
				marginLeft: {
					'margin-left': '0px'
				},
				label: [],
				label2: [],
				groupLabel: [],
				groupLabelName: '',
				manual_label: '',
				Keyword_label: '',
				searchHTML: '搜索内容显示区'
			}
		},
		watch: {},
		methods: {
			// 删除标签按钮
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			// 获取标签组id
			getgroupLabelId (groupLabelName) {
				return this.groupLabel.find((o, index) => {if (o.name === groupLabelName) {return o}}).gid
			},
			// 获取标签组名称
			getgroupLabelName (groupLabelId) {
				return this.groupLabel.find((o, index) => {if (o.gid === groupLabelId) {return o}}).name
			},
			// 标签组搜索操作
			search () {
				let temp = []
				let temp2 = []
				let _this = this
				this.label2 = []
				this.label3 = []
				console.log(11)
				if (this.Keyword_label.length !== 0 && this.groupLabelName.length !== 0) {
					this.label.find((obj, index) => {
						obj.name.indexOf(_this.Keyword_label) !== -1 ? temp.push(obj) : obj = obj
					})
					temp.find((obj, index) => {
						obj.gid === _this.getgroupLabelId(_this.groupLabelName) ? temp2.push(obj) : obj = obj
					})
					if (temp2.length !== 0) {
						temp2.find((obj, index) => {
							_this.label2.push(obj)
						})
					} else {
						this.searchHTML = '空空如也，什么都没有搜到....'
					}
				} else if (this.Keyword_label.length !== 0 && this.groupLabelName.length === 0) {
					this.label.find((obj, index) => {
						obj.name.indexOf(_this.Keyword_label) !== -1 ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.label2.push(obj)
						})
					} else {
						this.searchHTML = '空空如也，什么都没有搜到....'
					}
				}  else if (this.Keyword_label.length === 0 && this.groupLabelName.length !== 0) {
					this.label.find((obj, index) => {
						obj.gid === _this.getgroupLabelId(_this.groupLabelName) ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.label2.push(obj)
						})
					} else {
						this.searchHTML = '空空如也，什么都没有搜到....'
					}
				} else {
					this.label.find((obj, index) => {
						_this.$set(_this.label2, _this.label2.length, obj)
					})
				}
			},
			// 标签组件关闭事件
			labelPopover () {
				console.log("组件返回值：" + this.dynamicTags)
				// 关闭前 给父组件传递值
				this.$emit('setDynamicTags', this.dynamicTags);
				// 关闭时初始化数据参数
				this.label2 = []
				this.groupLabelName = ''
				this.manual_label = ''
				this.Keyword_label = ''
				this.searchHTML = '搜索内容显示区'
			},
			// 手动添加标签
			addLabel () {
				console.log(1)
				let num = 0,_this = this
				if (this.dynamicTags.length <=5) {
					this.dynamicTags.find((t, index) => {
						t.indexOf(_this.manual_label) !== -1 ? num++ : t = t
					})
					if (num === 0) {
						this.dynamicTags.push(this.manual_label)
					} else {
						this.$message({
				          type: 'info',
				          message: '标签重复，请重新添加！'
				        })
					}
				} else {
					this.$message({
			          type: 'info',
			          message: '标签最多6个，请删除后再添加！'
			        })
				}
			}
		},
		created() {
			// 获取标签组
			labelslist(this)
			// 获取标签
			labellist(this)
		},
		beforeDestroy() {}
	}
</script>

<style scoped>
	.title{width:100%}
	.title samp:nth-child(1){display:block;float:left;width:10%;font-size:18px;height:40px;line-height:40px;text-align:right;padding-right:20px;font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif}
	.title span.true{display:block;float:left;color:#1afa29;width:250px;line-height:40px;text-align:left}
	.title span.true img{display:block;float:left;padding-right:10px;width:30px;height:30px;margin:5px 0 5px 10px}
	.title span.fales{display:block;float:left;color:#d81e06;width:250px;line-height:40px;text-align:left}
	.title span.fales img{display:block;float:left;padding-right:10px;width:30px;height:30px;margin:5px 0 5px 10px}
	.title .el-input,.title .el-textarea{float:left;width:30%}
	.imgName{float:left;height:40px;font-size:18px;text-align:right;width:10%;padding-right:20px}
	.imgs{width:55%;float:left}
	.buttonImg{width:30%;margin-left:13%}
	.el-input--suffix{width:200px!important}
	.avatar-uploader{width:178px;height:178px}
	.uploadImg .el-upload{border-radius:6px!important}
	.avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden;width:148px;height:148px}
	.avatar-uploader .el-upload:hover{border-color:#409EFF}
	.avatar-uploader-icon{font-size:28px;color:#8c939d;width:178px;height:178px;line-height:178px;text-align:center}
	.avatar{width:178px;height:178px;display:block}
	.el-tag+.el-tag{margin-left:10px}
	.button-new-tag{margin-left:10px;height:32px;line-height:30px;padding-top:0;padding-bottom:0}
	.input-new-tag{width:90px;margin-left:10px;vertical-align:bottom}
</style>


// WEBPACK FOOTER //
// src/components/labelComponent.vue