<template>
  <div class="nested-container">
    <el-card shadow="never">
      <el-alert
        title="嵌套路由示例"
        type="success"
        description="这是一个嵌套路由的示例页面，展示了如何在Vue中实现多级路由"
        show-icon
      />
      
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8">
          <el-card class="nested-card" shadow="hover">
            <div class="card-content">
              <el-icon class="card-icon"><Folder /></el-icon>
              <h3>一级菜单</h3>
              <p>这是嵌套路由的一级菜单</p>
              <el-button type="primary" @click="$router.push('/vab/nested/menu1')">
                进入一级菜单
              </el-button>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="nested-card" shadow="hover">
            <div class="card-content">
              <el-icon class="card-icon"><Document /></el-icon>
              <h3>二级菜单</h3>
              <p>这是嵌套路由的二级菜单</p>
              <el-button type="primary" @click="$router.push('/vab/nested/menu1/menu2')">
                进入二级菜单
              </el-button>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="nested-card" shadow="hover">
            <div class="card-content">
              <el-icon class="card-icon"><Setting /></el-icon>
              <h3>三级菜单</h3>
              <p>这是嵌套路由的三级菜单</p>
              <el-button type="primary" @click="$router.push('/vab/nested/menu1/menu2/menu3')">
                进入三级菜单
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <div style="margin-top: 20px">
        <router-view />
      </div>
    </el-card>
  </div>
</template>

<script>
import { Folder, Document, Setting } from "@element-plus/icons-vue";

export default {
  name: "Nested",
  components: {
    Folder,
    Document,
    Setting,
  },
};
</script>

<style lang="scss" scoped>
.nested-container {
  padding: 20px;
  
  .nested-card {
    text-align: center;
    
    .card-content {
      .card-icon {
        font-size: 48px;
        color: #409eff;
        margin-bottom: 15px;
      }
      
      h3 {
        margin-bottom: 10px;
      }
      
      p {
        color: #666;
        margin-bottom: 15px;
      }
    }
  }
}
</style>