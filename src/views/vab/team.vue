<template>
  <div class="team-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>团队管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索团队成员..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddMemberDialog">添加成员</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="所有成员" name="all">
          <el-row :gutter="20">
            <el-col 
              v-for="member in filteredMembers" 
              :key="member.id" 
              :span="6"
              style="margin-bottom: 20px"
            >
              <el-card 
                class="member-card" 
                shadow="hover"
                @click="viewMember(member)"
              >
                <div class="member-avatar">
                  <el-avatar :size="64" :src="member.avatar" />
                </div>
                <div class="member-info">
                  <h3>{{ member.name }}</h3>
                  <p class="member-role">{{ member.role }}</p>
                  <p class="member-department">{{ member.department }}</p>
                  <div class="member-status">
                    <el-tag :type="getStatusType(member.status)">
                      {{ getStatusText(member.status) }}
                    </el-tag>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <el-tab-pane label="在线成员" name="online">
          <el-row :gutter="20">
            <el-col 
              v-for="member in onlineMembers" 
              :key="member.id" 
              :span="6"
              style="margin-bottom: 20px"
            >
              <el-card 
                class="member-card" 
                shadow="hover"
                @click="viewMember(member)"
              >
                <div class="member-avatar">
                  <el-avatar :size="64" :src="member.avatar" />
                  <div class="online-indicator"></div>
                </div>
                <div class="member-info">
                  <h3>{{ member.name }}</h3>
                  <p class="member-role">{{ member.role }}</p>
                  <p class="member-department">{{ member.department }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <el-tab-pane label="部门" name="departments">
          <el-row :gutter="20">
            <el-col 
              v-for="department in departments" 
              :key="department.id" 
              :span="8"
              style="margin-bottom: 20px"
            >
              <el-card class="department-card" shadow="hover">
                <div class="department-header">
                  <h3>{{ department.name }}</h3>
                  <el-tag>{{ department.memberCount }} 人</el-tag>
                </div>
                <div class="department-description">
                  {{ department.description }}
                </div>
                <div class="department-actions">
                  <el-button type="text" @click="viewDepartment(department)">查看详情</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 添加/编辑成员对话框 -->
    <el-dialog 
      v-model="memberDialogVisible" 
      :title="editingMember ? '编辑成员' : '添加成员'"
      width="600px"
    >
      <el-form
        ref="memberFormRef"
        :model="memberForm"
        :rules="memberRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="memberForm.name" />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="memberForm.email" />
            </el-form-item>
            
            <el-form-item label="部门" prop="department">
              <el-select v-model="memberForm.department" placeholder="请选择部门" style="width: 100%">
                <el-option
                  v-for="dept in departments"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.name"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="职位" prop="role">
              <el-input v-model="memberForm.role" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img 
                  v-if="memberForm.avatar" 
                  :src="memberForm.avatar" 
                  class="avatar" 
                  alt="Avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="memberForm.phone" />
            </el-form-item>
            
            <el-form-item label="状态" prop="status">
              <el-select v-model="memberForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="在线" value="online"></el-option>
                <el-option label="忙碌" value="busy"></el-option>
                <el-option label="离开" value="away"></el-option>
                <el-option label="离线" value="offline"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="memberDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveMember"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 成员详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="成员详情"
      width="600px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="detail-avatar">
            <el-avatar :size="80" :src="detailMember.avatar" />
          </div>
        </el-col>
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="姓名">{{ detailMember.name }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ detailMember.email }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ detailMember.department }}</el-descriptions-item>
            <el-descriptions-item label="职位">{{ detailMember.role }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ detailMember.phone }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(detailMember.status)">
                {{ getStatusText(detailMember.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
      
      <el-tabs v-model="memberActiveTab" style="margin-top: 20px">
        <el-tab-pane label="项目参与" name="projects">
          <el-table :data="memberProjects" style="width: 100%">
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="role" label="担任角色" width="120" />
            <el-table-column label="进度" width="150">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :status="getProgressStatus(row.progress)" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="任务分配" name="tasks">
          <el-table :data="memberTasks" style="width: 100%">
            <el-table-column prop="title" label="任务标题" />
            <el-table-column prop="project" label="所属项目" width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getTaskStatusType(row.status)">
                  {{ getTaskStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="截止日期" width="120" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editMember(detailMember)">编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from "@element-plus/icons-vue";

export default {
  name: "Team",
  components: {
    Search,
    Plus
  },
  data() {
    return {
      activeTab: "all",
      memberActiveTab: "projects",
      searchText: "",
      memberDialogVisible: false,
      detailDialogVisible: false,
      editingMember: null,
      members: [
        {
          id: 1,
          name: "张三",
          email: "zhangsan@example.com",
          department: "技术部",
          role: "前端工程师",
          phone: "13800138001",
          status: "online",
          avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        },
        {
          id: 2,
          name: "李四",
          email: "lisi@example.com",
          department: "技术部",
          role: "后端工程师",
          phone: "13800138002",
          status: "busy",
          avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        },
        {
          id: 3,
          name: "王五",
          email: "wangwu@example.com",
          department: "设计部",
          role: "UI设计师",
          phone: "13800138003",
          status: "away",
          avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        },
        {
          id: 4,
          name: "赵六",
          email: "zhaoliu@example.com",
          department: "产品部",
          role: "产品经理",
          phone: "13800138004",
          status: "online",
          avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        },
        {
          id: 5,
          name: "钱七",
          email: "qianqi@example.com",
          department: "市场部",
          role: "市场专员",
          phone: "13800138005",
          status: "offline",
          avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        },
        {
          id: 6,
          name: "孙八",
          email: "sunba@example.com",
          department: "技术部",
          role: "测试工程师",
          phone: "13800138006",
          status: "online",
          avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        }
      ],
      departments: [
        {
          id: 1,
          name: "技术部",
          description: "负责产品研发和技术支持",
          memberCount: 3
        },
        {
          id: 2,
          name: "设计部",
          description: "负责产品设计和用户体验",
          memberCount: 1
        },
        {
          id: 3,
          name: "产品部",
          description: "负责产品规划和项目管理",
          memberCount: 1
        },
        {
          id: 4,
          name: "市场部",
          description: "负责市场推广和客户关系",
          memberCount: 1
        }
      ],
      memberForm: {
        name: "",
        email: "",
        department: "",
        role: "",
        phone: "",
        status: "online",
        avatar: ""
      },
      detailMember: {},
      memberRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        department: [
          { required: true, message: "请选择部门", trigger: "change" }
        ],
        role: [
          { required: true, message: "请输入职位", trigger: "blur" }
        ]
      },
      memberProjects: [
        {
          id: 1,
          name: "电商平台开发",
          role: "前端开发",
          progress: 75
        },
        {
          id: 2,
          name: "移动端App",
          role: "前端开发",
          progress: 40
        }
      ],
      memberTasks: [
        {
          id: 1,
          title: "首页改版",
          project: "电商平台开发",
          status: "in-progress",
          dueDate: "2023-06-30"
        },
        {
          id: 2,
          title: "商品列表优化",
          project: "电商平台开发",
          status: "completed",
          dueDate: "2023-06-15"
        }
      ]
    };
  },
  computed: {
    filteredMembers() {
      if (!this.searchText) {
        return this.members;
      }
      return this.members.filter(member => 
        member.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        member.role.toLowerCase().includes(this.searchText.toLowerCase()) ||
        member.department.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    onlineMembers() {
      return this.members.filter(member => member.status === "online");
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
    },
    getStatusText(status) {
      const statusMap = {
        "online": "在线",
        "busy": "忙碌",
        "away": "离开",
        "offline": "离线"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "online": "success",
        "busy": "warning",
        "away": "info",
        "offline": "danger"
      };
      return typeMap[status] || "info";
    },
    getProgressStatus(progress) {
      if (progress === 100) {
        return "success";
      } else if (progress < 30) {
        return "exception";
      }
      return "";
    },
    getTaskStatusText(status) {
      const statusMap = {
        "pending": "待办",
        "in-progress": "进行中",
        "completed": "已完成"
      };
      return statusMap[status] || status;
    },
    getTaskStatusType(status) {
      const typeMap = {
        "pending": "info",
        "in-progress": "warning",
        "completed": "success"
      };
      return typeMap[status] || "info";
    },
    showAddMemberDialog() {
      this.editingMember = null;
      this.memberForm = {
        name: "",
        email: "",
        department: "",
        role: "",
        phone: "",
        status: "online",
        avatar: ""
      };
      this.memberDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.memberFormRef.resetFields();
      });
    },
    editMember(member) {
      this.editingMember = member;
      this.memberForm = { ...member };
      this.memberDialogVisible = true;
      this.detailDialogVisible = false;
    },
    viewMember(member) {
      this.detailMember = { ...member };
      this.detailDialogVisible = true;
    },
    viewDepartment(department) {
      this.$message.info(`查看部门: ${department.name}`);
    },
    saveMember() {
      this.$refs.memberFormRef.validate((valid) => {
        if (valid) {
          if (this.editingMember) {
            // 编辑成员
            const index = this.members.findIndex(m => m.id === this.editingMember.id);
            if (index !== -1) {
              this.members[index] = { ...this.editingMember, ...this.memberForm };
              this.$message.success("成员信息更新成功");
            }
          } else {
            // 添加成员
            const newMember = {
              id: Date.now(),
              ...this.memberForm
            };
            this.members.push(newMember);
            this.$message.success("成员添加成功");
          }
          this.memberDialogVisible = false;
        }
      });
    },
    handleAvatarSuccess(response, file) {
      this.memberForm.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.team-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .member-card {
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .member-avatar {
      text-align: center;
      position: relative;
      
      .online-indicator {
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: #67C23A;
        border-radius: 50%;
        border: 2px solid white;
        bottom: 0;
        right: 8px;
      }
    }
    
    .member-info {
      text-align: center;
      margin-top: 15px;
      
      h3 {
        margin: 10px 0 5px;
        font-size: 16px;
      }
      
      .member-role {
        color: #999;
        margin: 5px 0;
        font-size: 14px;
      }
      
      .member-department {
        color: #666;
        font-size: 13px;
        margin: 5px 0;
      }
    }
  }
  
  .department-card {
    .department-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      
      h3 {
        margin: 0;
      }
    }
    
    .department-description {
      color: #666;
      margin: 10px 0;
      min-height: 40px;
    }
  }
  
  .detail-avatar {
    text-align: center;
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