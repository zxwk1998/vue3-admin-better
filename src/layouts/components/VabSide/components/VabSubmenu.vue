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

<script setup>
import { isExternal } from "@/utils/validate";
import path from "path";
import { faToElIcon } from "@/utils/vab";

defineOptions({
  name: "VabSubmenu",
});

const props = defineProps({
  routeChildren: {
    type: Object,
    default: () => null,
  },
  item: {
    type: Object,
    default: () => null,
  },
  fullPath: {
    type: String,
    default: "",
  },
});

const handlePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.fullPath)) {
    return props.fullPath;
  }
  return path.resolve(props.fullPath, routePath);
};

// 将路由中的icon名称转换为Element Plus图标组件
const getIconComponent = (iconName) => {
  // 直接使用导入的faToElIcon函数
  return faToElIcon(iconName);
};
</script>
