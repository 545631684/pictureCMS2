<template>
	<div>
		<!-- 头部组件 -->
		<myWebHeader></myWebHeader>
		<!-- 搜索组件 -->
		<myWebSearch></myWebSearch>
		<!-- 搜索内容显示 -->
		<div>
			<!--<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="padding: 0 19%;">
				<el-menu-item index="0"><span class="xiangmu">全部</span></el-menu-item>
				<el-menu-item v-for="(item, index) in projects" :key="index" :index="item.pid"><span class="xiangmu">{{item.xname}}</span></el-menu-item>
			</el-menu>-->
			<div style="width:1200px; margin: 0 auto;">
				<div class="tab clearfix">
					<p>用户：</p>
					<ul>
						<li :class="{on:num4 === '-1'}" @click="tab4('', '-1', '')">全部</li>
						<li v-for="(item, index) in userList" :key="index" :class="{on:index === num4}" v-on:click.stop="tab4(index, item.nickname, item.uId)" v-if="item.state !== '2'">{{item.nickname}}</li>
					</ul>
				</div>
				<div class="tab clearfix">
					<p>项目：</p>
					<ul>
						<li :class="{on:num1 === '-1'}" @click="tab1('', '-1', '')">全部</li>
						<li v-for="(item, index) in projects" :key="index" :class="{on:index === num1}" v-on:click.stop="tab1(index, item.xname, item.pid)" v-if="item.state === '1' && item.xname !== '公司'">{{item.xname}}</li>
					</ul>
				</div>
				<div class="tab clearfix">
					<p>类型：</p>
					<ul>
						<li :class="{on:num2 === '-1'}" @click="tab2('', '-1', '')">全部</li>
						<li v-for="(item, index) in types" :key="index" :class="{on:index === num2}" v-on:click.stop="tab2(index, item.lname, item.tid)" v-if="item.state === '1'">{{item.lname}}</li>
					</ul>
				</div>
				<div class="tab clearfix" style="margin-bottom: 50px;">
					<p>分类：</p>
					<ul :class="{omit:showtype}">
						<li :class="{on:num3 === '-1'}" @click="tab3('', '-1', '', '', '')">全部</li>
						<li v-for="(item, index) in minTypes2" :key="index" :class="{on:index === num3}" v-on:click.stop="tab3(index, item.dname, item.did, item.tbid, item.pbid)" v-html="item.dname"></li>
						<li class="clearfix"></li>
				        <a class="el-button--default is-plain" v-show="showtype" v-on:click.stop="showMinType()">点击查看全部分类</a>
				        <a class="el-button--default is-plain" v-show="!showtype" v-on:click.stop="hideMinType()">收起</a>
					</ul>
				</div>
			</div>
			<div style="background: #f4f4f4;">
				<dl class="articleList clearfix">
					<dt v-if="prompt.length !== 0">{{prompt}}</dt>
					<dd v-for="(item, index) in article3" :key="index" v-if="prompt.length === 0">
						<router-link target="_blank" :title="item.title + '   ▉发布人：' + item.user.nickname + '-发布时间：' + formatDate(item.registerTimeImg)" tag="a" :to="seeArticle(item.mId, item.typeFile)">
							<p>
								<img :src="URLS2 + item.srcs[0]" alt="" />
							</p>
							<p class="omit2" :title="item.title">{{item.title}}</p>
							<p>
								<img :src="URLS2 + item.user.HeadPortraitSrc" alt="" />
								<span>{{item.user.nickname}}</span>
								<samp>
									{{formatDate(item.registerTimeImg)}}<br />
					        		<svg class="icon svg-icon" aria-hidden="true" v-if="returnArticleType('img', item.mId)">
						              <use xlink:href="#icon-picture"></use>
						            </svg>
									<svg class="icon svg-icon" aria-hidden="true" v-if="returnArticleType('psd', item.mId)">
						              <use xlink:href="#icon-ps"></use>
						            </svg>
									<svg class="icon svg-icon" aria-hidden="true" v-if="returnArticleType('video', item.mId)">
						              <use xlink:href="#icon-shipin"></use>
						            </svg>
								</samp>
							</p>
						</router-link>
					</dd>
				</dl>
				<div class="block" style="width: 470px;margin: 0 auto; padding-bottom: 20px;">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="dataList" layout="total, prev, pager, next" :total="article2.length">
					</el-pagination>
				</div>
			</div>
			<!-- 底部 -->
			<myWebFooter></myWebFooter>
		</div>
	</div>
</template>

<script>
	import { formatDate } from '../assets/js/publicAPI'
	import { projectList3, administrationArticleAll2, userList2, detailslist2, typeList4 } from '../assets/js/api'
	import myWebHeader from '../components/myWebHeader'
	import myWebSearch from '../components/myWebSearch'
	import myWebFooter from '../components/myWebFooter'
	export default {
		inject: ['reload'],
		name: 'search',
		data() {
			return {
				loading: false,
				activeIndex: '0',
				activeIndex2: '1',
				projects: [],
				typeId: '',
				searchTerms: '',
				article: [],
				article2: [],
				article3: [],
				prompt: '',
				userList: [],
				URLS2: this.URLS2,
				types: [],
				minTypes: [],
				minTypes2: [],
				num1: '-1',
				num2: '-1',
				num3: '-1',
				num4: '-1',
				user: {
					id: '',
					name: '',
					index: '-1'
				},
				xname: {
					id: '',
					name: '',
					index: '-1'
				},
				lname: {
					id: '',
					name: '',
					index: '-1'
				},
				dnames: {
					pbid: '',
					tbid: '',
					did: '',
					name: '',
					index: '-1'
				},
				showtype: true,
				currentPage1: 1,
				dataList: 8,
				sessionData: false
			}
		},
		watch: {
			article: function(newQuestion, oldQuestion) {
				console.log(1)
				if (!this.sessionData) {
					let _this = this
					this.article2 = this.article
					this.article.find((obj, index) => {
						if(index < _this.dataList) {
							_this.$set(_this.article3, _this.article3.length, obj)
						}
					})
					this.loading = false
				}
			},
			article3:  function(newQuestion, oldQuestion) {
				
				if (this.article3.length === 0) {
					
				}
			},
		    'lname.name':function (newQuestion, oldQuestion) {
		    	console.log(2)
		    	if (this.num3 !== '-1') {
			    	this.num3 = '-1'
			    	this.dnames.pbid = this.dnames.tbid = this.dnames.did = this.dnames.name = this.dnames.index = ''
		    	}
		    	if (!this.sessionData) {
			    	this.setdata(0)
		    	} else {
		    		this.setdata(this.currentPage1)
		    	}
		    }
		},
		methods: {
			// 分类全部显示关闭
			showMinType () {
		      this.showtype = false
		    },
		    // 分类全部显示开启
		    hideMinType () {
		      this.showtype = true
		    },
		    handleSizeChange(val) {
//				console.log('每页 ' + val + '条');
			},
			handleCurrentChange(val) {
				console.log(3)
				console.log('当前最新页数：' + val)
//				console.log('当前页: ' + val)
				let _this = this
				// 抓取数据下标开始位置
				let begin = (this.dataList * val) - this.dataList
				// 抓取数据下标开结束位置
				let end = (this.dataList * val) - 1
				// 清空当前页显示数据
				this.article3 = []
				// 循环抓取从起始位置到结束位置的数据
				this.article2.find((obj, index) => {
					if(index >= begin && index <= end) {
						_this.$set(_this.article3, _this.article3.length, obj)
					}
				})
			},
			// 项目按钮
			tab1(index, name, pid) {
				console.log(4)
				if(name !== '-1') {
					this.num1 = index
					this.xname.id = pid
					this.xname.name = name
					this.xname.index = index
				} else {
					this.num1 = name
					this.xname.id = this.xname.name = this.xname.index = ''
				}
				this.setdata(0)
				// 本地存储查询信息
				this.localStorageSet()
			},
			// 类型按钮
			tab2(index, name, tid) {
				console.log(5)
				if(name !== '-1') {
					this.num2 = index
					this.lname.id = tid
					this.lname.name = name
					this.lname.index = index
				} else {
					this.num2 = name
					this.lname.id = this.lname.name = this.lname.index = ''
				}
				this.setdata(0)
				// 本地存储查询信息
				this.localStorageSet()
			},
			// 分类按钮
			tab3(index, name, did, tbid, pbid) {
				console.log(6)
				if(name !== '-1') {
					this.num3 = index
					this.dnames.pbid = pbid
					this.dnames.tbid = tbid
					this.dnames.did = did
					this.dnames.name = name
					this.dnames.index = index
				} else {
					this.num3 = name
					this.dnames.pbid = this.dnames.tbid = this.dnames.did = this.dnames.name = this.dnames.index = ''
				}
				this.setdata(0)
				// 本地存储查询信息
				this.localStorageSet()
			},
			// 用户按钮
			tab4(index, name, uid) {
				console.log(7)
				if(name !== '-1') {
					this.num4 = index
					this.user.id = uid
					this.user.name = name
					this.user.index = index
				} else {
					this.num4 = name
					this.user.id = this.user.name = this.user.index = ''
				}
				this.setdata(0)
				// 本地存储查询信息
				this.localStorageSet()
			},
			resetTab() {
				console.log(8)
				this.num1 = '-1'
				this.num2 = '-1'
				this.xname.id = this.xname.name = this.xname.index = this.lname.id = this.lname.name = this.lname.index = ''
			},
			/**
			 * 选择类型动态修改，点击不同的项目、类型、分类显示相应的类型和分类
			 * */
			setdata(page) {
				console.log(9)
				let _this = this
				this.minTypes2 = []
				if(this.xname.id === '' && this.lname.id === '' && this.dnames.did === '') {
					this.minTypes2 = this.minTypes
				} else if(this.xname.id !== '' && this.lname.id === '' && this.dnames.did === '') {
					this.minTypes2 = this.minTypes
				} else if(this.xname.id === '' && this.lname.id !== '' && this.dnames.did === '') {
					this.minTypes.find((obj, index) => {
						if(_this.lname.id === obj.tbid  && obj.states === '1') {
							_this.minTypes2.push(obj)
						}
					})
				} else if(this.xname.id === '' && this.lname.id === '' && this.dnames.did !== '') {
					this.resetTab()
					this.minTypes2 = this.minTypes
				} else if(this.xname.id !== '' && this.lname.id !== '' && this.dnames.did === '') {
					this.minTypes.find((obj, index) => {
						if(_this.lname.id === obj.tbid  && obj.states === '1') {
							_this.minTypes2.push(obj)
						}
					})
				} else if(this.xname.id === '' && this.lname.id !== '' && this.dnames.did !== '') {
					this.minTypes.find((obj, index) => {
						if(_this.lname.id === obj.tbid  && obj.states === '1') {
							_this.minTypes2.push(obj)
						}
					})
				} else if(this.xname.id !== '' && this.lname.id === '' && this.dnames.did !== '') {
					this.minTypes2 = this.minTypes
				} else if(this.xname.id !== '' && this.lname.id !== '' && this.dnames.did !== '') {
					this.minTypes.find((obj, index) => {
						if(_this.lname.id === obj.tbid  && obj.states === '1') {
							_this.minTypes2.push(obj)
						}
					})
				}
				this.getArticle(this.xname.id, this.lname.id, this.dnames.did, page)
			},
			getArticle(xid, tid, did, page) {
				console.log(10)
				this.article2 = []
				this.article3 = []
				let condition = [], tmpeList = [], _this = this
				this.user.id !== '' ? condition[0] = this.user.id : condition[0] = ''
				this.xname.id !== '' ? condition[1] = this.xname.id : condition[1] = ''
				this.lname.id !== '' ? condition[2] = this.lname.id : condition[2] = ''
				this.dnames.did !== '' ? condition[3] = this.dnames.did : condition[3] = ''
				if(condition[0] !== '') {
					this.article.find((obj, index) => {
						if(condition[0] === obj.uId) {
							_this.article2.push(obj)
						}
					})
				} else {
					this.article2 = this.article
				}
				if(condition[1] !== '') {
					tmpeList = this.article2
					this.article2 = []
					tmpeList.find((obj, index) => {
						if(condition[1] === obj.projectid) {
							_this.article2.push(obj)
						}
					})
					tmpeList = []
				}
				if(condition[2] !== '') {
					tmpeList = this.article2
					this.article2 = []
					tmpeList.find((obj, index) => {
						if(condition[2] === obj.typeid) {
							_this.article2.push(obj)
						}
					})
					tmpeList = []
				}
				if(condition[3] !== '') {
					tmpeList = this.article2
					this.article2 = []
					tmpeList.find((obj, index) => {
						if(condition[3] === obj.detailsid) {
							_this.article2.push(obj)
						}
					})
					tmpeList = []
				}
				// 判断page参数来重置不同情况下的页面内容显示
				if (page === 0) {
					// 重置当前页数
	      			this.currentPage1 = 1
	      			// 显示当前最新文章dataList数量
	      			this.article2.find((obj, index) => {
	      				if(index < _this.dataList) {
	      					_this.$set(_this.article3, _this.article3.length, obj)
	      				}
	      			})
				} else {
					// 重置当前页数
	      			this.currentPage1 = JSON.parse(sessionStorage.getItem("webSeeArtcurrentPage")) || 1
	      			// 重置当前页面显示的文章到指定页数
	      			this.handleCurrentChange(this.currentPage1)
				}
			},
			// 项目点选查看
			handleSelect(key, keyPath) {
				let _this = this
				this.article2 = []
				this.prompt = ''
				if(key === '0') {
					this.article2 = this.article
				} else {
					this.article.find(obj => {
						obj.projectid === key ? _this.article2.push(obj) : obj = obj
					})
					this.article2.length === 0 ? this.prompt = '没有查到相关数据' : this.prompt = ''
				}
			},
			// 时间戳转换
			formatDate(time) { 
				if(time !== null) {
					let date = new Date(parseInt(time) * 1000)
					return formatDate(date, 'yyyy-MM-dd')
				} else {
					return '暂无'
				}
			},
			seeArticle(mid, typeFile) {
				switch(typeFile) {
					case 'img':
						return '/article/' + mid + '/search/' + this.typeId + '/' + this.searchTerms
						break;
					case 'psd':
						return '/article/' + mid + '/search/' + this.typeId + '/' + this.searchTerms
						break;
					case 'video':
						return '/articleVideo/' + mid + '/search/' + this.typeId + '/' + this.searchTerms
						break;
				}
			},
			// 判断文章的img、psd、video是否有数据并返回true/false
			returnArticleType (type,mid) {
				let time = false
				switch (type) {
		    		case 'img':
	    				this.article.find((obj, index) => {
	    					if (obj.mId === mid) {
	    						obj.img !== '[]' ? time = true : time = false
	    					}
	    				})
		    			return time
					    break;
		    		case 'psd':
			    		this.article.find((obj, index) => {
	    					if (obj.mId === mid) {
	    						obj.psd !== '[]' ? time = true : time = false
	    					}
	    				})
		    			return time
					    break;
		    		case 'video':
			    		this.article.find((obj, index) => {
	    					if (obj.mId === mid) {
	    						obj.video !== '[]' ? time = true : time = false
	    					}
	    				})
		    			return time
					    break;
		    	}
			}
		},
		created() {
			// 获取所有用户信息
			userList2(this)
			// 获取所有项目数据
			projectList3(this)
			// 获取类型的数据
      		typeList4(this)
      		// 获取类型的数据
      		detailslist2(this, '2')
			// 从连接中获取参数
			if(this.$router.history.current.params.searchTerms !== undefined) {
				this.typeId = this.$router.history.current.params.tid
				this.searchTerms = this.$router.history.current.params.searchTerms
			}
			// 查询指定参数的文章
			administrationArticleAll2(this)
		},
		components: {
			myWebHeader,
			myWebSearch,
			myWebFooter
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.xiangmu{font-size:20px}
	.articleList{width:1200px;height:auto;margin:0 auto;padding:80px 0}
	.articleList dt{width:100%;height:361px;font-size:20px;text-align:center;line-height:361px}
	.articleList dd{width:22%;height:335px;float:left;overflow:hidden;margin:1% 3.6% 1% 0;border:1px solid #e5e5e5;border-radius:5px;box-shadow:none;cursor:pointer;background:#FFF}
	.articleList dd:nth-child(4n+4){margin-right:0}
	.articleList dd:hover p:nth-child(2){color:#f00000}
	.articleList dd p:nth-child(1){width:266px;height:215px;position:relative;border-radius:10px 10px 0 0;overflow:hidden}
	.articleList dd p:nth-child(1) img{position:absolute;display:block;width:266px}
	.articleList dd p:nth-child(2){height:40px;padding:5px;border-bottom:1px solid #e5e5e5;font-size:18px; line-height: 1.2;}
	.articleList dd p:nth-child(3){height:45px;padding:15px;line-height:45px}
	.articleList dd p:nth-child(3) img{width:40px;height:40px;float:left;display:block;border-radius:50px}
	.articleList dd p:nth-child(3) span{float:left;display:block;width:50%;text-indent:10px}
	.articleList dd p:nth-child(3) samp{float:left;display:block;width:32%;text-align:center;color:#999;line-height: .5;padding: 17px 0 0 0;}
	.icon {width: 20px;height: 20px;vertical-align: -0.15em;fill: currentColor;overflow: hidden; padding-top: 7px;}
	.tab{width:100%;height:auto;min-height:30px;margin-bottom:20px;position:relative}
	.tab p{font-weight:400;color:#1f2f3d;font-size:20px;margin:0;float:left;width:7%}
	.tab ul{float:left;width:93%;height:auto}
	.tab ul li{float:left;height:30px;line-height:30px;margin:0 10px;cursor:pointer}
	.tab ul li:hover{color:#409eff;font-weight:700}
	.tab ul a{position:absolute;bottom:-40px;left:44%;width:160px;display:inline-block;line-height:30px;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;border-top-color:#dcdfe6;border-right-color:#dcdfe6;border-bottom-color:#dcdfe6;border-left-color:#dcdfe6;border-color:#dcdfe6;color:#606266;-webkit-appearance:none;text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;outline:0;margin:0;-webkit-transition:.1s;transition:.1s;font-weight:500;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;font-size:14px;border-radius:4px}
	.tab ul a:hover{background:#fff;border-color:#409eff;color:#409eff}
	.tab ul li.on{color:#fff;background-color:#409eff;border-color:#f56c6c;display:inline-block;white-space:nowrap;cursor:pointer;border:1px solid #dcdfe6;-webkit-appearance:none;text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;outline:0;margin:0;-webkit-transition:.1s;transition:.1s;font-weight:500;padding:5px 10px;font-size:14px;border-radius:4px;line-height:20px}
	.omit{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;height:30px!important}
</style>


// WEBPACK FOOTER //
// src/components/search.vue