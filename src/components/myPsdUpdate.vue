<template>
	<el-container style="margin: 50px 0px;" v-loading="loading2">
		<el-footer>
			<div class="title">
				<samp>标题：</samp>
				<el-input placeholder="请输入标题" v-model="article.title" clearable v-on:blur="titleRepeat" style="width: 455px !important;"></el-input>
				<span class="true" v-if="titleCf && titleDiv"><img src="../assets/images/true.png" alt="" />没有重复，可正常使用</span>
				<span class="fales" v-if="!titleCf && titleDiv"><img src="../assets/images/fales.png" alt="" />标题重复，请重新填写</span>
			</div>
		</el-footer>
		<el-footer style="min-height: 50px;height: auto !important; padding-bottom: 15px;">
			<div class="title">
				<samp>分类：</samp>
				<el-select v-model="projectImg" placeholder="请选择项目" filterable clearable style="width:200px; color: #409eff;">
					<el-option v-for="item in projects" :key="item.pid" :label="item.xname" :value="item.xname" v-if="item.state === '1'">
					</el-option>
				</el-select>
				<el-select v-model="typeImg" placeholder="请选择类型" filterable clearable style="width:200px;margin-left: 50px; color: #409eff;">
					<el-option v-for="item in types" :key="item.tid" :label="item.lname" :value="item.lname" v-if="item.state === '1'">
					</el-option>
				</el-select>
				<el-select v-model="minTypeImg" placeholder="请选择分类" filterable clearable style="width:200px;margin-left: 50px; color: #409eff;">
					<el-option v-for="item in minTypes2" :key="item.did" :label="item.dname" :value="item.dname" v-if="item.states === '1'">
					</el-option>
				</el-select>
			</div>
		</el-footer>
		<el-footer style="min-height: 50px;height: auto !important; padding-bottom: 15px;">
			<div class="title"><samp>描述：</samp>
				<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="article.describe"></el-input>
			</div>
		</el-footer>
		<el-footer style="min-height: 50px;height: auto !important; padding-bottom: 15px;">
			<labelComponent :dynamicTags2="dynamicTags" @setDynamicTags="setDynamicTags"></labelComponent>
		</el-footer>
		<el-footer style="min-height: 200px;height: auto !important; padding-bottom: 50px;">
			<p class="imgName">PSD：</p>
			<div class="imgs shangchuan" style="width: 40%;">
				<el-upload  :file-list="fileList" class="upload-demo2" :limit="20" :multiple="true" accept=".psd,.psb" :action="action + '?id=4'" :on-remove="handleRemovePsd" :on-change="obtainImgSrc" :on-exceed="limitNum">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传psd文件，文件大小不要超过1GB</div>
				</el-upload>
				<el-alert title="提示" description="※上传第一个文件时会自动获取文件名称并填写到标题。※一次最多上传20个psd文件，超出部分会自动剔除" type="info" show-icon style="width: 600px; margin: 20px 0;"></el-alert>
			</div>
		</el-footer>
		<el-row class="buttonImg">
			<el-button type="primary" v-on:click.stop="submitImg" :loading="loading">提交修改</el-button>
			<el-button v-on:click.stop="jumpUrl">返回列表页</el-button>
		</el-row>
	</el-container>
</template>

<script>
	import labelComponent from '../components/labelComponent'
	import { deleteTemporaryFile2, addImgsFile2, queryTitle2, exhibitionDetails } from '../assets/js/api'
	import { getProjectID, getProjectName, getTypesID, getTypesName, getMinTypesName, getMinTypesID } from '../assets/js/publicAPI'
	export default {
		inject: ['reload'],
		name: 'myPsdUpdate',
		data() {
			return {
				loading: false,
				loading2: true,
				title: '',
				titleCf: false,
				titleDiv: false,
				describe: '',
				dialogImageUrl: '',
				dialogVisible: false,
				action: this.URLS + '/index.php/Home/Index/upfile',
				types: this.$store.state.user.types,
				projects: this.$store.state.user.projects,
				minTypes: this.$store.state.user.minType,
				minTypes2: this.$store.state.user.minType,
				typeImg: '',
				projectImg: '',
				minTypeImg: '',
				psdImageUrlls: '',
				videoImageUrlls: '',
				article: {
					HeadPortraitSrc: '',
					Password: '',
					Verification: '',
					click: '',
					describe: '',
					endTime: '',
					endTimeImg: '',
					img: [],
					lname: '',
					mId: '',
					nickname: '',
					permissions: '',
					pid: '',
					projectid: '',
					psd: [],
					registerTime: '',
					registerTimeImg: '',
					sex: '',
					state: '',
					tid: '',
					title: '',
					typeid: '',
					uId: '',
					userName: '',
					video: [],
					xname: '',
					did: '',
					dname: ''
				},
				uploadingFiles: [],
				deleteFiles: [],
				release: false,
				URLS2: this.URLS2,
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				marginLeft: {
					'margin-left': '0px'
				},
				fileList: []
			}
		},
		watch: {
			// 填写标签时对齐样式的修改
			dynamicTags: function(newQuestion, oldQuestion) {
				this.dynamicTags.length !== 0 ? this.marginLeft = {'margin-left': '10px'} : this.marginLeft = {'margin-left': '0px'}
			},
			// 分类值的变更，有值是联动设置小分类可选值都是当前分类下的，如果没有清空小分类选中值并把下拉可选小分类
			typeImg: function(newQuestion, oldQuestion) {
				this.minTypes2 = []
				let _this = this
				let minTypeImgzj = false
				let tid = this.typeImg.length !== 0 ? this.$store.getters.getUserTypesId(this.typeImg).tid : ''
				if(this.typeImg.length !== 0) {
					this.minTypes.find(obj => {
						obj.tbid === tid ? _this.minTypes2.push(obj) : console.log()
					})
					this.minTypes2.find(obj => {
						obj.dname === _this.minTypeImg ? minTypeImgzj = true : console.log()
					})
					this.typeImg.length !== 0 && !minTypeImgzj ? this.minTypeImg = '' : this.minTypeImg = this.minTypeImg
				} else {
					this.minTypeImg = ''
					this.minTypes2 = this.minTypes
				}
			},
			// 小分类值的变更，有值的情况下获取小分类id联动填选它的上级分类，如果没有值而类型有值则只显示该类型的所有小分类，类型没有值则显示全部小分类
			minTypeImg: function(newQuestion, oldQuestion) {
				this.minTypes2 = []
				let _this = this
				let tid = this.typeImg.length !== 0 ? this.$store.getters.getUserTypesId(this.typeImg).tid : ''
				if(this.minTypeImg.length !== 0) {
					this.minTypes.find(obj => {
						_this.minTypeImg === obj.dname ? _this.typeImg = _this.$store.getters.getUserTypesName(obj.tbid).lname : _this.typeImg = _this.typeImg
					})
					this.minTypes.find(obj => {
						obj.tbid === tid ? _this.minTypes2.push(obj) : console.log()
					})
				} else if(this.minTypeImg.length === 0) {
					if(this.typeImg.length !== 0) {
						this.minTypes.find(obj => {
							obj.tbid === tid ? _this.minTypes2.push(obj) : console.log()
						})
					} else {
						this.minTypes2 = this.minTypes
					}
				}
			},
			// 小分类的值变动后，清空小类型input的值
			minTypes2: function(newQuestion, oldQuestion) {
				
			}
		},
		methods: {
			// 上传文件数超出限制提示
			limitNum (file, fileList) {
				if (fileList.length > 20) {
					this.$alert('最大上传20个psd文件，你已超出限制！', '警告', {
						confirmButtonText: '确定'
					})
				}
			},
			// 获取上传图片的服务器端实际路径地址并保存到数组中
			obtainImgSrc(file, fileList) {
				if(file.response !== undefined) {
					if(file.response.type === '4') {
						// 使用视图更新方法赋值文章的psd，防止视图不更新的情况
						// 这里也可以用数组的push()方法也可以保证视图的更新
						this.$set(
							this.article.psd,
							this.article.psd.length, {
								dataPsd: {
									size: file.size,
									name: file.name,
									url: file.response.dataPsd,
									type: 'image/x-photoshop',
									File: file.raw,
									title: file.name
								},
								Psdview: file.response.Psdview
							}
						)
						// 防止刷新等其他情况的统一上传文件存放地
						this.uploadingFiles.push(file.response.dataPsd, file.response.Psdview)
					}
				}
			},
			// 删除上传的文件psd
			handleRemovePsd(file, fileList) {
				let _this = this
				this.article.psd.find((obj, index) => {
					if (obj !== undefined) {
						if (obj.dataPsd.url === file.url) {
							_this.article.psd.splice(index,1)
							_this.deleteFiles.push(obj.dataPsd.url, obj.Psdview)
						}
					}
				})
				this.fileList.find((obj, index) => {
					if (obj !== undefined) {
						obj.url === file.url ? _this.fileList.splice(index,1) : obj = obj
					}
				})
			},
			// 发布用户文章，把数组中的路径拼接成字符串,以及Uid、title发送给后台接口
			submitImg() { 
				if (this.$store.state.user.nickname === this.$store.state.user.userName) {
					this.$alert('请修改昵称（个人真实姓名）后在修改文件', '警告', {
			          confirmButtonText: '确定',
			          callback: action => {
			            this.$router.push('/backstage/userInfo/')
			          }
			        });
				} else if(this.article.title.length === 0) {
					this.$alert('请填写标题', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.titleCf === false && this.titleDiv === true) {
					this.$alert('标题重复', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.projectImg.length === 0) {
					this.$alert('请选择项目类型', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.typeImg.length === 0) {
					this.$alert('请选择项目下的类型', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.minTypeImg.length === 0) {
					this.$alert('请选择项目下的分类', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.dynamicTags.length === 0) {
					this.$alert('请根据内容填写标签(最多可填写6个)', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.article.dname.length === 0 && this.article.detailsid.length) {
					this.$alert('请填写描述内容', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.article.psd.length === 0) {
					this.$alert('请添加需要上传的PSD文件', '警告', {
						confirmButtonText: '确定'
					})
				} else {
					this.loading = true
					addImgsFile2(this, {
						uId: this.article.uId,
						title: this.article.title,
						imgsrc: '[]',
						psdsrc: this.article.psd,
						videosrc: '[]',
						tid: this.$store.getters.getUserTypesId(this.typeImg).tid,
						pid: this.$store.getters.getUserProjectsId(this.projectImg).pid,
						did: this.$store.getters.getUserMinTypeId(this.minTypeImg).did,
						describe: this.article.describe,
						mId: this.article.mId,
						keyword: this.dynamicTags.toString(),
						typeFile: this.article.typeFile
					})
				}
			},
			// 判断标题是否重复，并提示用户
			titleRepeat() {
				if(this.title.length !== 0) {
					queryTitle2(this.title, this.article.mId, this)
				}
			},
			// 删除标签按钮
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			// 添加input标签
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			// 添加文章的标签
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if(inputValue && this.dynamicTags.length < 6) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			// 返回文章列表页
			jumpUrl() {
				this.$router.push('/backstage/seeArticle')
			},
			// 接受标签组件返回的值
			setDynamicTags (data) {
				console.log("返回值：" + data)
				this.dynamicTags = data
			}
		},
		created() {
			this.types = this.$store.state.user.types
			this.projects = this.$store.state.user.projects
			exhibitionDetails(this, this.$route.params.id)
			// 刷新页面时删除上传的文件
			window.addEventListener('beforeunload', e => {
				if(this.uploadingFiles.length !== 0) {
					deleteTemporaryFile2(this, this.uploadingFiles, 'all')
				}
			});
		},
		beforeDestroy() {
			// 注销页面时删除上传的文件
			if(this.uploadingFiles.length !== 0) {
				deleteTemporaryFile2(this, this.uploadingFiles, 'all')
			}
		},
		components: {
		    labelComponent
	   	}
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
	.navs{width:100%;float:left}
	.download{display:block;float:left;width:150px}
	.psdList{width:50%;height:auto;margin:10px 0}
	.psdList dd{height:35px;line-height:35px;color:#333;text-align:center;font-size:14px}
	.psdList dd a,.psdList dd samp,.psdList dd span{display:block;float:left;height:35px;line-height:35px;text-align:center}
	.psdList dd span{width:78%;text-align:left;padding-left:2%}
	.psdList dd samp{width:10%}
	.psdList dd a{width:10%}
	.psdList dd a i,.psdList dd samp i{font-size:22px;line-height:35px;text-align:center}
	.psdList dd:hover{background:#eee}
	/*.shangchuan .el-upload-list,.shangchuan .el-upload-list--text{display:none !important;}*/
	.el-tag+.el-tag{margin-left:10px}
	.button-new-tag{margin-left:10px;height:32px;line-height:30px;padding-top:0;padding-bottom:0}
	.input-new-tag{width:90px;margin-left:10px;vertical-align:bottom}
</style>


// WEBPACK FOOTER //
// src/components/myPsdUpdate.vue