/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 公共布局及样式自动引入
 */

// 使用 require.context 自动导入主题文件
const requireThemes = require.context("@/styles/themes", true, /\.scss$/);
requireThemes.keys().forEach((fileName) => {
  requireThemes(fileName);
});

// 预加载组件，但不立即注册
// 这些组件将在main.js中被注册
const components = {};
const requireComponents = require.context("./components", true, /\.vue$/);
requireComponents.keys().forEach((fileName) => {
  const componentConfig = requireComponents(fileName);
  const component = componentConfig.default || componentConfig;
  if (component.name) {
    components[component.name] = component;
  }
});

// 创建一个注册函数，接收app实例
export function registerLayoutComponents(app) {
  // 注册所有布局组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
}
