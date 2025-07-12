<template>
  <div class="top-container">
    <div class="vab-main">
      <el-row :gutter="15">
        <el-col :lg="6" :md="6" :sm="6" :xl="6" :xs="6">
          <vab-logo />
        </el-col>
        <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="12">
          <el-menu
            active-text-color=" hsla(0, 0%, 100%, 0.95)"
            background-color="#21252b"
            :collapse="collapse"
            :collapse-transition="false"
            :default-active="activeMenu"
            :default-openeds="defaultOpens"
            text-color=" hsla(0, 0%, 100%, 0.95)"
            menu-trigger="hover"
            mode="horizontal"
          >
            <template v-for="route in routes">
              <vab-side-item
                v-if="!route.hidden"
                :key="route.path"
                :full-path="route.path"
                :item="route"
              />
            </template>
          </el-menu>
        </el-col>
        <el-col :lg="6" :md="6" :sm="6" :xl="6" :xs="6">
          <div class="right-panel">
            <div class="right-menu">
              <vab-full-screen @refresh="refreshRoute" />
              <vab-theme class="hidden-md-and-down" />
              <el-icon
                :class="{ 'is-pulsing': pulse }"
                title="重载路由"
                @click="refreshRoute"
              >
                <Refresh />
              </el-icon>
            </div>
            <vab-avatar />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import variables from "@/styles/variables.scss";
import { Refresh } from "@element-plus/icons-vue";

defineOptions({
  name: "VabTop",
});

const store = useStore();
const route = useRoute();

// 响应式数据
const pulse = ref(false);
const menuTrigger = ref("hover");
let timeOutID = null;

// 计算属性
const routes = computed(() => store.getters["routes/routes"]);
const visitedRoutes = computed(() => store.getters["tabsBar/visitedRoutes"]);
const collapse = computed(() => store.getters["settings/collapse"]);
const defaultOpens = computed(() => []);

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

// 方法
const refreshRoute = async () => {
  window.$eventBus.emit("reload-router-view");
  pulse.value = true;
  timeOutID = setTimeout(() => {
    pulse.value = false;
  }, 1000);
};

// 生命周期钩子
onBeforeUnmount(() => {
  clearTimeout(timeOutID);
});
</script>

<style lang="scss" scoped>
.top-container {
  display: flex;
  align-items: center;
  justify-items: flex-end;
  height: $base-top-bar-height;
  background: $base-menu-background;
  width: 100%;

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

  .vab-main {
    background: $base-menu-background;
    width: 100%;
    padding: 0 15px;

    :deep() {
      .el-menu {
        &.el-menu--horizontal {
          display: flex;
          align-items: center;
          justify-content: center;
          height: $base-top-bar-height;
          border-bottom: 0 solid transparent !important;

          .el-menu-item,
          .el-submenu__title {
            padding: 0 15px;
          }

          @media only screen and (max-width: 767px) {
            .el-menu-item,
            .el-submenu__title {
              padding: 0 8px;
            }

            li:nth-child(4),
            li:nth-child(5) {
              display: none !important;
            }
          }

          > .el-menu-item {
            height: $base-top-bar-height;
            line-height: $base-top-bar-height;
          }

          > .el-submenu {
            .el-submenu__title {
              height: $base-top-bar-height;
              line-height: $base-top-bar-height;
            }
          }
        }

        svg {
          width: 1rem;
          margin-right: 3px;
        }

        &--horizontal {
          .el-menu {
            .el-menu-item,
            .el-submenu__title {
              height: $base-menu-item-height;
              line-height: $base-menu-item-height;
            }
          }

          .el-submenu,
          .el-menu-item {
            &.is-active {
              background-color: $base-color-blue !important;
              border-bottom: 0 solid transparent !important;

              .el-submenu__title {
                border-bottom: 0 solid transparent !important;
              }
            }
          }

          > .el-menu-item {
            .el-tag {
              margin-top: calc(#{$base-top-bar-height} / 2 - 7.5px);
              margin-left: 5px;
            }

            @media only screen and (max-width: 1199px) {
              .el-tag {
                display: none;
              }
            }

            &.is-active {
              background-color: transparent !important;
              border-bottom: 3px solid $base-color-blue !important;
            }
          }
        }
      }
    }
  }

  .right-panel {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: $base-top-bar-height;
    width: 100%;

    .right-menu {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }

    :deep() {
      .username,
      .user-role {
        color: rgba($base-color-white, 0.9);
      }

      .username + i {
        color: rgba($base-color-white, 0.9);
      }

      svg {
        width: 1em;
        height: 1em;
        margin-right: 15px;
        font-size: $base-font-size-big;
        color: rgba($base-color-white, 0.9);
        cursor: pointer;
        fill: rgba($base-color-white, 0.9);
      }

      button {
        svg {
          margin-right: 0;
          color: rgba($base-color-white, 0.9);
          cursor: pointer;
          fill: rgba($base-color-white, 0.9);
        }
      }

      .el-badge {
        margin-right: 15px;
      }
    }
  }
}

@media (max-width: 992px) {
  .top-container {
    .vab-main {
      .el-menu--horizontal {
        justify-content: flex-start;
      }
    }

    .right-panel {
      .right-menu {
        margin-right: 5px;
      }

      :deep() {
        svg {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
