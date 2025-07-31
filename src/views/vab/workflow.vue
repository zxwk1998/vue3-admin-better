<template>
  <div class="workflow-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>工作流</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索工作流..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddWorkflowDialog">创建工作流</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="所有工作流" name="all">
          <el-table 
            :data="filteredWorkflows" 
            style="width: 100%"
            row-key="id"
            v-loading="loading"
          >
            <el-table-column prop="name" label="工作流名称" min-width="200">
              <template #default="{ row }">
                <div class="workflow-name">
                  <el-icon :color="row.color"><Connection /></el-icon>
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="250">
              <template #default="{ row }">
                <div class="workflow-description">{{ row.description }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建者" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="250">
              <template #default="{ row }">
                <el-button type="text" @click="viewWorkflow(row)">查看</el-button>
                <el-button type="text" @click="editWorkflow(row)">编辑</el-button>
                <el-button type="text" @click="startWorkflow(row)">启动</el-button>
                <el-button type="text" @click="deleteWorkflow(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="我创建的" name="created">
          <el-table 
            :data="myWorkflows" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="工作流名称" min-width="200">
              <template #default="{ row }">
                <div class="workflow-name">
                  <el-icon :color="row.color"><Connection /></el-icon>
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="250" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="text" @click="viewWorkflow(row)">查看</el-button>
                <el-button type="text" @click="editWorkflow(row)">编辑</el-button>
                <el-button type="text" @click="startWorkflow(row)">启动</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="我参与的" name="participated">
          <el-table 
            :data="participatedWorkflows" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="工作流名称" min-width="200">
              <template #default="{ row }">
                <div class="workflow-name">
                  <el-icon :color="row.color"><Connection /></el-icon>
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="250" />
            <el-table-column label="我的角色" width="120">
              <template #default="{ row }">
                <el-tag>{{ getMyRole(row) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建者" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="viewWorkflow(row)">查看</el-button>
                <el-button type="text" @click="processWorkflow(row)">处理</el-button>
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
          :total="totalWorkflows"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑工作流对话框 -->
    <el-dialog 
      v-model="workflowDialogVisible" 
      :title="editingWorkflow ? '编辑工作流' : '创建工作流'"
      width="800px"
    >
      <el-form
        ref="workflowFormRef"
        :model="workflowForm"
        :rules="workflowRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作流名称" prop="name">
              <el-input v-model="workflowForm.name" />
            </el-form-item>
            
            <el-form-item label="描述" prop="description">
              <el-input 
                v-model="workflowForm.description" 
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            
            <el-form-item label="创建者">
              <el-input v-model="workflowForm.creator" disabled />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="workflowForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="草稿" value="draft"></el-option>
                <el-option label="已发布" value="published"></el-option>
                <el-option label="已停用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="工作流颜色">
              <el-color-picker v-model="workflowForm.color" />
            </el-form-item>
            
            <el-form-item label="可见范围">
              <el-select v-model="workflowForm.visibility" placeholder="请选择可见范围" style="width: 100%">
                <el-option label="所有人" value="public"></el-option>
                <el-option label="仅创建者" value="private"></el-option>
                <el-option label="指定部门" value="department"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider>流程节点</el-divider>
        
        <div class="node-list">
          <draggable 
            v-model="workflowForm.nodes" 
            item-key="id"
            handle=".node-handle"
          >
            <template #item="{ element, index }">
              <div class="node-item">
                <div class="node-handle">
                  <el-icon><Rank /></el-icon>
                </div>
                <div class="node-content">
                  <el-form-item 
                    :prop="`nodes.${index}.name`"
                    :rules="[{ required: true, message: '请输入节点名称', trigger: 'blur' }]"
                  >
                    <el-input v-model="element.name" placeholder="节点名称" />
                  </el-form-item>
                  
                  <el-form-item 
                    :prop="`nodes.${index}.assigneeType`"
                    :rules="[{ required: true, message: '请选择处理人类型', trigger: 'change' }]"
                  >
                    <el-select v-model="element.assigneeType" placeholder="处理人类型" style="width: 100%">
                      <el-option label="指定人员" value="user"></el-option>
                      <el-option label="指定角色" value="role"></el-option>
                      <el-option label="表单字段" value="field"></el-option>
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item 
                    v-if="element.assigneeType === 'user'"
                    :prop="`nodes.${index}.assignee`"
                    :rules="[{ required: true, message: '请选择处理人', trigger: 'change' }]"
                  >
                    <el-select v-model="element.assignee" placeholder="处理人" style="width: 100%">
                      <el-option
                        v-for="user in users"
                        :key="user.id"
                        :label="user.name"
                        :value="user.id"
                      />
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item 
                    v-if="element.assigneeType === 'role'"
                    :prop="`nodes.${index}.role`"
                    :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]"
                  >
                    <el-select v-model="element.role" placeholder="角色" style="width: 100%">
                      <el-option label="管理员" value="admin"></el-option>
                      <el-option label="经理" value="manager"></el-option>
                      <el-option label="员工" value="employee"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="node-actions">
                  <el-button 
                    type="danger" 
                    icon="Delete" 
                    circle 
                    @click="removeNode(index)"
                  />
                </div>
              </div>
            </template>
          </draggable>
          
          <div style="margin-top: 15px">
            <el-button type="primary" @click="addNode">添加节点</el-button>
          </div>
        </div>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="workflowDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveWorkflow"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 工作流详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="工作流详情"
      width="800px"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="工作流名称">{{ detailWorkflow.name }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{ detailWorkflow.description }}</el-descriptions-item>
            <el-descriptions-item label="创建者">{{ detailWorkflow.creator }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(detailWorkflow.status)">
                {{ getStatusText(detailWorkflow.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detailWorkflow.createTime }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div class="workflow-icon-detail" :style="{ color: detailWorkflow.color }">
            <el-icon :size="60"><Connection /></el-icon>
          </div>
        </el-col>
      </el-row>
      
      <el-tabs v-model="workflowActiveTab" style="margin-top: 20px">
        <el-tab-pane label="流程图" name="diagram">
          <div class="workflow-diagram">
            <div 
              v-for="(node, index) in detailWorkflow.nodes" 
              :key="node.id"
              class="workflow-node"
              :class="{ 'active': activeNodeIndex === index }"
              @click="activeNodeIndex = index"
            >
              <div class="node-index">{{ index + 1 }}</div>
              <div class="node-name">{{ node.name }}</div>
              <div class="node-assignee">
                <span v-if="node.assigneeType === 'user'">
                  处理人: {{ getUserById(node.assignee)?.name || '未指定' }}
                </span>
                <span v-else-if="node.assigneeType === 'role'">
                  角色: {{ getRoleText(node.role) }}
                </span>
                <span v-else>
                  字段: {{ node.field || '未指定' }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="实例" name="instances">
          <el-table :data="workflowInstances" style="width: 100%">
            <el-table-column prop="id" label="实例ID" width="100" />
            <el-table-column prop="title" label="标题" />
            <el-table-column label="当前节点" width="150">
              <template #default="{ row }">
                {{ getCurrentNodeName(row.currentNodeId) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getInstanceStatusType(row.status)">
                  {{ getInstanceStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="viewInstance(row)">查看</el-button>
              </template>
            </el-table-column>
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
import { Search, Connection, Rank, Delete } from "@element-plus/icons-vue";
import draggable from "vuedraggable";

export default {
  name: "Workflow",
  components: {
    Search,
    Connection,
    Rank,
    Delete,
    draggable
  },
  data() {
    return {
      activeTab: "all",
      workflowActiveTab: "diagram",
      searchText: "",
      currentPage: 1,
      pageSize: 10,
      totalWorkflows: 0,
      loading: false,
      workflowDialogVisible: false,
      detailDialogVisible: false,
      activeNodeIndex: 0,
      editingWorkflow: null,
      workflows: [
        {
          id: 1,
          name: "请假申请",
          description: "员工请假申请审批流程",
          status: "published",
          creator: "张三",
          createTime: "2023-05-01 10:00:00",
          color: "#409EFF",
          visibility: "public",
          nodes: [
            {
              id: 1,
              name: "提交申请",
              assigneeType: "user",
              assignee: 1
            },
            {
              id: 2,
              name: "直属上级审批",
              assigneeType: "role",
              role: "manager"
            },
            {
              id: 3,
              name: "人事审批",
              assigneeType: "role",
              role: "admin"
            }
          ]
        },
        {
          id: 2,
          name: "报销申请",
          description: "员工费用报销审批流程",
          status: "published",
          creator: "李四",
          createTime: "2023-05-05 14:30:00",
          color: "#67C23A",
          visibility: "public",
          nodes: [
            {
              id: 1,
              name: "提交报销",
              assigneeType: "user",
              assignee: 2
            },
            {
              id: 2,
              name: "部门经理审批",
              assigneeType: "role",
              role: "manager"
            },
            {
              id: 3,
              name: "财务审批",
              assigneeType: "role",
              role: "admin"
            }
          ]
        },
        {
          id: 3,
          name: "入职流程",
          description: "新员工入职办理流程",
          status: "draft",
          creator: "王五",
          createTime: "2023-05-10 09:15:00",
          color: "#E6A23C",
          visibility: "private",
          nodes: [
            {
              id: 1,
              name: "填写入职信息",
              assigneeType: "user",
              assignee: 3
            },
            {
              id: 2,
              name: "部门分配",
              assigneeType: "role",
              role: "manager"
            },
            {
              id: 3,
              name: "IT设备分配",
              assigneeType: "role",
              role: "admin"
            },
            {
              id: 4,
              name: "人事手续办理",
              assigneeType: "role",
              role: "admin"
            }
          ]
        }
      ],
      users: [
        { id: 1, name: "张三" },
        { id: 2, name: "李四" },
        { id: 3, name: "王五" },
        { id: 4, name: "赵六" },
        { id: 5, name: "钱七" }
      ],
      workflowForm: {
        name: "",
        description: "",
        status: "draft",
        creator: "当前用户",
        color: "#409EFF",
        visibility: "public",
        nodes: []
      },
      detailWorkflow: {},
      workflowRules: {
        name: [
          { required: true, message: "请输入工作流名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      workflowInstances: [
        {
          id: 1001,
          title: "张三的年假申请",
          currentNodeId: 2,
          status: "in-progress",
          startTime: "2023-05-15 09:30:00"
        },
        {
          id: 1002,
          title: "李四的差旅报销",
          currentNodeId: 3,
          status: "in-progress",
          startTime: "2023-05-16 14:20:00"
        },
        {
          id: 1003,
          title: "王五的病假申请",
          currentNodeId: 1,
          status: "completed",
          startTime: "2023-05-10 11:45:00",
          endTime: "2023-05-10 16:30:00"
        }
      ]
    };
  },
  computed: {
    filteredWorkflows() {
      let result = this.workflows;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(workflow => 
          workflow.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          workflow.description.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    },
    myWorkflows() {
      return this.workflows.filter(workflow => workflow.creator === "张三");
    },
    participatedWorkflows() {
      return this.workflows.filter(workflow => 
        workflow.nodes.some(node => 
          (node.assigneeType === "user" && node.assignee === 1) ||
          (node.assigneeType === "role" && node.role === "admin")
        )
      );
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
        "draft": "草稿",
        "published": "已发布",
        "disabled": "已停用"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "draft": "info",
        "published": "success",
        "disabled": "danger"
      };
      return typeMap[status] || "info";
    },
    getInstanceStatusText(status) {
      const statusMap = {
        "pending": "待处理",
        "in-progress": "进行中",
        "completed": "已完成",
        "rejected": "已拒绝"
      };
      return statusMap[status] || status;
    },
    getInstanceStatusType(status) {
      const typeMap = {
        "pending": "info",
        "in-progress": "warning",
        "completed": "success",
        "rejected": "danger"
      };
      return typeMap[status] || "info";
    },
    getRoleText(role) {
      const roleMap = {
        "admin": "管理员",
        "manager": "经理",
        "employee": "员工"
      };
      return roleMap[role] || role;
    },
    getMyRole(workflow) {
      if (workflow.creator === "张三") {
        return "创建者";
      }
      return "处理人";
    },
    getUserById(id) {
      return this.users.find(user => user.id === id);
    },
    getCurrentNodeName(nodeId) {
      if (!this.detailWorkflow.nodes) return "";
      const node = this.detailWorkflow.nodes.find(n => n.id === nodeId);
      return node ? node.name : "";
    },
    showAddWorkflowDialog() {
      this.editingWorkflow = null;
      this.workflowForm = {
        name: "",
        description: "",
        status: "draft",
        creator: "当前用户",
        color: "#409EFF",
        visibility: "public",
        nodes: [
          {
            id: Date.now(),
            name: "节点1",
            assigneeType: "user",
            assignee: 1
          }
        ]
      };
      this.workflowDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.workflowFormRef.resetFields();
      });
    },
    editWorkflow(workflow) {
      this.editingWorkflow = workflow;
      this.workflowForm = JSON.parse(JSON.stringify(workflow));
      this.workflowDialogVisible = true;
    },
    viewWorkflow(workflow) {
      this.detailWorkflow = { ...workflow };
      this.detailDialogVisible = true;
    },
    startWorkflow(workflow) {
      this.$message.success(`已启动工作流: ${workflow.name}`);
    },
    processWorkflow(workflow) {
      this.$message.success(`开始处理工作流: ${workflow.name}`);
    },
    deleteWorkflow(workflow) {
      this.$confirm(`确定要删除工作流"${workflow.name}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.workflows.findIndex(w => w.id === workflow.id);
        if (index !== -1) {
          this.workflows.splice(index, 1);
          this.totalWorkflows = this.workflows.length;
          this.$message.success("工作流删除成功");
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    saveWorkflow() {
      this.$refs.workflowFormRef.validate((valid) => {
        if (valid) {
          if (this.editingWorkflow) {
            // 编辑工作流
            const index = this.workflows.findIndex(w => w.id === this.editingWorkflow.id);
            if (index !== -1) {
              this.workflows[index] = { ...this.editingWorkflow, ...this.workflowForm };
              this.$message.success("工作流更新成功");
            }
          } else {
            // 添加工作流
            const newWorkflow = {
              id: Date.now(),
              createTime: new Date().toLocaleString(),
              ...this.workflowForm
            };
            this.workflows.push(newWorkflow);
            this.totalWorkflows = this.workflows.length;
            this.$message.success("工作流创建成功");
          }
          this.workflowDialogVisible = false;
        }
      });
    },
    addNode() {
      this.workflowForm.nodes.push({
        id: Date.now() + Math.random(),
        name: `节点${this.workflowForm.nodes.length + 1}`,
        assigneeType: "user",
        assignee: 1
      });
    },
    removeNode(index) {
      if (this.workflowForm.nodes.length <= 1) {
        this.$message.warning("至少需要保留一个节点");
        return;
      }
      this.workflowForm.nodes.splice(index, 1);
    },
    viewInstance(instance) {
      this.$message.info(`查看实例: ${instance.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.workflow-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .workflow-name {
    display: flex;
    align-items: center;
  }
  
  .workflow-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .workflow-icon-detail {
    text-align: center;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
  
  .node-list {
    .node-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      
      .node-handle {
        cursor: move;
        margin-right: 10px;
        color: #999;
      }
      
      .node-content {
        flex: 1;
        
        :deep(.el-form-item) {
          margin-bottom: 10px;
        }
      }
      
      .node-actions {
        margin-left: 10px;
      }
    }
  }
  
  .workflow-diagram {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .workflow-node {
      width: 300px;
      padding: 15px;
      margin: 10px 0;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      
      &.active {
        border-color: #409EFF;
        box-shadow: 0 0 0 2px #c6e2ff;
      }
      
      .node-index {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background-color: #409EFF;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        margin-right: 10px;
      }
      
      .node-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .node-assignee {
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>