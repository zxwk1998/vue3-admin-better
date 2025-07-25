import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store"; // 导入Vuex store
import plugins from "./plugins";
import { printLayoutsInfo } from "@/utils/printInfo";
// 导入布局组件注册函数
import { registerLayoutComponents } from "@/layouts/export";
// 导入事件总线
import eventBus from "@/utils/eventBus";
// 导入配置
import { title } from "@/config";

/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

// 创建应用实例
const app = createApp(App);

// 使用Vuex
app.use(store);

app.use(router);

// 初始化所有插件
plugins(app);

// 注册所有布局组件
registerLayoutComponents(app);

// 添加事件总线到全局属性
app.config.globalProperties.$eventBus = eventBus;

// 添加全局标题
app.config.globalProperties.$baseTitle = title;

// 使全局属性在window上也可用
window.$eventBus = eventBus;
window.$baseTitle = title;

// 检测环境变量，永远启用mock
const useMock = true; // 确保始终使用mock，无论是开发还是生产环境
if (useMock) {
  // 使用动态import替代require
  import("@/utils/static").then(({ mockXHR }) => {
    mockXHR();
    console.log("已启用Mock拦截，所有接口请求将被Mock拦截");

    // 打印layouts/index.js中的信息到控制台
    printLayoutsInfo();

    // 挂载应用
    app.mount("#vue-admin-better");
  });
} else {
  // 未启用Mock时直接打印layouts/index.js中的信息到控制台
  printLayoutsInfo();

  // 挂载应用
  app.mount("#vue-admin-better");
}
