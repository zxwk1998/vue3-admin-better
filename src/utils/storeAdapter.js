/**
 * @description Vuex to Pinia 适配器 - 简化版本
 * 处理从 Vuex 到 Pinia 的转换
 */

import { createStore } from 'vuex'

// 创建一个简单的空store
const store = createStore({
  state: () => ({}),
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
})

export { createStore }
export default store
