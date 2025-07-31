<template>
  <div class="menu1-container">
    <el-card shadow="never">
      <el-alert
        title="嵌套路由 - 一级菜单"
        type="info"
        description="您当前在 /vab/nested/menu1 路径下"
      />
      
      <div style="margin-top: 20px">
        <el-button type="primary" @click="$router.push('/vab/nested/menu1/menu2')">
          进入二级菜单
        </el-button>
      </div>
      
      <div style="margin-top: 20px">
        <router-view />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Menu1"
};
</script>

<style lang="scss" scoped>
.menu1-container {
  padding: 20px 0;
}
</style>