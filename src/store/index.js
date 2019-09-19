import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // 设置变量  语法：this.$store.state
    user: {
      uId: '',
      permissions: '',
      userName: '',
      Password: '',
      nickname: '',
      sex: '',
      registerTime: '',
      endTime: '',
      state: '',
      HeadPortraitSrc: '',
      setPasswordStyle: false,
      types: [],
      projects: [],
      minType: [],
      auth: {}
    },
    mId: ''
  },
  getters: { // 计算数学函数   语法：this.$store.getters.getUserUid
    // 获取单个值
    getUserUid: (state, getters) => {
      return state.user.uId
    },
    getUserPermissions: (state, getters) => {
      return state.user.permissions
    },
    getUserUserName: (state, getters) => {
      return state.user.userName
    },
    getUserPassword: (state, getters) => {
      return state.user.Password
    },
    getUserNickname: (state, getters) => {
      return state.user.nickname
    },
    getUserSex: (state, getters) => {
      return state.user.sex
    },
    getUserRegisterTime: (state, getters) => {
      return state.user.registerTime
    },
    getUserEndTime: (state, getters) => {
      return state.user.endTime
    },
    getUserState: (state, getters) => {
      return state.user.state
    },
    getUserHeadPortraitSrc: (state, getters) => {
      return state.user.HeadPortraitSrc
    },
    getUserSetPasswordStyle: (state, getters) => {
      return state.user.setPasswordStyle
    },
    getUserTypes: (state, getters) => {
      return state.user.types
    },
    getUserProjects: (state, getters) => {
      return state.user.projects
    },
    getUserMinType: (state, getters) => {
      return state.user.minType
    },
    getUserAuth: (state, getters) => {
      return state.user.auth
    },
    // 遍历项目数组，通过id获取name
    getUserProjectsName: (state, getters) => (id) => {
      return state.user.projects.find(project => {if (project.pid === id) {return project.xname}})
    },
    // 遍历类型数组，通过id获取name
    getUserTypesName: (state) => (id) => {
      return state.user.types.find(type => type.tid === id)
    },
    // 遍历小分类数组，通过id获取name
    getUserMinTypeName: (state, getters) => (id) => {
      return state.user.minType.find(minType => {if (minType.id === id) {return minType.dname}})
    },
    // 遍历项目数组，通过name获取id
    getUserProjectsId: (state, getters) => (xname) => {
      return state.user.projects.find(project => {if (project.xname === xname) {return project.pid}})
    },
    // 遍历类型数组，通过name获取id
    getUserTypesId: (state) => (lname) => {
      return state.user.types.find(type => {if (type.lname === lname) {return type.tid}})
    },
    // 遍历小分类数组，通过name获取id
    getUserMinTypeId: (state, getters) => (dname) => {
      return state.user.minType.find(minType => {if (minType.dname === dname) {return minType.did}})
    }
  },
  mutations: { // 修改函数，必须同步执行，不支持调用外部函数   语法：_this.$store.commit('函数名', 变量 || {名：值,.....})
    setUserUid (state, uId) {
//    console.log("uId：" + uId)
      state.user.uId = uId
    },
    setUserPermissions (state, permissions) {
//    console.log("permissions：" + permissions)
      state.user.permissions = permissions
    },
    setUserUserName (state, userName) {
//    console.log("userName：" + userName)
      state.user.userName = userName
    },
    setUserPassword (state, Password) {
//    console.log("Password：" + Password)
      state.user.Password = Password
    },
    setUserNickname (state, nickname) {
//    console.log("nickname：" + nickname)
      state.user.nickname = nickname
    },
    setUserSex (state, sex) {
//    console.log("sex：" + sex)
      state.user.sex = sex
    },
    setUserRegisterTime (state, registerTime) {
//    console.log("registerTime：" + registerTime)
      state.user.registerTime = registerTime
    },
    setUserEndTime (state, endTime) {
//    console.log("endTime：" + endTime)
      state.user.endTime = endTime
    },
    setUserState (state, userState) {
//    console.log("userState：" + userState)
      state.user.state = userState
    },
    setUserHeadPortraitSrc (state, HeadPortraitSrc) {
//    console.log("HeadPortraitSrc：" + HeadPortraitSrc)
      state.user.HeadPortraitSrc = HeadPortraitSrc
    },
    setUserSetPasswordStyle (state, setPasswordStyle) {
//    console.log("setPasswordStyle：" + setPasswordStyle)
      state.user.setPasswordStyle = setPasswordStyle
    },
    setUserTypes (state, types) {
//    console.log("types：" + types)
      state.user.types = types
    },
    setUserProjects (state, projects) {
//    console.log("projects：" + projects)
      state.user.projects = projects
    },
    setUserMinType (state, minType) {
//    console.log("minType：" + minType)
      state.user.minType = minType
//    console.log(state.user.minType)
    },
    setUserMid (state, mid) {
//    console.log("mid：" + mid)
      state.mId = mid
    },
    etUserAuth (state, auth) {
//    console.log("auth：" + auth)
      state.user.auth = auth
    },
    setUser (state, user) { // 赋值
      state.user.uId = user.uId
      state.user.permissions = user.permissions
      state.user.userName = user.userName
      state.user.Password = user.Password
      state.user.nickname = user.nickname
      state.user.sex = user.sex
      state.user.registerTime = user.registerTime
      state.user.endTime = user.endTime
      state.user.state = user.state
      state.user.HeadPortraitSrc = user.HeadPortraitSrc
      state.user.setPasswordStyle = user.setPasswordStyle
      state.user.types = user.types
      state.user.projects = user.projects
      state.user.minType = user.minType
      state.user.auth = user.auth
    },
    setUserInfo (state, user) { // 修改个人信息赋值
      state.user.nickname = user.nickname
      state.user.sex = user.sex
      state.user.HeadPortraitSrc = user.HeadPortraitSrc
    },
    cancellation (state) { // 注销
      state.user = {
        uId: '',
        permissions: '',
        userName: state.user.setPasswordStyle ? state.user.userName : '',
        Password: state.user.setPasswordStyle ? state.user.Password : '',
        nickname: '',
        sex: '',
        registerTime: '',
        endTime: '',
        state: '',
        HeadPortraitSrc: '',
        setPasswordStyle: state.user.setPasswordStyle,
        types: [],
        projects: [],
        minType: [],
        auth: {}
      }
      state.mId = ''
      // localStorage.clear()
    }
  },
  actions: { // 可以执行异步修改函数
    // 本地存储 用户对象 语法：_this.$store.dispatch('函数名', 变量 || {名：值,.....})
    setLocalStorageUid (store, uId) {
      Vue.localStorage.set('saiqiUid', uId)
    },
    setLocalStoragePermissions (store, permissions) {
      Vue.localStorage.set('saiqiPermissions', permissions)
    },
    setLocalStorageUserName (store, userName) {
      Vue.localStorage.set('saiqiUserName', userName)
    },
    setLocalStoragePassword (store, Password) {
      Vue.localStorage.set('saiqiPassword', Password)
    },
    setLocalStorageNickname (store, nickname) {
      Vue.localStorage.set('saiqiNickname', nickname)
    },
    setLocalStorageSex (store, sex) {
      Vue.localStorage.set('saiqiSex', sex)
    },
    setLocalStorageRegisterTime (store, registerTime) {
      Vue.localStorage.set('saiqiRegisterTime', registerTime)
    },
    setLocalStorageEndTime (store, endTime) {
      Vue.localStorage.set('saiqiEndTime', endTime)
    },
    setLocalStorageState (store, state) {
      Vue.localStorage.set('saiqiState', state)
    },
    setLocalStorageHeadPortraitSrc (store, headPortraitSrc) {
      Vue.localStorage.set('saiqiHeadPortraitSrc', headPortraitSrc)
    },
    setLocalStorageSetPasswordStyle (store, setPasswordStyle) {
      Vue.localStorage.set('saiqiSetPasswordStyle', setPasswordStyle)
    },
    setLocalStorageTtypes (store, types) {
      Vue.localStorage.set('saiqiTypes', JSON.stringify(types))
    },
    setLocalStorageProjects (store, projects) {
      Vue.localStorage.set('saiqiProjects', JSON.stringify(projects))
    },
    setLocalStorageMinType (store, minType) {
      Vue.localStorage.set('saiqiMinType', JSON.stringify(minType))
    },
    setLocalStorageMid (store, mid) {
      Vue.localStorage.set('saiqiMid', mid)
    },
    setLocalStorageAuth (store, auth) {
//  	console.log(auth)
      Vue.localStorage.set('saiqiAuth', JSON.stringify(auth))
    },
    setLocalStorage (store) {
      Vue.localStorage.set('saiqiUid', store.state.user.uId)
      Vue.localStorage.set('saiqiPermissions', store.state.user.permissions)
      Vue.localStorage.set('saiqiUserName', store.state.user.userName)
      Vue.localStorage.set('saiqiPassword', store.state.user.Password)
      Vue.localStorage.set('saiqiNickname', store.state.user.nickname)
      Vue.localStorage.set('saiqiSex', store.state.user.sex)
      Vue.localStorage.set('saiqiRegisterTime', store.state.user.registerTime)
      Vue.localStorage.set('saiqiEndTime', store.state.user.endTime)
      Vue.localStorage.set('saiqiState', store.state.user.state)
      Vue.localStorage.set('saiqiHeadPortraitSrc', store.state.user.HeadPortraitSrc)
      Vue.localStorage.set('saiqiSetPasswordStyle', store.state.user.setPasswordStyle)
      Vue.localStorage.set('saiqiTypes', JSON.stringify(store.state.user.types))
      Vue.localStorage.set('saiqiProjects', JSON.stringify(store.state.user.projects))
      Vue.localStorage.set('saiqiMinType', JSON.stringify(store.state.user.minType))
      Vue.localStorage.set('saiqiAuth', JSON.stringify(store.state.user.auth))
//    Vue.localStorage.set('saiqiMid', store.state.mid)
    },
    getLocalStorage (store) { // 获取本地存储的用户对象
      // console.log(Vue.localStorage.get('saiqiuserName') + '获取本地存储变量:用户名称')
      store.state.user.uId = Vue.localStorage.get('saiqiUid') === null ? store.state.user.uId : Vue.localStorage.get('saiqiUid')
      store.state.user.permissions = Vue.localStorage.get('saiqiPermissions') === null ? store.state.user.permissions : Vue.localStorage.get('saiqiPermissions')
      store.state.user.userName = Vue.localStorage.get('saiqiUserName') === null ? store.state.user.userName : Vue.localStorage.get('saiqiUserName')
      store.state.user.Password = Vue.localStorage.get('saiqiPassword') === null ? store.state.user.Password : Vue.localStorage.get('saiqiPassword')
      store.state.user.nickname = Vue.localStorage.get('saiqiNickname') === null ? store.state.user.nickname : Vue.localStorage.get('saiqiNickname')
      store.state.user.sex = Vue.localStorage.get('saiqiSex') === null ? store.state.user.sex : Vue.localStorage.get('saiqiSex')
      store.state.user.registerTime = Vue.localStorage.get('saiqiRegisterTime') === null ? store.state.user.registerTime : Vue.localStorage.get('saiqiRegisterTime')
      store.state.user.endTime = Vue.localStorage.get('saiqiEndTime') === null ? store.state.user.endTime : Vue.localStorage.get('saiqiEndTime')
      store.state.user.state = Vue.localStorage.get('saiqiState') === null ? store.state.user.state : Vue.localStorage.get('saiqiState')
      store.state.user.HeadPortraitSrc = Vue.localStorage.get('saiqiHeadPortraitSrc') === null ? store.state.user.HeadPortraitSrc : Vue.localStorage.get('saiqiHeadPortraitSrc')
      store.state.user.setPasswordStyle = Vue.localStorage.get('saiqiSetPasswordStyle') === null ? store.state.user.setPasswordStyle : Vue.localStorage.get('saiqiSetPasswordStyle')
      store.state.user.types = JSON.parse(Vue.localStorage.get('saiqiTypes')) === null ? store.state.user.types : JSON.parse(Vue.localStorage.get('saiqiTypes'))
      store.state.user.projects = JSON.parse(Vue.localStorage.get('saiqiProjects')) === null ? store.state.user.projects : JSON.parse(Vue.localStorage.get('saiqiProjects'))
      store.state.user.minType = JSON.parse(Vue.localStorage.get('saiqiMinType')) === null ? store.state.user.minType : JSON.parse(Vue.localStorage.get('saiqiMinType'))
      store.state.user.auth = JSON.parse(Vue.localStorage.get('saiqiAuth')) === null ? store.state.auth : JSON.parse(Vue.localStorage.get('saiqiAuth'))
      store.state.mId = Vue.localStorage.get('saiqiMid') === null ? store.state.mId : Vue.localStorage.get('saiqiMid')
    }
  },
  modules: { // 模块化调用vuwx状态对象
  }
})
