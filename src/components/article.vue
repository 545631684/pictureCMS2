<template>
	<div>
		<!-- 头部组件 -->
		<myWebHeader></myWebHeader>
		<div style="background: #f4f4f4; padding: 20px 0;">
			<div class="article clearfix">
				<div class="l">
					<div style="padding: 30px 30px 16px;">
						<h1 class="title">{{title}}</h1>
						<p class="time">{{formatDate(registerTime)}}</p>
						<p class="nav" v-if="nav.num.length === 2"><a :href="nav.num[0].href">{{nav.num[0].name}}</a><i>/</i><a>{{nav.num[1].name}}</a></p>
						<p class="nav" v-if="nav.num.length === 3"><a :href="nav.num[0].href">{{nav.num[0].name}}</a><i>/</i><a :href="nav.num[1].href">{{nav.num[1].name}}</a><i>/</i><a>{{nav.num[2].name}}</a></p>
					</div>
					<div class="describe">
						<p>描述：{{describe}}</p>
					</div>
					<div class="content clearfix">
						<div v-if="typeFile === 'img'">
							<viewer :images="imgs">
								<ul class="img" v-if="imgs.length !== 0">
									<li v-for="(item, index) in imgFile" :key="index">
										<img :src="URLS2 + item.miniImg" alt="" />
										<el-button class="download" type="primary" icon="el-icon-download" size="mini" @click="singleDownload(item.dataImg.url,item.dataImg.name)">下载</el-button>
									</li>
								</ul>
							</viewer>
						</div>
						<div v-if="typeFile === 'psd'">
							<viewer :images="psds">
								<ul class="psd" v-if="psds.length !== 0">
									<li v-for="(item, index) in psdFile" :key="index">
										<img :src="URLS2 + item.Psdview" alt="" />
										<el-button class="download" type="primary" icon="el-icon-download" size="mini" @click="singleDownload(item.dataPsd.url,item.dataPsd.name)">下载</el-button>
									</li>
								</ul>
							</viewer>
						</div>
					</div>
				</div>
				<div class="r">
					<div class="author">
						<img :src="URLS2 + article.HeadPortraitSrc" alt="" />
						<p>{{article.nickname}}</p>
						<p>赛奇设计师</p>
					</div>
					<el-collapse v-model="activeNames" @change="handleChange">
					  <el-collapse-item title="文章信息" name="1">
					  	<div class="attribute">文章类型：{{article.typeFile}}</div>
					    <div class="attribute">所属项目：{{article.xname}}</div>
					    <div class="attribute">所属分类：{{article.lname}}</div>
					    <div class="attribute">所属类型：{{article.dname}}</div>
					    <div class="attribute">文章标签</div>
					    <div class="keyword">
					    	<span v-for="(item, index) in article.keyword" :key="index" :title="item">{{item}}</span>
					    </div>
					  </el-collapse-item>
					  <el-collapse-item title="相关推荐" name="2">
					    <div class="attribute">
					    	<a class="omit" v-for="(item, index) in xiangguan" :key="index" @click="seeArticle(item.mId, item.typeFile)" :title="item.title">{{item.title}}</a>
					    </div>
					  </el-collapse-item>
					  <el-collapse-item title="文件下载" name="3" v-if="state === '1'">
					    <div class="attribute">
		    				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-left: 10px;">全选</el-checkbox>
		    				<el-button type="primary" icon="el-icon-download" size="mini" style="float: right;margin-right: 10px;" @click="download"></el-button>
						  	<div style="margin: 15px 0;"></div>
						  	<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
						    	<el-checkbox class="omit" v-for="city in cityOptions" :label="city" :key="city" :title="city">{{city}}</el-checkbox>
						  	</el-checkbox-group>
						  	<form method="POST" :action="URLS2 + 'index.php/Index/zipdownload'" id="hiddenForm" ref="hiddenForm" target="_blank" style="display: none;">
							    <input type="text" id="title" name="title" :value="title" />
							    <input type="text" id="zipfiles" name="zipfiles"  />
							    <input type="text" id="name" name="name"  />
							    <input type="text" id="mId" name="mId" :value="mid"/>
							    <input type="text" id="froid" name="froid" />
							    <input type="text" id="inid" name="inid" :value="uId" />
							</form>
					    </div>
					  </el-collapse-item>
					</el-collapse>
				</div>
			</div>
		</div>
		
		<!-- 底部 -->
		<myWebFooter></myWebFooter>
	</div>
</template>

<script>
	import { exhibitionDetails2, zipdownload } from '../assets/js/api'
	import { formatDate } from '../assets/js/publicAPI'
	import myWebHeader from '../components/myWebHeader'
	import myWebFooter from '../components/myWebFooter'
	export default {
		inject: ['reload'],
		name: 'articles',
		data() {
			return {
				mid: '',
				uId: '',
				title: '',
				typeid: '',
				describe: '',
				registerTime: '',
				imgFile: [],
				psdFile: [],
				videoFile: [],
				imgs:[],
				psds:[],
				typeFile: '',
				loading: false,
				xiangguan: [],
				article: {},
				nav: {
					id: '',
					name: '',
					tid: '',
					searchTerms: '',
					num: []
				},
				URLS2: this.URLS2,
				activeNames: ['1','2'],
				checkAll: false,
		        checkedCities: [],
		        cityOptions: [],
		        isIndeterminate: true,
		        state: this.$store.state.user.state,
		        zipfiles: [],
		      	downloadName: []
			}
		},
		watch: {
			// 服务器获取数据是异步进行的文章的标题获取有延时，所以在监控变量改变后在赋值给导航显示
			title: function(newQuestion, oldQuestion) {
				this.title.length !== 0 ? this.nav.num[this.nav.num.length] = {href: this.URLS2 + this.$route.path, name: this.title} : this.title = this.title
			},
			// 给图片查看器赋值
			imgFile: function(newQuestion, oldQuestion) {
				let _this = this
				if (this.imgFile.length !== 0 && this.typeFile === "img") {
					this.imgFile.find(obj => {
						_this.imgs.push(obj.miniImg)
						_this.cityOptions.push(obj.dataImg.name)
					})
				}
			},
			// 给图片查看器赋值
			psdFile: function(newQuestion, oldQuestion) {
				let _this = this
				if (this.psdFile.length !== 0  && this.typeFile === "psd") {
					this.psdFile.find(obj => {
						_this.psds.push(obj.Psdview)
						_this.cityOptions.push(obj.dataPsd.name)
					})
				}
			}
		},
		methods: {
			// 单个文件下载按钮
			singleDownload (file, title) {
				let _this = this
				if (file.length !== 0 && title.length !== 0) {
					document.getElementById('zipfiles').value = file
					document.getElementById('name').value = title
					document.getElementById('froid').value = this.$store.state.user.uId
					this.$refs.hiddenForm.submit()
				}
			},
			// 下载按钮
			download () {
				let _this = this
				if (this.typeFile === 'img') {
					this.checkedCities.find(strings => {
						this.imgFile.find(obj => {
							if (obj.dataImg.name === strings) {
								this.zipfiles.push(obj.dataImg.url)
								this.downloadName.push(obj.dataImg.name)
							}
						})
					})
				} else if (this.typeFile === 'psd') {
					this.checkedCities.find(strings => {
						this.psdFile.find(obj => {
							if (obj.dataPsd.name === strings) {
								this.zipfiles.push(obj.dataPsd.url)
								this.downloadName.push(obj.dataPsd.name)
							}
						})
					})
				} else if (this.typeFile === 'video') {
					this.checkedCities.find(strings => {
						this.videoFile.find(obj => {
							if (obj.dataVideo.name === strings) {
								this.zipfiles.push(obj.dataVideo.url)
								this.downloadName.push(obj.dataVideo.name)
							}
						})
					})
				}
				if (this.zipfiles.length !== 0 && this.downloadName.length !== 0 && this.title.length !== 0) {
					document.getElementById('zipfiles').value = this.zipfiles.join(',')
					document.getElementById('name').value = this.downloadName.join(',')
					document.getElementById('froid').value = this.$store.state.user.uId
					this.$refs.hiddenForm.submit()
				}
			},
			// 下载全选
			handleCheckAllChange(val) {
		        this.checkedCities = val ? this.cityOptions : [];
		        this.isIndeterminate = false;
	      	},
	      	// 下载单选
	      	handleCheckedCitiesChange(value) {
		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.cityOptions.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length;
	      	},
			// 点击跳转文章页
			seeArticle(mid, typeFile) {
				switch (typeFile) {
		    		case 'img':
		    			this.$router.push('/article/' + mid + '/Index/0/0/')
		    			this.reload()
					    break;
		    		case 'psd':
		    			this.$router.push('/article/' + mid  + '/Index/0/0/')
		    			this.reload()
					    break;
		    		case 'video':
		    			this.$router.push('/articleVideo/' + mid  + '/Index/0/0/')
		    			this.reload()
					    break;
		    	}
			},
			// 手风琴模块点击事件
			handleChange(val) {
//		        console.log(val);
		   	},
			// 时间戳转换
			formatDate (time) {
		      if (time !== null) {
		        let date = new Date(parseInt(time) * 1000)
		        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
		      } else {
		        return '暂无'
		      }
		    },
		    // 面包屑导航赋值
		    navfunction () {
		    	if (this.nav.tid === '0' && this.nav.searchTerms === '0') {
		    		this.nav.name === 'Index' ? this.nav.num.push({href: this.URLS2 + '#/', name: '首页'}) : console.log()
		    		this.nav.name === 'backstage' ? this.nav.num.push({href: this.URLS2 + '#/backstage/seeArticle', name: '后台'}) : console.log()
		    	} else if (this.nav.name === 'search') {
		    		this.nav.num.push({href: this.URLS2 + '#/', name: '首页'})
		    		this.nav.num.push({href: this.URLS2 + "#/search/" + this.nav.searchTerms, name: '搜索'})
		    	}
		    },
		    // 获取数据
		    getPost () {
		    	// 获取文章数据
				exhibitionDetails2(this, this.$route.params.id)
				// 面包屑导航参数
				this.nav.id = this.$route.params.id
				this.nav.name = this.$route.params.name
				this.nav.tid = this.$route.params.tid
				this.nav.searchTerms = this.$route.params.searchTerms
				// 导航赋值
				this.navfunction()
		    }
		},
		created() {
			// 获取数据
			this.getPost()
			// 获取本地存储用户信息
			this.$store.dispatch('getLocalStorage')
			this.state = this.$store.state.user.state
		},
		components: {
	        myWebHeader,
	        myWebFooter
	    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.article{width: 1200px; margin: 0 auto; height: auto;}
	.article .l{border-radius: 10px; background: #FFFFFF; width: 910px; float: left; margin-right: 10px; padding: 10px;}
	.article .l .title{color: #333333;font-size: 24px;font-weight: normal;display: inline-block;}
	.article .l .time{padding-top: 15px;font-size: 18px;color: #bbbbbb;}
	.article .l .nav{padding-top: 15px;    line-height: 30px;}
	.article .l .nav,.article .l .nav a{font-size: 18px;color: #bbbbbb;display: inline-block;vertical-align: middle;*vertical-align: auto;zoom: 1;*display: inline;}
	.article .l .nav i{color: #dddddd;margin: 0 30px;font-style:normal;}
	.describe{padding: 28px 0;line-height: 30px;color: #666666;background: #f8f8f8;}
	.describe p{width: 800px;font-size: 18px;margin: 0 auto;word-wrap: break-word;}
	.describe{padding: 28px 0;}
	.content{margin-top: 20px;}
	.img{}
	.img li{width: 32%;float: left;padding: 5px;}
	.img li img{max-width: 100%;}
	.psd{}
	.psd li{width: 75%;padding: 30px 10px; margin: 0 auto;}
	.psd li img{max-width: 100%;}
	.img li,.psd li{position: relative; overflow: hidden;}
	.img li .download,.psd li .download{ position: absolute; left: 10px; top: -28px;}
	.img li:hover .download,.psd li:hover .download{top: 10px;}
	.article .r{border-radius: 10px; background: #FFFFFF; width: 260px; float: left;}
	.article .r .author{ height: 140px; padding: 30px 0 20px;}
	.article .r .author img{ width: 80px; height: 80px; margin:0 auto; display: block; border-radius: 50px; margin-bottom: 16px;}
	.article .r .author p:nth-child(2){ text-align: center; font-size: 16px;color: #333;font-weight: 600;vertical-align: middle;margin-right: 4px;}
	.article .r .author p:nth-child(3){text-align: center; font-size: 12px;color: #bbb;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	.attribute{font-size: 14px;color: #666666;background-repeat: no-repeat;background-position: left;padding: 0 10px;}
	.attribute a{cursor: pointer; display: block; padding: 5px; text-indent: 1em;}
	.attribute a:hover{color: #B10202;}
	.keyword{ padding-top: 10px;}
	.keyword span{max-width: 60px;height: 24px;font-size: 12px;color: #999;line-height: 24px;padding: 0 14px;margin: 0 5px 10px 0;background: #eee;border-radius: 4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;display: inline-block;vertical-align: middle;zoom: 1;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;cursor: pointer;}
	.el-checkbox{padding: 5px 10px;}
	.el-checkbox+.el-checkbox{margin: 0;}
	.el-collapse-item .el-collapse-item__header{ text-indent: 1em !important;}
</style>


// WEBPACK FOOTER //
// src/components/article.vue