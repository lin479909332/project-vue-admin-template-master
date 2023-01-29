// 登录 登出 获取用户信息 的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token 设置token 移除token的接口函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 或如常量路由 异步路由 任意路由
import { resetRouter, constantRoutes, asyncRoutes, anyRoutes } from '@/router'
// 引入路由
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    // 用户名
    name: '',
    // 用户头像
    avatar: '',
    // 服务器返回的菜单信息【根据不同的角色:返回的标记信息，数组里面的元素是字符串】
    routes: [],
    // 按钮权限信息
    buttons: [],
    // 角色信息
    roles: [],
    //对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比后的理由】
    resultAsyncRoutes: [],
    // 用户需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储用户token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 计算异步路由 且合并其他路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // 计算异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 合并其他路由并赋值
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    // 给路由器添加新路由
    router.addRoutes(state.resultAllRoutes);
  }
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    //解构用户名和密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password });
    //使用mock数据时 成功的回到是20000
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok';
    } else {
      new Promise.reject(new Error("fail"));
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //获取用户信息:返回数据包含:用户名name、用户头像avatar routes[返回的标志:不同的用户应该展示哪些莱单的标记]、 roles (用户角色信息）、buttons 【按钮的信息。按钮权限用的标记】
        const { data } = response
        // 存储用户信息
        commit('SET_USERINFO', data)
        // 计算异步路由
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 对比计算出异步路由的函数
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户需要展示出来的异步路由
  return asyncRoutes.filter(item => {
    // 数组当前没有这个元素返回所以值-1，所以有这个元素返回的索引值就非-1
    if (routes.indexOf(item.name) != -1) {
      // 处理二级路由---------递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

