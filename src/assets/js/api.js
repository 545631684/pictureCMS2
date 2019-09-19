import Axios from 'axios'
import qs from 'qs'

// login.vue 接口  登陆验证
export function loginLand (_this) {
  Axios.post(_this.URLS + '/index.php/Home/Login/login.html', qs.stringify({userName: _this.ruleForm.email, Password: _this.ruleForm.pw}))
    .then(function (response) {
      if (response.data.msg === '0') {
        // 给全局变量赋值
        _this.$store.commit('setUserUid', response.data.uId)
        _this.$store.commit('setUserPermissions', response.data.permissions)
        _this.$store.commit('setUserUserName', response.data.userName)
        _this.$store.commit('setUserPassword', response.data.Password)
        _this.$store.commit('setUserNickname', response.data.nickname)
        _this.$store.commit('setUserSex', response.data.sex)
        _this.$store.commit('setUserRegisterTime', response.data.registerTime)
        _this.$store.commit('setUserEndTime', response.data.endTime)
        _this.$store.commit('setUserState', response.data.state)
        _this.$store.commit('setUserHeadPortraitSrc', response.data.HeadPortraitSrc)
        _this.$store.commit('setUserSetPasswordStyle', _this.ruleForm.type)
        _this.$store.commit('setUserTypes', response.data.types)
        _this.$store.commit('setUserProjects', response.data.projects)
        _this.$store.commit('setUserMinType', response.data.details)
        // 用户的权限重新赋值，去除权限以后的功能页
        var UserAuth = response.data.auth[0]
        var temp = {disabled: response.data.auth[0].disabled, id: response.data.auth[0].id, rules: [], status: response.data.auth[0].status, 	title: response.data.auth[0].title}
        var num = 0
				for	(let e = 0; e < UserAuth.rules.length; e++) {
		    	if (UserAuth.rules[e].checkedCities !== '[]') {
		    		temp.rules[num] = {checkAll: UserAuth.rules[e].checkAll, checkedCities: UserAuth.rules[e].checkedCities, cityOptions: UserAuth.rules[e].cityOptions, icon: UserAuth.rules[e].icon, id: UserAuth.rules[e].id, index: UserAuth.rules[e].index, isIndeterminate: UserAuth.rules[e].isIndeterminate, name: UserAuth.rules[e].name, rules: [], sid: UserAuth.rules[e].sid, status: UserAuth.rules[e].status, urlKeyword: UserAuth.rules[e].urlKeyword}
		    		for (let i = 0; i < UserAuth.rules[e].checkedCities.length; i++) {
		    			for (let j = 0; j < UserAuth.rules[e].rules.length; j++) {
		    				if (UserAuth.rules[e].checkedCities[i] === UserAuth.rules[e].rules[j].name) {
		    					temp.rules[num].rules[temp.rules[num].rules.length] = UserAuth.rules[e].rules[j]
		    				}
		    			}
		    		}
		    		num++
		    	} else if (UserAuth.rules[e].checkedCities === '[]' && UserAuth.rules[e].checkAll === 'true') {
		    		temp.rules[num] = UserAuth.rules[e]
		    		num++
		    	}
				}
        _this.$store.commit('etUserAuth', temp)
        _this.$store.commit('setUserMid', _this.$store.state.mId)
        _this.$store.dispatch('setLocalStorage') // 本地存储用户信息
        _this.$router.push('/') // 跳转前台首页
         
      } else if (response.data.msg === '1') {
        _this.$alert('用户名或密码错误', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '2') {
        _this.$alert('该用户已被冻结', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '3') {
        _this.$alert('用户名不存在', '警告', {confirmButtonText: '确定'})
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// login.vue 接口  邮箱验证码
export function mailboxVerification (_this, userName) {
Axios.post(_this.URLS + '/index.php/Home/Login/Send.html', qs.stringify({to: userName}))
    .then(function (response) {
      if (response.data.Verification.length > 1) {
        _this.verificationServer = response.data.Verification
        _this.$message({
          message: '发送成功',
          type: 'success'
        })
      } else {
        console.log('未知原因获取失败。。。')
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// article.vue 接口  文章页下载文件
export function zipdownload (_this, obj) {
Axios.post(_this.URLS + '/index.php/Index/zipdownload', qs.stringify({title: obj.title, zipfiles: obj.zipfiles, name: obj.name}))
    .then(function (response) {
      if (response.msg === '1' || response.msg === '2') {
        _this.$message({
          message: '下载失败！',
          type: 'success'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// enrollUser.vue 接口  注册邮箱验证码
export function mailboxVerification2 (_this, userName) {
  Axios.post(_this.URLS + '/index.php/Home/Login/emailrepeat', qs.stringify({userName: userName}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$alert('账号已被注册', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '1') {
        Axios.post(_this.URLS + '/index.php/Home/Login/Send.html', qs.stringify({to: userName}))
          .then(function (response) {
            if (response.data.Verification.length > 1) {
              _this.verificationServer = response.data.Verification
              _this.$message({
                message: '发送成功',
                type: 'success'
              })
            } else {
              console.log('未知原因获取失败。。。')
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// enrollUser.vue 接口  注册用户
export function interfaceAddUser (_this) {
  Axios.post(_this.URLS + '/index.php/Home/Index/user_add', qs.stringify({userName: _this.ruleForm.email, Password: _this.ruleForm.pw, Verification: _this.ruleForm.yzm}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$alert('用户名或密码错误', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '2') {
        _this.$alert('验证码错误', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '3') {
        _this.$alert('已被注册', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '4') {
        _this.$alert('注册成功！', '提示', {confirmButtonText: '确定', callback: action => {_this.$router.push('/login')}})
      } else if (response.data.msg === '5') {
        _this.$alert('注册失败，请重新注册！', '警告', {confirmButtonText: '确定'})
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// retrieveUser.vue 接口  找回面
export function forgetpass (_this) {
  Axios.post(_this.URLS + '/index.php/Home/Index/forgetpass', qs.stringify({userName: _this.ruleForm.email, Password: _this.ruleForm.pw, Verification: _this.ruleForm.yzm}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$alert('用户名或密码错误', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '2') {
        _this.$alert('验证码错误', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '4') {
        _this.$alert('此用户不存在！', '警告', {confirmButtonText: '确定'})
      } else if (response.data.msg === '6') {
        _this.$alert('修改成功！', '提示', {confirmButtonText: '确定', callback: action => {_this.$router.push('/login')}})
      } else if (response.data.msg === '7') {
        _this.$alert('修改失败，请重新修改！', '警告', {confirmButtonText: '确定'})
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageAddUser.vue 接口  注册
export function guanliAddUser (_this, adduser) {
  Axios.post(_this.URLS + '/index.php/Home/Index/guanliadduser', qs.stringify({userName: _this.adduser.userName, Password: _this.adduser.Password, nickname: _this.adduser.nickname, sex: _this.adduser.sex, permissions: _this.getUserGroupId(_this.adduser.permissions), webShow: _this.adduser.webShow, state: _this.adduser.state, HeadPortraitSrc: _this.adduser.HeadPortraitSrc}))
    .then(function (response) {
    	// 关闭按钮加载效果
    	_this.handleUpdateLoading = false
      if (response.data.msg === '0') {
        _this.$alert('用户名或密码不能为空', '提示', {confirmButtonText: '确定'})
      } else if (response.data.msg === '1') {
        _this.$alert('此用户已存在，请重新填写', '提示', {confirmButtonText: '确定'})
      } else if (response.data.msg === '2') {
        _this.$alert('添加成功', '提示', {confirmButtonText: '确定'})
      } else if (response.data.msg === '3') {
        _this.$alert('添加失败，请重新填写', '提示', {confirmButtonText: '确定'})
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// login.vue 接口  查询账号是否已注册
export function judgeName (_this, callback) {
  Axios.post(_this.URLS + '/index.php/Home/Login/emailrepeat', qs.stringify({userName: _this.ruleForm.email}))
    .then(function (response) {
      if (response.data.msg === '0') {
        callback(new Error('账号已被注册'))
      } else if (response.data.msg === '1') {
        callback()
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// login.vue 接口  注销
export function cancellationUser (_this) {
  Axios.post(_this.URLS + '/index.php/Home/Index/exitlogin', qs.stringify({uId: _this.$store.state.user.uId}))
    .then(function (response) {
      // console.log(response.data)
      if (response.data !== undefined) {
        if (response.data.msg === '0') {
          _this.$store.commit('cancellation', _this.$store.state)
          _this.$store.dispatch('setLocalStorage', _this.$store.state.user)
          _this.$store.dispatch('getLocalStorage', _this.$store.state.user)
          _this.$router.push('/login') // 跳转登录页
          
        } else {
          _this.$store.commit('cancellation', _this.$store.state)
          _this.$store.dispatch('setLocalStorage', _this.$store.state.user)
          _this.$store.dispatch('getLocalStorage', _this.$store.state.user)
          _this.$router.push('/login') // 跳转登录页
        }
      } else {
        _this.$store.commit('cancellation', _this.$store.state)
        _this.$store.dispatch('setLocalStorage', _this.$store.state.user)
        _this.$store.dispatch('getLocalStorage', _this.$store.state.user)
        _this.$router.push('/login') // 跳转登录页
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 删除上传临时文件
export function deleteTemporaryFile (_this, imgSrc) {
//	console.log(imgSrc)
  Axios.post(_this.URLS + '/index.php/Home/Index/delfile', qs.stringify({filesrc: imgSrc}))
    .then(function (response) {
      if (response.data.msg === '0') {
//      _this.$message({
//        message: '删除成功',
//        type: 'success'
//      })
      } else if (response.data.msg === '1') {
        _this.$message({
          message: '删除失败',
          type: 'warning'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 删除上传临时文件 批量删除
export function deleteTemporaryFile2 (_this, srcs, type) {
  if (srcs !== undefined) {
    if (srcs.length > 1) {
      for (let i = 0; i < srcs.length; i++) {
        Axios.post(_this.URLS + '/index.php/Home/Index/delfile', qs.stringify({filesrc: srcs[i]}))
        .then(function (response) {
          // console.log(response.data)
          if (response.data.msg === '0') {
            _this.release = true
          } else if (response.data.msg === '1') {
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
      _this.uploadFiles = []
    } else if (srcs.length === 1) {
      Axios.post(_this.URLS + '/index.php/Home/Index/delfile', qs.stringify({filesrc: srcs[0]}))
      .then(function (response) {
        if (response.data.msg === '0') {
          /* _this.$message({
            message: '图片删除成功',
            type: 'success'
          })*/
        } else if (response.data.msg === '1') {
          /* _this.$message({
            message: '图片删除失败',
            type: 'warning'
          }) */
        }
      })
      .catch(function (error) {
        console.log(error)
      })
      _this.uploadFiles = []
    }
  }
}

// backstageUploadImg.vue 接口 用户上传发布图片信息
export function addImgsFile (_this, tid, pid, imgsrc, psdsrc, videosrc, describe, did, typeFile) {
  Axios.post(_this.URLS + '/index.php/Home/Index/exhibitionAdd', qs.stringify({uId: _this.$store.state.user.uId, title: _this.title, imgsrc: imgsrc, psdsrc: psdsrc, videosrc: videosrc, tid: tid, pid: pid, did: did, describe: describe, keyword: _this.dynamicTags.toString(), typeFile: typeFile}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          message: '恭喜你，发布成功',
          type: 'success'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          message: '发布失败',
          type: 'warning'
        })
      }
	    // 更新页面调用app.vue的更新方法
			_this.myReload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 用户上传发布图片信息
export function addImgsFile3 (_this, tid, pid, psdsrc, videosrc, describe, did) {
  console.log('uId:' + _this.$store.state.user.uId + ', title:' + _this.title + ', imgsrc:' + _this.imgCrss + ', psdsrc:' + psdsrc + ', videosrc:' + videosrc + ', tid:' + tid + ', pid:' + pid)
  _this.imgCrss = _this.imgCrss.length === 0 ? '' : _this.imgCrss
  Axios.post(_this.URLS + '/index.php/Home/Index/exhibitionAdd', qs.stringify({uId: _this.$store.state.user.uId, title: _this.title, imgsrc: _this.imgCrss, psdsrc: psdsrc, videosrc: videosrc, tid: tid, pid: pid, did: did, describe: describe, keyword: _this.dynamicTags.toString()}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          message: '恭喜你，发布成功',
          type: 'success'
        })
        _this.title = ''
        _this.$refs.fliesImg.clearFiles() // 清除上传的文件 图片
        _this.psdImageUrlls = ''
        _this.videoImageUrlls = ''
        _this.typeImg = ''
        _this.describe = ''
        _this.projectImg = ''
        _this.titleDiv = false
        _this.titleCf = false
        _this.release = true
        _this.loading = false
      } else if (response.data.msg === '1') {
        _this.$message({
          message: '发布失败',
          type: 'warning'
        })
        _this.title = ''
        _this.$refs.fliesImg.clearFiles() // 清除上传的文件 图片
        _this.psdImageUrlls = ''
        _this.videoImageUrlls = ''
        _this.typeImg = ''
        _this.describe = ''
        _this.projectImg = ''
        _this.titleDiv = false
        _this.titleCf = false
        _this.release = true
        _this.loading = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 用户上传发布图片信息
export function addImgsFile2 (_this, obj) {
	// 上传中删除的文件
  deleteTemporaryFile2(_this, _this.deleteFiles, 'all')
  // 提交修改数据
  Axios.post(_this.URLS + '/index.php/Home/Index/exhibitionedit', qs.stringify({uId: obj.uId, title: obj.title, imgsrc: obj.imgsrc, psdsrc: obj.psdsrc, videosrc: obj.videosrc, tid: obj.tid, pid: obj.pid, describe: obj.describe, mId: obj.mId, did: obj.did, keyword: obj.keyword, typeFile: obj.typeFile}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          message: '修改失败',
          type: 'warning'
        })
      }
      // 清空数据，刷新状态关闭
      _this.uploadingFiles = []
      _this.article = []
      _this.loading = false
       // 跳转后台查看文章
      _this.$router.push('/backstage/seeArticle')
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 标题判断是否重复
export function queryTitle (title, _this) {
  Axios.post(_this.URLS + '/index.php/Home/Index/titlerepeat', qs.stringify({title: title}))
    .then(function (response) {
      if (response.data.msg === '0') {
        // 有重复的
        _this.titleDiv = true
        _this.titleCf = false
      } else if (response.data.msg === '1') {
        // 没有重复的
        _this.titleDiv = true
        _this.titleCf = true
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 标题判断是否重复
export function queryTitle2 (title, mid, _this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/titlerepeats?title=' + title + '&mId=' + mid)
    .then(function (response) {
      if (response.data.msg === '0') {
        // 没有重复的
        _this.titleDiv = true
        _this.titleCf = true
      } else if (response.data.msg === '1') {
        // 有重复的
        _this.titleDiv = true
        _this.titleCf = false
      } else if (response.data.msg === '2') {
        // 没有重复的
        _this.titleDiv = true
        _this.titleCf = true
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUploadImg.vue 接口 标题判断是否重复
export function reductionInterface (_this, mid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionreduction?mId=' + mid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          message: '还原成功',
          type: 'success'
        })
        recoveryArticleAll(_this)
      } else if (response.data.msg === '1') {
        _this.$message({
          message: '还原失败',
          type: 'warning'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserInfoModify.vue 接口 修改用户信息
export function modifyUserInfo (_this, HeadPortraitSrc, nickname, sex) {
  Axios.post(_this.URLS + '/index.php/Home/Index/editUser', qs.stringify({uId: _this.$store.state.user.uId, HeadPortraitSrc: HeadPortraitSrc, nickname: nickname, sex: sex}))
    .then(function (response) {
      if (response.data.msg === '0') {
        // 给全局变量赋值
        let user = {
          nickname: response.data.nickname,
          sex: response.data.sex,
          HeadPortraitSrc: response.data.HeadPortraitSrc
        }
        _this.$store.commit('setUserInfo', user)
        _this.$store.dispatch('setLocalStorage', _this.$store.state.user) // 本地存储用户信息
        // console.log(_this.$store.state.user.permissions + '修改用户信息')
        _this.$message({
          message: '修改成功',
          type: 'success'
        })
        _this.userInfo.HeadPortraitSrc = _this.$store.state.user.HeadPortraitSrc
        _this.userInfo.nickname = _this.$store.state.user.nickname
        _this.userInfo.sex = _this.$store.state.user.sex
//      _this.info = true
        _this.infoModify = false
      } else if (response.data.msg === '1') {
        _this.$message({
          message: '修改失败',
          type: 'warning'
        })
//      _this.info = true
        _this.infoModify = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageSeeImg.vue 接口 查询当前用户的所有文章信息
export function currentUserArticleAll (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibition?uId=' + _this.$store.state.user.uId)
    .then(function (response) {
      _this.loading = true
      let srcs = []
      if (response.data.msg === '1') {
        _this.article = []
        _this.loading = false
        _this.prompt = '没有查到相关数据'
      } else if (response.data.list.length !== 0) {
        _this.article = response.data.list
        for (let i = 0; i < _this.article.length; i++) {
          _this.article[i].img = JSON.parse(_this.article[i].img)
          _this.article[i].psd = JSON.parse(_this.article[i].psd)
          _this.article[i].video = JSON.parse(_this.article[i].video)
          if (_this.article[i].video.videoImg.url !== '') {
            srcs[0] = _this.article[i].video.videoImg.url
          }
          if (srcs.length === 0) {
            if (_this.article[i].img.length !== 0) {
              for (let j = 0; j < _this.article[i].img.length; j++) {
                if (j <= 3) {
                  srcs[srcs.length] = _this.article[i].img[j].url
                }
              }
            }
          } else if (srcs.length === 1) {
            for (let a = 0; a < _this.article[i].img.length; a++) {
              if (a <= 2) {
                srcs[srcs.length] = _this.article[i].img[a].url
              }
            }
          } else if (srcs.length === 2) {
            for (let b = 0; b < _this.article[i].img.length; b++) {
              if (b <= 1) {
                srcs[srcs.length] = _this.article[i].img[b].url
              }
            }
          }
          _this.article[i].srcs = srcs
          srcs = []
        }
        _this.loading = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageAdministrationSeeImg.vue 接口 查询所有用户的文章信息
export function administrationArticleAll (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionguanli?permissions=' + _this.$store.state.user.permissions)
    .then(function (response) {
      _this.loading = true
      let srcs = []
      if (response.data.msg === '1') {
        _this.article = []
        _this.loading = false
        _this.prompt = '没有查到相关数据'
      } else if (response.data.list.length !== 0) {
        _this.article = response.data.list
        _this.article.find(obj => {
        	obj.img = obj.img === '[]' ? eval('(' + obj.img + ')') : JSON.parse(obj.img)
        	obj.psd = obj.psd === '[]' ? eval('(' + obj.psd + ')') : JSON.parse(obj.psd)
        	obj.video = obj.video === '[]' ? eval('(' + obj.video + ')') : JSON.parse(obj.video)
        	obj.typeFile === 'img' ? srcs[srcs.length] = obj.img[0].miniImg : obj.typeFile = obj.typeFile
        	obj.typeFile === 'psd' ? srcs[srcs.length] = obj.psd[0].Psdview : obj.typeFile = obj.typeFile
        	obj.typeFile === 'video' ? srcs[srcs.length] = obj.video[0].Videoview : obj.typeFile = obj.typeFile
					obj.srcs = srcs.length !== 0 ? srcs : new Array()
					srcs = []
        })
        _this.loading = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageRecoverySeeImg.vue 接口 查询所有用户的文章信息
export function recoveryArticleAll (_this) {
  let uid = _this.$store.state.user.permissions === '1' ? _this.$store.state.user.uId : ''
  let pid = _this.projectImg.length === 0 ? '' : _this.projectImg
  let tid = _this.typeImg.length === 0 ? '' : _this.typeImg
  let did = _this.minTypeImg.length === 0 ? '' : _this.minTypeImg
  if (_this.$store.state.user.permissions === '2') {
    for (let j = 0; j < _this.userList.length; j++) {
      if (_this.userList[j].nickname === _this.userName) {
        uid = _this.userList[j].uId
      }
    }
  }
  if (pid !== '') {
    for (let j = 0; j < _this.projects.length; j++) {
      if (_this.projects[j].xname === pid) {
        pid = _this.projects[j].pid
      }
    }
  }
  if (tid !== '') {
    for (let j = 0; j < _this.types.length; j++) {
      if (_this.types[j].lname === tid) {
        tid = _this.types[j].tid
      }
    }
  }
  if (did !== '') {
    for (let j = 0; j < _this.minTypes.length; j++) {
      if (_this.minTypes[j].dname === did) {
        did = _this.minTypes[j].did
      }
    }
  }
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionrecovery?permissions=' + _this.$store.state.user.permissions + '&uId=' + uid + '&title=' + _this.searchTXT + '&pid=' + pid + '&tid=' + tid + '&did=' + did)
    .then(function (response) {
      _this.loading = true
      let srcs = []
      if (response.data.msg === '1') {
        _this.article = []
        _this.loading = false
        _this.prompt = '没有查到相关数据'
      } else if (response.data.length !== 0) {
        _this.article = response.data
        for (let i = 0; i < _this.article.length; i++) {
          _this.article[i].img = JSON.parse(_this.article[i].img)
          _this.article[i].psd = JSON.parse(_this.article[i].psd)
          _this.article[i].video = JSON.parse(_this.article[i].video)
          switch(srcs.length)
					{
					    case 0:
					    		if (_this.article[i].typeFile === 'img') {
					    			_this.article[i].img.find((obj, index) => {
					    				if (index <= 3) {
			                  srcs[srcs.length] = obj.miniImg
			                }
					    			})
					    		} else if (_this.article[i].typeFile === 'psd') {
					    			_this.article[i].psd.find((obj, index) => {
					    				if (index <= 3) {
			                  srcs[srcs.length] = obj.Psdview
			                }
					    			})
					    		} else if (_this.article[i].typeFile === 'video') {
					    			_this.article[i].video.find((obj, index) => {
					    				if (index <= 3) {
			                  srcs[srcs.length] = obj.Videoview
			                }
					    			})
					    		}
					        break;
					    case 1:
					        if (_this.article[i].typeFile === 'img') {
					    			_this.article[i].img.find((obj, index) => {
					    				if (index <= 2) {
			                  srcs[srcs.length] = obj.miniImg
			                }
					    			})
					    		} else if (_this.article[i].typeFile === 'psd') {
					    			_this.article[i].psd.find((obj, index) => {
					    				if (index <= 2) {
			                  srcs[srcs.length] = obj.Psdview
			                }
					    			})
					    		} else if (_this.article[i].typeFile === 'video') {
					    			_this.article[i].video.find((obj, index) => {
					    				if (index <= 2) {
			                  srcs[srcs.length] = obj.Videoview
			                }
					    			})
					    		}
					        break;
					    case 2:
					        if (_this.article[i].typeFile === 'img') {
					    			_this.article[i].img.find((obj, index) => {
					    				if (index <= 1) {
			                  srcs[srcs.length] = obj.miniImg
			                }
					    			})
					    		} else if (_this.article[i].typeFile === 'psd') {
					    			_this.article[i].psd.find((obj, index) => {
					    				if (index <= 1) {
			                  srcs[srcs.length] = obj.Psdview
			                }
					    			})
					    		} else if (_this.article[i].typeFile === 'video') {
					    			_this.article[i].video.find((obj, index) => {
					    				if (index <= 1) {
			                  srcs[srcs.length] = obj.Videoview
			                }
					    			})
					    		}
					        break;
					}
          _this.article[i].srcs = srcs
          srcs = []
        }
        _this.loading = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageSeeImg.vue 接口 条件查询文章
export function userArticleQuery (_this) {
  let title = _this.searchTXT.length === 0 ? '' : _this.searchTXT
  let pid = _this.projectImg.length === 0 ? '' : _this.projectImg
  let tid = _this.typeImg.length === 0 ? '' : _this.typeImg
  let did = _this.minTypeImg.length === 0 ? '' : _this.minTypeImg
  if (pid !== '') {
    for (let j = 0; j < _this.projects.length; j++) {
      if (_this.projects[j].xname === pid) {
        pid = _this.projects[j].pid
      }
    }
  }
  if (tid !== '') {
    for (let j = 0; j < _this.types.length; j++) {
      if (_this.types[j].lname === tid) {
        tid = _this.types[j].tid
      }
    }
  }
  if (did !== '') {
    for (let j = 0; j < _this.minTypes.length; j++) {
      if (_this.minTypes[j].dname === did) {
        did = _this.minTypes[j].did
      }
    }
  }
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibition?title=' + title + '&pid=' + pid + '&tid=' + tid + '&uId=' + _this.$store.state.user.uId + '&did=' + did)
    .then(function (response) {
      let srcs = []
      if (response.data.msg === '1') {
        _this.article = []
        _this.prompt = '没有查到相关数据'
      } else if (response.data.list.length !== 0) {
        _this.prompt = ''
        _this.article = response.data.list
        for (let i = 0; i < _this.article.length; i++) {
          _this.article[i].img = JSON.parse(_this.article[i].img)
          _this.article[i].psd = JSON.parse(_this.article[i].psd)
          _this.article[i].video = JSON.parse(_this.article[i].video)
          _this.article[i].video.videoImg.url.length !== 0 ? srcs[0] = _this.article[i].video.videoImg.url : console.log()
          if (srcs.length === 0) {
            for (let j = 0; j < _this.article[i].img.length; j++) {
              if (j <= 3) {
                srcs[j] = _this.article[i].img[j].url
              }
            }
          } else if (srcs.length === 1) {
            for (let a = 0; a < _this.article[i].img.length; a++) {
              if (a <= 2) {
                srcs[srcs.length] = _this.article[i].img[a].url
              }
            }
          } else if (srcs.length === 2) {
            for (let b = 0; b < _this.article[i].img.length; b++) {
              if (b <= 1) {
                srcs[srcs.length] = _this.article[i].img[b].url
              }
            }
          }
          _this.article[i].srcs = srcs
          srcs = []
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageAdministrationSeeImg.vue 接口 管理条件查询文章
export function administrationArticleQuery (_this) {
  let title = _this.searchTXT.length === 0 ? '' : _this.searchTXT
  let pid = _this.projectImg.length === 0 ? '' : _this.projectImg
  let tid = _this.typeImg.length === 0 ? '' : _this.typeImg
  let uid = _this.userName.length === 0 ? '' : _this.userName
  let did = _this.minTypeImg.length === 0 ? '' : _this.minTypeImg
  if (pid !== '') {
    for (let j = 0; j < _this.projects.length; j++) {
      if (_this.projects[j].xname === pid) {
        pid = _this.projects[j].pid
      }
    }
  }
  if (tid !== '') {
    for (let i = 0; i < _this.types.length; i++) {
      if (_this.types[i].lname === tid) {
        tid = _this.types[i].tid
      }
    }
  }
  if (uid !== '') {
    for (let e = 0; e < _this.userList.length; e++) {
      if (_this.userList[e].nickname === uid) {
        uid = _this.userList[e].uId
      }
    }
  }
  if (did !== '') {
    for (let j = 0; j < _this.minTypes.length; j++) {
      if (_this.minTypes[j].dname === did) {
        did = _this.minTypes[j].did
      }
    }
  }
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionguanli?title=' + title + '&pid=' + pid + '&tid=' + tid + '&uId=' + uid + '&did=' + did)
    .then(function (response) {
      let srcs = []
      if (response.data.msg === '1') {
        _this.article = []
        _this.prompt = '没有查到相关数据'
      } else if (response.data.list.length !== 0) {
        _this.prompt = ''
        _this.article = response.data.list
        for (let i = 0; i < _this.article.length; i++) {
          _this.article[i].img = JSON.parse(_this.article[i].img)
          _this.article[i].psd = JSON.parse(_this.article[i].psd)
          _this.article[i].video = JSON.parse(_this.article[i].video)
          _this.article[i].video.videoImg.url.length !== 0 ? srcs[0] = _this.article[i].video.videoImg.url : console.log()
          if (srcs.length === 0) {
            for (let j = 0; j < _this.article[i].img.length; j++) {
              if (j <= 3) {
                srcs[j] = _this.article[i].img[j].url
              }
            }
          } else if (srcs.length === 1) {
            for (let a = 0; a < _this.article[i].img.length; a++) {
              if (a <= 2) {
                srcs[srcs.length] = _this.article[i].img[a].url
              }
            }
          } else if (srcs.length === 2) {
            for (let b = 0; b < _this.article[i].img.length; b++) {
              if (b <= 1) {
                srcs[srcs.length] = _this.article[i].img[b].url
              }
            }
          }
          _this.article[i].srcs = srcs
          srcs = []
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// search.vue 接口 条件查询文章
export function administrationArticleAll2 (_this) {
	Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionguanli2?title=' + _this.searchTerms + '&pid=&tid=&uId=&did=')
    .then(function (response) {
      let srcs = [],temp = [], num = 0
      if (response.data.msg === '1') {
        _this.article = []
        _this.prompt = '没有查到相关数据'
      } else if (response.data.list.length !== 0) {
        _this.article = response.data.list
        _this.article.find(obj => {
        	obj.img = obj.img === '[]' ? eval('(' + obj.img + ')') : JSON.parse(obj.img)
        	obj.psd = obj.psd === '[]' ? eval('(' + obj.psd + ')') : JSON.parse(obj.psd)
        	obj.video = obj.video === '[]' ? eval('(' + obj.video + ')') : JSON.parse(obj.video)
        	obj.typeFile === 'img' ? srcs[srcs.length] = obj.img[0].miniImg : obj.typeFile = obj.typeFile
        	obj.typeFile === 'psd' ? srcs[srcs.length] = obj.psd[0].Psdview : obj.typeFile = obj.typeFile
        	obj.typeFile === 'video' ? srcs[srcs.length] = obj.video[0].Videoview : obj.typeFile = obj.typeFile
        	// 给每一篇文章添加用户信息
        	_this.userList.find(user => {
        		user.uId === obj.uId ? obj.user = user : user = user
        	})
        	// 给每一篇文章添加缩率图
					obj.srcs = srcs.length !== 0 ? srcs : new Array()
					srcs = []
        })
        
        // 查询数据去重赋值
        srcs = []
        _this.article.find((o, index) => {
        	srcs.find((s, sindex) => {
        		o.mId === s.mId ? num++ : console.log()
        	})
        	num === 0 ? srcs.push(o) : console.log()
					num = 0        	
        })
        _this.article2 = _this.article = srcs
    	}
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myWebSeeArticle.vue接口 条件查询文章
export function administrationArticleAll3 (_this) {
	Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionguanli?permissions=2')
    .then(function (response) {
      let srcs = []
      if (response.data.msg === '1') {
        _this.article = []
        _this.prompt = '没有查到相关数据'
      } else if (response.data.list.length !== 0) {
        _this.article = response.data.list
        _this.article.find((obj, index) => {
        	obj.img = obj.img === '[]' ? eval('(' + obj.img + ')') : JSON.parse(obj.img)
        	obj.psd = obj.psd === '[]' ? eval('(' + obj.psd + ')') : JSON.parse(obj.psd)
        	obj.video = obj.video === '[]' ? eval('(' + obj.video + ')') : JSON.parse(obj.video)
        	obj.typeFile === 'img' ? srcs[srcs.length] = obj.img[0].miniImg : obj.typeFile = obj.typeFile
        	obj.typeFile === 'psd' ? srcs[srcs.length] = obj.psd[0].Psdview : obj.typeFile = obj.typeFile
        	obj.typeFile === 'video' ? srcs[srcs.length] = obj.video[0].Videoview : obj.typeFile = obj.typeFile
        	// 给每一篇文章添加用户信息
        	_this.userList.find(user => {
        		user.uId === obj.uId ? obj.user = user : user = user
        	})
        	// 给每一篇文章添加缩率图
					obj.srcs = srcs.length !== 0 ? srcs : new Array()
					srcs = []
        })
    	}
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageSeeImg.vue 接口 删除文章
export function delArticle (_this, mid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionDel?mId=' + mid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
        userArticleQuery(_this)
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '删除失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageSeeImg.vue 接口 删除文章
export function delArticle2 (_this, mid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionDel?mId=' + mid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
        administrationArticleAll(_this)
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '删除失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}


// backstageRecoverySeeImg.vue 接口 删除文章永久删除
export function delArticle3 (_this, mid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/del?mId=' + mid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
        recoveryArticleAll(_this)
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '删除失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// modifyPassword.vue 接口 修改用户密码
export function updatePwd (_this, formName) {
  Axios.get(_this.URLS + '/index.php/Home/Index/user_edit?uId=' + _this.$store.state.user.uId + '&Verification=' + _this.ruleForm.yzm + '&Password=' + _this.ruleForm.pw)
    .then(function (response) {
      if (response.data.msg === '0') {
        // 给全局变量赋值
        _this.$store.commit('setUserPassword', _this.ruleForm.pw)
        // 本地存储用户信息
        _this.$store.dispatch('setLocalStorage')
        // 用户提示
        _this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 重置表单
        _this.$refs[formName].resetFields()
        // 按钮状态值更新
        _this.loading = false
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '修改失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// modifyPassword.vue 接口 修改用户密码
export function guanliuser_save (_this, row) {
  Axios.post(_this.URLS + '/index.php/Home/Index/guanliuser_save', qs.stringify({uId: row.uId, nickname: row.nickname, sex: row.sex, Password: row.Password, permissions: _this.getUserGroupId(row.permissions), webShow: row.webShow, state: row.state}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({type: 'success',message: '修改成功!'})
      } else if (response.data.msg === '1') {
        _this.$message({type: 'info',message: '修改失败!'})
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 修改用户密码
export function updatePwd2 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/guanliuser_edit?uId=' + _this.uId + '&Password=' + _this.pwd)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '修改成功!'
        })
        _this.centerDialogVisible = false
        _this.pwd = ''
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '修改失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 删除用户
export function delUser (_this, uId) {
  Axios.get(_this.URLS + '/index.php/Home/Index/user_del?uId=' + uId)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
        userList(_this)
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '删除失败!'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 查询所有用户信息
export function userList (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/user_list')
    .then(function (response) {
      _this.loading = true
      if (response.data !== null) {
        _this.userList = response.data
        if (_this.userList.length !== 0) {
          for (let i = 0; i < _this.userList.length; i++) {
            _this.userList[i].registerTime = _this.formatDate(_this.userList[i].registerTime)
            _this.userList[i].endTime = _this.formatDate(_this.userList[i].endTime)
          }
          _this.loading = false
        } else {
          _this.userList = []
        }
        // console.log(_this.userList)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 查询所有用户信息
export function userList2 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/userxiala')
    .then(function (response) {
      _this.loading = true
      if (response.data !== null) {
        _this.userList = response.data
        if (_this.userList.length !== 0) {
          for (let i = 0; i < _this.userList.length; i++) {
            _this.userList[i].registerTime = _this.formatDate(_this.userList[i].registerTime)
            _this.userList[i].endTime = _this.formatDate(_this.userList[i].endTime)
          }
          _this.loading = false
        } else {
          _this.userList = []
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 查询所有用户信息
export function userList3 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/userxiala')
    .then(function (response) {
      if (response.data !== null) {
        _this.userList = response.data
        if (_this.userList.length !== 0) {
          for (let i = 0; i < _this.userList.length; i++) {
            _this.userList[i].registerTime = _this.formatDate(_this.userList[i].registerTime)
            _this.userList[i].endTime = _this.formatDate(_this.userList[i].endTime)
          }
        } else {
          _this.userList = []
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 权限修改
export function permissions (_this, uid, pid) {
  Axios.post(_this.URLS + '/index.php/Home/Index/usergroupedit', qs.stringify({uId: uid, permissions: pid}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '修改成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '修改失败，请重新修改!'
        })
      }
      // 关闭选择框  清空uId变量内容
      _this.userGroupUpdate = false
			_this.uId = ''
			// 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 查询被删除的所有用户信息
export function userRecovery (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/userrecovery')
    .then(function (response) {
      _this.loading = true
      _this.userList = []
      if (response.data !== null) {
        _this.userList = response.data
        if (_this.userList.length !== 0) {
          for (let i = 0; i < _this.userList.length; i++) {
            _this.userList[i].registerTime = _this.formatDate(_this.userList[i].registerTime)
            _this.userList[i].endTime = _this.formatDate(_this.userList[i].endTime)
          }
        } else {
          _this.userList = []
        }
      }
      _this.loading = false
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageUserList.vue 接口 被删除的用户还原
export function reduction (_this, uId) {
  Axios.get(_this.URLS + '/index.php/Home/Index/reduction?uId=' + uId)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '还原成功!'
        })
        userRecovery(_this)
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '还原失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 查询项目list（所有）
export function projectList (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/projectlist?flag=0')
    .then(function (response) {
      _this.loadingP = true
      if (response.data.msg !== null && response.data.msg === '1') {
        // 没有数据
        _this.loadingP = false
      } else if (response.data.length !== 0) {
        _this.PList = response.data
        // 这里如果是直接赋值过来是浅拷贝会修改其中的值，所以这里做了深拷贝处理
        let PList = JSON.stringify(response.data)
        // 更新vuex中的分类信息
        _this.$store.commit('setUserProjects', JSON.parse(PList))
        // 查询输入框提示值
        _this.PList.find((obj, index) => {
					_this.PListSou.push({
						"value": obj.xname,
						"address": obj.pid
					})
				})
        // 本地存储信息更新
        _this.$store.dispatch('setLocalStorage')
        _this.loadingP = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myWebSeeArticle.vue 接口 查询项目list（所有）
export function projectList4 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/projectlist?flag=0')
    .then(function (response) {
      if (response.data.length !== 0) {
        _this.projects = response.data
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 查询项目list（只查启用的）
export function projectList2 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/projectlist?flag=1')
    .then(function (response) {
      if (response.data !== '1') {
        // 给全局变量赋值
        let user = {
          uId: _this.$store.state.user.uId,
          permissions: _this.$store.state.user.permissions,
          userName: _this.$store.state.user.userName,
          Password: _this.$store.state.user.Password,
          nickname: _this.$store.state.user.nickname,
          sex: _this.$store.state.user.sex,
          registerTime: _this.$store.state.user.registerTime,
          endTime: _this.$store.state.user.endTime,
          state: _this.$store.state.user.state,
          HeadPortraitSrc: _this.$store.state.user.HeadPortraitSrc,
          setPasswordStyle: _this.$store.state.user.setPasswordStyle,
          types: _this.$store.state.user.types,
          projects: response.data,
          minType: _this.$store.state.user.minType,
          mId: _this.$store.state.mId
        }
        _this.$store.commit('setUsername', user)
        _this.$store.dispatch('setLocalStorage', _this.$store.state.user) // 本地存储用户信息
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 查询项目list
export function projectList3 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/projectlist?flag=0')
    .then(function (response) {
      if (response.data !== '1') {
        _this.projects = response.data
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 查询类型list（所有）
export function typeList (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/typelist?flag=0')
    .then(function (response) {
      _this.loadingT = true
      if (response.data.msg !== null && response.data.msg === '1') {
        // 没有数据
        _this.loadingT = false
      } else if (response.data.length !== 0) {
        _this.tList = response.data
        // 这里如果是直接赋值过来是浅拷贝会修改其中的值，所以这里做了深拷贝处理
        let tList = JSON.stringify(response.data)
        // 更新vuex中的分类信息
        _this.$store.commit('setUserTypes', JSON.parse(tList))
        // 查询输入框提示值
        _this.tList.find((obj, index) => {
					_this.tListSou.push({
						"value": obj.lname,
						"address": obj.tid
					})
				})
        // 本地存储信息更新
        _this.$store.dispatch('setLocalStorage')
        _this.loadingT = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 查询类型list（只查启用的）
export function typeList2 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/typelist?flag=1')
    .then(function (response) {
      if (response.data !== '1') {
        // 给全局变量赋值
        let user = {
          uId: _this.$store.state.user.uId,
          permissions: _this.$store.state.user.permissions,
          userName: _this.$store.state.user.userName,
          Password: _this.$store.state.user.Password,
          nickname: _this.$store.state.user.nickname,
          sex: _this.$store.state.user.sex,
          registerTime: _this.$store.state.user.registerTime,
          endTime: _this.$store.state.user.endTime,
          state: _this.$store.state.user.state,
          HeadPortraitSrc: _this.$store.state.user.HeadPortraitSrc,
          setPasswordStyle: _this.$store.state.user.setPasswordStyle,
          types: response.data,
          projects: _this.$store.state.user.projects,
          minType: _this.$store.state.user.minType,
          mId: _this.$store.state.mId
        }
        _this.$store.commit('setUsername', user)
        _this.$store.dispatch('setLocalStorage', _this.$store.state.user) // 本地存储用户信息
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myWebSeeArticle.vue 接口 查询类型list
export function typeList4 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/typelist?flag=1')
    .then(function (response) {
      if (response.data !== '1') {
        _this.types = response.data
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 查询类型list（只查启用的）
export function typeList3 (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/typelist?flag=1')
    .then(function (response) {
      if (response.data !== '1') {
        _this.options = response.data
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 禁用类型
export function typeDisable (_this, tid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/typeDisable?tid=' + tid)
    .then(function (response) {
      if (response.data.msg === '0') {
        typeList(_this)
        typeList2(_this)
        _this.$message({
          type: 'success',
          message: '禁用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '禁用失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 禁用项目
export function projectDisable (_this, pid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/projectDisable?pid=' + pid)
    .then(function (response) {
      if (response.data.msg === '0') {
        projectList(_this)
        projectList2(_this)
        _this.$message({
          type: 'success',
          message: '禁用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '禁用失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 启用类型
export function typeEnable (_this, tid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/typeEnable?tid=' + tid)
    .then(function (response) {
      if (response.data.msg === '0') {
        typeList(_this)
        typeList2(_this)
        _this.$message({
          type: 'success',
          message: '启用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '启用失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 启用项目
export function projectEnable (_this, pid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/projectEnable?pid=' + pid)
    .then(function (response) {
      if (response.data.msg === '0') {
        projectList(_this)
        projectList2(_this)
        _this.$message({
          type: 'success',
          message: '启用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '启用失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 编辑修改类型
export function typesave (_this, row) {
  Axios.post(_this.URLS + '/index.php/Home/Index/typesave', qs.stringify({tid: row.tid, lname: row.lname, state: row.state, webShow: row.webShow}))
    .then(function (response) {
    	// 按钮加载效果关闭
    	_this.handleUpdateLoading = false
    	// 编辑窗口关闭
    	_this.centerDialogVisibleT = false
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '修改成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '修改失败!'})
      } else if (response.data.msg === '2') {
        _this.$alert('类型名称重复，请修改后重新提交', '警告', { confirmButtonText: '确定' })
      } else if (response.data.msg === '3') {
        _this.$alert('请不要重复提交！', '警告', { confirmButtonText: '确定' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 修改项目名称
export function projectsave (_this, row) {
  Axios.post(_this.URLS + '/index.php/Home/Index/projectsave', qs.stringify({pid: row.pid, xname: row.xname, state: row.state, webShow: row.webShow}))
    .then(function (response) {
    	// 按钮加载效果关闭
    	_this.handleUpdateLoading = false
    	// 编辑窗口关闭
    	_this.centerDialogVisibleP = false
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '修改成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '修改失败!'})
      } else if (response.data.msg === '2') {
        _this.$alert('项目名称重复，请修改后重新提交', '警告', { confirmButtonText: '确定' })
      } else if (response.data.msg === '3') {
        _this.$alert('请不要重复提交！', '警告', { confirmButtonText: '确定' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageModifyImg.vue 接口 修改文章获取数据
export function exhibitionDetails (_this, mId) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionDetails?mId=' + mId)
    .then(function (response) {
      _this.loading2 = true
      if (response.data.list.length !== 0) {
        _this.article = response.data.list[0]
        let tags = _this.article.keyword.split(",")
        tags.find((e, index) => {
        	_this.dynamicTags.push(e)
        })
        _this.title = _this.article.title
        _this.projectImg = _this.article.xname
        _this.typeImg = _this.article.lname
        _this.did = _this.article.detailsid
        _this.minTypeImg = _this.article.dname
        _this.article.img = _this.article.img !== '[]' ? JSON.parse(_this.article.img) : new Array()
        _this.article.psd = _this.article.psd !== '[]' ? JSON.parse(_this.article.psd) : new Array()
        _this.article.video = _this.article.video !== '[]' ? JSON.parse(_this.article.video) : new Array()
        _this.article.typeFile === 'img' ? _this.imgDiv = true : _this.imgDiv = false
        _this.article.typeFile === 'psd' ? _this.psdDiv = true : _this.psdDiv = false
        _this.article.typeFile === 'video' ? _this.videoDiv = true : _this.videoDiv = false
        
        // 以下代码是针对element的上传组件在修改中对已上传的文件显示变量赋值
        var num = []
	      if (response.data.list[0].typeFile === 'img') {
	      	_this.fileList = response.data.list[0].img
	      	if (_this.fileList !== '[]' && _this.fileList.length > 0) {
		      	_this.fileList.find(obj => {
		          	num[num.length] = {
									name: obj.dataImg.name,
									url: _this.URLS2 + obj.dataImg.url
								}
		      	})
		      	_this.fileList = num
	      	}
	      } else if (response.data.list[0].typeFile === 'psd') {
	      	_this.fileList = response.data.list[0].psd
	      	_this.fileList.find(obj => {
	          	num[num.length] = {
								name: obj.dataPsd.name,
								url: obj.dataPsd.url
							}
	      	})
	      	_this.fileList = num
	      } else if (response.data.list[0].typeFile === 'video') {
	      	response.data.list[0].video.find(obj => {
	          	_this.fileListVideo.push({
								name: obj.dataVideo.name,
								url: obj.dataVideo.url
							})
	      	})
	      	if (response.data.list[0].img !== '[]') {
	      		response.data.list[0].img.find(obj => {
		          	_this.fileListImg.push({
									name: obj.dataImg.name,
									url: _this.URLS2 + obj.dataImg.url
								})
		      	})
	      	}
	      }
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '获取失败！'
        })
      }
      _this.loading2 = false
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 添加类型名称
export function typeAdd (_this) {
  Axios.post(_this.URLS + '/index.php/Home/Index/typeAdd', qs.stringify({lname: _this.name}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '添加成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '添加失败!' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageProjectType.vue 接口 添加项目名称
export function projectAdd (_this) {
  Axios.post(_this.URLS + '/index.php/Home/Index/projectAdd', qs.stringify({xname: _this.name}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '添加成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '添加失败!' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// webIndex.vue 接口 获取图片集的数量和内容
export function exhibitionAllimg (_this, queryInfo) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionAllimg?title=' + queryInfo.title + '&pid=' + queryInfo.pid + '&tid=' + queryInfo.tid + '&sort=' + queryInfo.sort + '&p=' + queryInfo.p)
    .then(function (response) {
      if (response.data.msg !== "1") {
        if (_this.imgList.length === 0) {
          _this.imgList = response.data
        } else {
          for (let i = 0; i < response.data.length; i++) {
            if (i < _this.pageSize) {
              _this.$set(_this.imgList, _this.imgList.length, response.data[i])
            }
          }
        }
      } else if (response.data.msg === '1') {
        _this.prompt = '没有查询到相关数据'
      }
      _this.loading = false
    })
    .catch(function (error) {
      console.log(error)
    })
}

// webIndex.vue 接口 获取psd的数量和内容
export function exhibitionAllpsd (_this, queryInfo) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionAllpsd?title=' + queryInfo.title + '&pid=' + queryInfo.pid + '&tid=' + queryInfo.tid + '&sort=' + queryInfo.sort + '&p=' + queryInfo.p)
    .then(function (response) {
      if (response.data.msg !== "1") {
        if (_this.psdList.length === 0) {
          _this.psdList = response.data
        } else {
          for (let i = 0; i < response.data.length; i++) {
            if (i < _this.pageSize) {
              _this.$set(_this.psdList, _this.psdList.length, response.data[i])
            }
          }
        }
      } else if (response.data.msg === '1') {
        _this.prompt = '没有查询到相关数据'
      }
      _this.loading = false
    })
    .catch(function (error) {
      console.log(error)
    })
}

// webIndex.vue 接口 获取视频的数量和内容
export function exhibitionAllvideo (_this, queryInfo) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionAllvideo?title=' + queryInfo.title + '&pid=' + queryInfo.pid + '&tid=' + queryInfo.tid + '&sort=' + queryInfo.sort + '&p=' + queryInfo.p)
    .then(function (response) {
      if (response.data.msg !== "1") {
        if (_this.videoList.length === 0) {
          _this.videoList = response.data
        } else {
          for (let i = 0; i < response.data.length; i++) {
            if (i < _this.pageSize) {
              _this.$set(_this.videoList, _this.videoList.length, response.data[i])
            }
          }
        }
      } else if (response.data.msg === '1') {
        _this.prompt = '没有查询到相关数据'
      }
      _this.loading = false
    })
    .catch(function (error) {
      console.log(error)
    })
}

// article.vue 接口 获取文章内容
export function exhibitionDetails2 (_this, mid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/exhibitionDetailse?mId=' + mid)
    .then(function (response) {
      if (response.data.msg !== "1") {
        if (response.data.list.length !== 0) {
        	_this.article = response.data.list
        	_this.article.keyword = _this.article.keyword.split(",")
          _this.mid = response.data.list.mId
          _this.uId = response.data.list.uId
          _this.title = response.data.list.title
          _this.typeid = response.data.list.typeid === '7' ? response.data.list.typeid : ''
          _this.describe = response.data.list.describe
          _this.registerTime = response.data.list.registerTimeImg
          _this.imgFile = response.data.list.img
          _this.psdFile = response.data.list.psd
          _this.videoFile = response.data.list.video
          _this.typeFile = response.data.list.typeFile
          _this.loading = false
          _this.xiangguan = response.data.list.xiangguan
        }
      } else if (response.data.msg === '1') {
        _this.prompt = '没有查询到相关数据'
        _this.loading = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageMinType.vue 接口 获取小分类信息
export function detailslist (_this, flag) {
  Axios.get(_this.URLS + '/index.php/Home/Index/detailslist?flag=' + flag)
    .then(function (response) {
      if (response.data.msg !== "1") {
        _this.minType = response.data
        // 这里如果是直接赋值过来是浅拷贝会修改其中的值，所以这里做了深拷贝处理
        let minType = JSON.stringify(response.data)
        // 更新vuex中的分类信息
        _this.$store.commit('setUserMinType', JSON.parse(minType))
        // 查询输入框提示值
        _this.minType.find((obj, index) => {
					_this.minTypeSou.push({ "value": obj.dname, "address": obj.did })
				})
        // 本地存储信息更新
        _this.$store.dispatch('setLocalStorage')
        _this.loadingList = false
      } else if (response.data.msg === '1') {
        _this.prompt = '没有查询到相关数据'
        _this.loadingList = false
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myWebSeeArticle.vue 接口 获取小分类信息
export function detailslist2 (_this, flag) {
  Axios.get(_this.URLS + '/index.php/Home/Index/detailslist?flag=' + flag)
    .then(function (response) {
      if (response.data.msg !== "1") {
        _this.minTypes = response.data
        _this.minTypes2 = response.data
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageMinType.vue 接口 添加小分类
export function detailsAdd (_this, mixname, pid, tid) {
  Axios.post(_this.URLS + '/index.php/Home/Index/detailsAdd', qs.stringify({pbid: pid, tbid: tid, dname: mixname}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '添加成功!' })
//      _this.typeName = ''
//      _this.name = ''
//      _this.mixTypeAdd = false
//      _this.loadingList = true
        detailslist(_this, '2')
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '添加失败!' })
//      _this.typeName = ''
//      _this.name = ''
//      _this.mixTypeAdd = false
      } else if (response.data.msg === '2') {
        _this.$message({ type: 'info', message: '重复添加!' })
//      _this.typeName = ''
//      _this.name = ''
//      _this.mixTypeAdd = false
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageMinType.vue 接口 启用小分类
export function detailsEnable (_this, did) {
  Axios.get(_this.URLS + '/index.php/Home/Index/detailsEnable?did=' + did)
    .then(function (response) {
      if (response.data.msg === '0') {
        detailslist(_this, '2')
        _this.$message({
          type: 'success',
          message: '启用成功!'
        })
      } else if (response.data.msg === '1') {
        detailslist(_this, '2')
        _this.$message({
          type: 'info',
          message: '启用失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageMinType.vue 接口 禁用小分类
export function detailsDisable (_this, did) {
  Axios.get(_this.URLS + '/index.php/Home/Index/detailsDisable?did=' + did)
    .then(function (response) {
      if (response.data.msg === '0') {
        detailslist(_this, '2')
        _this.$message({
          type: 'success',
          message: '禁用成功!'
        })
      } else if (response.data.msg === '1') {
        detailslist(_this, '2')
        _this.$message({
          type: 'info',
          message: '禁用失败!'
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageMinType.vue 接口 修改小分类
export function detailssave (_this, row, tbid) {
  Axios.post(_this.URLS + '/index.php/Home/Index/detailssave', qs.stringify({did: row.did, tbid: tbid, dname: row.dname, states: row.states, webShow: row.webShow}))
    .then(function (response) {
    	_this.handleUpdateLoading = false
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '修改成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '修改失败!'})
      } else if (response.data.msg === '2') {
        _this.$alert('项目名称重复，请修改后重新提交', '警告', { confirmButtonText: '确定' })
      } else if (response.data.msg === '3') {
        _this.$alert('请不要重复提交！', '警告', { confirmButtonText: '确定' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// backstageRightIndex.vue 接口 统计当前7天的上传数据
export function Statistics (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/Statistics')
    .then(function (response) {
      for (let o = 1; o < 8; o++) {
      	_this.tj4data[_this.tj4data.length] = response.data[o].date
      	_this.tj4time[_this.tj4time.length] = parseInt(response.data[o].counts)
      }
      _this.drawLine()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myUserGroup.vue 接口  权限组功能页list
export function auth_list (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/auth_list')
    .then(function (response) {
    	if (response.data.msg === "0") {
    		// 权限组调用数组
    		_this.groups = response.data.userGroup
    		// 权限组初始化数组
    		_this.groupsInitial = response.data.userGroup
    		
    		// 下面的循环是在json字符串转换成josn数据后个别字段没有转过来 需要单独转下
//  		for(let i of _this.groups){
//			  	i.checkAll = eval('(' + i.checkAll + ')')
//			  	i.isIndeterminate = eval('(' + i.isIndeterminate + ')')
//			  	i.cityOptions = eval('(' + i.cityOptions + ')')
//			  	i.checkedCities = eval('(' + i.checkedCities + ')')
//				}
    	}
    })
    .catch(function (error) {
      console.log(error)
    })
}
// myUserGroup.vue 接口  权限组list
export function auth_grouplist (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/auth_grouplist')
    .then(function (response) {
			// 权限组list
			if (response.data.msg === undefined) {
				_this.usergroups = response.data
				_this.usergroups.find(obj => {
					obj.rules.find( o => {
						typeof o.checkedCities === "string" ? o.checkedCities === "[]" ? o.checkedCities = [] : o.checkedCities = eval('(' + o.checkedCities + ')') : o.checkedCities
						typeof o.checkAll === "string" ? o.checkAll = eval('(' + o.checkAll + ')') : o.checkAll
						typeof o.isIndeterminate === "string" ? o.isIndeterminate = eval('(' + o.isIndeterminate + ')') : o.isIndeterminate
						typeof o.cityOptions === "string" ? o.cityOptions === "[]" ? o.cityOptions = [] : o.cityOptions = eval('(' + o.cityOptions + ')') : o.cityOptions
					})
				})
			}
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myUserGroup.vue 接口  权限组添加
export function auth_groupadd (_this, userGroup) {
  Axios.post(_this.URLS + '/index.php/Home/Index/auth_groupadd', qs.stringify({title: userGroup.title, rules: userGroup.rules}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '添加成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '添加失败!'
        })
      }
      // 清空选择功能页所有选中状态、名称
			_this.groups = _this.groupsInitial
			_this.groupNameAdd = ''
			// 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myUserGroup.vue 接口  权限组修改  
export function auth_groupedit (_this, userGroup) {
  Axios.post(_this.URLS + '/index.php/Home/Index/auth_groupedit', qs.stringify({id: userGroup.id, title: userGroup.title, rules: userGroup.rules}))
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '添加成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '添加失败!'
        })
      }
      // 关闭添加用户组弹窗
      _this.groupUpdate = false
      // 清空groupUpdateSinglen内容
			_this.groupUpdateSingle = []
			// 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myUserGroup.vue 接口  获取单个权限组数据
export function auth_groupone (_this, id) {
  Axios.post(_this.URLS + '/index.php/Home/Index/auth_groupone', qs.stringify({id: id}))
    .then(function (response) {
    	var groupUpdateSingle = {}
      if (response.data[0].msg === '0') {
      	groupUpdateSingle.id = response.data[0].id
      	groupUpdateSingle.title = response.data[0].title
      	groupUpdateSingle.status = response.data[0].status
      	groupUpdateSingle.rules = response.data[0].rules
      	groupUpdateSingle.rules.find( o => {
						typeof o.checkedCities === "string" ? o.checkedCities === "[]" ? o.checkedCities = [] : o.checkedCities = eval('(' + o.checkedCities + ')') : o.checkedCities
						typeof o.checkAll === "string" ? o.checkAll = eval('(' + o.checkAll + ')') : o.checkAll
						typeof o.isIndeterminate === "string" ? o.isIndeterminate = eval('(' + o.isIndeterminate + ')') : o.isIndeterminate
						typeof o.cityOptions === "string" ? o.cityOptions === "[]" ? o.cityOptions = [] : o.cityOptions = eval('(' + o.cityOptions + ')') : o.cityOptions
					})
      	// 数据更新
      	_this.$set(_this.groupUpdateSingle, 0, groupUpdateSingle)
      	// 打开权限组修改框
      	_this.groupUpdate = true
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myUserGroup.vue 接口  删除权限组
export function groupdel (_this, id) {
  Axios.post(_this.URLS + '/index.php/Home/Index/groupdel', qs.stringify({id: id}))
    .then(function (response) {
    	if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '删除成功，相关用户全部重置为设计师权限！'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '删除失败!'
        })
      } else if (response.data.msg === '2') {
        _this.$message({
          type: 'success',
          message: '删除成功，相关用户权限请及时手动修改，否则会影响其登录！'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}


// index.vue 接口  获取标签组和标签
export function labelAlllist (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labelAlllist')
    .then(function (response) {
			if (response.data.msg === '0') {
				_this.groupLabel = response.data.groupLabel
				_this.labelAll = response.data.labelAll
				_this.groupLabel.find((gobj, index) => {
					gobj.lid = []
					_this.labelAll.find((lobj, index) => {
						gobj.gid === lobj.gid ? gobj.lid.push(lobj) : lobj = lobj
					})
				})
			}
    })
    .catch(function (error) {
      console.log(error)
    })
}
// myColumnFour.vue 接口  标签组list
export function labelslist (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labelslist')
    .then(function (response) {
			if (response.data.msg === '0') {
				_this.groupLabel = response.data.labellistarr
			}
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFour.vue 接口  添加标签组
export function labelsAdd (_this, name) {
  Axios.post(_this.URLS + '/index.php/Home/Index/labelsAdd', qs.stringify({name: name}))
    .then(function (response) {
    	// 按钮加载效果关闭
    	_this.addNameLoading = false
    	if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '添加成功'})
      } else if (response.data.msg === '1') {
        _this.$message({type: 'info',message: '添加失败!'})
      } else if (response.data.msg === '2') {
        _this.$alert('名称重复，请重新填写！', '警告', { confirmButtonText: '确定' })
      } else if (response.data.msg === '3') {
      	_this.$alert('post值出错，请重新添加！', '警告', { confirmButtonText: '确定' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFour.vue 接口  修改标签组名称
export function labelssave (_this, row) {
  Axios.post(_this.URLS + '/index.php/Home/Index/labelssave', qs.stringify({gid: row.gid, name: row.name , status: row.status , webShow: row.webShow}))
    .then(function (response) {
    	_this.handleUpdateLoading = false
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '修改成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '修改失败!'})
      } else if (response.data.msg === '2') {
        _this.$alert('项目名称重复，请修改后重新提交', '警告', { confirmButtonText: '确定' })
      } else if (response.data.msg === '3') {
        _this.$alert('请不要重复提交！', '警告', { confirmButtonText: '确定' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFour.vue 接口 禁用标签组名称
export function labelsDisable (_this, gid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labelsDisable?gid=' + gid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '禁用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '禁用失败!'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFour.vue 接口 启用标签组名称
export function labelsEnable (_this, gid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labelsEnable?gid=' + gid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '启用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '启用失败!'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFive.vue 接口  标签list
export function labellist (_this) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labellist')
    .then(function (response) {
			if (response.data.msg === '0') {
				_this.label = response.data.labellist
			}
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFive.vue 接口  添加标签
export function labelAdd (_this, gid, name) {
  Axios.post(_this.URLS + '/index.php/Home/Index/labelAdd', qs.stringify({gid: gid, name: name}))
    .then(function (response) {
    	if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '添加成功'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '数据库出错，添加失败!'
        })
      } else if (response.data.msg === '2') {
        _this.$message({
          type: 'info',
          message: '名称重复，请重新填写！'
        })
      } else if (response.data.msg === '3') {
        _this.$message({
          type: 'info',
          message: 'post值出错，请重新添加！'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFive.vue 接口  编辑标签的所有可更改属性
export function labelsave (_this, row, gid) {
  Axios.post(_this.URLS + '/index.php/Home/Index/labelsave', qs.stringify({lid: row.lid, gid: gid, name: row.name, status: row.status , webShow: row.webShow}))
    .then(function (response) {
    	_this.handleUpdateLoading = false
      if (response.data.msg === '0') {
        _this.$message({ type: 'success', message: '修改成功!' })
      } else if (response.data.msg === '1') {
        _this.$message({ type: 'info', message: '修改失败!'})
      } else if (response.data.msg === '2') {
        _this.$alert('项目名称重复，请修改后重新提交', '警告', { confirmButtonText: '确定' })
      } else if (response.data.msg === '3') {
        _this.$alert('请不要重复提交！', '警告', { confirmButtonText: '确定' })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFive.vue 接口 禁用标签名称
export function labelDiable (_this, lid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labelDiable?lid=' + lid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '禁用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '禁用失败!'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myColumnFive.vue 接口 启用标签名称
export function labelEnable (_this, lid) {
  Axios.get(_this.URLS + '/index.php/Home/Index/labelEnable?lid=' + lid)
    .then(function (response) {
      if (response.data.msg === '0') {
        _this.$message({
          type: 'success',
          message: '启用成功!'
        })
      } else if (response.data.msg === '1') {
        _this.$message({
          type: 'info',
          message: '启用失败!'
        })
      }
      // 更新页面调用app.vue的更新方法
			_this.reload()
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myAuthorizeList.vue 接口 获取当前用户文件被下载信息
// froid下载用户id，inid被下载用户id，都是可选值，都不填默认返回全部下载信息
export function informationlist (_this, froid, inid) {
  Axios.get(_this.URLS + '/index.php/Home/Information/informationlist?froid=' + froid + '&inid=' + inid)
    .then(function (response) {
      if (response.data.msg === '0') {
        if (response.data.info !== null) {
        	// 赋值
        	const res = new Map();
        	_this.userInfo.userDownloadInfo = response.data.info === null ? [] : response.data.info
        	// 过滤重复froid 算出几人下载
	    		_this.userInfo.downloadMan = response.data.info.filter((o) => !res.has(o.froid) && res.set(o.froid, 1)).length
	    		// 被下载次数
        	_this.userInfo.downloadNext = response.data.info.length
        	// 当前用户发布文章数
        	_this.userInfo.articleNum = parseInt(response.data.articleNum)
        	// 当前用户发布文章内容10条
        	_this.userInfo.article = response.data.article
        	// 所有发布文章数
        	_this.userInfo.articleAll = parseInt(response.data.articleAll)
        	// 用户发布项目分布数据
        	_this.userInfo.articleDistribution = response.data.articleDistribution
        	// 用户最近一周发布数据
        	_this.userInfo.articleWeek = response.data.articleWeek
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myAuthorizeList.vue 接口 获取当前用户的所有文章
// uid用户id
export function currentUserArticleList (_this, uid) {
  Axios.get(_this.URLS + '/index.php/Home/Information/currentUserArticleList?uid=' + uid)
    .then(function (response) {
      if (response.data.msg === '0') {
        if (response.data.article !== null) {
        	// 赋值
        	const res = new Map();
        	_this.userDownloadInfo = response.data.info === null ? [] : response.data.info
        	// 过滤重复froid 算出几人下载
	    		_this.userInfo.downloadMan = response.data.info.filter((o) => !res.has(o.froid) && res.set(o.froid, 1)).length
	    		// 被下载次数
        	_this.userInfo.downloadNext = response.data.info.length
        	// 当前用户发布文章数
        	_this.userInfo.articleNum = parseInt(response.data.article)
        	// 所有发布文章数
        	_this.userInfo.articleAll = parseInt(response.data.articleAll)
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

// myAuthorizeList.vue 接口 获取管理员统计页面数据
// uid用户id
export function administratorStatistics (_this, uid) {
  Axios.get(_this.URLS + '/index.php/Home/Information/administratorStatistics?uid=' + uid)
    .then(function (response) {
      if (response.data.msg === '0') {
	    	_this.activeDownloadAll = response.data.activeDownloadAll
				_this.userAll = response.data.userAll
				_this.activeAll = response.data.activeAll
				_this.activeImg = {num: response.data.activeImg, Proportion: parseInt((response.data.activeImg/response.data.activeAll*100).toFixed(1))}
				_this.activePsd = {num: response.data.activePsd, Proportion: parseInt((response.data.activePsd/response.data.activeAll*100).toFixed(1))}
				_this.activeVideo = {num: response.data.activeVideo, Proportion: parseInt((response.data.activeVideo/response.data.activeAll*100).toFixed(1))}
					
					// 用户发布占比（全部）数据填充
	    	response.data.activeUsers.find((obj, index) => {
	    		_this.articleUserReportData.legend.data.push(obj.nickname)
	    		_this.articleUserReportData.series[0].data.push({value:obj.count, name:obj.nickname})
	    	})
	    	// 用户发布文章占比 初始化图表
				_this.articleUserReport()
				
				// 文章发布排行榜 数据填充
				_this.articleRankingData = response.data.articleRanking
				
				// 最近发布文章（20篇） 数据填充
				_this.activeLatelyData = response.data.activeLately
				// 判断之前先把数据转换成json格式
				_this.activeLatelyData.find((obj, index) => {
        	obj.img = obj.img === '[]' ? eval('(' + obj.img + ')') : JSON.parse(obj.img)
        	obj.psd = obj.psd === '[]' ? eval('(' + obj.psd + ')') : JSON.parse(obj.psd)
        	obj.video = obj.video === '[]' ? eval('(' + obj.video + ')') : JSON.parse(obj.video)
        })
				// 项目文章占比（全部）数据填充
				response.data.activeProject.find((obj, index) => {
	    		_this.articleProjectData.legend.data.push(obj.xname)
	    		_this.articleProjectData.series[0].data.push({value:obj.count, name:obj.xname})
	    	})
				// 项目文章占比 初始化图表
				_this.articleProject()
					
	    	// 文章类型分布（总）数据填充
	    	_this.articleType1Data.series[0].data = [
	    		{value:response.data.activeImg, name:'img'},
		        {value:response.data.activePsd, name:'psd'},
		        {value:response.data.activeVideo, name:'video'}
	    	]
	    	response.data.activeType.find((obj, index) => {
	    		_this.articleType1Data.legend.data.push(obj.lname)
	    		_this.articleType1Data.series[1].data.push({value:obj.count, name:obj.lname})
	    	})
	    	// 文章类型分布（总） 初始化图表
	    	_this.articleType1()
					
	    	// 文章类型分布（月）数据填充
	    	_this.articleType2Data.series[0].data = [
	    		{value:response.data.activeImgMonth, name:'img'},
	        {value:response.data.activePsdMonth, name:'psd'},
	        {value:response.data.activeVideoMonth, name:'video'}
	    	]
	    	response.data.activeType2.find((obj, index) => {
	    		_this.articleType2Data.legend.data.push(obj.lname)
	    		_this.articleType2Data.series[1].data.push({value:obj.count, name:obj.lname})
	    	})
	    	// 文章类型分布（月） 初始化图表
	    	_this.articleType2()
	    	
	    	// 用户文章类型1（img/psd/video） 数据填充
	    	let objImg = {}, objPsd = {}, objVideo = {}
	    	response.data.userNicknameAll.find((obj, index) => {
	    		objImg = response.data.activeUserType1.find((o, index) => { return  o.typeFile === 'img' && o.nickname === obj.nickname}) || {count: 0}
	    		objPsd = response.data.activeUserType1.find((o, index) => { return  o.typeFile === 'psd' && o.nickname === obj.nickname}) || {count: 0}
	    		objVideo = response.data.activeUserType1.find((o, index) => { return  o.typeFile === 'video' && o.nickname === obj.nickname}) || {count: 0}
    			_this.articleUserType1Data.yAxis.data.push(obj.nickname)
    			_this.articleUserType1Data.series[0].data.push(objImg.count)
    			_this.articleUserType1Data.series[1].data.push(objPsd.count)
    			_this.articleUserType1Data.series[2].data.push(objVideo.count)
	    	})
	    	// 用户文章类型1（img/psd/video） 初始化图表
	    	_this.articleUserType1()
	    	
	    	// 用户文章类型2（类型分类） 数据填充
	    	let temp = {},temp2 = [],temp3 = 0
	    	let typeNum = response.data.typeAll.length
	    	response.data.userNicknameAll.find((user, userIndex) => {_this.articleUserType2Data.yAxis.data.push(user.nickname)})
	    	response.data.typeAll.find((obj, objIndex) => {
	    		_this.articleUserType2Data.legend.data.push(obj.lname)
	    		_this.articleUserType2Data.series.push({name: obj.lname, type: 'bar', stack: '总量', label: { normal: { show: true, position: 'insideRight' } }, data: [] })
	    		response.data.userNicknameAll.find((user, userIndex) => {
	    			temp = response.data.activeUserType2.find((num, numIndex) => {return num.typeid === obj.tid && user.nickname === num.nickname}) || 0
	    			temp !== 0 ? _this.articleUserType2Data.series[objIndex].data.push(temp.count): _this.articleUserType2Data.series[objIndex].data.push(temp)
	    			temp = {}
	    		})
	    	})
	    	/*
	    	 * 这部分代码是针对类型统计都是0的用户剔除操作，但是没有成功，后期再做处理
	    	response.data.userNicknameAll.find((user, userIndex) => {
	    		temp2[userIndex] = {name: user.nickname, data:[]}
	    		_this.articleUserType2Data.series.find((s, sIndex) => {
	    			s.data.find((t, tIndex) => {
	    				tIndex === userIndex ? temp2[userIndex].data.push(t) : tIndex = tIndex
	    			})
	    		})
	    	})
	    	temp2.find((t, index) => {
	    		t.data.find((d,dindex) => {
	    			temp3 += d
	    		})
	    		if (temp3 === 0) {
	    			_this.articleUserType2Data.series.find((s, sIndex) => {
	        			s.data.splice(index, 1)
	        		})
	    			_this.articleUserType2Data.yAxis.data.splice(index, 1)
	    		}
	    		temp3 = 0
	    		console.log(temp3)
	    	})*/
	    	// 用户文章类型1（类型分类） 初始化图表
	    	_this.articleUserType2()
	    	
	    	// 年统计每月img\psd\video类型的数据  数据填充
	    	response.data.activeTypeYear.find((num, index) => {
	    		_this.articleSubsectionData.dataset.source[1].push(num[1])
	    		_this.articleSubsectionData.dataset.source[2].push(num[2])
	    		_this.articleSubsectionData.dataset.source[3].push(num[3])
	    	})
	    	// 年统计每月img\psd\video类型的数据 初始化图表
	    	_this.articleSubsection()
	    	
	    	// 年统计每个在职用户的月下载数量
	    	response.data.userNicknameAll.find((obj, index) => {
	    		_this.articleUserDownloadData.legend.data.push(obj.nickname)
	    		_this.articleUserDownloadData.series.push({name:obj.nickname,type:'line',data:[]})
	    	})
	    	response.data.activeDownloadYearAll.find((objs, objsindex) => {
	    		if (objs.length === 0) {
	    			_this.articleUserDownloadData.series.find((obj, objindex) => {obj.data.push(0)})
	    		} else {
	    			objs.find((o, oindex) =>{
	    				_this.articleUserDownloadData.series.find((obj2, obj2index) => {
	    					o.nickname === obj2.name ? obj2.data.push(o.count) : console.log()
    					})
	    			})
	    			_this.articleUserDownloadData.series.find((obj3, obj3index) => {
							obj3.data.length === objsindex + 1 ? console.log() : obj3.data.push(0)
						})
	    		}
	    	})
	    	
	    	// 当月在职用户每日发布情况  数据填充
	    	response.data.m.find((r, index) => {_this.articleUserSubsectionData.xAxis.data.push(r.riqi)})
	    	response.data.activeUserReleaseMonthAll.find((o, index) => {
	    		_this.articleUserSubsectionData.legend.data.push(o.name)
	    		_this.articleUserSubsectionData.series.push({name:o.name,type:'line',data:o.data})
    		})
	    	
	    	// 当月在职用户每日发布情况 初始化图表
	    	_this.articleUserSubsection()
	    	
	    	// 文章类型项目分布（总）
	    	response.data.projectAll.find((p, index) => {
	    		_this.articleTypeProjectAllData.dataset.source[0].push(p.xname)
	    	})
	    	_this.articleTypeProjectAllData.dataset.source[0].find((s, indexs) => {
	    		if (indexs > 0) {
	    			response.data.activeProjectTotalImg.find((i, indexi) => {
			    		_this.articleTypeProjectAllData.dataset.source[1].push(i.img)
			    	})
	    			response.data.activeProjectTotalPsd.find((p, indexp) => {
			    		_this.articleTypeProjectAllData.dataset.source[2].push(p.psd)
			    	})
	    			response.data.activeProjectTotalVideo.find((v, indexv) => {
			    		_this.articleTypeProjectAllData.dataset.source[3].push(v.video)
			    	})
	    		}
	    	})
	    	// 文章类型项目分布（总） 初始化图表
	    	_this.articleTypeProjectAll()
	    	
	    	// 文章类型项目分布（月）
	    	response.data.projectAll.find((p, index) => {
	    		_this.articleTypeProjectMonthAllData.dataset.source[0].push(p.xname)
	    	})
	    	_this.articleTypeProjectMonthAllData.dataset.source[0].find((s, indexs) => {
	    		if (indexs > 0) {
	    			response.data.activeProjectMonthImg.find((i, indexi) => {
			    		_this.articleTypeProjectMonthAllData.dataset.source[1].push(i.img)
			    	})
	    			response.data.activeProjectMonthPsd.find((p, indexp) => {
			    		_this.articleTypeProjectMonthAllData.dataset.source[2].push(p.psd)
			    	})
	    			response.data.activeProjectMonthVideo.find((v, indexv) => {
			    		_this.articleTypeProjectMonthAllData.dataset.source[3].push(v.video)
			    	})
	    		}
	    	})
	    	// 文章类型项目分布（月） 初始化图表
	    	_this.articleTypeProjectMonthAll()
	    	
	    	// 文章类型项目用户分布（总）
	    	temp = {type: 'category',gridIndex: 0,data: []}
	    	temp2 = {type: 'category',gridIndex: 1,data: []}
	    	temp3 = {type: 'category',gridIndex: 2,data: []}
	    	response.data.articleRanking.find((o, index) => {
	    		_this.activeProjectUserAllData.legend.data.push(o.nickname)
	    	})
	    	response.data.projectAll.find((p, indexp) => {
	    		temp.data.push(p.xname)
	    		temp2.data.push(p.xname)
	    		temp3.data.push(p.xname)
	    	})
	    	_this.activeProjectUserAllData.yAxis.push(temp)
	    	_this.activeProjectUserAllData.yAxis.push(temp2)
	    	_this.activeProjectUserAllData.yAxis.push(temp3)
	    	temp = {name: '',type: 'bar',stack: 'img',xAxisIndex: 0, yAxisIndex: 0,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	temp2 = {name: '',type: 'bar',stack: 'psd',xAxisIndex: 1, yAxisIndex: 1,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	temp3 = {name: '',type: 'bar',stack: 'video',xAxisIndex: 2, yAxisIndex: 2,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	response.data.articleRanking.find((u, indexu) => {
	    		temp.name = u.nickname
	    		response.data.projectAll.find((p, indexp) => {
	    			response.data.activeProjectUserTotalImg.find((i, indexi) => {
			    		i.xname === p.xname && i.nickname === u.nickname ? temp.data.push(i.img) : i = i
			    	})
	    			indexp === temp.data.length ? temp.data.push('无') : temp = temp
	    		})
	    		_this.activeProjectUserAllData.series.push(temp)
	    		temp = {name: '',type: 'bar',stack: 'img',xAxisIndex: 0, yAxisIndex: 0,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	})
	    	response.data.articleRanking.find((u, indexu) => {
	    		temp2.name = u.nickname
	    		response.data.projectAll.find((p, indexp) => {
	    			response.data.activeProjectUserTotalPsd.find((i, indexi) => {
			    		i.xname === p.xname && i.nickname === u.nickname ? temp2.data.push(i.psd) : i = i
			    	})
	    			indexp === temp2.data.length ? temp2.data.push('无') : temp2 = temp2
	    		})
	    		_this.activeProjectUserAllData.series.push(temp2)
	    		temp2 = {name: '',type: 'bar',stack: 'psd',xAxisIndex: 1, yAxisIndex: 1,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	})
	    	response.data.articleRanking.find((u, indexu) => {
	    		temp3.name = u.nickname
	    		response.data.projectAll.find((p, indexp) => {
	    			response.data.activeProjectUserTotalVideo.find((i, indexi) => {
			    		i.xname === p.xname && i.nickname === u.nickname ? temp3.data.push(i.video) : i = i
			    	})
	    			indexp === temp3.data.length ? temp3.data.push('无') : temp3 = temp3
	    		})
	    		_this.activeProjectUserAllData.series.push(temp3)
	    		temp3 = {name: '',type: 'bar',stack: 'video',xAxisIndex: 2, yAxisIndex: 2,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	})
	    	// 文章类型项目用户分布（总） 初始化图表
	    	_this.activeProjectUserAll()
	    	
	    	// 文章类型项目用户分布（月）
	    	temp = {type: 'category',gridIndex: 0,data: []}
	    	temp2 = {type: 'category',gridIndex: 1,data: []}
	    	temp3 = {type: 'category',gridIndex: 2,data: []}
	    	response.data.articleRanking.find((o, index) => {
	    		_this.activeProjectUserMonthAllData.legend.data.push(o.nickname)
	    	})
	    	response.data.projectAll.find((p, indexp) => {
	    		temp.data.push(p.xname)
	    		temp2.data.push(p.xname)
	    		temp3.data.push(p.xname)
	    	})
	    	_this.activeProjectUserMonthAllData.yAxis.push(temp)
	    	_this.activeProjectUserMonthAllData.yAxis.push(temp2)
	    	_this.activeProjectUserMonthAllData.yAxis.push(temp3)
	    	temp = {name: '',type: 'bar',stack: 'img',xAxisIndex: 0, yAxisIndex: 0,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	temp2 = {name: '',type: 'bar',stack: 'psd',xAxisIndex: 1, yAxisIndex: 1,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	temp3 = {name: '',type: 'bar',stack: 'video',xAxisIndex: 2, yAxisIndex: 2,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	response.data.articleRanking.find((u, indexu) => {
	    		temp.name = u.nickname
	    		response.data.projectAll.find((p, indexp) => {
	    			response.data.activeProjectUserMonthImg.find((i, indexi) => {
			    		i.xname === p.xname && i.nickname === u.nickname ? temp.data.push(i.img) : i = i
			    	})
	    			indexp === temp.data.length ? temp.data.push('无') : temp = temp
	    		})
	    		_this.activeProjectUserMonthAllData.series.push(temp)
	    		temp = {name: '',type: 'bar',stack: 'img',xAxisIndex: 0, yAxisIndex: 0,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	})
	    	response.data.articleRanking.find((u, indexu) => {
	    		temp2.name = u.nickname
	    		response.data.projectAll.find((p, indexp) => {
	    			response.data.activeProjectUserMonthPsd.find((i, indexi) => {
			    		i.xname === p.xname && i.nickname === u.nickname ? temp2.data.push(i.psd) : i = i
			    	})
	    			indexp === temp2.data.length ? temp2.data.push('无') : temp2 = temp2
	    		})
	    		_this.activeProjectUserMonthAllData.series.push(temp2)
	    		temp2 = {name: '',type: 'bar',stack: 'psd',xAxisIndex: 1, yAxisIndex: 1,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	})
	    	response.data.articleRanking.find((u, indexu) => {
	    		temp3.name = u.nickname
	    		response.data.projectAll.find((p, indexp) => {
	    			response.data.activeProjectUserMonthVideo.find((i, indexi) => {
			    		i.xname === p.xname && i.nickname === u.nickname ? temp3.data.push(i.video) : i = i
			    	})
	    			indexp === temp3.data.length ? temp3.data.push('无') : temp3 = temp3
	    		})
	    		_this.activeProjectUserMonthAllData.series.push(temp3)
	    		temp3 = {name: '',type: 'bar',stack: 'video',xAxisIndex: 2, yAxisIndex: 2,label: {normal: {show: true,position: 'insideRight'}},data: []}
	    	})
	    	// 文章类型项目用户分布（月） 初始化图表
	    	_this.activeProjectUserMonthAll()
      }
      // 关闭加载状态
      _this.loading = false
    })
    .catch(function (error) {
      console.log(error)
    })
}


// WEBPACK FOOTER //
// ./src/assets/js/api.js