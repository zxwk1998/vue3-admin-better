/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 * @description 这是一个兼容层，允许项目逐步从Vuex迁移到Pinia
 */

import { createStore } from 'vuex'

// 从modules目录导入所有模块
const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

// 为所有模块添加namespaced
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})

// 创建store
const store = createStore({
  modules,
})

export default store
