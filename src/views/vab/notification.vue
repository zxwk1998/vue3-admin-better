<template>
  <div class="notification-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>通知中心</span>
          <el-button 
            type="primary" 
            @click="showCreateDialog"
            style="float: right; margin-left: 10px;"
          >
            发送通知
          </el-button>
          <el-button 
            @click="refreshNotifications"
            style="float: right;"
          >
            刷新
          </el-button>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部通知" name="all">
          <el-table 
            :data="filteredNotifications" 
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="title" label="标题" width="200">
              <template #default="{ row }">
                <el-badge 
                  v-if="!row.read" 
                  is-dot 
                  class="item"
                >
                  {{ row.title }}
                </el-badge>
                <span v-else>{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
              <template #default="{ row }">
                <div class="notification-content">{{ row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="sender" label="发送者" width="120" />
            <el-table-column prop="date" label="时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button 
                  v-if="!row.read" 
                  type="primary" 
                  size="small"
                  @click="markAsRead(row)"
                >
                  标为已读
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteNotification(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="未读通知" name="unread">
          <el-table 
            :data="unreadNotifications" 
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="title" label="标题" width="200">
              <template #default="{ row }">
                <el-badge is-dot class="item">
                  {{ row.title }}
                </el-badge>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
              <template #default="{ row }">
                <div class="notification-content">{{ row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="sender" label="发送者" width="120" />
            <el-table-column prop="date" label="时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  size="small"
                  @click="markAsRead(row)"
                >
                  标为已读
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteNotification(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="已读通知" name="read">
          <el-table 
            :data="readNotifications" 
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column prop="content" label="内容">
              <template #default="{ row }">
                <div class="notification-content">{{ row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="sender" label="发送者" width="120" />
            <el-table-column prop="date" label="时间" width="180" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteNotification(row)"
                >
                  删除
                </el-button>
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
          :total="totalNotifications"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 发送通知对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="发送通知" 
      width="600px"
    >
      <el-form
        ref="notificationFormRef"
        :model="notificationForm"
        :rules="notificationRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="notificationForm.title" />
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="notificationForm.content" 
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        
        <el-form-item label="接收者" prop="recipients">
          <el-select 
            v-model="notificationForm.recipients" 
            multiple 
            placeholder="请选择接收者"
            style="width: 100%"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="紧急程度">
          <el-radio-group v-model="notificationForm.priority">
            <el-radio :label="1">普通</el-radio>
            <el-radio :label="2">重要</el-radio>
            <el-radio :label="3">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="sendNotification"
            :loading="sending"
          >
            发送
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      activeTab: "all",
      currentPage: 1,
      pageSize: 10,
      totalNotifications: 0,
      loading: false,
      sending: false,
      dialogVisible: false,
      notifications: [
        {
          id: 1,
          title: "系统维护通知",
          content: "系统将于今晚00:00-02:00进行例行维护，请提前做好相关准备。",
          sender: "系统管理员",
          date: "2023-05-15 14:30",
          read: false,
          priority: 3
        },
        {
          id: 2,
          title: "新功能上线",
          content: "我们新增了数据可视化功能，欢迎体验使用。",
          sender: "产品团队",
          date: "2023-05-14 09:15",
          read: true,
          priority: 1
        },
        {
          id: 3,
          title: "安全更新提醒",
          content: "检测到您的密码强度较弱，请及时修改以确保账户安全。",
          sender: "安全团队",
          date: "2023-05-12 16:45",
          read: false,
          priority: 2
        },
        {
          id: 4,
          title: "会议通知",
          content: "本周五下午3点将召开全体成员会议，请准时参加。",
          sender: "人事部",
          date: "2023-05-10 11:20",
          read: true,
          priority: 2
        },
        {
          id: 5,
          title: "系统升级完成",
          content: "系统v2.0版本已升级完成，新增多项功能和优化。",
          sender: "技术部",
          date: "2023-05-08 18:00",
          read: true,
          priority: 1
        }
      ],
      notificationForm: {
        title: "",
        content: "",
        recipients: [],
        priority: 1
      },
      notificationRules: {
        title: [
          { required: true, message: "请输入通知标题", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入通知内容", trigger: "blur" }
        ],
        recipients: [
          { required: true, message: "请选择接收者", trigger: "change" }
        ]
      },
      users: [
        { id: 1, name: "张三" },
        { id: 2, name: "李四" },
        { id: 3, name: "王五" },
        { id: 4, name: "赵六" },
        { id: 5, name: "钱七" }
      ]
    };
  },
  computed: {
    filteredNotifications() {
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.notifications.slice(start, end);
    },
    unreadNotifications() {
      return this.notifications.filter(n => !n.read);
    },
    readNotifications() {
      return this.notifications.filter(n => n.read);
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
    markAsRead(notification) {
      const index = this.notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.notifications[index].read = true;
        this.$message.success("已标记为已读");
      }
    },
    deleteNotification(notification) {
      this.$confirm(`确定要删除通知"${notification.title}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          this.notifications.splice(index, 1);
          this.totalNotifications = this.notifications.length;
          this.$message.success("删除成功");
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    showCreateDialog() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.notificationFormRef.resetFields();
      });
    },
    sendNotification() {
      this.$refs.notificationFormRef.validate((valid) => {
        if (valid) {
          this.sending = true;
          
          // 模拟发送过程
          setTimeout(() => {
            const newNotification = {
              id: this.notifications.length + 1,
              ...this.notificationForm,
              sender: "当前用户",
              date: new Date().toLocaleString(),
              read: false
            };
            
            this.notifications.unshift(newNotification);
            this.totalNotifications = this.notifications.length;
            this.dialogVisible = false;
            this.sending = false;
            this.$message.success("通知发送成功");
          }, 1000);
        }
      });
    },
    refreshNotifications() {
      this.loading = true;
      // 模拟刷新过程
      setTimeout(() => {
        this.loading = false;
        this.$message.success("刷新成功");
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.notification-container {
  padding: 20px;
  
  .card-header {
    font-weight: bold;
  }
  
  .notification-content {
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