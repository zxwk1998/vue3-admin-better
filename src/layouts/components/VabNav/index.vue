<template>
  <div class="nav-container">
    <el-row :gutter="15">
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="4">
        <div class="left-panel">
          <component
            :is="collapse ? 'DArrowRight' : 'DArrowLeft'"
            class="nav-icon"
            @click="handleCollapse"
          />
          <vab-breadcrumb class="hidden-xs-only" />
        </div>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="20">
        <div class="right-panel">
          <vab-full-screen @refresh="refreshRoute" />
          <vab-theme class="hidden-xs-only" />
          <Refresh
            :class="{ 'is-pulsing': pulse }"
            title="重载所有路由"
            @click="refreshRoute"
            class="nav-icon"
          />
          <vab-avatar />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { Refresh } from "@element-plus/icons-vue";

defineOptions({
  name: "VabNav",
});

const store = useStore();
const pulse = ref(false);
let timeOutID = null;

const collapse = computed(() => store.getters["settings/collapse"]);

const handleCollapse = () => {
  store.dispatch("settings/changeCollapse");
};

const refreshRoute = async () => {
  window.$eventBus.emit("reload-router-view");
  pulse.value = true;
  timeOutID = setTimeout(() => {
    pulse.value = false;
  }, 1000);
};

onBeforeUnmount(() => {
  clearTimeout(timeOutID);
});
</script>

<style lang="scss" scoped>
.nav-container {
  position: relative;
  height: $base-nav-bar-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  overflow: hidden;
  user-select: none;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6);

  .left-panel {
    position: relative;
    display: flex;
    align-items: center;
    justify-items: center;
    height: $base-nav-bar-height;
    gap: 8px; /* 折叠按钮与面包屑之间的间距 */
  }

  .right-panel {
    position: relative;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: $base-nav-bar-height;
    gap: 4px; /* 适当调整图标间距 */

    .is-pulsing {
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  :deep() {
    svg {
      width: 1.2em;
      height: 1.2em;
      color: rgba(0, 0, 0, 0.7);
      fill: rgba(0, 0, 0, 0.7) !important;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    svg:hover {
      background: rgba(0, 0, 0, 0.05);
      color: rgba(0, 0, 0, 0.9);
      fill: rgba(0, 0, 0, 0.9) !important;
      transform: scale(1.05);
    }

    button {
      svg {
        margin-right: 0;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(0, 122, 255, 0.8);
        border-color: rgba(0, 122, 255, 0.9);
        cursor: pointer;
        fill: rgba(255, 255, 255, 0.9);

        &:hover {
          background: rgba(0, 122, 255, 0.9);
          border-color: rgba(0, 122, 255, 1);
        }
      }
    }

    .el-badge {
      margin-right: 0;

      .el-button {
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(255, 255, 255, 1);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .nav-container {
    padding: 0 12px;
  }
}
</style>
