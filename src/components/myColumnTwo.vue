<template>
	<el-container class="clearfix">
		<el-header style="width: 100%; height: 40px; padding: 0; margin-bottom: 20px;">
			<el-row class="demo-autocomplete" style="width: 200px; margin-right: 10px; float: left;">
				<el-col :span="24">
					<el-autocomplete class="inline-input" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入关键字进行搜索" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
				</el-col>
			</el-row>
			<el-button type="primary" style="float: left;" @click="search()">搜索</el-button>
			<el-button style="float: left;" @click="firing('', '4')">添加类型</el-button>
			<el-dialog :title="title" :visible.sync="centerDialogVisibleAdd" width="20%" center>
				<p class="upPwd">
					<input class="el-input__inner" type="text" name="" id="" value="" v-model="name" @keyup.enter="addName()" />
				</p>
				<span slot="footer" class="dialog-footer">
	            <el-button @click="cancel('3')">取 消</el-button>
	            <el-button type="primary" @click="addName()">确 定</el-button>
	          </span>
			</el-dialog>
		</el-header>

		<el-footer style="height: auto;">
			<el-table v-loading="loadingT" :data="tList3" style="width: 100%; min-height: 568px;">
				<el-table-column prop="tid" label="id" width="50" align="center"></el-table-column>
				<el-table-column prop="lname" label="类型名称" width="100" align="center"></el-table-column>
				<el-table-column prop="state" label="项目状态" width="100" align="center">
					<template slot-scope="scope">
						<svg v-if="scope.row.state === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
						<svg v-if="scope.row.state === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
					</template>
				</el-table-column>
				<el-table-column prop="state" label="前台显示" width="100" align="center">
					<template slot-scope="scope">
						<svg v-if="scope.row.webShow === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
						<svg v-if="scope.row.webShow === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="250">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" plain @click="firing(scope.row, '2')" style="margin-left: 20px;">编辑</el-button>
						<el-dialog :title="title" :visible.sync="centerDialogVisibleT" width="20%" center>
							<div class="demo-input-suffix">
								项目名称:
								<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入内容"  name="" id="" v-model="row.lname"></el-input>
							</div>
							<div class="demo-input-suffix">
								状态:
								<el-radio-group v-model="row.state" style="margin-left: 43px;">
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
				                <el-button @click="cancel('2')">取 消</el-button>
				                <el-button type="primary" @click="handleUpdate(scope.$index, scope.row)" :loading="handleUpdateLoading">确 定</el-button>
			              	</span>
						</el-dialog>
					</template>
				</el-table-column>
			</el-table>
		</el-footer>
		<div class="block" style="width: 470px;margin: 0 0 0 20%;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="dataList" layout="total, prev, pager, next" :total="tList2.length">
			</el-pagination>
		</div>
	</el-container>
</template>

<script>
	import { typeList, projectDisable, typeDisable, typeEnable, projectEnable, typesave, projectsave, projectAdd, typeAdd } from '@/assets/js/api'
	export default {
		inject: ['reload'],
		name: 'myProject',
		data() {
			return {
				restaurants: [],
				state1: '',
				state2: '',
				loadingP: true,
				loadingT: true,
				PList: [],
				PListSou: [],
				tListSou: [],
				minTypeSou: [],
				tList: [],
				tList2: [],
				tList3: [],
				uId: '',
				title: '',
				name: '',
				row: {},
				handleUpdateLoading: false,
				centerDialogVisibleP: false,
				centerDialogVisibleT: false,
				centerDialogVisibleAdd: false,
				currentPage1: 1,
				dataList: 10
			};
		},
		watch: {
			// 监听tList有变动时对显示变量重新赋值
			tList: function(newQuestion, oldQuestion) {
				let _this = this
				this.tList2 = []
				this.tList3 = []
				this.tList2 = this.tList
				if(this.tList.length !== 0) {
					this.tList.find((obj, index) => {
						if(index < _this.dataList) {
							_this.$set(_this.tList3, _this.tList3.length, obj)
						}
					})
				}
			}
		},
		methods: {
			// 搜索操作
			search () {
				this.loadingP = true
				let temp = []
				let _this = this
				this.tList2 = []
				this.tList3 = []
				if (this.state2.length !== 0) {
					this.tList.find((obj, index) => {
						obj.lname.indexOf(_this.state2) !== -1 ? temp.push(obj) : obj = obj
						console.log(obj.lname.indexOf())
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.tList2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				} else {
					this.tList.find((obj, index) => {
						_this.$set(_this.tList2, _this.tList2.length, obj)
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
				this.tList3 = []
				// 循环抓取从起始位置到结束位置的数据
				this.tList2.find((obj, index) => {
					if(index >= begin && index <= end) {
						_this.$set(_this.tList3, _this.tList3.length, obj)
					}
				})
			},
			// 状态开关
			handleFiring(index, row, id) {
				if(id === false) {
					typeDisable(this, row.tid)
				} else if(id === true) {
					typeEnable(this, row.tid)
				}
			},
			// 类型编辑修改
			handleUpdate(index, row) {
				this.handleUpdateLoading = true
				if(this.row.lname.replace(/\s*/g,"").length === 0) {
					this.$alert('类型名称不能为空', '警告', { confirmButtonText: '确定' })
				} else if(this.row.state.length > 1) {
					this.$alert('请选择状态的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else if(this.row.webShow.length > 1) {
					this.$alert('请选择前台显示的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else {
					typesave(this, this.row)
				}
			},
			// 功能弹出框的标题重构
			firing(row, id) {
				// 深拷贝处理
				this.row = JSON.stringify(row)
				this.row = JSON.parse(this.row)
				if(id === '2') {
					this.centerDialogVisibleT = true
					this.title = '编辑类型名称（' + row.lname + '）'
				} else if(id === '4') {
					this.centerDialogVisibleAdd = true
					this.title = '输入添加的类型名称：'
				}
			},
			// 关闭添加/修改
			cancel(id) {
				if(id === '1') {
					this.centerDialogVisibleP = false
				} else if(id === '2') {
					this.centerDialogVisibleT = false
				} else if(id === '3') {
					this.centerDialogVisibleAdd = false
				} else if(id === '4') {
					this.centerDialogVisibleAdd = false
				}
				this.row = {}
				this.name = ''
			},
			// 添加项目/类型
			addName() {
				if(this.name.length === 0) {
					this.$alert('添加的名称不能为空', '警告', {
						confirmButtonText: '确定'
					})
				} else if(this.title.indexOf('类型') !== -1) {
					typeAdd(this)
				}
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
				return this.tListSou
			},
			handleSelect(item) {
				console.log(item);
			}
		},
		mounted() {
			this.restaurants = this.loadAll();
		},
		created() {
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
// src/components/myColumnTwo.vue