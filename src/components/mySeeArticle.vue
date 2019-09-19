<template>
  <el-container>
    <el-header>
      <div class="tab clearfix">
        <p>用户：</p>
        <ul>
          <li :class="{on:num4 === ''}" @click="tab4('', '全部', '')">全部</li>
          <li v-for="(item, index) in userList" :key="index" :class="{on:index === num4}" v-on:click.stop="tab4(index, item.nickname, item.uId)" v-if="item.state !== '2' && item.webShow === '1'">{{item.nickname}}</li>
        </ul>
      </div>
      <div class="tab clearfix">
        <p>项目：</p>
        <ul>
          <li :class="{on:num1 === ''}" @click="tab1('', '全部', '')">全部</li>
          <li v-for="(item, index) in projects" :key="index" :class="{on:index === num1}" v-on:click.stop="tab1(index, item.xname, item.pid)" v-if="item.state === '1' && item.webShow === '1'">{{item.xname}}</li>
        </ul>
      </div>
      <div class="tab clearfix">
        <p>类型：</p>
        <ul>
          <li :class="{on:num2 === ''}" @click="tab2('', '全部', '')">全部</li>
          <li v-for="(item, index) in types" :key="index" :class="{on:index === num2}" v-on:click.stop="tab2(index, item.lname, item.tid)" v-if="item.state === '1' && item.webShow === '1'">{{item.lname}}</li>
        </ul>
      </div>
      <div class="tab clearfix" style="margin-bottom: 50px;">
        <p>分类：</p>
        <ul :class="{omit:showtype}">
          <li :class="{on:num3 === ''}" @click="tab3('', '全部', '', '', '')">全部</li>
          <li v-for="(item, index) in minTypes2" :key="index" :class="{on:index === num3}" v-on:click.stop="tab3(index, item.dname, item.did, item.tbid, item.pbid)" v-html="item.dname"></li>
          <li class="clearfix"></li>
          <a class="el-button--default is-plain" v-show="showtype" v-on:click.stop="showMinType()">点击查看全部分类</a>
          <a class="el-button--default is-plain" v-show="!showtype" v-on:click.stop="hideMinType()">收起</a>
        </ul>
      </div>
       <el-alert title="带💗️标志为当前用户发布的文章" type="info" show-icon style="width: 55% !important;"></el-alert>
      <el-table v-loading="loading" :data="article3" style="width: 80% !important;">
        <el-table-column prop="mId" label="id" width="100" align="center">
        	<template slot-scope="scope">
        		{{myarticle(scope.row.uId, scope.row.mId)}}<br />
        		<svg class="icon svg-icon" aria-hidden="true" v-if="returnArticleType('img', scope.row.mId)">
              <use xlink:href="#icon-picture"></use>
            </svg>
						<svg class="icon svg-icon" aria-hidden="true" v-if="returnArticleType('psd', scope.row.mId)">
              <use xlink:href="#icon-web-psd"></use>
            </svg>
						<svg class="icon svg-icon" aria-hidden="true" v-if="returnArticleType('video', scope.row.mId)">
              <use xlink:href="#icon-shipinbofangyingpian"></use>
            </svg>
        	</template>
        </el-table-column>
        <el-table-column prop="img" label="缩略图" width="100" align="left">
          <template slot-scope="scope" v-if="scope.row.srcs.length === 0">暂无图片</template>
          <template slot-scope="scope" v-if="scope.row.srcs.length !== 0" >
          	<div style="width: 100px;height: 100px;position: relative;overflow: hidden; background: #CCCCCC;">
          		<viewer :images="viewer(scope.row.srcs[0])">
	            <img :src="URLS2 + scope.row.srcs[0]" alt="" width="90" height="100" style="position: absolute;display: block;height: auto;width: 100px;"/>
	            </viewer>
          	</div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="400" align="center"></el-table-column>
        <el-table-column prop="registerTimeImg" label="发布时间" align="center" width="160">
          <template slot-scope="scope">
            {{formatDate(scope.row.registerTimeImg)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button style="margin-right: 10px;" v-on:click.stop="seeArticle(scope.row.mId, scope.row.typeFile)" type="success" size="mini" plain>查看</el-button>
            <el-button type="primary" size="mini" v-on:click.stop="modifyArticle(scope.row.mId, scope.row.typeFile, scope.row.uId)" plain>更改</el-button>
            <el-button type="danger" size="mini" v-on:click.stop="deleteArticle(scope.row.mId, scope.row.uId)" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="width: 470px;margin: 0 0 0 20%;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="dataList"
          layout="total, prev, pager, next"
          :total="article2.length">
        </el-pagination>
      </div>
    </el-header>
  </el-container>
</template>

<script>
import { formatDate, getProjectID, getProjectName, getTypesID, getTypesName } from '../assets/js/publicAPI'
import { administrationArticleAll, administrationArticleQuery, delArticle2, userList2 } from '../assets/js/api'
export default {
	inject: ['reload'],
  name: 'mySeeArticle',
  data () {
    return {
      loading: true,
      types: this.$store.state.user.types,
      projects: this.$store.state.user.projects,
      minTypes: this.$store.state.user.minType,
      minTypes2: this.$store.state.user.minType,
      article: [],
      article2: [],
      article3: [],
      userList: [],
      URLS2: this.URLS2,
      num1: '',
      num2: '',
      num3: '',
      num4: '',
      user: {
        id: '',
        name: '',
        index: ''
      },
      xname: {
        id: '',
        name: '',
        index: ''
      },
      lname: {
        id: '',
        name: '',
        index: ''
      },
      dnames: {
        pbid: '',
        tbid: '',
        did: '',
        name: '',
        index: ''
      },
      showtype: true,
      currentPage1: 1,
      dataList: 4,
      
    }
  },
  watch: {
    article:function (newQuestion, oldQuestion) {
    	let _this = this
      this.article2 = this.article
      this.article.find((obj, index) => {
      	if (index < _this.dataList) {
      	  _this.$set(_this.article3, _this.article3.length, obj)
      	}
      })
    },
    'lname.name':function (newQuestion, oldQuestion) {
    	if (this.num3 !== '') {
	    	this.num3 = this.dnames.pbid = this.dnames.tbid = this.dnames.did = this.dnames.name = this.dnames.index = ''
    	}
    	this.setdata()
    }
  },
  methods: {
  	// 返回查看数据
  	viewer (url) {
  		var urls = [this.URLS2 + url]
  		return urls
  	},
    handleSizeChange(val) {
//    console.log('每页 ' + val + '条');
    },
    handleCurrentChange(val) {
    	let _this = this
      // 抓取数据下标开始位置
      let begin = (this.dataList * val) - this.dataList
      // 抓取数据下标开结束位置
      let end = (this.dataList * val) - 1
      // 清空当前页显示数据
      this.article3 = []
      // 循环抓取从起始位置到结束位置的数据
      this.article2.find((obj, index) => {
      	if (index >= begin && index <= end) {
          _this.$set(_this.article3, _this.article3.length, obj)
        }
      })
    },
    // 项目按钮
    tab1 (index, name, pid) {
      if (name !== '全部') {
        this.num1 = index
        this.xname.id = pid
        this.xname.name = name
        this.xname.index = index
      } else {
        this.num1 = this.xname.id = this.xname.name = this.xname.index = ''
      }
      this.setdata()
    },
    // 类型按钮
    tab2 (index, name, tid) {
      if (name !== '全部') {
        this.num2 = index
        this.lname.id = tid
        this.lname.name = name
        this.lname.index = index
      } else {
        this.num2 = this.lname.id = this.lname.name = this.lname.index = ''
      }
      this.setdata()
    },
    // 分类按钮
    tab3 (index, name, did, tbid, pbid) {
      if (name !== '全部') {
        this.num3 = index
        this.dnames.pbid = pbid
        this.dnames.tbid = tbid
        this.dnames.did = did
        this.dnames.name = name
        this.dnames.index = index
      } else {
        this.num3 = this.dnames.pbid = this.dnames.tbid = this.dnames.did = this.dnames.name = this.dnames.index = ''
      }
      this.setdata()
    },
    // 用户按钮
    tab4 (index, name, uid) {
      if (name !== '全部') {
        this.num4 = index
        this.user.id = uid
        this.user.name = name
        this.user.index = index
      } else {
        this.num4 = this.user.id = this.user.name = this.user.index = ''
      }
      this.setdata()
    },
    resetTab () {
      this.num1 = this.xname.id = this.xname.name = this.xname.index = this.num2 = this.lname.id = this.lname.name = this.lname.index = ''
    },
    showMinType () {
      this.setdata()
      this.showtype = false
    },
    hideMinType () {
      this.setdata()
      this.showtype = true
    },
    /**
     * 选择类型动态修改，点击不同的项目、类型、分类显示相应的类型和分类
     * */
    setdata () {
    	let _this = this
      this.minTypes2 = []
      if (this.xname.id === '' && this.lname.id === '' && this.dnames.did === '') {
        this.minTypes2 = this.minTypes
      } else if (this.xname.id !== '' && this.lname.id === '' && this.dnames.did === '') {
        this.minTypes2 = this.minTypes
      } else if (this.xname.id === '' && this.lname.id !== '' && this.dnames.did === '') {
      	this.minTypes.find((obj, index) => {
      		if (_this.lname.id === obj.tbid && obj.states === '1' && obj.webShow === '1') {
            _this.minTypes2.push(obj)
          }
      	})
      } else if (this.xname.id === '' && this.lname.id === '' && this.dnames.did !== '') {
        this.resetTab()
        this.minTypes2 = this.minTypes
      } else if (this.xname.id !== '' && this.lname.id !== '' && this.dnames.did === '') {
        this.minTypes.find((obj, index) => {
      		if (_this.lname.id === obj.tbid  && obj.states === '1' && obj.webShow === '1') {
            _this.minTypes2.push(obj)
          }
      	})
      } else if (this.xname.id === '' && this.lname.id !== '' && this.dnames.did !== '') {
        this.minTypes.find((obj, index) => {
      		if (_this.lname.id === obj.tbid  && obj.states === '1' && obj.webShow === '1') {
            _this.minTypes2.push(obj)
          }
      	})
      } else if (this.xname.id !== '' && this.lname.id === '' && this.dnames.did !== '') {
        this.minTypes2 = this.minTypes
      } else if (this.xname.id !== '' && this.lname.id !== '' && this.dnames.did !== '') {
        this.minTypes.find((obj, index) => {
      		if (_this.lname.id === obj.tbid  && obj.states === '1' && obj.webShow === '1') {
            _this.minTypes2.push(obj)
          }
      	})
      }
      this.getArticle(this.xname.id, this.lname.id, this.dnames.did)
    },
    getArticle (xid, tid, did) {
      this.article2 = []
      this.article3 = []
      let condition = [], tmpeList = [], _this = this
      this.user.id !== '' ? condition[0] = this.user.id:condition[0] = ''
      this.xname.id !== '' ? condition[1] = this.xname.id:condition[1] = ''
      this.lname.id !== '' ? condition[2] = this.lname.id:condition[2] = ''
      this.dnames.did !== '' ? condition[3] = this.dnames.did:condition[3] = ''
      if (condition[0] !== '') {
      	this.article.find((obj, index) => {
      		if (condition[0] === obj.uId) {
            _this.article2.push(obj)
          }
      	})
      } else {
        this.article2 = this.article
      }
      if (condition[1] !== '') {
        tmpeList = this.article2
        this.article2 = []
        tmpeList.find((obj, index) => {
        	if (condition[1] === obj.projectid) {
            _this.article2.push(obj)
          }
        })
        tmpeList = []
      }
      if (condition[2] !== '') {
        tmpeList = this.article2
        this.article2 = []
        tmpeList.find((obj, index) => {
        	if (condition[2] === obj.typeid) {
            _this.article2.push(obj)
          }
        })
        tmpeList = []
      }
      if (condition[3] !== '') {
        tmpeList = this.article2
        this.article2 = []
        tmpeList.find((obj, index) => {
        	if (condition[3] === obj.detailsid) {
            _this.article2.push(obj)
          }
        })
        tmpeList = []
      }
      this.article2.find((obj, index) => {
      	if (index < _this.dataList) {
          _this.$set(_this.article3, _this.article3.length, obj)
        }
      })
      // 重置当前页数
      this.currentPage1 = 1
      // 关闭加载状态
//    this.loading = false
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
    // 修改文章路径跳转
    modifyArticle (mid, typeFile, uid) {
    	// 限制普通用户不可修改他人发布的文章
    	/*let implement = false
    	if (uid === this.$store.state.user.uId || this.$store.state.user.permissions === '2') {
    		implement = true
    	} else {
    		this.$alert('此文章不是当前用户发布，无权修改！', '警告', {
					confirmButtonText: '确定'
				})
    		implement = false
    	}*/
    	if (true) {
	    	switch (typeFile) {
	    		case 'img':
	    			this.$router.push('/backstage/imgUpdate/' + mid)
				    break;
	    		case 'psd':
	    			this.$router.push('/backstage/psdUpdate/' + mid)
				    break;
	    		case 'video':
	    			this.$router.push('/backstage/videoUpdate/' + mid)
				    break;
	    	}
    	}
    },
    // 查看文章路径跳转
    seeArticle (mid, typeFile) {
    	switch (typeFile) {
    		case 'img':
//  			this.$router.push('/article/' + mid + '/backstage/0/0/')
    			window.open('#/article/' + mid + '/backstage/0/0/', '_blank')
			    break;
    		case 'psd':
//  			this.$router.push('/article/' + mid + '/backstage/0/0/')
    			window.open('#/article/' + mid + '/backstage/0/0/', '_blank')
			    break;
    		case 'video':
//  			this.$router.push('/articleVideo/' + mid + '/backstage/0/0/')
    			window.open('#/articleVideo/' + mid + '/backstage/0/0/', '_blank')
			    break;
    	}
    },
    // 删除文章
    deleteArticle (mid, uid) {
      this.$confirm('此操作将删除该文件到回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle2(this, mid)
        this.article3 = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 💗️标出时当前用户的文章
    myarticle (uid, mid) {
    	return uid === this.$store.state.user.uId ? '💗️' + mid : mid
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
  created () {
    administrationArticleAll(this)
    userList2(this)
  }
}
</script>

<style scoped>
.omit{text-overflow:ellipsis; overflow:hidden; white-space:nowrap; height: 30px !important;}
.clearfix:after {content: ".";display: block;height: 0;clear: both;visibility: hidden;}
.el-header{background: none; height: auto !important; padding-bottom: 40px;}
.tab{width: 100%; height: auto; min-height: 30px; margin-bottom: 20px; position: relative;}
.tab p{font-weight: 400;color: #1f2f3d;font-size: 20px;margin: 0; float: left; width: 6%;}
.tab ul{float: left;width: 94%; height: auto;}
.tab ul li{float: left; height: 30px; line-height: 30px; margin: 0 10px;cursor: pointer;}
.tab ul li:hover{color: #409eff; font-weight: bold;}
.tab ul a{position: absolute;bottom: -40px;left: 44%;width: 160px;display: inline-block;line-height: 30px;white-space: nowrap;cursor: pointer;background: #fff;border: 1px solid #dcdfe6;border-top-color: rgb(220, 223, 230);border-right-color: rgb(220, 223, 230);border-bottom-color: rgb(220, 223, 230);border-left-color: rgb(220, 223, 230);border-color: #dcdfe6;color: #606266;-webkit-appearance: none;text-align: center;-webkit-box-sizing: border-box;box-sizing: border-box;outline: none;margin: 0;-webkit-transition: .1s;transition: .1s;font-weight: 500;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;font-size: 14px;border-radius: 4px;}
.tab ul a:hover{background: #fff;border-color: #409eff;color: #409eff;}
.tab ul li.on{color: #fff;background-color: #409eff;border-color: #f56c6c; display: inline-block;white-space: nowrap;cursor: pointer;border: 1px solid #dcdfe6;-webkit-appearance: none;text-align: center;-webkit-box-sizing: border-box;box-sizing: border-box; outline: 0; margin: 0;-webkit-transition: .1s;transition: .1s;font-weight: 500;padding: 5px 10px;font-size: 14px;border-radius: 4px;line-height: 20px;}
table{ width: 100% !important;}
.icon {width: 25px;height: 25px;vertical-align: -0.15em;fill: currentColor;overflow: hidden;}
</style>

<style>
  .el-pagination span:not([class*=suffix]){float: right !important;}
  .cell{padding: 0 !important;}
</style>



// WEBPACK FOOTER //
// src/components/mySeeArticle.vue