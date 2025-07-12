/* 公共引入,勿随意修改,修改时需经过确认 */
import "./support";
import "@/styles/vab.scss";
import "@/config/permission";
import vabIcon from "./vabIcon";
import VabPermissions from "layouts/Permissions";
import Vab from "@/utils/vab";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default (app) => {
  // 注册Element Plus
  app.use(ElementPlus, { size: "small" });

  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  // 注册vabIcon插件
  vabIcon(app);

  // 注册自定义插件
  app.use(Vab);
  app.use(VabPermissions);
};
