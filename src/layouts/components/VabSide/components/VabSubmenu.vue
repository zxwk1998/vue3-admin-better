<template>
  <el-sub-menu
    ref="subMenu"
    :index="handlePath(item.path)"
    :popper-append-to-body="false"
  >
    <template #title>
      <el-icon v-if="item.meta && item.meta.icon" class="vab-fas-icon">
        <component :is="getIconComponent(item.meta.icon)" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <slot />
  </el-sub-menu>
</template>

<script>
import { isExternal } from "@/utils/validate";
import path from "path";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default {
  name: "VabSubmenu",
  props: {
    routeChildren: {
      type: Object,
      default() {
        return null;
      },
    },
    item: {
      type: Object,
      default() {
        return null;
      },
    },
    fullPath: {
      type: String,
      default: "",
    },
  },
  methods: {
    handlePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.fullPath)) {
        return this.fullPath;
      }
      return path.resolve(this.fullPath, routePath);
    },
    // 将路由中的icon名称转换为Element Plus图标组件
    getIconComponent(iconName) {
      // 映射FontAwesome图标名称到Element Plus图标
      const iconMap = {
        home: "HomeFilled",
        marker: "Location",
        "box-open": "Box",
        "horse-head": "Promotion",
        bug: "Warning",
        // 添加更多映射...
      };

      // 获取映射的组件名或使用默认图标
      const componentName = iconMap[iconName] || "More";
      return componentName;
    },
  },
};
</script>
