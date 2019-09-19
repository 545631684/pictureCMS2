<template>
	<el-container class="clearfix">
		<el-header style="width: 100%; height: 40px; padding: 0; margin-bottom: 20px;">
			<el-row class="demo-autocomplete" style="width: 200px; margin-right: 10px; float: left;">
				<el-col :span="24">
					<el-autocomplete class="inline-input" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入关键字进行搜索" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
				</el-col>
			</el-row>
			<el-button type="primary" style="float: left;" @click="search()">搜索</el-button>
			<el-button style="float: left;" @click="firing('', '3')">添加标签组</el-button>
			<el-dialog :title="title" :visible.sync="centerDialogVisibleAdd" width="20%" center>
				<p class="upPwd">
					<input class="el-input__inner" type="text" name="" id="" value="" v-model="name" @keyup.enter="addName()" />
				</p>
				<span slot="footer" class="dialog-footer">
	            <el-button @click="cancel('3')">取 消</el-button>
	            <el-button type="primary" @click="addName()" :loading="addNameLoading">确 定</el-button>
	          </span>
			</el-dialog>
		</el-header>
		<el-footer style="height: auto;">
			<el-table v-loading="loadingP" :data="groupLabel3" class="clearfix" style="width: 100%; min-height: 568px;">
				<el-table-column prop="gid" label="id" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="标签组名称" width="100" align="center"></el-table-column>
				<el-table-column prop="lid" label="绑定分类" width="300" align="center">
					<template slot-scope="scope">
						<span v-html="scope.row.lid === null ? '暂无数据' : scope.row.lid"></span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="标签组状态" width="100" align="center">
					<template slot-scope="scope">
						<svg v-if="scope.row.status === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
						<svg v-if="scope.row.status === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
					</template>
				</el-table-column>
				<el-table-column prop="webShow" label="前台显示" width="100" align="center">
					<template slot-scope="scope">
						<svg v-if="scope.row.webShow === '1'" class="icon" aria-hidden="true"><use xlink:href="#icon-dui"></use></svg>
						<svg v-if="scope.row.webShow === '0'" class="icon" aria-hidden="true"><use xlink:href="#icon-cuo"></use></svg>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="300">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" plain @click="firing(scope.row, '1')" style="margin-left: 20px;">编辑</el-button>
						<el-dialog :title="title" :visible.sync="centerDialogVisibleP" width="20%" center style="margin-left: -15vw;">
							<div class="demo-input-suffix">
								标签组名称:
								<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入内容"  name="" id="" v-model="row.name" clearable></el-input>
							</div>
							<div class="demo-input-suffix">
								状态:
								<el-radio-group v-model="row.status" style="margin-left: 43px;">
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
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="dataList" layout="total, prev, pager, next" :total="groupLabel2.length">
			</el-pagination>
		</div>
	</el-container>
</template>

<script>
	import { labelslist, labelsDisable, labelsEnable, labelssave, labelsAdd } from '@/assets/js/api'
	export default {
		inject: ['reload'],
		name: 'myProject',
		data() {
			return {
				restaurants: [],
				state1: '',
				state2: '',
				loadingP: false,
				loadingT: false,
				PList: [],
				tList: [],
				groupLabel: [],
				groupLabel2: [],
				groupLabel3: [],
				uId: '',
				title: '',
				name: '',
				addNameLoading: false,
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
			// 监听minType有变动时对显示变量重新赋值
			groupLabel: function(newQuestion, oldQuestion) {
				let _this = this
				this.groupLabel2 = []
				this.groupLabel3 = []
				this.groupLabel2 = this.groupLabel
				if(this.groupLabel.length !== 0) {
					this.groupLabel.find((obj, index) => {
						if(index < _this.dataList) {
							_this.$set(_this.groupLabel3, _this.groupLabel3.length, obj)
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
				this.groupLabel2 = []
				this.groupLabel3 = []
				if (this.state2.length !== 0) {
					this.groupLabel.find((obj, index) => {
						obj.name.indexOf(_this.state2) !== -1 ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.groupLabel2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				} else {
					this.groupLabel.find((obj, index) => {
						_this.$set(_this.groupLabel2, _this.groupLabel2.length, obj)
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
				this.groupLabel3 = []
				// 循环抓取从起始位置到结束位置的数据
				this.groupLabel2.find((obj, index) => {
					if(index >= begin && index <= end) {
						_this.$set(_this.groupLabel3, _this.groupLabel3.length, obj)
					}
				})
			},
			handleProhibit(index, row, id) {
				if(id === false) {
					labelsDisable(this, row.gid)
				} else if(id === true) {
					labelsEnable(this, row.gid)
				}
			},
			// 标签组名称修改
			handleUpdate() {
				// 按钮加载状态开启
				this.handleUpdateLoading = true
				if(this.row.name.replace(/\s*/g,"").length === 0) {
					this.$alert('标签组名称不能为空', '警告', { confirmButtonText: '确定' })
				} else if(this.row.status.length > 1) {
					this.$alert('请选择状态的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else if(this.row.webShow.length > 1) {
					this.$alert('请选择前台显示的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else {
					labelssave(this, this.row)
				}
			},
			// 各种功能弹出 文字的不同
			firing(row, id) {
				// 深拷贝处理
				this.row = JSON.stringify(row)
				this.row = JSON.parse(this.row)
				if(id === '1') {
					this.centerDialogVisibleP = true
					this.title = '编辑标签组名称（' + row.name + '）为：'
				} else if(id === '3') {
					this.centerDialogVisibleAdd = true
					this.title = '输入添加的标签组名称：'
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
				if(this.name.replace(/\s*/g,"").length === 0) {
					this.$alert('名称不能为空', '警告', {
						confirmButtonText: '确定'
					})
				} else {
					// 按钮加载效果开启
					this.addNameLoading = true
					// 添加标签组接口
					labelsAdd(this, this.name.replace(/\s*/g,""))
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
				let temp = []
				this.groupLabel.find((obj, index) => {
					temp.push({
						"value": obj.name,
						"address": obj.gid
					})
				})
				return temp
			},
			handleSelect(item) {
				console.log(item);
			}
		},
		mounted() {
			this.restaurants = this.loadAll();
		},
		created() {
			labelslist(this)
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
// src/components/myColumnFour.vue