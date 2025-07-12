<template>
  <component
    :is="menuComponent"
    v-if="!item.hidden"
    :full-path="fullPath"
    :item="item"
    :route-children="routeChildren"
  >
    <template v-if="item.children && item.children.length">
      <vab-side-item
        v-for="route in item.children"
        :key="route.path"
        :full-path="handlePath(route.path)"
        :item="route"
      />
    </template>
  </component>
</template>

<script setup>
import { ref, computed } from "vue";
import { isExternal } from "@/utils/validate";
import path from "path";

defineOptions({
  name: "VabSideItem",
});

// Props 定义
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  fullPath: {
    type: String,
    default: "",
  },
});

// 数据
const routeChildren = ref(null);
let onlyOneChild = null;

// 方法
const handleChildren = (children = [], parent) => {
  if (children === null) children = [];
  const showChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      routeChildren.value = item;
      return true;
    }
  });

  if (showChildren.length === 1) {
    return true;
  }

  if (showChildren.length === 0) {
    routeChildren.value = {
      ...parent,
      path: "",
      notShowChildren: true,
    };
    return true;
  }
  return false;
};

const handlePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.fullPath)) {
    return props.fullPath;
  }
  return path.resolve(props.fullPath, routePath);
};

// 计算属性
const menuComponent = computed(() => {
  if (
    handleChildren(props.item.children, props.item) &&
    (!routeChildren.value.children || routeChildren.value.notShowChildren) &&
    !props.item.alwaysShow
  ) {
    return "VabMenuItem";
  } else {
    return "VabSubmenu";
  }
});
</script>

<style lang="scss" scoped>
.vab-nav-icon {
  margin-right: 4px;
}
</style>
