<template>
  <el-scrollbar :class="{ 'is-collapse': collapse }" class="side-container">
    <vab-logo />
    <el-menu
      active-text-color=" hsla(0, 0%, 100%, 0.95)"
      background-color="#21252b"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      :default-openeds="defaultOpens"
      text-color=" hsla(0, 0%, 100%, 0.95)"
      mode="vertical"
    >
      <template v-for="route in routes">
        <vab-side-item :full-path="route.path" :item="route" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import variables from "@/styles/variables.scss";
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { defaultOopeneds } from "@/config";

defineOptions({
  name: "VabSide",
});

const store = useStore();
const route = useRoute();

const collapse = computed(() => store.getters["settings/collapse"]);
const routes = computed(() => store.getters["routes/routes"]);

const defaultOpens = computed(() => {
  // 使用配置文件中的defaultOopeneds
  return defaultOopeneds;
});

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>

<style lang="scss" scoped>
@mixin active {
  &:hover {
    color: $base-color-white;
    background-color: $base-menu-background-active !important;
  }

  &.is-active {
    color: $base-color-white;
    background-color: $base-menu-background-active !important;
  }
}

.side-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $base-z-index;
  width: $base-left-menu-width;
  height: 100vh;
  overflow: hidden;
  background: $base-menu-background;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width $base-transition-time;

  &.is-collapse {
    width: $base-left-menu-width-min;
    border-right: 0;

    :deep() {
      .el-menu {
        transition: width $base-transition-time;
      }

      .el-menu--collapse {
        border-right: 0;

        .el-submenu__icon-arrow {
          right: 10px;
          margin-top: -3px;
        }

        .el-menu-item,
        .el-submenu {
          text-align: center;
        }
      }
    }
  }

  :deep() {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-menu {
      border: 0;
    }

    .el-menu-item,
    .el-submenu__title {
      height: $base-menu-item-height;
      line-height: $base-menu-item-height;
    }

    .el-menu-item {
      @include active;
    }
  }
}
</style>
