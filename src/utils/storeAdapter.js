/**
 * @description Vuex 到 Pinia 的兼容适配器
 * 帮助逐步迁移项目，同时保持兼容性
 */

import { useUserStore } from '@/pinia/modules/user'
import store from '@/store'

// 为了确保兼容性，这里为store添加一些适配方法
export const setupStoreCompat = (app) => {
  // 全局mixin，确保旧的组件可以使用this.$store
  app.mixin({
    computed: {
      $store() {
        return store
      },
    },
  })

  // 为Vuex store添加一些访问Pinia的方法
  // 这允许旧代码通过Vuex方式访问新的Pinia store
  const originalDispatch = store.dispatch
  store.dispatch = function (type, payload) {
    // 特殊处理用户相关的actions
    if (type.startsWith('user/')) {
      const action = type.split('/')[1]
      const userStore = useUserStore()

      if (typeof userStore[action] === 'function') {
        return userStore[action](payload)
      }
    }

    // 默认使用原始dispatch
    return originalDispatch.call(this, type, payload)
  }

  const originalGetters = store.getters

  // 定义一个特殊的getter处理器
  Object.defineProperty(store, 'getters', {
    get() {
      // 创建代理以拦截getter访问
      return new Proxy(originalGetters, {
        get(target, prop) {
          // 为用户store创建特殊处理
          if (prop === 'user/accessToken') {
            return useUserStore().accessToken
          }
          if (prop === 'user/username') {
            return useUserStore().username
          }
          if (prop === 'user/avatar') {
            return useUserStore().avatar
          }
          if (prop === 'user/permissions') {
            return useUserStore().permissions
          }

          // 默认返回原始getter
          return target[prop]
        },
      })
    },
  })
}
