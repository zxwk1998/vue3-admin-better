<template>
  <span :title="isFullscreen ? '退出全屏' : '进入全屏'">
    <!-- 直接使用图标组件，不再包裹在el-icon中 -->
    <component
      :is="isFullscreen ? 'FullScreen' : 'FullScreen'"
      class="nav-icon"
      @click="click"
    />
  </span>
</template>

<script>
import screenfull from "screenfull";
import { FullScreen, ScaleToOriginal } from "@element-plus/icons-vue";

export default {
  name: "VabFullScreen",
  components: {
    FullScreen,
    ScaleToOriginal,
  },
  data() {
    return {
      isFullscreen: false,
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$vab.message("开启全屏失败", "error");
        return false;
      }
      screenfull.toggle();
      this.$emit("refresh");
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off("change", this.change);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 采用VabNav中定义的统一样式 */
</style>
