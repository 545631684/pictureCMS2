<template>
	<el-container>
		<el-main>
			<p>
				<el-button type="primary" size="medium" @click="groupAdd = true">添加用户组</el-button>
				<el-alert title="重要提示" description="默认设计师、管理员权限组为不可删除，不可修改。指定删除的权限组（删除的权限组下有用户绑定），默认修改为设计师权限组" type="warning" show-icon style="width: 600px; margin: 20px 0;"></el-alert>
				<el-dialog title="添加用户组" :visible.sync="groupAdd" width="30%" center>
					<el-input size="small" v-model="groupNameAdd" placeholder="组名称"></el-input>
					<div v-for="(time, index) in groups" style="margin-top: 25px;">
						<el-checkbox :indeterminate="time.isIndeterminate" v-model="time.checkAll" @change="handleCheckAllChange(time.checkAll, index)">{{time.name}}</el-checkbox>
						<el-checkbox-group v-model="time.checkedCities" @change="handleCheckedCitiesChange(time.checkedCities, index)" style="margin-left: 25px;">
							<el-checkbox v-for="(city, index) in time.cityOptions" :label="city" :key="city" name="type">{{city}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<span slot="footer" class="dialog-footer">
					    <el-button @click="groupAdd = false">取 消</el-button>
					    <el-button type="primary" @click="groupUserAdd">确 定</el-button>
					</span>
				</el-dialog>
			</p>
			<el-table v-loading="loading" :data="usergroups" style="width: 80% !important; margin-top: 20px;">
				<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="title" label="组名称" width="180" align="center"></el-table-column>
				<el-table-column prop="rules" label="权限" width="300" align="center">
					<template slot-scope="slotProps">
						{{getGroupUserName(slotProps.row.rules)}}
					</template>
				</el-table-column>
				<el-table-column label="管理" align="center" width="500">
					<template slot-scope="slotProps">
						<el-button size="mini" @click="updateGroupsShow(slotProps.row.id)" :disabled="slotProps.row.disabled === '1' ? true : false">修改</el-button>
						<el-dialog title="修改用户组" :visible.sync="groupUpdate" width="30%" center v-if="groupUpdate && groupUpdateSingle !== {}">
							<el-input size="small" v-model="groupUpdateSingle[0].title" placeholder="组名称"></el-input>
							<div v-for="(time, index) in groupUpdateSingle[0].rules" style="margin-top: 25px;">
								<el-checkbox :indeterminate="time.isIndeterminate" v-model="time.checkAll" @change="handleCheckAllChangeUp(time.checkAll, index, groupUpdateSingle[0].id)">{{time.name}}</el-checkbox>
								<el-checkbox-group v-model="time.checkedCities" @change="handleCheckedCitiesChangeUp(time.checkedCities, index, groupUpdateSingle[0].id)" style="margin-left: 25px;">
									<el-checkbox v-for="(city, index) in time.cityOptions" :label="city" :key="city" name="type">{{city}}</el-checkbox>
								</el-checkbox-group>
							</div>
							<span slot="footer" class="dialog-footer">
							    <el-button @click="groupUpdate = false">取 消</el-button>
							    <el-button type="primary" @click="updateGroups(slotProps.row.id)">确 定</el-button>
							</span>
						</el-dialog>
						<el-button size="mini" type="danger" plain @click="groupsDelete(slotProps.row.id)" :disabled="slotProps.row.disabled === '0' ? true : false">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
	</el-container>
</template>

<script>
	import { auth_list, auth_groupadd, auth_grouplist, auth_groupedit, auth_groupone, groupdel } from '../assets/js/api'
	export default {
		inject: ['reload'],
		name: 'myUserGroup',
		data() {
			return {
				groupNameAdd: '',
				loading: true,
				groupAdd: false,
				groupAddInspect: false,
				groupUpdate: false,
				groups: [],
				groupsInitial: [],
				usergroups: [],
				groupUpdateSingle: {},			
				groupUpdateInspect: false			
			}
		},
		watch: {
			// 值为false时清空所有权限选中状态，权限组名称
			groupAdd:function (newQuestion, oldQuestion) {
		      if (this.groupAdd === false) {
		      	this.groups.find(obj => {
		      		obj.rules === null ? obj.isIndeterminate = false : obj.isIndeterminate = true
		      		obj.checkedCities = []
		      		obj.checkAll = false
		      	})
		      	this.groupNameAdd = ''
		      }
		    },
		    // 值为false时groupUpdateSingle改为空数组
			groupUpdate:function (newQuestion, oldQuestion) {
		      if (this.groupUpdate === false) {
		      	this.groupUpdateSingle = {}
		      }
		  }
		},
		methods: {
			// 新增组单个功能组全选
			handleCheckAllChange(val, index) {
				this.groups[index].checkedCities = val ? this.groups[index].cityOptions : []
				this.groups[index].isIndeterminate = false
				this.groupInspect('add', null)
			},
			// 单个功能选中并更新当前上级选择框的状态更新
			handleCheckedCitiesChange(value, index) {
				let checkedCount = value.length
				this.groups[index].checkAll = checkedCount === this.groups[index].cityOptions.length
				this.groups[index].isIndeterminate = checkedCount > 0 && checkedCount < this.groups[index].cityOptions.length
				this.groupInspect('add', null)
			},
			// 修改组单个功能组全选
			handleCheckAllChangeUp(val, index, id) {
				this.groupUpdateSingle[0].rules[index].checkedCities = val ? this.groupUpdateSingle[0].rules[index].cityOptions : new Array()
				this.groupUpdateSingle[0].rules[index].isIndeterminate = false
				this.groupInspect('update', id)
				
			},
			// 修改单个功能选中并更新当前上级选择框的状态更新
			handleCheckedCitiesChangeUp(value, index, id) {
				let checkedCount = value.length
				this.groupUpdateSingle[0].rules[index].checkAll = checkedCount === this.groupUpdateSingle[0].rules[index].cityOptions.length
				this.groupUpdateSingle[0].rules[index].isIndeterminate = checkedCount > 0 && checkedCount < this.groupUpdateSingle[0].rules[index].cityOptions.length
				this.groupInspect('update', id)
			},
			// 删除权限组
			groupsDelete(id) {
				this.$confirm('此操作将删除该权限组, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 关闭loading
    				this.setLoading(true)
					groupdel(this, id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 修改权限组框的显示
			updateGroupsShow (id) {
		      	// 当前权限组赋值给groupUpdateSingle变量
				auth_groupone(this, id)
			},
			// 修改权限组
			updateGroups (id) {
				if (this.groupUpdateSingle[0].title.length === 0) {
					this.$alert('请填写组名称', '警告', {confirmButtonText: '确定'})
				} else if (this.groupUpdateInspect === false) {
					this.$alert('请填写权限，不能为空', '警告', {confirmButtonText: '确定'})
				} else {
					// 关闭loading
    				this.setLoading(true)
					// 有二级权限的checkedCities字段内容改字符串‘[]’
					this.groupUpdateSingle[0].rules.find(obj => {obj.checkedCities.length === 0 ? obj.checkedCities = '[]' : obj.checkedCities})
					// 修改权限组接口
					auth_groupedit(this, {id: id, title: this.groupUpdateSingle[0].title, rules: this.groupUpdateSingle[0].rules})
				}
			},
			// 添加权限组
			groupUserAdd () {
				if (this.groupNameAdd.length === 0) {
					this.$alert('请填写组名称', '警告', {confirmButtonText: '确定'})
				} else if (this.groupAddInspect === false) {
					this.$alert('请填写权限，不能为空', '警告', {confirmButtonText: '确定'})
				} else {
					// 关闭添加用户组弹窗
  					this.groupAdd = false
					// 有二级权限的checkedCities字段内容改字符串‘[]’
					this.groups.find(obj => {
						obj.checkedCities.length === 0 ? obj.checkedCities = '[]' : obj.checkedCities
						obj.cityOptions.length === 0 ? obj.cityOptions = '[]' : obj.cityOptions
					})
					// 关闭loading
    				this.setLoading(true)
					// 添加用户组
					auth_groupadd(this, {title: this.groupNameAdd, rules: this.groups})
				}
			},
			// 检查权限功能是否选中
			// type: 检查的类型      gid（string）： 权限组id
			groupInspect (type, gid) {
				var temp = []
				var i = 0
				switch (type) {
					case 'add':
						// 通过find喊出循环数组，判断每个数组对象一级或二级功能有没有被选中temp自身+1赋值，判断temp里有没有被选中的返回对错
					    this.groups.find(obj => {
					    	obj.checkAll === true ? temp.push(1) : obj.checkedCities.length >= 1 ? temp.push(1) : temp.push(0)
				    	})
					    temp.filter(num => {return num === 1}).length >= 1 ? this.groupAddInspect = true : this.groupAddInspect = false
					    break;
					case 'update':
						// 通过find喊出循环数组，判断每个数组对象一级或二级功能有没有被选中temp自身+1赋值，判断temp里有没有被选中的返回对错
						if (gid !== null||undefined||'') {
							this.groupUpdateSingle[0].rules.find(obj => {
								obj.checkAll === true ? temp.push(1) : obj.checkedCities.length >= 1 ? temp.push(1) : temp.push(0)
							})
							temp.filter(num => {return num === 1}).length >= 1 ? this.groupUpdateInspect = true : this.groupUpdateInspect = false
						}
					    break;
				}
				temp = []
			},
			// 获取当前权限组所有权限名称
			getGroupUserName (obj) {
				var names = []
				var i = 0
				obj.find( o => {
					// 有二级权限的添加一级权限名称
					o.checkAll === true ? names.push(o.name) : o.checkedCities.length >= 1 ? names.push(o.name) : console.log()
					// 二级权限选中状态不为空全部添加名称
					o.checkedCities.length >= 1 ? o.checkedCities.find(checked => {names.push(checked)}) : console.log()
					i++
				})
				return names.join(', ')
			},
			// 开启/关闭loading
			setLoading (Boolean) {
				this.loading = Boolean
			}
		},
	    created() {
	    	// 获取权限的所有功能页
	    	auth_list(this)
	    	// 获取权限组list
	    	auth_grouplist(this)
	    	// 关闭loading
	    	this.setLoading(false)
	    }
	}
</script>

<style scoped>

</style>


// WEBPACK FOOTER //
// src/components/myUserGroup.vue