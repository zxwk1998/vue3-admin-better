<template>
  <div class="task-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>任务管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索任务..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select 
              v-model="filterStatus" 
              placeholder="状态筛选" 
              style="width: 120px; margin-right: 10px"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="待办" value="pending"></el-option>
              <el-option label="进行中" value="in-progress"></el-option>
              <el-option label="已完成" value="completed"></el-option>
            </el-select>
            <el-button type="primary" @click="showAddTaskDialog">添加任务</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部任务" name="all">
          <el-table 
            :data="filteredTasks" 
            style="width: 100%"
            row-key="id"
            v-loading="loading"
          >
            <el-table-column prop="title" label="任务标题" min-width="200">
              <template #default="{ row }">
                <div class="task-title">
                  <el-checkbox 
                    v-model="row.completed" 
                    @change="toggleTaskStatus(row)"
                  ></el-checkbox>
                  <span 
                    :class="{ 'completed-task': row.completed }"
                    style="margin-left: 10px"
                  >
                    {{ row.title }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="200">
              <template #default="{ row }">
                <div class="task-description">{{ row.description }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="assignee" label="负责人" width="120" />
            <el-table-column prop="dueDate" label="截止日期" width="120" />
            <el-table-column prop="priority" label="优先级" width="100">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)">
                  {{ getPriorityText(row.priority) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="text" @click="editTask(row)">编辑</el-button>
                <el-button type="text" @click="viewTask(row)">查看</el-button>
                <el-button type="text" @click="deleteTask(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="待办任务" name="pending">
          <el-table 
            :data="pendingTasks" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="title" label="任务标题" min-width="200">
              <template #default="{ row }">
                <div class="task-title">
                  <el-checkbox 
                    v-model="row.completed" 
                    @change="toggleTaskStatus(row)"
                  ></el-checkbox>
                  <span style="margin-left: 10px">{{ row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column prop="assignee" label="负责人" width="120" />
            <el-table-column prop="dueDate" label="截止日期" width="120" />
            <el-table-column label="优先级" width="100">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)">
                  {{ getPriorityText(row.priority) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="editTask(row)">编辑</el-button>
                <el-button type="text" @click="startTask(row)">开始</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="进行中任务" name="in-progress">
          <el-table 
            :data="inProgressTasks" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="title" label="任务标题" min-width="200" />
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column prop="assignee" label="负责人" width="120" />
            <el-table-column prop="startDate" label="开始日期" width="120" />
            <el-table-column prop="dueDate" label="截止日期" width="120" />
            <el-table-column label="优先级" width="100">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)">
                  {{ getPriorityText(row.priority) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="editTask(row)">编辑</el-button>
                <el-button type="text" @click="completeTask(row)">完成</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="已完成任务" name="completed">
          <el-table 
            :data="completedTasks" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="title" label="任务标题" min-width="200" />
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column prop="assignee" label="负责人" width="120" />
            <el-table-column prop="completedDate" label="完成日期" width="120" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="text" @click="viewTask(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalTasks"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑任务对话框 -->
    <el-dialog 
      v-model="taskDialogVisible" 
      :title="editingTask ? '编辑任务' : '添加任务'"
      width="600px"
    >
      <el-form
        ref="taskFormRef"
        :model="taskForm"
        :rules="taskRules"
        label-width="100px"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="taskForm.title" />
        </el-form-item>
        
        <el-form-item label="任务描述" prop="description">
          <el-input 
            v-model="taskForm.description" 
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="负责人" prop="assignee">
          <el-select v-model="taskForm.assignee" placeholder="请选择负责人" style="width: 100%">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.name"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="截止日期" prop="dueDate">
          <el-date-picker
            v-model="taskForm.dueDate"
            type="date"
            placeholder="选择截止日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="taskForm.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option label="低" value="low"></el-option>
            <el-option label="中" value="medium"></el-option>
            <el-option label="高" value="high"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="taskForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待办" value="pending"></el-option>
            <el-option label="进行中" value="in-progress"></el-option>
            <el-option label="已完成" value="completed"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="taskDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveTask"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 任务详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="任务详情"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="任务标题">{{ detailTask.title }}</el-descriptions-item>
        <el-descriptions-item label="任务描述">{{ detailTask.description }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ detailTask.assignee }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailTask.status)">
            {{ getStatusText(detailTask.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(detailTask.priority)">
            {{ getPriorityText(detailTask.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建日期">{{ detailTask.createDate }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ detailTask.dueDate }}</el-descriptions-item>
        <el-descriptions-item v-if="detailTask.startDate" label="开始日期">{{ detailTask.startDate }}</el-descriptions-item>
        <el-descriptions-item v-if="detailTask.completedDate" label="完成日期">{{ detailTask.completedDate }}</el-descriptions-item>
      </el-descriptions>
      
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
  name: "Task",
  components: {
    Search
  },
  data() {
    return {
      activeTab: "all",
      searchText: "",
      filterStatus: "",
      currentPage: 1,
      pageSize: 10,
      totalTasks: 0,
      loading: false,
      taskDialogVisible: false,
      detailDialogVisible: false,
      editingTask: null,
      tasks: [
        {
          id: 1,
          title: "设计新功能界面",
          description: "为新功能模块设计用户界面，包括主要页面布局和交互流程",
          assignee: "张三",
          status: "pending",
          priority: "high",
          createDate: "2023-05-01",
          dueDate: "2023-05-20"
        },
        {
          id: 2,
          title: "开发用户认证模块",
          description: "实现用户注册、登录、权限验证等功能",
          assignee: "李四",
          status: "in-progress",
          priority: "high",
          createDate: "2023-05-02",
          dueDate: "2023-05-25",
          startDate: "2023-05-10"
        },
        {
          id: 3,
          title: "编写API文档",
          description: "为已开发的API接口编写详细文档",
          assignee: "王五",
          status: "completed",
          priority: "medium",
          createDate: "2023-04-28",
          dueDate: "2023-05-10",
          completedDate: "2023-05-09"
        },
        {
          id: 4,
          title: "测试系统性能",
          description: "对系统进行压力测试，找出性能瓶颈",
          assignee: "赵六",
          status: "pending",
          priority: "medium",
          createDate: "2023-05-05",
          dueDate: "2023-05-30"
        },
        {
          id: 5,
          title: "修复已知bug",
          description: "修复用户反馈的几个重要bug",
          assignee: "钱七",
          status: "in-progress",
          priority: "high",
          createDate: "2023-05-03",
          dueDate: "2023-05-18",
          startDate: "2023-05-12"
        }
      ],
      users: [
        { id: 1, name: "张三" },
        { id: 2, name: "李四" },
        { id: 3, name: "王五" },
        { id: 4, name: "赵六" },
        { id: 5, name: "钱七" }
      ],
      taskForm: {
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "medium",
        status: "pending"
      },
      detailTask: {},
      taskRules: {
        title: [
          { required: true, message: "请输入任务标题", trigger: "blur" }
        ],
        assignee: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
        dueDate: [
          { required: true, message: "请选择截止日期", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    filteredTasks() {
      let result = this.tasks;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(task => 
          task.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          task.description.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 状态过滤
      if (this.filterStatus) {
        result = result.filter(task => task.status === this.filterStatus);
      }
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    },
    pendingTasks() {
      return this.tasks.filter(task => task.status === "pending");
    },
    inProgressTasks() {
      return this.tasks.filter(task => task.status === "in-progress");
    },
    completedTasks() {
      return this.tasks.filter(task => task.status === "completed");
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getStatusText(status) {
      const statusMap = {
        "pending": "待办",
        "in-progress": "进行中",
        "completed": "已完成"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "pending": "info",
        "in-progress": "warning",
        "completed": "success"
      };
      return typeMap[status] || "info";
    },
    getPriorityText(priority) {
      const priorityMap = {
        "low": "低",
        "medium": "中",
        "high": "高"
      };
      return priorityMap[priority] || priority;
    },
    getPriorityType(priority) {
      const typeMap = {
        "low": "info",
        "medium": "",
        "high": "danger"
      };
      return typeMap[priority] || "info";
    },
    showAddTaskDialog() {
      this.editingTask = null;
      this.taskForm = {
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "medium",
        status: "pending"
      };
      this.taskDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.taskFormRef.resetFields();
      });
    },
    editTask(task) {
      this.editingTask = task;
      this.taskForm = { ...task };
      this.taskDialogVisible = true;
    },
    viewTask(task) {
      this.detailTask = { ...task };
      this.detailDialogVisible = true;
    },
    deleteTask(task) {
      this.$confirm(`确定要删除任务"${task.title}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks.splice(index, 1);
          this.totalTasks = this.tasks.length;
          this.$message.success("任务删除成功");
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    saveTask() {
      this.$refs.taskFormRef.validate((valid) => {
        if (valid) {
          if (this.editingTask) {
            // 编辑任务
            const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
            if (index !== -1) {
              this.tasks[index] = { ...this.editingTask, ...this.taskForm };
              this.$message.success("任务更新成功");
            }
          } else {
            // 添加任务
            const newTask = {
              id: Date.now(),
              createDate: this.formatDate(new Date()),
              ...this.taskForm
            };
            this.tasks.push(newTask);
            this.totalTasks = this.tasks.length;
            this.$message.success("任务添加成功");
          }
          this.taskDialogVisible = false;
        }
      });
    },
    toggleTaskStatus(task) {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        if (task.completed) {
          this.tasks[index].status = "completed";
          this.tasks[index].completedDate = this.formatDate(new Date());
        } else {
          this.tasks[index].status = "pending";
          delete this.tasks[index].completedDate;
        }
        this.$message.success("任务状态已更新");
      }
    },
    startTask(task) {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index].status = "in-progress";
        this.tasks[index].startDate = this.formatDate(new Date());
        this.$message.success("任务已开始");
      }
    },
    completeTask(task) {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index].status = "completed";
        this.tasks[index].completedDate = this.formatDate(new Date());
        this.$message.success("任务已完成");
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .task-title {
    display: flex;
    align-items: center;
  }
  
  .completed-task {
    text-decoration: line-through;
    color: #909399;
  }
  
  .task-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>