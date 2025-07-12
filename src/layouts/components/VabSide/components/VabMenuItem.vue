<template>
  <el-menu-item :index="handlePath(routeChildren.path)" @click="handleLink">
    <el-icon v-if="routeChildren.meta.icon" class="vab-fas-icon">
      <component :is="getIconComponent(routeChildren.meta.icon)" />
    </el-icon>
    <span>{{ routeChildren.meta.title }}</span>
  </el-menu-item>
</template>

<script>
import { isExternal } from "@/utils/validate";
import path from "path";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default {
  name: "VabMenuItem",
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
    handleLink() {
      const routePath = this.routeChildren.path;
      const target = this.routeChildren.meta.target;

      if (target === "_blank") {
        if (isExternal(routePath)) {
          window.open(routePath);
        } else if (isExternal(this.fullPath)) {
          window.open(this.fullPath);
        } else if (
          this.$route.path !== path.resolve(this.fullPath, routePath)
        ) {
          let routeData = this.$router.resolve(
            path.resolve(this.fullPath, routePath)
          );
          window.open(routeData.href);
        }
      } else {
        if (isExternal(routePath)) {
          window.location.href = routePath;
        } else if (isExternal(this.fullPath)) {
          window.location.href = this.fullPath;
        } else if (
          this.$route.path !== path.resolve(this.fullPath, routePath)
        ) {
          this.$router.push(path.resolve(this.fullPath, routePath));
        }
      }
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
