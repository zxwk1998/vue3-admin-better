<template>
  <div class="project-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>项目管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索项目..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddProjectDialog">添加项目</el-button>
          </div>
        </div>
      </template>
      
      <el-table 
        :data="filteredProjects" 
        style="width: 100%"
        row-key="id"
        v-loading="loading"
      >
        <el-table-column prop="name" label="项目名称" min-width="200">
          <template #default="{ row }">
            <div class="project-name">
              <el-avatar :size="32" :style="{ backgroundColor: row.color }">
                {{ row.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <span style="margin-left: 10px">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="项目描述" min-width="250">
          <template #default="{ row }">
            <div class="project-description">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="150">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.progress" 
              :status="getProgressStatus(row.progress)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="manager" label="项目经理" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="viewProject(row)">查看</el-button>
            <el-button type="text" @click="editProject(row)">编辑</el-button>
            <el-button type="text" @click="deleteProject(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalProjects"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑项目对话框 -->
    <el-dialog 
      v-model="projectDialogVisible" 
      :title="editingProject ? '编辑项目' : '添加项目'"
      width="600px"
    >
      <el-form
        ref="projectFormRef"
        :model="projectForm"
        :rules="projectRules"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name" />
        </el-form-item>
        
        <el-form-item label="项目描述" prop="description">
          <el-input 
            v-model="projectForm.description" 
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="项目经理" prop="manager">
          <el-select v-model="projectForm.manager" placeholder="请选择项目经理" style="width: 100%">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.name"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="projectForm.startDate"
            type="date"
            placeholder="选择开始日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="projectForm.endDate"
            type="date"
            placeholder="选择结束日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="projectForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="未开始" value="not-started"></el-option>
            <el-option label="进行中" value="in-progress"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已暂停" value="paused"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="项目颜色">
          <el-color-picker v-model="projectForm.color" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="projectDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveProject"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 项目详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="项目详情"
      width="800px"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="项目名称">{{ detailProject.name }}</el-descriptions-item>
            <el-descriptions-item label="项目描述">{{ detailProject.description }}</el-descriptions-item>
            <el-descriptions-item label="项目经理">{{ detailProject.manager }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(detailProject.status)">
                {{ getStatusText(detailProject.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ detailProject.startDate }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ detailProject.endDate }}</el-descriptions-item>
            <el-descriptions-item label="进度">
              <el-progress 
                :percentage="detailProject.progress" 
                :status="getProgressStatus(detailProject.progress)"
              />
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div class="project-avatar-detail" :style="{ backgroundColor: detailProject.color }">
            {{ detailProject.name.charAt(0).toUpperCase() }}
          </div>
        </el-col>
      </el-row>
      
      <el-tabs v-model="activeTab" style="margin-top: 20px">
        <el-tab-pane label="任务" name="tasks">
          <el-table :data="projectTasks" style="width: 100%">
            <el-table-column prop="title" label="任务标题" />
            <el-table-column prop="assignee" label="负责人" width="120" />
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
        <el-tab-pane label="成员" name="members">
          <el-table :data="projectMembers" style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="email" label="邮箱" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "Project",
  components: {
    Search
  },
  data() {
    return {
      searchText: "",
      currentPage: 1,
      pageSize: 10,
      totalProjects: 0,
      loading: false,
      projectDialogVisible: false,
      detailDialogVisible: false,
      activeTab: "tasks",
      editingProject: null,
      projects: [
        {
          id: 1,
          name: "电商平台开发",
          description: "开发全新的电商平台，包括前端和后端系统",
          progress: 75,
          manager: "张三",
          status: "in-progress",
          startDate: "2023-04-01",
          endDate: "2023-09-30",
          color: "#409EFF"
        },
        {
          id: 2,
          name: "移动端App",
          description: "开发公司业务的移动端应用程序",
          progress: 40,
          manager: "李四",
          status: "in-progress",
          startDate: "2023-05-01",
          endDate: "2023-11-30",
          color: "#67C23A"
        },
        {
          id: 3,
          name: "数据分析系统",
          description: "构建大数据分析平台，支持实时数据处理",
          progress: 90,
          manager: "王五",
          status: "in-progress",
          startDate: "2023-03-01",
          endDate: "2023-08-31",
          color: "#E6A23C"
        },
        {
          id: 4,
          name: "内部管理系统",
          description: "升级公司内部管理系统，提高办公效率",
          progress: 100,
          manager: "赵六",
          status: "completed",
          startDate: "2023-01-01",
          endDate: "2023-05-31",
          color: "#F56C6C"
        },
        {
          id: 5,
          name: "客户关系管理",
          description: "开发CRM系统，提升客户服务质量",
          progress: 20,
          manager: "钱七",
          status: "not-started",
          startDate: "2023-07-01",
          endDate: "2023-12-31",
          color: "#909399"
        }
      ],
      users: [
        { id: 1, name: "张三" },
        { id: 2, name: "李四" },
        { id: 3, name: "王五" },
        { id: 4, name: "赵六" },
        { id: 5, name: "钱七" }
      ],
      projectForm: {
        name: "",
        description: "",
        manager: "",
        startDate: "",
        endDate: "",
        status: "not-started",
        color: "#409EFF"
      },
      detailProject: {},
      projectRules: {
        name: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        manager: [
          { required: true, message: "请选择项目经理", trigger: "change" }
        ],
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "change" }
        ]
      },
      projectTasks: [
        {
          id: 1,
          title: "需求分析",
          assignee: "张三",
          status: "completed",
          dueDate: "2023-04-10"
        },
        {
          id: 2,
          title: "UI设计",
          assignee: "李四",
          status: "completed",
          dueDate: "2023-04-20"
        },
        {
          id: 3,
          title: "前端开发",
          assignee: "王五",
          status: "in-progress",
          dueDate: "2023-06-30"
        },
        {
          id: 4,
          title: "后端开发",
          assignee: "赵六",
          status: "in-progress",
          dueDate: "2023-07-15"
        }
      ],
      projectMembers: [
        { id: 1, name: "张三", role: "项目经理", email: "zhangsan@example.com" },
        { id: 2, name: "李四", role: "UI设计师", email: "lisi@example.com" },
        { id: 3, name: "王五", role: "前端工程师", email: "wangwu@example.com" },
        { id: 4, name: "赵六", role: "后端工程师", email: "zhaoliu@example.com" }
      ]
    };
  },
  computed: {
    filteredProjects() {
      let result = this.projects;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(project => 
          project.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          project.description.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getStatusText(status) {
      const statusMap = {
        "not-started": "未开始",
        "in-progress": "进行中",
        "completed": "已完成",
        "paused": "已暂停"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "not-started": "info",
        "in-progress": "warning",
        "completed": "success",
        "paused": "danger"
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
    showAddProjectDialog() {
      this.editingProject = null;
      this.projectForm = {
        name: "",
        description: "",
        manager: "",
        startDate: "",
        endDate: "",
        status: "not-started",
        color: "#409EFF"
      };
      this.projectDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.projectFormRef.resetFields();
      });
    },
    editProject(project) {
      this.editingProject = project;
      this.projectForm = { ...project };
      this.projectDialogVisible = true;
    },
    viewProject(project) {
      this.detailProject = { ...project };
      this.detailDialogVisible = true;
    },
    deleteProject(project) {
      this.$confirm(`确定要删除项目"${project.name}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          this.projects.splice(index, 1);
          this.totalProjects = this.projects.length;
          this.$message.success("项目删除成功");
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    saveProject() {
      this.$refs.projectFormRef.validate((valid) => {
        if (valid) {
          if (this.editingProject) {
            // 编辑项目
            const index = this.projects.findIndex(p => p.id === this.editingProject.id);
            if (index !== -1) {
              this.projects[index] = { ...this.editingProject, ...this.projectForm };
              this.$message.success("项目更新成功");
            }
          } else {
            // 添加项目
            const newProject = {
              id: Date.now(),
              progress: 0,
              ...this.projectForm
            };
            this.projects.push(newProject);
            this.totalProjects = this.projects.length;
            this.$message.success("项目添加成功");
          }
          this.projectDialogVisible = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.project-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .project-name {
    display: flex;
    align-items: center;
  }
  
  .project-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .project-avatar-detail {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: white;
    margin: 0 auto;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>