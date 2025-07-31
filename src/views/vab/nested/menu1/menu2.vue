<template>
  <div class="menu2-container">
    <el-card shadow="never">
      <el-alert
        title="嵌套路由 - 二级菜单"
        type="warning"
        description="您当前在 /vab/nested/menu1/menu2 路径下"
      />
      
      <div style="margin-top: 20px">
        <el-button type="primary" @click="$router.push('/vab/nested/menu1/menu2/menu3')">
          进入三级菜单
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
  name: "Menu2"
};
</script>

<style lang="scss" scoped>
.menu2-container {
  padding: 20px 0;
}
</style>