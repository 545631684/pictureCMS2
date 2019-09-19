<template>
	<div>
		<el-button icon="el-icon-plus" type="primary" @click="addUserShow()">添加用户</el-button>
		<el-dialog title="添加用户" :visible.sync="addUserdiv" width="30%" center>
		  <div class="demo-input-suffix">
				邮箱:
				<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入用户名"  name="" id="" v-model="adduser.userName" clearable></el-input>
				<span class="intro">请填写自己常用的邮箱作为自己的用户名</span>
			</div>
		  <div class="demo-input-suffix">
				昵称:
				<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入昵称"  name="" id="" v-model="adduser.nickname" clearable></el-input>
			</div>
			<div class="demo-input-suffix">
				性别:
				<el-radio-group v-model="adduser.sex" style="margin-left: 43px;">
			      	<el-radio label="1">男</el-radio>
			      	<el-radio label="0">女</el-radio>
			    </el-radio-group>
			</div>
		  <div class="demo-input-suffix">
				密码:
				<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入密码"  name="" id="" v-model="adduser.Password" clearable></el-input>
				 <span class="intro">请用数字+字母+字符（最少8位数）密码结构</span>
			</div>
			<div class="demo-input-suffix">
				权限:
				<el-select class="ma10" v-model="adduser.permissions" placeholder="请选择权限组" filterable clearable style="margin-left: 43px;">
					<el-option v-for="item in usergroups" :key="item.title" :label="item.title" :value="item.title">
					</el-option>
				</el-select>
			</div>
			<div class="demo-input-suffix">
				前台显示:
				<el-radio-group v-model="adduser.webShow" style="margin-left: 15px;">
			      	<el-radio label="1">启用</el-radio>
			      	<el-radio label="0">禁用</el-radio>
	    	</el-radio-group>
	    	<span class="intro" style="margin-left: 73px;">前台用户搜索显示</span>
			</div>
			<div class="demo-input-suffix">
				账号状态:
				<el-radio-group v-model="adduser.state" style="margin-left: 15px;">
			      	<el-radio label="0">启用</el-radio>
			      	<el-radio label="2">禁用</el-radio>
		    </el-radio-group>
		    <span class="intro" style="margin-left: 73px;">选择禁用后可在用户回收站中还原</span>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addUserCancel">取 消</el-button>
		    <el-button type="primary" @click="addUser" :loading="handleUpdateLoading">确 定</el-button>
		  </span>
		</el-dialog>
	  <el-table v-loading="loading" :data="userList" style="width: 100% !important;">
	    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
	    <el-table-column prop="userName" label="用户名" width="200" align="center"></el-table-column>
	    <el-table-column prop="nickname" label="昵称" align="center" width="100">
	    	<template slot-scope="scope">
	    		<img :src="URLS2 + scope.row.HeadPortraitSrc" alt="" style="width: 40px; height: 40px; border-radius: 50px;"/><br />
	        <span>{{scope.row.nickname}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column prop="registerTime" label="创建时间" align="center" width="180"></el-table-column>
	    <el-table-column prop="endTime" label="最后登陆" align="center" width="180"></el-table-column>
	    <el-table-column prop="permissions" label="权限组" align="center" width="180">
	      <template slot-scope="scope">
	        {{getUserGroupName(scope.row.permissions)}}
	      </template>
	    </el-table-column>
	    <el-table-column prop="webShow" label="前台显示" align="center" width="180">
	      <template slot-scope="scope">
	      	<svg v-if="scope.row.webShow === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
					<svg v-if="scope.row.webShow === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
	      </template>
	    </el-table-column>
	    <el-table-column label="操作" align="center" width="200">
	      <template slot-scope="scope">
	        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
	        <el-dialog title="编辑用户信息" :visible.sync="centerDialogVisible" width="30%" center>
	          <div class="demo-input-suffix">
							用户名:
							<el-input style="width: auto;margin-left: 28px;" class="el-input--suffix" placeholder="请输入用户名"  name="" id="" v-model="row.userName" clearable disabled></el-input>
						</div>
	          <div class="demo-input-suffix">
							昵称:
							<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入昵称"  name="" id="" v-model="row.nickname" clearable></el-input>
						</div>
						<div class="demo-input-suffix">
							性别:
							<el-radio-group v-model="row.sex" style="margin-left: 43px;">
						      	<el-radio label="1">男</el-radio>
						      	<el-radio label="0">女</el-radio>
						    </el-radio-group>
						</div>
	          <div class="demo-input-suffix">
							密码:
							<el-input style="width: auto;" class="el-input--suffix" placeholder="不输入则不会修改密码"  name="" id="" v-model="row.Password" clearable></el-input>
							 <span class="intro">请用数字+字母+字符（最少8位数）密码结构</span>
						</div>
						<div class="demo-input-suffix">
							权限:
							<el-select class="ma10" v-model="row.permissions" placeholder="请选择权限组" filterable clearable style="margin-left: 43px;">
								<el-option v-for="item in usergroups" :key="item.title" :label="item.title" :value="item.title">
								</el-option>
							</el-select>
						</div>
						<div class="demo-input-suffix">
							前台显示:
							<el-radio-group v-model="row.webShow" style="margin-left: 15px;">
						      	<el-radio label="1">启用</el-radio>
						      	<el-radio label="0">禁用</el-radio>
				    	</el-radio-group>
				    	<span class="intro" style="margin-left: 73px;">前台用户搜索显示</span>
						</div>
						<div class="demo-input-suffix">
							账号状态:
							<el-radio-group v-model="row.state" style="margin-left: 15px;">
						      	<el-radio label="1">启用</el-radio>
						      	<el-radio label="2">禁用</el-radio>
					    </el-radio-group>
					    <span class="intro" style="margin-left: 73px;">选择禁用后可在用户回收站中还原</span>
						</div>
	          <span slot="footer" class="dialog-footer">
	            <el-button @click="updatePwdCancel">取 消</el-button>
	            <el-button type="primary" @click="updatePwd" :loading="handleUpdateLoading">确 定</el-button>
	          </span>
	        </el-dialog>
	      </template>
	    </el-table-column>
	  </el-table>
  </div>
</template>

<script>
  import { formatDate } from '../assets/js/publicAPI'
  import { userList, updatePwd2, delUser, permissions, auth_grouplist, guanliuser_save, guanliAddUser } from '../assets/js/api'
  export default {
  	inject: ['reload'],
    name: 'myUserList',
    data() {
      return {
        loading: true,
        userList: [],
        centerDialogVisible: false,
        row: {},
        adduser: {
        	HeadPortraitSrc:"image/sq17.png",
			Password:"",
			nickname:"",
			permissions:"",
			sex:"1",
			state:"0",
			userName:"",
			webShow:"1",
        },
        addUserdiv: false,
        handleUpdateLoading: false,
        userGroupUpdate: false,
        usergroups: [],
        usergroupName: '',
        URLS2: this.URLS2,
      }
    },
    methods: {
    	// 用户信息编辑框弹出
      handleEdit(index, row) {
      	let _this = this
        this.centerDialogVisible = true
        // 深拷贝处理
        this.userList.find((o, index) => {
        	o.uId === row.uId ? _this.row = o : o = o
        })
        this.row = JSON.stringify(row)
				this.row = JSON.parse(this.row)
				// 权限id转名称，清空密码,账号状态修改
				this.usergroups.find((o, index) => {
					if (o.id === _this.row.permissions) {
						_this.row.permissions = o.title
						_this.row.Password = ''
						_this.row.state !== '2' ? _this.row.state = '1' : _this.row.state = _this.row.state
					}
				})
      },
      // 添加用户
      addUser() {
      	if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.adduser.userName))) {
      		this.$alert('邮箱格式错误，请重新输入', '警告', { confirmButtonText: '确定' })
      	} else if (this.adduser.nickname.replace(/\s*/g,"").length === 0) {
      		this.$alert('请输入昵称', '警告', { confirmButtonText: '确定' })
      	} else if (this.adduser.sex.length === 0) {
      		this.$alert('请选择性别', '警告', { confirmButtonText: '确定' })
      	} else if (this.adduser.Password.replace(/\s*/g,"").length === 0) {
      		this.$alert('请输入密码', '警告', { confirmButtonText: '确定' })
      	} else if (!(/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/.test(this.adduser.Password))) {
      		this.$alert('输入的密码过于简单请重新输入', '警告', { confirmButtonText: '确定' })
      	} else if (this.adduser.permissions.length === 0) {
      		this.$alert('请选择权限组名称', '警告', { confirmButtonText: '确定' })
      	} else if (this.adduser.webShow.length === 0) {
      		this.$alert('请选择前台显示，开启/禁用', '警告', { confirmButtonText: '确定' })
      	} else if (this.adduser.state.length === 0) {
      		this.$alert('请选择账号状态，开启/禁用', '警告', { confirmButtonText: '确定' })
      	} else {
      		this.handleUpdateLoading = true
      		guanliAddUser(this, this.adduser)
      	}
      	
      },
      // 开启添加用户窗口
      addUserShow() {
      	this.addUserdiv = true
      },
      // 关闭添加用户窗口
      addUserCancel() {
      	this.addUserdiv = false
      	this.adduser = {
        	HeadPortraitSrc:"",
			Password:"",
			nickname:"",
			permissions:"",
			sex:"1",
			state:"0",
			userName:"",
			webShow:"1",
        }
      },
      // 编辑框关闭
      updatePwdCancel() {
        this.centerDialogVisible = false
        this.row = {}
      },
      // 用户编辑信息确认提交
      updatePwd() {
      	if (this.row.nickname.replace(/\s*/g,"").length === 0) {
      		this.$alert('请输入昵称', '警告', { confirmButtonText: '确定' })
      	} else if (this.row.sex.length === 0) {
      		this.$alert('请选择性别', '警告', { confirmButtonText: '确定' })
      	} else if (this.row.Password.replace(/\s*/g,"").length !== 0 && !(/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/.test(this.row.Password))) {
      		this.$alert('输入的密码过于简单请重新输入', '警告', { confirmButtonText: '确定' })
      	} else if (this.row.permissions.length === 0) {
      		this.$alert('请选择权限组名称', '警告', { confirmButtonText: '确定' })
      	} else if (this.row.webShow.length === 0) {
      		this.$alert('请选择前台显示，开启/禁用', '警告', { confirmButtonText: '确定' })
      	} else if (this.row.state.length === 0) {
      		this.$alert('请选择账号状态，开启/禁用', '警告', { confirmButtonText: '确定' })
      	} else {
      		this.handleUpdateLoading = true
      		guanliuser_save(this, this.row)
      	}
      },
      formatDate(time) { // 时间戳转换
        if(time !== null) {
          let date = new Date(parseInt(time) * 1000)
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        } else {
          return '暂无'
        }
      },
	    // 遍历权限组list，通过id获取name
	    getUserGroupName (id) {
	    	var temp = ''
	    	this.usergroups.find(obj => {if (obj.id === id) { temp = obj.title }})
	      return temp
	    },
	    // 遍历权限组list，通过name获取id
	    getUserGroupId (name) {
	    	var temp = ''
	    	this.usergroups.find(obj => {if (obj.title === name) { temp = obj.id }})
	      return temp
	    }
    },
    created() {
    	// 获取用户list
      userList(this)
      // 获取权限组list
      auth_grouplist(this)
    }
  }
</script>

<style scoped>
.intro {color: gray;font-weight: normal;font-size: 12px;border: 1px solid silver; border-left-width: 4px;padding: 3px 4px 2px 4px; line-height: 14px; height: 20px;margin-left: 6px;}
.v-modal{position:relative}
.upPwd{padding:20px 10px}
.upPwd span{display:block;float:left;width:20%;height:40px;line-height:40px;text-align:center}
.upPwd input{display:block;float:left;width:80%}
.icon{width:1.5em;height:1.5em;vertical-align:-.15em;fill:currentColor;overflow:hidden;margin-left:.5em}
.demo-input-suffix{margin-bottom:15px}
.demo-input-suffix .el-input{margin-left:43px}
</style>


// WEBPACK FOOTER //
// src/components/myUserList.vue