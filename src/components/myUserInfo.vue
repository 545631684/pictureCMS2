<template>
	<el-container class="userInfo">
		<el-header>
			<el-row :gutter="20">
			  <el-col :span="6">
			  	<el-card class="">
			  		<ul class="userInfoyTop clearfix">
			  			<li>
					  		<img :src="this.URLS + userInfo.HeadPortraitSrc" alt=""/>
			  			</li>
			  			<li>
			  				<span>{{userInfo.nickname}}<svg v-if="userInfo.sex === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-xingbienan"></use></svg><svg v-else class="icon" aria-hidden="true"><use xlink:href="#icon-xingbienv"></use></svg></span>
							<samp>{{userInfo.userName}}</samp>	
			  			</li>
			  			<el-popover
			  				v-on:show="onuserInfoUp"
			  				v-on:hide="onuserInfoUpleave"
						  	placement="right"
						  	width="400"
						  	trigger="click"
						  	v-model="infoModify">
						  <div>
						  	<el-upload class="avatar-uploader avatar_div avatar_div01" :action="action + '?id=2'" :show-file-list="false" :on-change="obtainImgSrc" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					          <img v-if="userInfo.HeadPortraitSrc !== 'null'" :src="this.URLS + userInfoUp.HeadPortraitSrc" class="avatar">
					          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					          <span class="avatar_span">点击修改</span>
					        </el-upload>
					        <div style="float: left; width: 75%;">
					        	<el-container class="inputInfo" style="width: 300px;">
							        <el-aside>昵称:</el-aside>
							        <el-main>
							          	<el-input placeholder="请输入内容" v-model="userInfoUp.nickname" clearable style="width: 200px;"></el-input>
							        </el-main>
							    </el-container>
							    <el-container class="inputInfo">
							        <el-aside>性别:</el-aside>
							        <el-main>
							          	<el-radio v-model="userInfoUp.sex" label="1">男</el-radio>
							          	<el-radio v-model="userInfoUp.sex" label="0">女</el-radio>
							        </el-main>
							    </el-container>
							    <el-button type="primary" style="float: right;" v-on:click.stop="modifyInfo()">保存</el-button>
					        </div>
						  </div>
						  <el-button slot="reference" style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
						</el-popover>
			  		</ul>
			  		<el-divider></el-divider>
			  		<p class="info"><samp>Hi</samp>，你已经发布了<span>{{userInfo.articleNum}}</span>篇文章,已有<span>{{userInfo.downloadMan}}</span>人下载了你发布的文章,总下载次数已超过了<span>{{userInfo.downloadNext}}</span>次，继续努力哦！</p>
			  	</el-card>
			  </el-col>
			  <el-col :span="9">
			  	<el-card class="info_div">
			  		<p>最近发布</p>
			  		<ul>
			  			<li class="clearfix" v-for="(item, index) in userInfo.article" :key="index" v-if="index < 5">
			  				<a :href="seeArticle(item.mId, item.typeFile)" target="_blank" :title="item.title">
			  					<span class="omit">{{item.title}}</span>
			  					<samp>{{formatDate(item.registerTimeImg)}}</samp>
			  				</a>
			  			</li>
			  		</ul>
			  	</el-card>
			  </el-col>
			  <el-col :span="9">
			  	<el-card class="info_div">
			  		<p>下载信息</p>
			  		<ul>
			  			<li class="clearfix" v-for="(item, index) in userInfo.userDownloadInfo" :key="index" v-if="index < 5">
			  				<el-tooltip class="item" effect="dark" :content="item.information" placement="top-start">
				  				<a>
				  					<span class="omit">{{item.information}}</span>
				  					<samp>{{formatDate(item.created)}}</samp>
				  				</a>
						    </el-tooltip>
			  			</li>
			  		</ul>
			  	</el-card>
			  </el-col>
			</el-row>
		</el-header>
		<el-header style="margin: 10px 0;">
			<el-row :gutter="20">
				<el-col :span="6">
					<el-card>
						<div id="earth" style="height: 250px;"></div>
					</el-card>
				</el-col>
				<el-col :span="18">
					<el-card>
						<div id="articleWeek" style="height: 250px;"></div>
					</el-card>
				</el-col>
			</el-row>
		</el-header>
		<el-header style="margin: 10px 0;">
			<el-row :gutter="20">
				<el-col :span="6">
					<el-card>
						<div id="articleProportion" style="height: 250px;"></div>
					</el-card>
				</el-col>
				<el-col :span="18">
					<el-card>
						<div id="articleDistribution" style="height: 250px;"></div>
					</el-card>
				</el-col>
			</el-row>
		</el-header>
	</el-container>
</template>

<script>
	import { formatDate } from '../assets/js/publicAPI'
	import { informationlist, modifyUserInfo } from '../assets/js/api'
	export default {
		inject: ['reload'],
		name: 'myAuthorizeList',
		data() {
			return {
				userInfo: {
					uId: this.$store.state.user.uId,
			        userName: this.$store.state.user.userName,
			        nickname: this.$store.state.user.nickname,
			        HeadPortraitSrc: this.$store.state.user.HeadPortraitSrc,
			        sex: this.$store.state.user.sex,
					articleNum: 0,
					downloadMan: 0,
					downloadNext: 0,
					article: [],
					articleAll: 0,
					userDownloadInfo: [],
					articleDistribution: [],
					articleDistributionName: [],
					articleDistributionNum: [],
					articleWeek: [],
					articleWeekName: [],
					articleWeekNum: []
					
				},
				userInfoUp: {
					HeadPortraitSrc: '',
					nickname: '',
					sex: ''
				},
				action: this.URLS + '/index.php/Home/Index/upfile',
				infoModify: false
			}
		},
		watch: {
			// 监听当前值是否为空，并执行图表函数
			"userInfo.articleAll": function(newQuestion, oldQuestion) {
				if(this.userInfo.articleAll !== 0 && this.userInfo.articleNum !== 0) {
					this.articleProportion()
				}
			},
			// 监听当前值是否为空，并执行图表函数
			"userInfo.articleDistribution": function(newQuestion, oldQuestion) {
				if(this.userInfo.articleDistribution.length !== 0) {
					let _this = this
					this.userInfo.articleDistribution.find((obj, index) => {
						_this.userInfo.articleDistributionName.push(obj.xname)
						_this.userInfo.articleDistributionNum.push(parseInt(obj.num))
					})
					this.articleDistribution()
				}
			},
			// 监听当前值是否为空，并执行图表函数
			"userInfo.articleWeek": function(newQuestion, oldQuestion) {
				if(this.userInfo.articleWeek.length !== 0) {
					let _this = this
					this.userInfo.articleWeek.find((obj, index) => {
						_this.userInfo.articleWeekName.push(obj.date)
						_this.userInfo.articleWeekNum.push(parseInt(obj.counts))
					})
					this.articleWeek()
				}
			}
		},
		mounted() {
			this.articleProportion()
			this.articleDistribution()
		},
		methods: {
			// 获取上传图片的服务器端实际路径地址并保存到数组中
			obtainImgSrc(file, fileList) { 
		        console.log(file)
		        console.log(fileList)
		        if(file.response !== undefined) {
		          if (file.response.msg === '0') {
		            this.userInfoUp.HeadPortraitSrc = file.response.dataheadImg
		          }
		        }
		    },
		    handleAvatarSuccess(res, file) {
		        this.imageUrl = URL.createObjectURL(file.raw)
		    },
		    // 上传头像文件大小和格式验证
		    beforeAvatarUpload(file) {
		        const isJPG = file.type === 'image/jpeg'
		        const isLt2M = file.size / 1024 / 1024 < 2
		
		        if(!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG 格式!')
		        }
		        if(!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!')
		        }
		        return isJPG && isLt2M
		    },
			// 修改用户信息窗口关闭事件
			onuserInfoUpleave () {
				console.log('关闭')
				this.userInfoUp.nickname = ''
				this.userInfoUp.sex = ''
				this.userInfoUp.HeadPortraitSrc = ''
			},
			// 修改用户信息窗口显示事件
			onuserInfoUp () {
				console.log('开启')
				this.userInfoUp.HeadPortraitSrc = this.userInfo.HeadPortraitSrc
				this.userInfoUp.nickname = this.userInfo.nickname || this.userInfo.userName
				this.userInfoUp.sex = this.userInfo.sex || '1'
			},
			// 修改用户信息
			modifyInfo() {
		        if(this.userInfoUp.nickname.length === 0) {
		          this.$alert('请填写昵称', '警告', {
		            confirmButtonText: '确定'
		          })
		        } else {
		          modifyUserInfo(this, this.userInfoUp.HeadPortraitSrc, this.userInfoUp.nickname, this.userInfoUp.sex)
		        }
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
			// 查看文章路径跳转
		    seeArticle (mid, typeFile) {
		    	var articleUrl = ''
		    	switch (typeFile) {
		    		case 'img':
		    			articleUrl = this.URLS2 + '#/article/' + mid + '/backstage/0/0/'
					    break;
		    		case 'psd':
		    			articleUrl = this.URLS2 + '#/article/' + mid + '/backstage/0/0/'
					    break;
		    		case 'video':
		    			articleUrl = this.URLS2 + '#/articleVideo/' + mid + '/backstage/0/0/'
					    break;
		    	}
		    	return articleUrl
		    },
		    // 文章占比图标
		    articleProportion () {
		    	let _this = this
		    	// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('articleProportion'))
				// 绘制图表
				myChart.setOption({
					title : {
				        text: '发布占比',
				        subtext: '',
				        x:'left'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        bottom: '20px',
				        data: ['全站发布','个人发布']
				    },
				    series : [
				        {
				            name: '文章发布',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data:[
				                {value:_this.userInfo.articleAll, name:'全站发布'},
				                {value:_this.userInfo.articleNum, name:'个人发布'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				})
		    },
		    // 文章分布
		    articleDistribution () {
		    	let _this = this
		    	// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('articleDistribution'))
				// 绘制图表
				myChart.setOption({
					title : {
				        text: '项目分布',
				        subtext: '',
				        x:'left'
				    },
				    color: ['#3398DB'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				        left: '1%',
				        right: '1%',
				        bottom: '2%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : _this.userInfo.articleDistributionName,
				            axisTick: {
				                alignWithLabel: false,
				                interval: 0
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],
				    series : [
				        {
				            name:'发布数',
				            type:'bar',
				            barWidth: '60%',
				            data:_this.userInfo.articleDistributionNum
				        }
				    ]
				})
		    },
			// 当前用户最近一周发布情况
			articleWeek() {
				let _this = this 
					// 基于准备好的dom，初始化echarts实例
			      let myChart = this.$echarts.init(document.getElementById('articleWeek'))
			      // 绘制图表
			      myChart.setOption({
			          title: { 
			            text: '一周发布',
			            subtext: '',
			            x:'left'
			          },
			          tooltip: {
			            trigger: 'axis'
			          },
			          toolbox: {
			            feature: {
			              saveAsImage: {}
			            }
			          },
			          grid: {
			            left: '3%',
			            right: '4%',
			            bottom: '3%',
			            containLabel: true
			          },
			          xAxis: {
			            type: 'category',
			            data: _this.userInfo.articleWeekName,
			            boundaryGap: false,
			            axisLine: {
			              show: false
			            },
			            axisTick: {
			              show: false,
			              interval: 0
			            }
			          },
			          yAxis: {
			            show: true,
			            name: "",
			            nameLocation: 'end',
			            boundaryGap: ['0', '10%'],
			            nameTextStyle: {
			              backgroundColor: 'red'
			            },
			            axisLine: {
			              show: false
			            },
			            axisTick: {
			              show: false
			            }
			          },
			          series: [{
			              data: _this.userInfo.articleWeekNum,
			              name: '发布量',
			              type: 'line',
			              symbolSize: 12,
			              symbol: 'diamond',
			              smooth: true,
			              emphasis: {
			                lineStyle: {
			                  color: '#0077E6'
			                }
			              }
			          }]
			      });
			}
		},
		created() {
			// 获取当前用户页面所需的信息
			informationlist(this, '', this.$store.state.user.uId)
		}
	}
</script>

<style scoped>
	.icon {width: 1em;height: 1em; vertical-align: -0.15em;fill: currentColor;overflow: hidden; margin-left: .5em;}
	.el-row{width: 100%;}
	.el-header{ height: auto !important; padding: 0;}
	.userInfo {}
	.userInfo .userInfoyTop{}
	.userInfo .userInfoyTop li{float: left; height: 88px;}
	.userInfo .userInfoyTop li:nth-child(2){padding: 10px;height: 68px;}
	.userInfo .userInfoyTop li img{width: 88px; height: 88px; border-radius: 100px;}
	.userInfo .userInfoyTop li span,.userInfo .userInfoyTop li samp{display: block; font-size: 18px; font-weight: bold; color: #606266; height: 30px; line-height: 30px;}
	.userInfo .info {color: #606266; font-weight: bold; text-align: justify;}
	.userInfo .info samp{font-size: 18px !important;}
	.userInfo .info span{font-size: 18px !important; color: #F56C6C !important;}
	.userInfo .eChartsHistogram {height: 200px;}
	.userInfo .info_div{min-height: 220px;}
	.userInfo .info_div p{ padding-bottom: 10px; border-bottom: 1px solid #DCDFE6; margin-bottom: 10px;}
	.userInfo .info_div ul li{padding: 3.8px 0;}
	.userInfo .info_div ul li a{line-height: 20px;}
	.userInfo .info_div ul li a span{float: left; display: block; width: 75%;}
	.userInfo .info_div ul li a samp{float: right;}
	.headPortrait{display:block;margin:50px auto 10px;border-radius:200px;width:150px;height:150px}
	.avatar-uploader{width: 88px; height: auto; float: left; margin-right: 10px;}
	.avatar_div01 .el-upload{width: auto !important; height: auto !important; border-radius: initial !important;}
  .avatar_div01 .el-upload .avatar_span{top:0;left: 0;}
	.avatar-uploader .el-upload{cursor:pointer;position:relative;overflow:hidden; }
	.avatar-uploader .el-upload:hover{border-color:#409EFF}
	.avatar-uploader-icon{font-size:28px;color:#8c939d;width:150px!important;height:150px!important;line-height:150px!important;text-align:center}
	.avatar{width:88px;height:88px;display:block;border-radius: 100px; position: relative;}
	.avatar_span{display: none;width: 88px;height: 88px;position: absolute;top: 7%; left: 3%;text-align: center;color: #fff;line-height: 88px;font-weight: bold;background: #09090985;}
	.avatar_div:hover,.avatar_span{display: block;}
	.inputInfo{width:385px;height:40px;line-height:40px;margin:auto auto 20px}
	.inputInfo .el-aside{background:0 0;width:50px!important;height:auto}
	.inputInfo .el-main{padding:0;}
	.inputInfo .el-main .el-input__inner{width: 200px !important;}
</style>
