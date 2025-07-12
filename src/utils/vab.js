import { loadingText, messageDuration, title } from "@/config";
import * as lodash from "lodash";
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from "element-plus";
import { getAccessToken } from "@/utils/accessToken";

/**
 * 将FontAwesome图标名转换为Element Plus图标组件名
 * @param {Array|String} icon FontAwesome图标配置，例如['fas', 'user']或直接的图标名称
 * @returns {String} Element Plus图标组件名
 */
export const faToElIcon = (icon) => {
  // 如果是数组，获取第二个元素（图标名）
  // 如果不是数组，直接使用icon作为图标名
  const iconName = Array.isArray(icon) ? icon[1] : icon;

  // 图标名映射表（可根据需要扩展）
  const iconMap = {
    // 常用图标
    user: "User",
    "user-alt": "User",
    "mobile-alt": "Cellphone",
    "envelope-open": "Message",
    unlock: "Unlock",
    download: "Download",
    star: "Star",
    users: "User",
    coffee: "Coffee",
    "code-branch": "Share",
    gem: "Trophy",
    palette: "Brush",
    "info-circle": "InfoFilled",
    crown: "Crown",
    edit: "Edit",
    "exchange-alt": "Sort",
    "sync-alt": "Refresh",
    "mouse-pointer": "Pointer",
    route: "Connection",
    check: "Check",
    "arrow-right": "ArrowRight",
    "shopping-cart": "ShoppingCart",
    "paint-brush": "Brush",
    "check-circle": "SuccessFilled",
    bug: "Warning",
    search: "Search",
    "expand-arrows-alt": "FullScreen",
    "compress-arrows-alt": "ScaleToOriginal",
    redo: "Refresh",

    // 基础图标
    home: "HomeFilled",
    marker: "Location",
    "box-open": "Box",
    "horse-head": "Promotion",

    // 常用图标
    "chart-line": "TrendCharts",
    "chart-pie": "PieChart",
    "chart-bar": "Histogram",
    table: "Grid",
    form: "Document",
    "list-ul": "List",
    "user-cog": "Setting",
    cog: "Setting",
    cogs: "Tools",
    tools: "Tools",
    wrench: "Tools",
    code: "Terminal",
    "file-code": "Document",
    "file-alt": "Document",
    "folder-open": "Folder",
    folder: "FolderOpened",
    "folder-plus": "FolderAdd",
    "calendar-alt": "Calendar",
    image: "Picture",
    images: "PictureFilled",
    video: "VideoPlay",
    music: "Headset",
    store: "Shop",
    "credit-card": "CreditCard",
    "money-bill": "Money",
    "dollar-sign": "Money",
    comments: "ChatDotRound",
    comment: "ChatLineRound",
    envelope: "Message",
    bell: "Bell",
    database: "Collection",
    server: "Monitor",
    desktop: "Monitor",
    mobile: "Cellphone",
    tablet: "Cellphone",
    lock: "Lock",
    shield: "Shield",
    "exclamation-triangle": "Warning",
    "exclamation-circle": "Warning",
    "question-circle": "QuestionFilled",
    "times-circle": "CircleCloseFilled",
    plus: "Plus",
    minus: "Minus",
    times: "Close",
    filter: "Filter",
    bars: "Menu",
    th: "Grid",
    "th-large": "Grid",
    "ellipsis-v": "More",
    "ellipsis-h": "More",
    "caret-down": "ArrowDown",
    "caret-up": "ArrowUp",
    "caret-left": "ArrowLeft",
    "caret-right": "ArrowRight",
    "arrow-down": "ArrowDown",
    "arrow-up": "ArrowUp",
    "arrow-left": "ArrowLeft",
    undo: "RefreshLeft",
    sync: "Refresh",
    refresh: "Refresh",
    "sign-out-alt": "SwitchButton",

    // 品牌图标
    github: "Platform",
    qq: "ChatDotRound",
    vuejs: "ElementPlus",

    // 默认情况
    default: "More",
  };

  // 返回映射的Element Plus图标名，如果没有映射则返回默认图标
  return iconMap[iconName] || iconMap["default"];
};

const install = (app) => {
  // 全局方法
  const vab = {
    /* 全局accessToken */
    get accessToken() {
      return getAccessToken();
    },
    /* 全局标题 */
    get title() {
      return title;
    },
    /* 全局加载层 */
    loading: (options = {}) => {
      const defaultOptions = {
        lock: true,
        text: loadingText,
        background: "rgba(0, 0, 0, 0.7)",
      };
      return ElLoading.service({ ...defaultOptions, ...options });
    },
    /* 全局多彩加载层 */
    colorfulLoading: (options = {}) => {
      let defaultOptions = {
        lock: true,
        text: loadingText,
        spinner: "dots",
        background: "rgba(0, 0, 0, 0.7)",
      };
      if (options.spinner) {
        defaultOptions.spinner = options.spinner;
      }
      return ElLoading.service({ ...defaultOptions, ...options });
    },
    /* 全局Message */
    message: (message, type = "info", options = {}) => {
      if (message) {
        const defaultOptions = {
          message,
          type,
          duration: messageDuration,
        };
        return ElMessage({ ...defaultOptions, ...options });
      }
    },
    /* 全局Alert */
    alert: (content, options = {}) => {
      const defaultOptions = {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        ...options,
      };
      return ElMessageBox.alert(content, "温馨提示", defaultOptions);
    },
    /* 全局Confirm */
    confirm: (content, options = {}) => {
      const defaultOptions = {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        ...options,
      };
      return ElMessageBox.confirm(content, "温馨提示", defaultOptions);
    },
    /* 全局Notification */
    notification: (message, options = {}) => {
      if (message) {
        ElNotification({
          title: "温馨通知",
          message,
          ...options,
        });
      }
    },
    /* Lodash */
    lodash,
  };

  app.config.globalProperties.$vab = vab;
};

export default {
  install,
};
