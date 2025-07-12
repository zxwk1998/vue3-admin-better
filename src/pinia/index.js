/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 导入所有 pinia 模块，自动注册
 */

import { createPinia } from 'pinia'

// 创建 pinia 实例
const pinia = createPinia()

// 导出 pinia 实例供 main.js 使用
export default pinia 