/**
 * @description 消息提示工具函数
 * 提供统一的消息提示方法，兼容Vue 3
 */
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { messageDuration } from "@/config";

/**
 * 消息提示
 * @param {string} message 提示信息
 * @param {string} type 消息类型
 * @param {object} options 配置项
 */
export function baseMessage(message, type = "info", options = {}) {
  if (message) {
    const defaultOptions = {
      message,
      type,
      duration: messageDuration,
    };
    return ElMessage({ ...defaultOptions, ...options });
  }
}

/**
 * 通知提示
 * @param {string} title 标题
 * @param {string} message 提示信息
 * @param {object} options 配置项
 */
export function baseNotify(title, message, options = {}) {
  ElNotification({
    title,
    message,
    type: "success",
    ...options,
  });
}

/**
 * 确认提示
 * @param {string} content 内容
 * @param {object} options 配置项
 */
export function baseConfirm(content, options = {}) {
  const defaultOptions = {
    closeOnClickModal: false,
    closeOnPressEscape: false,
    ...options,
  };
  return ElMessageBox.confirm(content, "温馨提示", defaultOptions);
}

/**
 * 警告提示
 * @param {string} content 内容
 * @param {object} options 配置项
 */
export function baseAlert(content, options = {}) {
  const defaultOptions = {
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: true,
    ...options,
  };
  return ElMessageBox.alert(content, "温馨提示", defaultOptions);
}
