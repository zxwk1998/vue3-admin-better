<template>
  <div class="upload-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>文件上传</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="upload-demo">
              <h3>点击上传</h3>
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-remove="beforeRemove"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </template>
              </el-upload>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="upload-demo">
              <h3>照片墙</h3>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-success="handleAvatarSuccess"
                :file-list="imageList"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              
              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <el-card shadow="hover">
            <div class="upload-demo">
              <h3>手动上传</h3>
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="false"
                :on-change="handleChange"
                :file-list="manualFiles"
              >
                <template #trigger>
                  <el-button type="primary">选取文件</el-button>
                </template>
                <el-button 
                  class="ml-3" 
                  type="success" 
                  @click="submitUpload"
                  :loading="uploadLoading"
                >
                  上传到服务器
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    文件会先保存到本地，点击上传按钮后才会上传到服务器
                  </div>
                </template>
              </el-upload>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { UploadFilled, Plus } from "@element-plus/icons-vue";

export default {
  name: "Upload",
  components: {
    UploadFilled,
    Plus
  },
  data() {
    return {
      fileList: [],
      imageList: [],
      manualFiles: [],
      dialogImageUrl: "",
      dialogVisible: false,
      uploadLoading: false,
      uploadRef: null
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$message.success("文件上传成功");
      console.log("上传成功:", response, file, fileList);
    },
    handleError(error, file, fileList) {
      this.$message.error("文件上传失败");
      console.error("上传失败:", error, file, fileList);
    },
    beforeRemove(uploadFile, uploadFiles) {
      return this.$confirm(`确定移除 ${uploadFile.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(response, uploadFile) {
      this.$message.success("图片上传成功");
      console.log("图片上传成功:", response, uploadFile);
    },
    handleChange(file, fileList) {
      this.manualFiles = fileList;
    },
    async submitUpload() {
      this.uploadLoading = true;
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.uploadLoading = false;
      this.$message.success("手动上传成功");
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-container {
  padding: 20px;
  
  .card-header {
    font-weight: bold;
  }
  
  .upload-demo {
    h3 {
      margin-bottom: 20px;
      color: #333;
    }
    
    :deep(.el-upload-dragger) {
      width: 100%;
    }
    
    :deep(.el-upload-list__item) {
      transition: none !important;
    }
  }
}
</style>