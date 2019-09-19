/**
 * 获取后台时间戳转换为正常的时间格式：yyyy-MM-dd
 * */
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

/**
 * 返回文件的大小（单位：MB）
 * */
export function fileSize (size) {
  size = (file.size/1024*100)/100
  return size.toFixed(1)
}

/**
 * 生成防查看路径链接地址
 * */
export function fileUrl (file) {
  return URL.createObjectURL(file)
}

/**
 * 给单数1~9前添加0，以表示正常时间格式
 * */
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 返回项目名称的所属id
 * */
export function getProjectID (_this, xname) {
  let id = ''
  for (let i = 0; i < _this.projects.length; i++) {
    if (_this.projects[i].xname === xname) {
      id = _this.projects[i].pid
    }
  }
  return id
}

/**
 * 返回项目id所属名称
 * */
export function getProjectName (_this, pid) {
  let name = ''
  for (let i = 0; i < _this.projects.length; i++) {
    if (_this.projects[i].pid === pid) {
      name = _this.projects[i].xname
    }
  }
  return name
}

/**
 * 返回项目类型的所属id
 * */
export function getTypesID (_this, lname) {
  let id = ''
  for (let i = 0; i < _this.types.length; i++) {
    if (_this.types[i].lname === lname) {
      id = _this.types[i].tid
    }
  }
  return id
}

/**
 * 返回项目类型id所属类型名称
 * */
export function getTypesName (_this, tid) {
  let name = ''
  for (let i = 0; i < _this.types.length; i++) {
    if (_this.types[i].tid === tid) {
      name = _this.types[i].lname
    }
  }
  return name
}

/**
 * 返回项目的小分类ID
 * */
export function getMinTypesID (_this, name) {
  let id = ''
  for (let i = 0; i < _this.minTypes.length; i++) {
    if (_this.minTypes[i].dname === name) {
      id = _this.minTypes[i].did
    }
  }
  return id
}

/**
 * 返回项目小分类id所属名称
 * */
export function getMinTypesName (_this, did) {
  let name = ''
  for (let i = 0; i < _this.minTypes.length; i++) {
    if (_this.minTypes[i].did === did) {
      name = _this.minTypes[i].dname
    }
  }
  return name
}

/**
 * 列表页数据瀑布流的分配
 * */
export function subData (_this, typeName) {
	// 每页数据数量
	var pageSize = _this.pageSize
	// 获取的数据数量  当前数量 - （当前数量 - 每页数量）
	if (typeName === 'images') {
		var getDataSize = _this.imgList.length < _this.pageSize ? _this.imgList.length : _this.imgList.length - (_this.imgList.length - _this.pageSize)
	}
	if (typeName === 'psd') {
		var getDataSize = _this.psdList.length < _this.pageSize ? _this.psdList.length : _this.psdList.length - (_this.psdList.length - _this.pageSize)
	}
	if (typeName === 'video') {
		var getDataSize = _this.videoList.length < _this.pageSize ? _this.videoList.length : _this.videoList.length - (_this.videoList.length - _this.pageSize)
	}
	// 获取3列ul的高度，从高到底排序后，返回obj，并在数组最后一个添加3列ul高度最大和最小之间的差值、第二高的ul和最小之间的差值
	let type = judgeSize([{
			name: '1',
			height: _this.$refs.ullist1.scrollHeight
		}, {
			name: '2',
			height: _this.$refs.ullist2.scrollHeight
		}, {
			name: '3',
			height: _this.$refs.ullist3.scrollHeight
		}])
	// 通过type的排序，把3列ul的数组从小到大放到一个数组中
	let ullists = setSortingData(_this, type)
	// 瀑布流加载判断，默认显示数据
	if (_this.searchTitle.length !== 0 && _this.page === 1) {
		// 在查询条件/改变排序顺序   清空当前显示数据 重新赋值结果数据
		_this.ulImgList1 = []
		_this.ulImgList2 = []
		_this.ulImgList3 = []
		// 给3列ul数组赋值
		if (_this.imgList !== undefined && _this.imgList.length !== 0) {
			setPageData(_this, ullists, getDataSize, 4, typeName)
		}
		if (_this.psdList !== undefined && _this.psdList.length !== 0) {
			setPageData(_this, ullists, getDataSize, 4, typeName)
		}
		if (_this.videoList !== undefined && _this.videoList.length !== 0) {
			setPageData(_this, ullists, getDataSize, 4, typeName)
		}
	} else if (_this.searchTitle.length !== 0 && _this.page > 1) {
		// 给3列ul数组赋值
		if (_this.imgList !== undefined && _this.imgList.length !== 0) {
			setUldata(_this, type, ullists, getDataSize, typeName)
		}
		if (_this.psdList !== undefined && _this.psdList.length !== 0) {
			setUldata(_this, type, ullists, getDataSize, typeName)
		}
		if (_this.videoList !== undefined && _this.videoList.length !== 0) {
			setUldata(_this, type, ullists, getDataSize, typeName)
		}
	} else if(_this.$refs.ullist1.offsetHeight !== 0 && _this.$refs.ullist2.offsetHeight !== 0 && _this.$refs.ullist3.offsetHeight !== 0 && _this.changeSort === 1) {
		console.log(_this.changeSort)
		// 排序：2中排序方式互转时  清空显示数据 从新赋值
		_this.ulImgList1 = []
		_this.ulImgList2 = []
		_this.ulImgList3 = []
		// 给3列ul数组赋值
		setPageData(_this, ullists, getDataSize, 0, typeName)
	} else if(_this.$refs.ullist1.offsetHeight === 0 && _this.$refs.ullist2.offsetHeight === 0 && _this.$refs.ullist3.offsetHeight === 0) {
		// 默认初始化赋值
		// 给3列ul数组赋值
		setPageData(_this, ullists, getDataSize, 0, typeName)
	} else {
		// 每次加载时获取3列UL的高度，判断高度排序分别给与追加 3 2 1条数据显示
		setUldata(_this, type, ullists, getDataSize, typeName)
	}
	
}

/**
 * 判断ul的高度合理分配数据的显示
 * */
function setUldata (_this, type, ullists, getDataSize, typeName) {
	if(type[3].height > 1000) {
		setPageData(_this, ullists, getDataSize, 2, typeName)
	} else if(type[3].height > 500) {
		setPageData(_this, ullists, getDataSize, 3, typeName)
	} else {
		setPageData(_this, ullists, getDataSize, 1, typeName)
	}
}

/**
 * 从小到大排序，并返回最大和最小直接的差值，第二大和最小直接的差值
 * */
function judgeSize (obj) {
	for (let i = 0; i < obj.length - 1; i++) {
		for (let j = 0; j < obj.length - 1 - i; j++) {
			if (obj[j].height > obj[j + 1].height) {
				let temp = obj[j]
				obj[j]=obj[j+1]
　　　　			obj[j+1]=temp
			}
		}
	}
	obj[3] = {name: '', height: obj[2].height - obj[0].height, height2: obj[1].height - obj[0].height}
	return obj
}

/**
 * 给与指定条件返回数据,把3列ul的数据,按高度从底倒排序添加到数组中
 * */
function setSortingData (_this, array) {
	let datas = []
	for (let i = 0; i < 3; i++) {
		if (array[i].name === '1') {
			datas[datas.length] = {data: _this.ulImgList1, type: '1'}
		} else if (array[i].name === '2') {
			datas[datas.length] = {data: _this.ulImgList2, type: '2'}
		} else if (array[i].name === '3') {
			datas[datas.length] = {data: _this.ulImgList3, type: '3'}
		}
	}
	return datas
}

/**
 * 给3列ul数组赋值
 * _this: 当前列表页本身
 * array: 3列ul的数据通过高度 从小到大排列数组
 * num: 当前请求到的数据条数
 * plan: 执行方案: 0为初始页面,1为最加数据,2为最大和最小差值大于1000,3为最大和最小差值大于500
 * typeName: 赋值类型:images/psd/video
 * */
function setPageData (_this, array, num, plan, typeName) {
	let j = 0
	let e = 0
	// 排序顺序点击后执行一次后把值初始化
	_this.changeSort = 0
	console.log('当前请求到的数据条数:' + num)
	console.log('执行方案:' + plan)
	if (plan === 0) {
		if (typeName === 'images') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
		if (typeName === 'psd') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
		if (typeName === 'video') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
	} else if (plan === 1) {
		if (typeName === 'images') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
		if (typeName === 'psd') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
		if (typeName === 'video') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
	} else if (plan === 2) {
		if (typeName === 'images') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j = 0
			}
		}
		if (typeName === 'psd') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j = 0
			}
		}
		if (typeName === 'video') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j = 0
			}
		}
	} else if (plan === 3) {
		if (typeName === 'images') {
			for (let i = 0; i < num; i++) {
				if (e < 1) {
					if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				}
				} else {
					j = j === 2 ? 0 : j
					if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				}
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
				e = j === 2 ? ++e : e
			}
		}
		if (typeName === 'psd') {
			for (let i = 0; i < num; i++) {
				if (e < 1) {
					if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				}
				} else {
					j = j === 2 ? 0 : j
					if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				}
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
				e = j === 2 ? ++e : e
			}
		}
		if (typeName === 'video') {
			for (let i = 0; i < num; i++) {
				if (e < 1) {
					if (array[j].type === '1') {
						_this.ulImgList1[_this.ulImgList1.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
					} else if (array[j].type === '2') {
						_this.ulImgList2[_this.ulImgList2.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
					} else if (array[j].type === '3') {
						_this.ulImgList3[_this.ulImgList3.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
					}
				} else {
					j = j === 2 ? 0 : j
					if (array[j].type === '1') {
						num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
					} else if (array[j].type === '2') {
						num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
					} else if (array[j].type === '3') {
						num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
					}
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
				e = j === 2 ? ++e : e
			}
		}
	} else if (plan === 4) {
		if (typeName === 'images') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.imgList[_this.imgList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
		if (typeName === 'psd') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.psdList[_this.psdList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
		if (typeName === 'video') {
			for (let i = 0; i < num; i++) {
				if (array[j].type === '1') {
					num < _this.pageSize ? _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[i] : _this.ulImgList1[_this.ulImgList1.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '2') {
					num < _this.pageSize ? _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[i] : _this.ulImgList2[_this.ulImgList2.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				} else if (array[j].type === '3') {
					num < _this.pageSize ? _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[i] : _this.ulImgList3[_this.ulImgList3.length] = _this.videoList[_this.videoList.length - _this.pageSize + i]
				}
				j === 0 ? ++j : j === 1 ? ++j : j = 0
			}
		}
	}
}

/**
 * 返回顶部
 * */
function returnTop () {
  // 获取当前最外围document的scrollTop，返回顶部
  var timer = setInterval(function() {
    var top = document.body.scrollTop || document.documentElement.scrollTop
    var speed = Math.ceil(top / 5)
    document.body.scrollTop = document.documentElement.scrollTop = top - speed
    if (top === 0) {
      clearInterval(timer)
    }
  }, 20)
}

/**
 * 判断是否登录,没有登录不能查看所有页面
 * */
function judgeLogin (store, next) {
	store.dispatch('getLocalStorage', store.state) // 获取本地存储全局用户状态
	if(store.state.user.userName !== '' || store.state.userName.length !== null) {
		if(store.state.user.state === '1') {
			next()
		} else {
			next('/login')
		}
	} else {
		next('/login')
	}
}



// WEBPACK FOOTER //
// ./src/assets/js/publicAPI.js