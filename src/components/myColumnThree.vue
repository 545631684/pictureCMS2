<template>
	<el-container class="clearfix">
		<el-header style="width: 100%; height: 40px; padding: 0; margin-bottom: 20px;">
			<el-select v-model="Tvalue" clearable placeholder="类型选择" style="float: left;margin-right: 10px;">
			    <el-option
			      v-for="item in tList"
			      :key="item.tid"
			      :label="item.lname"
			      :value="item.tid">
			    </el-option>
			  </el-select>
			<el-row class="demo-autocomplete" style="width: 200px; margin-right: 10px; float: left;">
				<el-col :span="24">
					<el-autocomplete class="inline-input" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入关键字进行搜索" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
				</el-col>
			</el-row>
			<el-button type="primary" style="float: left;" @click="search()">搜索</el-button>
			<el-button style="float: left;" @click="firing('', '1')">添加分类</el-button>
			<el-dialog :title="title" :visible.sync="mixTypeAdd" width="35%" center>
				<p class="clearfix" style="width: 65%;margin: 0 auto;">
					<el-select class="ma10" v-model="typeName" placeholder="分类" filterable clearable style="width:200px;margin-left: 20px; color: #409eff;">
						<el-option v-for="item in types" :key="item.tid" :label="item.lname" :value="item.lname">
						</el-option>
					</el-select>
					<input style="width: 150px;" class="el-input__inner" placeholder="分类" type="text" name="" id="" value="" v-model="name" @keyup.enter="addName()" />
				</p>
				<span slot="footer" class="dialog-footer">
	            <el-button @click="cancel('3')">取 消</el-button>
	            <el-button type="primary" @click="addName()">确 定</el-button>
	          </span>
			</el-dialog>
		</el-header>
		<el-footer style="height: auto;" class="clearfix">
			<el-table :data="minType3" style="width: 100%; min-height: 568px;" v-loading="loadingList">
				<el-table-column prop="did" label="id" width="50" align="center"></el-table-column>
				<el-table-column prop="tbid" label="类型名称" width="100" align="center">
					<template slot-scope="scope">
						{{getTypesName(scope.row.tbid)}}
					</template>
				</el-table-column>
				<el-table-column prop="dname" label="分类名称" width="150" align="center"></el-table-column>
				<el-table-column prop="state" label="分类状态" width="100" align="center">
					<template slot-scope="scope">
						<svg v-if="scope.row.states === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
						<svg v-if="scope.row.states === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
					</template>
				</el-table-column>
				<el-table-column prop="state" label="前台显示" width="100" align="center">
					<template slot-scope="scope">
						<svg v-if="scope.row.webShow === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
						<svg v-if="scope.row.webShow === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="400">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" plain @click="firing(scope.row, '2')" style="margin-left: 20px;">编辑</el-button>
						<el-dialog :title="title" :visible.sync="mixTypeModify" width="23%" center>
							<div class="demo-input-suffix">
								分类名称:
								<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入内容"  name="" id="" v-model="row.dname" clearable></el-input>
							</div>
							<div class="demo-input-suffix">
								所属类型:
								<el-select class="ma10" v-model="typeName" placeholder="类型" filterable clearable style=" margin-left: 15px;">
									<el-option v-for="item in types" :key="item.tid" :label="item.lname" :value="item.lname">
									</el-option>
								</el-select>
							</div>
							<div class="demo-input-suffix">
								状态:
								<el-radio-group v-model="row.states" style="margin-left: 43px;">
							      	<el-radio label="1">启用</el-radio>
							      	<el-radio label="0">禁用</el-radio>
							    </el-radio-group>
							</div>
							<div class="demo-input-suffix">
								前台显示:
								<el-radio-group v-model="row.webShow" style="margin-left: 15px;">
							      	<el-radio label="1">启用</el-radio>
							      	<el-radio label="0">禁用</el-radio>
							    </el-radio-group>
							</div>
							<span slot="footer" class="dialog-footer">
				                <el-button @click="cancel('1')">取 消</el-button>
				                <el-button type="primary" @click="handleUpdate()" :loading="handleUpdateLoading">确 定</el-button>
				              </span>
						</el-dialog>
					</template>
				</el-table-column>
			</el-table>
		</el-footer>
		<div class="block" style="width: 470px;margin: 0 0 0 20%;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="dataList" layout="total, prev, pager, next" :total="minType2.length">
			</el-pagination>
		</div>
	</el-container>
</template>

<script>
	import { detailsDisable, detailsEnable, detailsAdd, detailssave, detailslist, typeList } from '@/assets/js/api'
	export default {
		inject: ['reload'],
		name: 'myProject',
		data() {
			return {
				options: [],
				Tvalue: '',
				restaurants: [],
				state1: '',
				state2: '',
				loading: true,
				types: this.$store.state.user.types || [],
				projects: this.$store.state.user.projects || [],
				minType: [],
				minType2: [],
				minType3: [],
				tList: [],
				PListSou: [],
				tListSou: [],
				minTypeSou: [],
				uId: '',
				title: '',
				name: '',
				row: {},
				handleUpdateLoading: false,
				mixTypeModify: false,
				mixTypeModifyUp: false,
				mixTypeAdd: false,
				loadingList: false,
				typeName: '',
				dname: '',
				currentPage1: 1,
				dataList: 10
			};
		},
		watch: {
			// 监听minType有变动时对显示变量重新赋值
			minType: function(newQuestion, oldQuestion) {
				let _this = this
				this.minType2 = []
				this.minType3 = []
				this.minType2 = this.minType
				if(this.minType.length !== 0) {
					this.minType.find((obj, index) => {
						if(index < _this.dataList) {
							_this.$set(_this.minType3, _this.minType3.length, obj)
						}
					})
				}
			},
			// 修改分类名称在取消操作时清空所填写的信息
			mixTypeModify: function(newQuestion, oldQuestion) {
				if(this.mixTypeModify === false) {
					this.dname = ''
				}
			},
			// 修改分类的上级类型取消做时清空所填写的信息
			mixTypeModifyUp: function(newQuestion, oldQuestion) {
				if(this.mixTypeModifyUp === false) {
					this.typeName = ''
					this.name = ''
				}
			}
		},
		methods: {
			// 搜索操作
			search () {
				this.loadingP = true
				let temp = []
				let temp2 = []
				let _this = this
				this.minType2 = []
				this.minType3 = []
				
				if (this.state2.length !== 0 && this.Tvalue.length !== 0) {
					this.minType.find((obj, index) => {
						obj.tbid === _this.Tvalue ? temp.push(obj) : obj = obj
					})
					temp.find((obj, index) => {
						obj.dname.indexOf(_this.state2) !== -1 ? temp2.push(obj) : obj = obj
					})
					if (temp2.length !== 0) {
						temp2.find((obj, index) => {
							_this.minType2.push(obj)
						})
						this.handleCurrentChange(1)
					} else {
						this.minType2 = []
						this.minType3 = []
					}
				} else if (this.state2.length !== 0 && this.Tvalue.length === 0) {
					this.minType.find((obj, index) => {
						obj.dname.indexOf(_this.state2) !== -1 ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.minType2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				} else if (this.state2.length === 0 && this.Tvalue.length !== 0) {
					this.minType.find((obj, index) => {
						obj.tbid === _this.Tvalue ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.minType2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				} else {
					this.minType.find((obj, index) => {
						_this.$set(_this.minType2, _this.minType2.length, obj)
					})
					this.handleCurrentChange(1)
				}
				this.loadingP = false
			},
			// 分页信息变更时打印信息
			handleSizeChange(val) {
				//      console.log('每页 ' + val + '条');
			},
			// 分页按钮
			handleCurrentChange(val) {
				//      console.log('当前页: ' + val)
				let _this = this
				// 抓取数据下标开始位置
				let begin = (this.dataList * val) - this.dataList
				// 抓取数据下标开结束位置
				let end = (this.dataList * val) - 1
				// 清空当前页显示数据
				this.minType3 = []
				// 循环抓取从起始位置到结束位置的数据
				this.minType2.find((obj, index) => {
					if(index >= begin && index <= end) {
						_this.$set(_this.minType3, _this.minType3.length, obj)
					}
				})
			},
			// 当前分类的禁用和开启状态开关函数
			handleProhibit(index, row, id) {
				id === false ? detailsDisable(this, row.did) : detailsEnable(this, row.did)
				// 刷新页面时重置当前分页数
				this.currentPage1 = 1
			},
			// 修改分类名称
			handleUpdate(index) {
				this.handleUpdateLoading = true
				if(this.row.dname.replace(/\s*/g,"").length === 0) {
					this.$alert('分类名称不能为空', '警告', { confirmButtonText: '确定' })
				} else if(this.typeName.replace(/\s*/g,"").length === 0) {
					this.$alert('类型不能为空', '警告', { confirmButtonText: '确定' })
				} else if(this.row.states.length > 1) {
					this.$alert('请选择状态的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else if(this.row.webShow.length > 1) {
					this.$alert('请选择前台显示的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else {
					detailssave(this, this.row, this.getTypesID(this.typeName))
					// 刷新页面时重置当前分页数
					this.currentPage1 = 1
				}
			},
			// 新增/修改类型、名称弹出显示函数，并动态修改部分显示文字
			firing(row, id) {
				// 深拷贝处理
				this.row = JSON.stringify(row)
				this.row = JSON.parse(this.row)
				if(id === '1') {
					this.mixTypeAdd = true
					this.title = '输入添加的分类名称：'
				} else if(id === '2') {
					this.mixTypeModify = true
					this.title = '编辑分类名称（' + row.dname + '）'
					this.typeName = this.getTypesName(this.row.tbid)
				} else if(id === '3') {
					this.typeName = this.getTypesName(this.row.tbid)
					this.name = this.row.dname
					this.title = '修改分类名称（' + row.dname + '）的类型：'
					this.mixTypeModifyUp = true
				}
				// 刷新页面时重置当前分页数
				this.currentPage1 = 1
			},
			// 新增/修改类型、名称弹出的关闭函数
			cancel(id) {
				if(id === '1') {
					this.mixTypeModify = false
				} else if(id === '2') {
					this.mixTypeModifyUp = false
				} else if(id === '3') {
					this.mixTypeAdd = false
				}
				this.row = {}
				this.name = ''
				this.dname = ''
			},
			// 新增分类
			addName() {
				this.name.length === 0 ? this.$alert('添加的分类不能为空', '警告', {
					confirmButtonText: '确定'
				}) : detailsAdd(this, this.name, 0, this.getTypesID(this.typeName))
				// 刷新页面时重置当前分页数
				this.currentPage1 = 1
			},
			// 修改分类的上级类型
			modifyUpType() {
				this.typeName.length === 0 ? this.$alert('请选择类型名称', '警告', {
					confirmButtonText: '确定'
				}) : detailssave(this, this.row.did, 0, this.getTypesID(this.typeName), this.row.dname)
				// 刷新页面时重置当前分页数
				this.currentPage1 = 1
			},
			// 获取当前分类的上级项目id
			getProjectID(xname) {
				return this.$store.getters.getUserProjectsId(xname).pid
			},
			// 获取当前分类的上级类型id
			getTypesID(lname) {
				return this.$store.getters.getUserTypesId(lname).tid
			},
			// 获取当前分类的上级项目名称
			getProjectName(pid) {
				return this.$store.getters.getUserProjectsName(pid).xname
			},
			// 获取当前分类的上级分类名称
			getTypesName(tid) {
				return this.$store.getters.getUserTypesName(tid).lname
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
				};
			},
			loadAll() {
				return this.minTypeSou
			},
			handleSelect(item) {
				console.log(item);
			}
		},
		mounted() {
			this.restaurants = this.loadAll();
		},
		created() { // 页面加载默认开启加载状态
			this.loadingList = true
			// 获取分类的数据
			detailslist(this, '2')
			// 获取类型数据
			typeList(this)
		}
	}
</script>

<style scoped>
.icon {width: 1.5em;height: 1.5em; vertical-align: -0.15em;fill: currentColor;overflow: hidden; margin-left: .5em;}
.titleType{height:60px;line-height:60px;text-align:left}
.titleType b{display:block;float:left;width:50%;height:60px;line-height:60px;font-size:20px}
.demo-input-suffix{margin-bottom:15px}
.demo-input-suffix .el-input{margin-left:15px}
</style>


// WEBPACK FOOTER //
// src/components/myColumnThree.vue