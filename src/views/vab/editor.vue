<template>
  <div class="editor-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>富文本编辑器</span>
        </div>
      </template>
      
      <div class="editor-wrapper">
        <el-input
          v-model="content"
          type="textarea"
          :rows="10"
          placeholder="请输入内容..."
        ></el-input>
        
        <div class="editor-toolbar">
          <el-button type="primary" @click="saveContent">保存</el-button>
          <el-button @click="clearContent">清空</el-button>
        </div>
        
        <div class="content-preview">
          <h3>内容预览：</h3>
          <div class="preview-content" v-html="content"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Editor",
  data() {
    return {
      content: "<h1>欢迎使用富文本编辑器</h1><p>这是一个简单的富文本编辑器示例。</p><ul><li>您可以在这里编辑文本</li><li>支持HTML格式</li><li>可以预览编辑效果</li></ul>",
    };
  },
  methods: {
    saveContent() {
      this.$message.success("内容已保存");
      console.log("保存的内容：", this.content);
    },
    clearContent() {
      this.content = "";
      this.$message.info("内容已清空");
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  padding: 20px;
  
  .card-header {
    font-weight: bold;
  }
  
  .editor-wrapper {
    .editor-toolbar {
      margin: 20px 0;
      text-align: center;
    }
    
    .content-preview {
      margin-top: 30px;
      padding: 20px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      background-color: #f9f9f9;
      
      .preview-content {
        min-height: 200px;
        margin-top: 10px;
        padding: 10px;
        background-color: white;
        border: 1px solid #ebeef5;
      }
    }
  }
}
</style>