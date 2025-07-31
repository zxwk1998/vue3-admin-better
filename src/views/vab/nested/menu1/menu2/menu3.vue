<template>
  <div class="menu3-container">
    <el-card shadow="never">
      <el-alert
        title="嵌套路由 - 三级菜单"
        type="error"
        description="您当前在 /vab/nested/menu1/menu2/menu3 路径下，这是最深层的嵌套路由"
      />
      
      <div style="margin-top: 20px">
        <el-button type="primary" @click="$router.push('/vab/nested')">
          返回顶层
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Menu3"
};
</script>

<style lang="scss" scoped>
.menu3-container {
  padding: 20px 0;
}
</style>