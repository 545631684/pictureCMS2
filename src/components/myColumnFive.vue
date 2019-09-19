<template>
	<el-container class="clearfix">
		<el-header style="width: 100%; height: 40px; padding: 0; margin-bottom: 20px;">
			<el-select v-model="groupLabelName2" clearable placeholder="标签组选择" style="float: left;margin-right: 10px;">
			    <el-option
			      v-for="item in groupLabel"
			      :key="item.gid"
			      :label="item.name"
			      :value="item.gid">
			    </el-option>
			  </el-select>
			<el-row class="demo-autocomplete" style="width: 200px; margin-right: 10px; float: left;">
				<el-col :span="24">
					<el-autocomplete class="inline-input" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入关键字进行搜索" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
				</el-col>
			</el-row>
			<el-button type="primary" style="float: left;" @click="search()">搜索</el-button>
			<el-button style="float: left;" @click="firing('', '3')">添加标签</el-button>
			<el-dialog :title="title" :visible.sync="centerDialogVisibleAdd" width="22%" center>
				<p class="upPwd">
					<el-select class="ma10" v-model="groupLabelName" placeholder="请选择标签组" filterable clearable style="width:200px;margin-left: 20px; color: #409eff;">
						<el-option v-for="item in groupLabel" :key="item.gid" :label="item.name" :value="item.name">
						</el-option>
					</el-select>
					<el-input
						style="width: 150px;"
						placeholder="请输入内容"
						v-model="name"
						@keyup.enter.native="addName()"
						clearable>
					</el-input>
				</p>
				<span slot="footer" class="dialog-footer">
	            <el-button @click="cancel('3')">取 消</el-button>
	            <el-button type="primary" @click="addName()">确 定</el-button>
	          </span>
			</el-dialog>
		</el-header>
		<el-footer style="height: auto;">
			<el-table v-loading="loadingP" :data="label3" class="clearfix" style="width: 100%; min-height: 568px;">
				<el-table-column prop="lid" label="id" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="标签名称" width="150" align="center"></el-table-column>
				<el-table-column prop="gid" label="标签组名称" width="150" align="center">
					<template slot-scope="scope">
						<span>{{getgroupLabelName(scope.row.gid, scope.row.name)}}</span>
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
						<el-dialog :title="title" :visible.sync="centerDialogVisibleP" width="22%" center style="margin-left: -15vw;">
							<div class="demo-input-suffix">
								标签名称:
								<el-input style="width: auto;" class="el-input--suffix" placeholder="请输入内容"  name="" id="" v-model="row.name" clearable></el-input>
							</div>
							<div class="demo-input-suffix">
								所属标签组:
								<el-select class="ma10" v-model="groupLabelName" placeholder="请选择标签组" filterable clearable style="margin-left: 15px;">
									<el-option v-for="item in groupLabel" :key="item.gid" :label="item.name" :value="item.name">
									</el-option>
								</el-select>
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
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="dataList" layout="total, prev, pager, next" :total="label2.length">
			</el-pagination>
		</div>
	</el-container>
</template>

<script>
	import { labelslist, labellist, labelDiable, labelEnable, labelsave, labelAdd } from '@/assets/js/api'
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
				groupLabel: [],
				groupLabelName: '',
				groupLabelName2: '',
				label: [],
				label2: [],
				label3: [],
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
			// 监听minType有变动时对显示变量重新赋值
			label: function(newQuestion, oldQuestion) {
				let _this = this
				this.label2 = []
				this.label3 = []
				this.label2 = this.label
				if(this.label.length !== 0) {
					this.label.find((obj, index) => {
						if(index < _this.dataList) {
							_this.$set(_this.label3, _this.label3.length, obj)
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
				let temp2 = []
				let _this = this
				this.label2 = []
				this.label3 = []
				if (this.state2.length !== 0 && this.groupLabelName2.length !== 0) {
					this.label.find((obj, index) => {
						obj.name.indexOf(_this.state2) !== -1 ? temp.push(obj) : obj = obj
					})
					temp.find((obj, index) => {
						obj.gid === _this.groupLabelName2 ? temp2.push(obj) : obj = obj
					})
					if (temp2.length !== 0) {
						temp2.find((obj, index) => {
							_this.label2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				} else if (this.state2.length !== 0 && this.groupLabelName2.length === 0) {
					this.label.find((obj, index) => {
						obj.name.indexOf(_this.state2) !== -1 ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.label2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				}  else if (this.state2.length === 0 && this.groupLabelName2.length !== 0) {
					this.label.find((obj, index) => {
						obj.gid === _this.groupLabelName2 ? temp.push(obj) : obj = obj
					})
					if (temp.length !== 0) {
						temp.find((obj, index) => {
							_this.label2.push(obj)
						})
						this.handleCurrentChange(1)
					}
				} else {
					this.label.find((obj, index) => {
						_this.$set(_this.label2, _this.label2.length, obj)
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
				this.label3 = []
				// 循环抓取从起始位置到结束位置的数据
				this.label2.find((obj, index) => {
					if(index >= begin && index <= end) {
						_this.$set(_this.label3, _this.label3.length, obj)
					}
				})
			},
			typeHTML(status) {
				return status === true ? '启用' : '禁用'
			},
			handleProhibit(index, row, id) {
				if(id === false) {
					labelDiable(this, row.lid)
				} else if(id === true) {
					labelEnable(this, row.lid)
				}
			},
			// 标签名称修改
			handleUpdate() {
				// 按钮加载状态开启
				this.handleUpdateLoading = true
				if(this.row.name.replace(/\s*/g,"").length === 0) {
					this.$alert('标签名称不能为空', '警告', { confirmButtonText: '确定' })
				} else if(this.groupLabelName.length === 0) {
					this.$alert('请选择所属标签组', '警告', { confirmButtonText: '确定' })
				} else if(this.row.status.length > 1) {
					this.$alert('请选择状态的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else if(this.row.webShow.length > 1) {
					this.$alert('请选择前台显示的启用或禁用', '警告', { confirmButtonText: '确定' })
				} else {
					labelsave(this, this.row, this.getgroupLabelId(this.groupLabelName))
				}
			},
			// 各种功能弹出 文字的不同
			firing(row, id) {
				// 深拷贝处理
				this.row = JSON.stringify(row)
				this.row = JSON.parse(this.row)
				if(id === '1') {
					this.centerDialogVisibleP = true
					this.title = '编辑标签名称（' + row.name + '）'
					this.groupLabelName = this.getgroupLabelName(this.row.gid)
					this.name = this.row.name
				} else if(id === '3') {
					this.centerDialogVisibleAdd = true
					this.title = '输入添加的标签名称、组：'
					// 如果当前有搜索的标签组则自动添加没有不会添加
					this.groupLabelName2.length !== 0 ? this.groupLabelName = this.getgroupLabelName(this.groupLabelName2) : this.groupLabelName2 = this.groupLabelName2
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
				this.groupLabelName = ''
			},
			// 添加项目/类型
			addName() {
				if(this.name.length === 0) {
					this.$alert('标签名不能为空', '警告', {
						confirmButtonText: '确定'
					})
				} else if (this.groupLabelName.length === 0) {
					this.$alert('标签组不能为空', '警告', {
						confirmButtonText: '确定'
					})
				} else {
					// 添加标签接口
					labelAdd(this, this.getgroupLabelId(this.groupLabelName), this.name)
				}
			},
			// 获取标签组id
			getgroupLabelId (groupLabelName) {
				return this.groupLabel.find((o, index) => {if (o.name === groupLabelName) {return o}}).gid
			},
			// 获取标签组名称
			getgroupLabelName (groupLabelId, webname) {
				let groupLabel = this.groupLabel.find((o, index) => {if (o.gid === groupLabelId) {return o}})
				if (groupLabel !== undefined) {
					return groupLabel.name
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
				this.label.find((obj, index) => {
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
			// 获取标签组
			labelslist(this)
			// 获取标签
			labellist(this)
		}
	}
</script>

<style scoped>
.icon {width: 1.5em;height: 1.5em; vertical-align: -0.15em;fill: currentColor;overflow: hidden; margin-left: .5em;}
.titleType{height:60px;line-height:60px;text-align:left}
.titleType b{display:block;float:left;width:50%;height:60px;line-height:60px;font-size:20px}
.demo-input-suffix{margin-bottom:15px}
.demo-input-suffix .el-input{margin-left:28px}
</style>


// WEBPACK FOOTER //
// src/components/myColumnFive.vue