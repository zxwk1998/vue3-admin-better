<template>
  <div class="settings-container">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="120px"
            style="max-width: 600px"
          >
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="basicForm.siteName" />
            </el-form-item>
            
            <el-form-item label="网站描述" prop="description">
              <el-input 
                v-model="basicForm.description" 
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            
            <el-form-item label="网站Logo">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img 
                  v-if="basicForm.logo" 
                  :src="basicForm.logo" 
                  class="avatar" 
                  alt="Logo"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            
            <el-form-item label="启用维护模式">
              <el-switch v-model="basicForm.maintenanceMode" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
              <el-button @click="resetBasicForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="安全设置" name="security">
          <el-form
            ref="securityFormRef"
            :model="securityForm"
            :rules="securityRules"
            label-width="150px"
            style="max-width: 600px"
          >
            <el-form-item label="密码最小长度" prop="minPasswordLength">
              <el-input-number 
                v-model="securityForm.minPasswordLength" 
                :min="6" 
                :max="20" 
              />
            </el-form-item>
            
            <el-form-item label="启用双重认证">
              <el-switch v-model="securityForm.twoFactorAuth" />
            </el-form-item>
            
            <el-form-item label="会话超时时间(分钟)" prop="sessionTimeout">
              <el-input-number 
                v-model="securityForm.sessionTimeout" 
                :min="1" 
                :max="1440" 
              />
            </el-form-item>
            
            <el-form-item label="登录失败尝试次数" prop="maxLoginAttempts">
              <el-input-number 
                v-model="securityForm.maxLoginAttempts" 
                :min="1" 
                :max="10" 
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
              <el-button @click="resetSecurityForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="邮件设置" name="email">
          <el-form
            ref="emailFormRef"
            :model="emailForm"
            :rules="emailRules"
            label-width="120px"
            style="max-width: 600px"
          >
            <el-form-item label="SMTP服务器" prop="smtpServer">
              <el-input v-model="emailForm.smtpServer" />
            </el-form-item>
            
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input-number 
                v-model="emailForm.smtpPort" 
                :min="1" 
                :max="65535" 
              />
            </el-form-item>
            
            <el-form-item label="用户名" prop="username">
              <el-input v-model="emailForm.username" />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="emailForm.password" 
                type="password"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="发件人邮箱" prop="senderEmail">
              <el-input v-model="emailForm.senderEmail" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveEmailSettings">保存设置</el-button>
              <el-button @click="resetEmailForm">重置</el-button>
              <el-button @click="testEmailConnection">测试连接</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { Plus } from "@element-plus/icons-vue";

export default {
  name: "Settings",
  components: {
    Plus
  },
  data() {
    return {
      activeTab: "basic",
      basicForm: {
        siteName: "Vue Admin Better",
        description: "一个基于Vue 3和Element Plus的后台管理系统",
        logo: "",
        maintenanceMode: false
      },
      securityForm: {
        minPasswordLength: 8,
        twoFactorAuth: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5
      },
      emailForm: {
        smtpServer: "smtp.example.com",
        smtpPort: 587,
        username: "user@example.com",
        password: "",
        senderEmail: "noreply@example.com"
      },
      basicRules: {
        siteName: [
          { required: true, message: "请输入网站名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入网站描述", trigger: "blur" }
        ]
      },
      securityRules: {
        minPasswordLength: [
          { required: true, message: "请输入密码最小长度", trigger: "blur" }
        ],
        sessionTimeout: [
          { required: true, message: "请输入会话超时时间", trigger: "blur" }
        ],
        maxLoginAttempts: [
          { required: true, message: "请输入登录失败尝试次数", trigger: "blur" }
        ]
      },
      emailRules: {
        smtpServer: [
          { required: true, message: "请输入SMTP服务器", trigger: "blur" }
        ],
        smtpPort: [
          { required: true, message: "请输入SMTP端口", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        senderEmail: [
          { required: true, message: "请输入发件人邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleAvatarSuccess(response, file) {
      this.basicForm.logo = URL.createObjectURL(file.raw);
      this.$message.success("Logo上传成功");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("Logo图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("Logo图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    saveBasicSettings() {
      this.$refs.basicFormRef.validate((valid) => {
        if (valid) {
          this.$message.success("基本设置保存成功");
        } else {
          this.$message.error("请填写必填项");
        }
      });
    },
    resetBasicForm() {
      this.$refs.basicFormRef.resetFields();
      this.$message.info("表单已重置");
    },
    saveSecuritySettings() {
      this.$refs.securityFormRef.validate((valid) => {
        if (valid) {
          this.$message.success("安全设置保存成功");
        } else {
          this.$message.error("请填写必填项");
        }
      });
    },
    resetSecurityForm() {
      this.$refs.securityFormRef.resetFields();
      this.$message.info("表单已重置");
    },
    saveEmailSettings() {
      this.$refs.emailFormRef.validate((valid) => {
        if (valid) {
          this.$message.success("邮件设置保存成功");
        } else {
          this.$message.error("请填写必填项");
        }
      });
    },
    resetEmailForm() {
      this.$refs.emailFormRef.resetFields();
      this.$message.info("表单已重置");
    },
    testEmailConnection() {
      this.$refs.emailFormRef.validateField("smtpServer", (valid) => {
        if (!valid) {
          this.$message.info("正在测试邮件连接...");
          setTimeout(() => {
            this.$message.success("邮件连接测试成功");
          }, 1000);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 20px;
  
  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
  
  .avatar-uploader .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>