<template>
  <div class="help-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never" class="help-sidebar">
          <template #header>
            <span>帮助中心</span>
          </template>
          <el-menu
            :default-active="activeMenu"
            class="help-menu"
            @select="handleMenuSelect"
          >
            <el-sub-menu index="guide">
              <template #title>
                <el-icon><Guide /></el-icon>
                <span>使用指南</span>
              </template>
              <el-menu-item index="guide-basic">基础操作</el-menu-item>
              <el-menu-item index="guide-advanced">高级功能</el-menu-item>
              <el-menu-item index="guide-tips">使用技巧</el-menu-item>
            </el-sub-menu>
            
            <el-sub-menu index="faq">
              <template #title>
                <el-icon><QuestionFilled /></el-icon>
                <span>常见问题</span>
              </template>
              <el-menu-item index="faq-account">账户相关</el-menu-item>
              <el-menu-item index="faq-task">任务管理</el-menu-item>
              <el-menu-item index="faq-data">数据相关</el-menu-item>
            </el-sub-menu>
            
            <el-menu-item index="video">
              <el-icon><VideoPlay /></el-icon>
              <span>视频教程</span>
            </el-menu-item>
            
            <el-menu-item index="download">
              <el-icon><Download /></el-icon>
              <span>资源下载</span>
            </el-menu-item>
            
            <el-menu-item index="feedback">
              <el-icon><ChatDotSquare /></el-icon>
              <span>意见反馈</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <el-card shadow="never" class="help-content">
          <div v-if="activeMenu === 'guide-basic'">
            <h2>基础操作指南</h2>
            <p>欢迎使用本系统，以下是基础操作的详细说明：</p>
            
            <el-divider />
            
            <h3>1. 登录系统</h3>
            <p>访问系统网址，在登录页面输入您的用户名和密码即可登录系统。</p>
            <el-image 
              style="width: 100%; height: 200px; margin: 10px 0"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              :preview-src-list="['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg']"
            />
            
            <h3>2. 导航菜单</h3>
            <p>系统左侧为导航菜单，点击菜单项可以切换到对应的功能模块。</p>
            
            <h3>3. 页面操作</h3>
            <p>每个页面都提供了相应的操作按钮，如新增、编辑、删除等，点击对应按钮即可执行相关操作。</p>
          </div>
          
          <div v-else-if="activeMenu === 'guide-advanced'">
            <h2>高级功能指南</h2>
            <p>以下是系统提供的高级功能介绍：</p>
            
            <el-divider />
            
            <h3>1. 数据导入导出</h3>
            <p>系统支持Excel格式的数据导入和导出，方便您进行数据处理。</p>
            
            <h3>2. 权限管理</h3>
            <p>管理员可以为不同用户分配不同的权限，确保系统安全。</p>
            
            <h3>3. 自定义报表</h3>
            <p>您可以根据需要自定义生成各类数据报表。</p>
          </div>
          
          <div v-else-if="activeMenu === 'guide-tips'">
            <h2>使用技巧</h2>
            <p>以下是一些使用系统的小技巧：</p>
            
            <el-divider />
            
            <h3>1. 快捷键</h3>
            <ul>
              <li>Ctrl + S: 保存当前操作</li>
              <li>Ctrl + F: 快速搜索</li>
              <li>Esc: 关闭当前弹窗</li>
            </ul>
            
            <h3>2. 批量操作</h3>
            <p>在列表页面，您可以勾选多个项目进行批量操作，提高工作效率。</p>
          </div>
          
          <div v-else-if="activeMenu === 'faq-account'">
            <h2>账户相关问题</h2>
            
            <el-divider />
            
            <el-collapse v-model="activeFaq" accordion>
              <el-collapse-item title="如何修改密码？" name="1">
                <div>登录系统后，点击右上角头像，选择"个人设置"，在个人资料页面可以修改密码。</div>
              </el-collapse-item>
              <el-collapse-item title="忘记密码怎么办？" name="2">
                <div>在登录页面点击"忘记密码"，按照提示操作即可重置密码。</div>
              </el-collapse-item>
              <el-collapse-item title="如何切换账户？" name="3">
                <div>退出当前账户后，重新输入新账户的用户名和密码登录即可。</div>
              </el-collapse-item>
            </el-collapse>
          </div>
          
          <div v-else-if="activeMenu === 'faq-task'">
            <h2>任务管理问题</h2>
            
            <el-divider />
            
            <el-collapse v-model="activeFaq" accordion>
              <el-collapse-item title="如何创建新任务？" name="1">
                <div>进入任务管理页面，点击"添加任务"按钮，填写任务信息后保存即可。</div>
              </el-collapse-item>
              <el-collapse-item title="如何分配任务给他人？" name="2">
                <div>创建或编辑任务时，在"负责人"字段中选择相应的用户即可。</div>
              </el-collapse-item>
              <el-collapse-item title="如何查看任务进度？" name="3">
                <div>在任务列表中，可以通过任务状态和进度条查看任务的完成情况。</div>
              </el-collapse-item>
            </el-collapse>
          </div>
          
          <div v-else-if="activeMenu === 'faq-data'">
            <h2>数据相关问题</h2>
            
            <el-divider />
            
            <el-collapse v-model="activeFaq" accordion>
              <el-collapse-item title="数据如何备份？" name="1">
                <div>系统会自动进行数据备份，您也可以在系统设置中手动备份数据。</div>
              </el-collapse-item>
              <el-collapse-item title="如何导出数据？" name="2">
                <div>在数据列表页面，点击"导出"按钮，选择导出格式即可下载数据。</div>
              </el-collapse-item>
              <el-collapse-item title="数据导入有什么要求？" name="3">
                <div>导入的数据需要符合系统模板格式，支持Excel和CSV格式。</div>
              </el-collapse-item>
            </el-collapse>
          </div>
          
          <div v-else-if="activeMenu === 'video'">
            <h2>视频教程</h2>
            <p>以下是一些操作视频教程：</p>
            
            <el-divider />
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card shadow="hover">
                  <div class="video-item">
                    <el-image 
                      style="width: 100%; height: 150px"
                      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    />
                    <h3>系统入门教程</h3>
                    <p>介绍系统的基本功能和操作方法</p>
                    <el-button type="primary" plain>观看视频</el-button>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="12">
                <el-card shadow="hover">
                  <div class="video-item">
                    <el-image 
                      style="width: 100%; height: 150px"
                      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    />
                    <h3>高级功能详解</h3>
                    <p>详细介绍系统的高级功能使用方法</p>
                    <el-button type="primary" plain>观看视频</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          
          <div v-else-if="activeMenu === 'download'">
            <h2>资源下载</h2>
            <p>以下是一些可供下载的资源：</p>
            
            <el-divider />
            
            <el-table :data="resources" style="width: 100%">
              <el-table-column prop="name" label="资源名称" />
              <el-table-column prop="description" label="描述" />
              <el-table-column prop="size" label="大小" width="100" />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button type="primary" size="small" @click="downloadResource(row)">
                    下载
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div v-else-if="activeMenu === 'feedback'">
            <h2>意见反馈</h2>
            <p>如果您有任何建议或问题，请告诉我们：</p>
            
            <el-divider />
            
            <el-form
              ref="feedbackFormRef"
              :model="feedbackForm"
              :rules="feedbackRules"
              label-width="100px"
              style="max-width: 600px"
            >
              <el-form-item label="您的姓名" prop="name">
                <el-input v-model="feedbackForm.name" />
              </el-form-item>
              
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model="feedbackForm.contact" />
              </el-form-item>
              
              <el-form-item label="反馈类型">
                <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型" style="width: 100%">
                  <el-option label="功能建议" value="suggestion"></el-option>
                  <el-option label="问题反馈" value="issue"></el-option>
                  <el-option label="使用咨询" value="question"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="反馈内容" prop="content">
                <el-input 
                  v-model="feedbackForm.content" 
                  type="textarea"
                  :rows="5"
                  placeholder="请详细描述您的建议或遇到的问题..."
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
                <el-button @click="resetFeedbackForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div v-else>
            <h2>帮助中心</h2>
            <p>欢迎使用系统帮助中心，您可以通过左侧菜单查找需要的帮助内容。</p>
            <p>如需更多帮助，请联系我们的客服团队。</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { 
  Guide, 
  QuestionFilled, 
  VideoPlay, 
  Download, 
  ChatDotSquare 
} from "@element-plus/icons-vue";

export default {
  name: "Help",
  components: {
    Guide,
    QuestionFilled,
    VideoPlay,
    Download,
    ChatDotSquare
  },
  data() {
    return {
      activeMenu: "guide-basic",
      activeFaq: "",
      feedbackForm: {
        name: "",
        contact: "",
        type: "suggestion",
        content: ""
      },
      feedbackRules: {
        name: [
          { required: true, message: "请输入您的姓名", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入反馈内容", trigger: "blur" }
        ]
      },
      resources: [
        {
          id: 1,
          name: "用户手册.pdf",
          description: "系统详细使用说明文档",
          size: "2.4MB"
        },
        {
          id: 2,
          name: "API文档.pdf",
          description: "系统接口文档",
          size: "1.8MB"
        },
        {
          id: 3,
          name: "模板文件.xlsx",
          description: "数据导入模板",
          size: "56KB"
        }
      ]
    };
  },
  methods: {
    handleMenuSelect(key) {
      this.activeMenu = key;
    },
    downloadResource(resource) {
      this.$message.success(`开始下载 ${resource.name}`);
      // 模拟下载过程
    },
    submitFeedback() {
      this.$refs.feedbackFormRef.validate((valid) => {
        if (valid) {
          this.$message.success("反馈提交成功，感谢您的建议！");
          this.resetFeedbackForm();
        }
      });
    },
    resetFeedbackForm() {
      this.$refs.feedbackFormRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.help-container {
  padding: 20px;
  
  .help-sidebar {
    height: calc(100vh - 120px);
    
    :deep(.el-menu) {
      border-right: 0;
    }
  }
  
  .help-content {
    height: calc(100vh - 120px);
    overflow-y: auto;
    
    .video-item {
      text-align: center;
      
      h3 {
        margin: 15px 0 10px;
      }
      
      p {
        color: #666;
        margin-bottom: 15px;
      }
    }
  }
}
</style>