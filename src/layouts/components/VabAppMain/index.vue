<template>
  <div v-if="routerView" class="app-main-container">
    <vab-github-corner />
    <transition mode="out-in" name="fade-transform">
      <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
        <router-view :key="key" class="app-main-height" />
      </keep-alive>
    </transition>
    <footer v-show="footerCopyright" class="footer-copyright">
      Copyright
      <el-icon><CopyDocument /></el-icon>
      vue-admin-better 开源免费版 {{ fullYear }}
    </footer>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { copyright, footerCopyright, keepAliveMaxNum, title } from "@/config";
import { CopyDocument } from "@element-plus/icons-vue";
import eventBus from "@/utils/eventBus";

defineOptions({
  name: "VabAppMain",
});

const store = useStore();
const route = useRoute();

// 响应式数据
const show = ref(false);
const fullYear = ref(new Date().getFullYear());
const routerView = ref(true);

// 从store获取数据
const visitedRoutes = computed(() => store.getters["tabsBar/visitedRoutes"]);
const device = computed(() => store.getters["settings/device"]);

// 计算缓存路由
const cachedRoutes = computed(() => {
  const cachedRoutesArr = [];
  visitedRoutes.value.forEach((item) => {
    if (!item.meta.noKeepAlive) {
      cachedRoutesArr.push(item.name);
    }
  });
  return cachedRoutesArr;
});

// 路由key
const key = computed(() => route.path);

// 方法
const foldSideBar = () => {
  store.dispatch("settings/foldSideBar");
};

// 重新加载路由视图
const reloadRouterView = () => {
  routerView.value = false;
  nextTick(() => {
    routerView.value = true;
  });
};

// 监听路由变化
watch(
  () => route,
  (route) => {
    if ("mobile" === device.value) foldSideBar();
  },
  { immediate: true, deep: true }
);

// 生命周期钩子
onMounted(() => {
  // 监听事件总线中的reload-router-view事件
  eventBus.on("reload-router-view", reloadRouterView);
});

onBeforeUnmount(() => {
  // 组件销毁前移除事件监听
  eventBus.off("reload-router-view", reloadRouterView);
});
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  width: 100%;
  overflow: hidden;

  .vab-keel {
    margin: $base-padding;
  }

  .app-main-height {
    min-height: $base-app-main-height;
  }

  .footer-copyright {
    min-height: 55px;
    line-height: 55px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
    border-top: 1px dashed $base-border-color;
  }
}
</style>
