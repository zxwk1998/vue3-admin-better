/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import { defineStore } from 'pinia'
import { getUserInfo, login, logout } from '@/api/user'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'
import { ElMessage, ElNotification } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: getAccessToken(),
    username: '',
    avatar: '',
    permissions: [],
  }),
  
  getters: {
    getAccessToken: (state) => state.accessToken,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getPermissions: (state) => state.permissions,
  },
  
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions
    },
    
    setAccessToken(accessToken) {
      this.accessToken = accessToken
      setAccessToken(accessToken)
    },
    
    setUsername(username) {
      this.username = username
    },
    
    setAvatar(avatar) {
      this.avatar = avatar
    },
    
    async login(userInfo) {
      try {
        const { data } = await login(userInfo)
        const accessToken = data[tokenName]
        if (accessToken) {
          this.setAccessToken(accessToken)
          const hour = new Date().getHours()
          const thisTime = hour < 8 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
          ElNotification({
            title: `欢迎登录${title}`,
            message: `${thisTime}！`,
            type: 'success',
          })
        } else {
          ElMessage.error(`登录接口异常，未正确返回${tokenName}...`)
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败')
      }
    },
    
    async getUserInfo() {
      try {
        const { data } = await getUserInfo(this.accessToken)
        if (!data) {
          ElMessage.error('验证失败，请重新登录...')
          return false
        }
        
        const { permissions, username, avatar } = data
        
        if (permissions && username && Array.isArray(permissions)) {
          this.setPermissions(permissions)
          this.setUsername(username)
          this.setAvatar(avatar)
          return permissions
        } else {
          ElMessage.error('用户信息接口异常')
          return false
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return false
      }
    },
    
    async logout() {
      try {
        await logout(this.accessToken)
        this.resetAccessToken()
        await resetRouter()
      } catch (error) {
        console.error('登出失败:', error)
      }
    },
    
    resetAccessToken() {
      this.permissions = []
      this.accessToken = ''
      removeAccessToken()
    },
  },
}) 