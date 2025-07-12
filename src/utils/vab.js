import { loadingText, messageDuration, title } from '@/config'
import * as lodash from 'lodash'
import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { getAccessToken } from '@/utils/accessToken'

const install = (app) => {
  // 全局方法
  const vab = {
    /* 全局accessToken */
    get accessToken() {
      return getAccessToken()
    },
    /* 全局标题 */
    get title() {
      return title
    },
    /* 全局加载层 */
    loading: (options = {}) => {
      const defaultOptions = {
        lock: true,
        text: loadingText,
        background: 'rgba(0, 0, 0, 0.7)',
      }
      return ElLoading.service({ ...defaultOptions, ...options })
    },
    /* 全局多彩加载层 */
    colorfulLoading: (options = {}) => {
      let defaultOptions = {
        lock: true,
        text: loadingText,
        spinner: 'dots',
        background: 'rgba(0, 0, 0, 0.7)',
      }
      if (options.spinner) {
        defaultOptions.spinner = options.spinner
      }
      return ElLoading.service({ ...defaultOptions, ...options })
    },
    /* 全局Message */
    message: (message, type = 'info', options = {}) => {
      if (message) {
        const defaultOptions = {
          message,
          type,
          duration: messageDuration,
        }
        return ElMessage({ ...defaultOptions, ...options })
      }
    },
    /* 全局Alert */
    alert: (content, options = {}) => {
      const defaultOptions = {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        ...options,
      }
      return ElMessageBox.alert(content, '温馨提示', defaultOptions)
    },
    /* 全局Confirm */
    confirm: (content, options = {}) => {
      const defaultOptions = {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        ...options,
      }
      return ElMessageBox.confirm(content, '温馨提示', defaultOptions)
    },
    /* 全局Notification */
    notification: (message, options = {}) => {
      if (message) {
        ElNotification({
          title: '温馨通知',
          message,
          ...options,
        })
      }
    },
    /* Lodash */
    lodash,
  }

  app.config.globalProperties.$vab = vab
}

export default {
  install,
}
