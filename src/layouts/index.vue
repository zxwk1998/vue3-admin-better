<template>
  <div :class="classObj" class="vue-admin-better-wrapper">
    <div
      v-if="'horizontal' === layout"
      :class="{
        fixed: header === 'fixed',
        'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
      }"
      class="layout-container-horizontal"
    >
      <div :class="header === 'fixed' ? 'fixed-header' : ''">
        <vab-top />
        <div
          v-if="tabsBar === 'true' || tabsBar === true"
          :class="{ 'tag-view-show': tabsBar }"
        >
          <el-scrollbar>
            <vab-tabs />
          </el-scrollbar>
        </div>
      </div>
      <div class="vab-main main-padding">
        <vab-ad />
        <vab-app-main />
      </div>
    </div>
    <div
      v-else
      :class="{
        fixed: header === 'fixed',
        'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
      }"
      class="layout-container-vertical"
    >
      <div
        v-if="device === 'mobile' && collapse === false"
        class="mask"
        @click="handleFoldSideBar"
      />
      <vab-side />
      <div :class="collapse ? 'is-collapse-main' : ''" class="vab-main">
        <div :class="header === 'fixed' ? 'fixed-header' : ''">
          <vab-nav />
          <vab-tabs v-if="tabsBar === 'true' || tabsBar === true" />
        </div>
        <vab-ad />
        <vab-app-main />
      </div>
    </div>
    <el-backtop />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { tokenName } from "@/config";

const store = useStore();

const oldLayout = ref("");
const controller = ref(new window.AbortController());
let timeOutID = null;

const layout = computed(() => store.getters["settings/layout"]);
const tabsBar = computed(() => store.getters["settings/tabsBar"]);
const collapse = computed(() => store.getters["settings/collapse"]);
const header = computed(() => store.getters["settings/header"]);
const device = computed(() => store.getters["settings/device"]);

const classObj = computed(() => {
  return {
    mobile: device.value === "mobile",
  };
});

const handleFoldSideBar = () => {
  store.dispatch("settings/foldSideBar");
};

const handleIsMobile = () => {
  return document.body.getBoundingClientRect().width - 1 < 992;
};

const handleResize = () => {
  if (!document.hidden) {
    const isMobile = handleIsMobile();
    if (isMobile) {
      //横向布局时如果是手机端访问那么改成纵向版
      store.dispatch("settings/changeLayout", "vertical");
    } else {
      store.dispatch("settings/changeLayout", oldLayout.value);
    }

    store.dispatch("settings/toggleDevice", isMobile ? "mobile" : "desktop");
  }
};

onBeforeMount(() => {
  window.addEventListener("resize", handleResize);
  
  // 页面加载时检查是否有保存的路由信息
  const savedRoute = sessionStorage.getItem('currentRoute');
  if (savedRoute) {
    try {
      const routeInfo = JSON.parse(savedRoute);
      // 这里可以添加恢复路由状态的逻辑，比如重新设置Vuex中的路由状态
      console.log('恢复保存的路由信息:', routeInfo);
      // 清除保存的路由信息
      sessionStorage.removeItem('currentRoute');
    } catch (e) {
      console.error('解析保存的路由信息失败:', e);
    }
  }
});

// 页面刷新前保存当前路由信息
const handleBeforeUnload = () => {
  // 保存当前路由到 sessionStorage
  sessionStorage.setItem('currentRoute', JSON.stringify({
    path: window.location.hash.replace('#', ''),
    fullPath: window.location.href
  }));
};

// 监听页面可见性变化，处理页面切换
const handleVisibilityChange = () => {
  if (document.hidden) {
    // 页面隐藏时保存路由信息
    handleBeforeUnload();
  }
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  controller.value.abort();
  clearTimeout(timeOutID);
});

// 相当于mounted
oldLayout.value = layout.value;
const isMobile = handleIsMobile();
if (isMobile) {
  //横向布局时如果是手机端访问那么改成纵向版
  store.dispatch("settings/changeLayout", "vertical");
} else {
  store.dispatch("settings/changeLayout", oldLayout.value);
}
store.dispatch("settings/toggleDevice", isMobile ? "mobile" : "desktop");
if (isMobile) {
  timeOutID = setTimeout(() => {
    store.dispatch("settings/foldSideBar");
  }, 2000);
} else {
  store.dispatch("settings/openSideBar");
}

nextTick(() => {
  window.addEventListener(
    "storage",
    (e) => {
      if (e.key === tokenName || e.key === null) window.location.reload();
      if (e.key === tokenName && e.value === null) window.location.reload();
    },
    {
      capture: false,
      signal: controller.value?.signal,
    }
  );
});
</script>

<style lang="scss" scoped>
@mixin fix-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: $base-z-index - 2;
  width: 100%;
  overflow: hidden;
}

.vue-admin-better-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .layout-container-horizontal {
    position: relative;

    &.fixed {
      padding-top: calc(#{$base-top-bar-height} + #{$base-tabs-bar-height});
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-top-bar-height;
    }

    :deep() {
      .vab-main {
        width: 88%;
        margin: auto;
      }

      .fixed-header {
        @include fix-header;
      }

      .tag-view-show {
        background: $base-color-white;
        box-shadow: $base-box-shadow;
      }

      .nav-container {
        .fold-unfold {
          display: none;
        }
      }

      .main-padding {
        .app-main-container {
          margin-top: $base-padding;
          margin-bottom: $base-padding;
          background: $base-color-white;
        }
      }
    }
  }

  .layout-container-vertical {
    position: relative;

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index - 1;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #000;
      opacity: 0.5;
    }

    &.fixed {
      padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-nav-bar-height;
    }

    .vab-main {
      position: relative;
      min-height: 100%;
      margin-left: $base-left-menu-width;
      background: #f6f8f9;
      transition: $base-transition;

      :deep() {
        .fixed-header {
          @include fix-header;

          left: $base-left-menu-width;
          width: $base-right-content-width;
          box-shadow: $base-box-shadow;
          transition: $base-transition;
        }

        .nav-container {
          position: relative;
          box-sizing: border-box;
        }

        .tabs-container {
          box-sizing: border-box;
        }

        .app-main-container {
          width: calc(100% - #{$base-padding} - #{$base-padding});
          margin: $base-padding auto;
          background: $base-color-white;
          border-radius: $base-border-radius;
        }
      }

      &.is-collapse-main {
        margin-left: $base-left-menu-width-min;

        :deep() {
          .fixed-header {
            left: $base-left-menu-width-min;
            width: calc(100% - 65px);
          }
        }
      }
    }
  }

  /* 手机端开始 */
  &.mobile {
    :deep() {
      .el-pager,
      .el-pagination__jump {
        display: none;
      }

      .layout-container-vertical {
        .el-scrollbar.side-container.is-collapse {
          width: 0;
        }

        .vab-main {
          width: 100%;
          margin-left: 0;
        }
      }

      .vab-main {
        .fixed-header {
          left: 0 !important;
          width: 100% !important;
        }
      }
    }
  }

  /* 手机端结束 */
}
</style>
