<template>
  <div class="customer-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>客户管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索客户..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddCustomerDialog">添加客户</el-button>
          </div>
        </div>
      </template>
      
      <el-table 
        :data="filteredCustomers" 
        style="width: 100%"
        row-key="id"
        v-loading="loading"
      >
        <el-table-column prop="name" label="客户名称" min-width="150">
          <template #default="{ row }">
            <div class="customer-name">
              <el-avatar :size="32" :style="{ backgroundColor: getAvatarColor(row.name) }">
                {{ row.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <span style="margin-left: 10px">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column label="客户等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">
              {{ getLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="viewCustomer(row)">查看</el-button>
            <el-button type="text" @click="editCustomer(row)">编辑</el-button>
            <el-button type="text" @click="deleteCustomer(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCustomers"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑客户对话框 -->
    <el-dialog 
      v-model="customerDialogVisible" 
      :title="editingCustomer ? '编辑客户' : '添加客户'"
      width="600px"
    >
      <el-form
        ref="customerFormRef"
        :model="customerForm"
        :rules="customerRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="customerForm.name" />
            </el-form-item>
            
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="customerForm.contact" />
            </el-form-item>
            
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="customerForm.phone" />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="customerForm.email" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="客户等级" prop="level">
              <el-select v-model="customerForm.level" placeholder="请选择客户等级" style="width: 100%">
                <el-option label="普通客户" value="normal"></el-option>
                <el-option label="重要客户" value="important"></el-option>
                <el-option label="VIP客户" value="vip"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="所在地区" prop="region">
              <el-cascader
                v-model="customerForm.region"
                :options="regionOptions"
                :props="{ expandTrigger: 'hover' }"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="详细地址" prop="address">
              <el-input 
                v-model="customerForm.address" 
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="customerDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveCustomer"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 客户详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="客户详情"
      width="800px"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="客户名称">{{ detailCustomer.name }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ detailCustomer.contact }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ detailCustomer.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ detailCustomer.email }}</el-descriptions-item>
            <el-descriptions-item label="客户等级">
              <el-tag :type="getLevelType(detailCustomer.level)">
                {{ getLevelText(detailCustomer.level) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="所在地区">{{ getRegionText(detailCustomer.region) }}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{ detailCustomer.address }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detailCustomer.createTime }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div class="customer-avatar-detail" :style="{ backgroundColor: getAvatarColor(detailCustomer.name) }">
            {{ detailCustomer.name.charAt(0).toUpperCase() }}
          </div>
        </el-col>
      </el-row>
      
      <el-tabs v-model="activeTab" style="margin-top: 20px">
        <el-tab-pane label="交易记录" name="transactions">
          <el-table :data="customerTransactions" style="width: 100%">
            <el-table-column prop="id" label="订单号" width="120" />
            <el-table-column prop="product" label="产品" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ¥{{ row.amount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getTransactionStatusType(row.status)">
                  {{ getTransactionStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="交易时间" width="180" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="联系记录" name="contacts">
          <el-table :data="customerContacts" style="width: 100%">
            <el-table-column prop="contactPerson" label="联系人" width="120" />
            <el-table-column prop="method" label="联系方式" width="120" />
            <el-table-column prop="content" label="联系内容" />
            <el-table-column prop="date" label="联系时间" width="180" />
          </el-table>
          
          <div style="margin-top: 20px; text-align: center">
            <el-button type="primary" @click="showAddContactDialog">添加联系记录</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editCustomer(detailCustomer)">编辑</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加联系记录对话框 -->
    <el-dialog 
      v-model="contactDialogVisible" 
      title="添加联系记录"
      width="500px"
    >
      <el-form
        ref="contactFormRef"
        :model="contactForm"
        :rules="contactRules"
        label-width="80px"
      >
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="contactForm.contactPerson" />
        </el-form-item>
        
        <el-form-item label="联系方式" prop="method">
          <el-select v-model="contactForm.method" placeholder="请选择联系方式" style="width: 100%">
            <el-option label="电话" value="电话"></el-option>
            <el-option label="邮件" value="邮件"></el-option>
            <el-option label="面谈" value="面谈"></el-option>
            <el-option label="微信" value="微信"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="联系内容" prop="content">
          <el-input 
            v-model="contactForm.content" 
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="contactDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveContact"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "Customer",
  components: {
    Search
  },
  data() {
    return {
      searchText: "",
      currentPage: 1,
      pageSize: 10,
      totalCustomers: 0,
      loading: false,
      customerDialogVisible: false,
      detailDialogVisible: false,
      contactDialogVisible: false,
      activeTab: "transactions",
      editingCustomer: null,
      customers: [
        {
          id: 1,
          name: "阿里巴巴集团",
          contact: "张伟",
          phone: "010-12345678",
          email: "zhangwei@alibaba.com",
          level: "vip",
          region: ["北京市", "北京市", "朝阳区"],
          address: "北京市朝阳区某某大厦101室",
          createTime: "2023-01-15 10:30:00"
        },
        {
          id: 2,
          name: "腾讯科技",
          contact: "李娜",
          phone: "0755-87654321",
          email: "lina@tencent.com",
          level: "important",
          region: ["广东省", "深圳市", "南山区"],
          address: "深圳市南山区科技园南路1001号",
          createTime: "2023-02-20 14:45:00"
        },
        {
          id: 3,
          name: "百度在线",
          contact: "王强",
          phone: "010-88886666",
          email: "wangqiang@baidu.com",
          level: "important",
          region: ["北京市", "北京市", "海淀区"],
          address: "北京市海淀区上地十街10号",
          createTime: "2023-03-10 09:15:00"
        },
        {
          id: 4,
          name: "字节跳动",
          contact: "赵敏",
          phone: "010-56891234",
          email: "zhaomin@bytedance.com",
          level: "vip",
          region: ["北京市", "北京市", "海淀区"],
          address: "北京市海淀区知春路甲48号",
          createTime: "2023-04-05 16:20:00"
        },
        {
          id: 5,
          name: "京东商城",
          contact: "孙丽",
          phone: "010-95068888",
          email: "sunli@jd.com",
          level: "important",
          region: ["北京市", "北京市", "大兴区"],
          address: "北京市大兴区亦庄经济技术开发区科创十一街18号",
          createTime: "2023-05-12 11:30:00"
        }
      ],
      regionOptions: [
        {
          value: "北京市",
          label: "北京市",
          children: [
            {
              value: "北京市",
              label: "北京市",
              children: [
                { value: "东城区", label: "东城区" },
                { value: "西城区", label: "西城区" },
                { value: "朝阳区", label: "朝阳区" },
                { value: "海淀区", label: "海淀区" },
                { value: "大兴区", label: "大兴区" }
              ]
            }
          ]
        },
        {
          value: "广东省",
          label: "广东省",
          children: [
            {
              value: "深圳市",
              label: "深圳市",
              children: [
                { value: "南山区", label: "南山区" },
                { value: "福田区", label: "福田区" },
                { value: "宝安区", label: "宝安区" }
              ]
            },
            {
              value: "广州市",
              label: "广州市",
              children: [
                { value: "天河区", label: "天河区" },
                { value: "越秀区", label: "越秀区" }
              ]
            }
          ]
        }
      ],
      customerForm: {
        name: "",
        contact: "",
        phone: "",
        email: "",
        level: "normal",
        region: [],
        address: ""
      },
      detailCustomer: {},
      contactForm: {
        contactPerson: "",
        method: "电话",
        content: ""
      },
      customerRules: {
        name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择客户等级", trigger: "change" }
        ],
        region: [
          { required: true, message: "请选择所在地区", trigger: "change" }
        ]
      },
      contactRules: {
        contactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        method: [
          { required: true, message: "请选择联系方式", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入联系内容", trigger: "blur" }
        ]
      },
      customerTransactions: [
        {
          id: "T202305001",
          product: "企业级软件服务",
          amount: 50000,
          status: "completed",
          date: "2023-05-01 14:30:00"
        },
        {
          id: "T202304015",
          product: "云服务器租赁",
          amount: 12000,
          status: "completed",
          date: "2023-04-15 10:15:00"
        }
      ],
      customerContacts: [
        {
          contactPerson: "张伟",
          method: "电话",
          content: "确认合同细节，对方表示满意",
          date: "2023-05-10 16:00:00"
        },
        {
          contactPerson: "李娜",
          method: "邮件",
          content: "发送产品资料和报价单",
          date: "2023-05-08 09:30:00"
        }
      ]
    };
  },
  computed: {
    filteredCustomers() {
      let result = this.customers;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(customer => 
          customer.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          customer.contact.toLowerCase().includes(this.searchText.toLowerCase()) ||
          customer.phone.includes(this.searchText) ||
          customer.email.toLowerCase().includes(this.searchText.toLowerCase())
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
    getLevelText(level) {
      const levelMap = {
        "normal": "普通客户",
        "important": "重要客户",
        "vip": "VIP客户"
      };
      return levelMap[level] || level;
    },
    getLevelType(level) {
      const typeMap = {
        "normal": "info",
        "important": "warning",
        "vip": "success"
      };
      return typeMap[level] || "info";
    },
    getTransactionStatusText(status) {
      const statusMap = {
        "pending": "待处理",
        "processing": "处理中",
        "completed": "已完成",
        "cancelled": "已取消"
      };
      return statusMap[status] || status;
    },
    getTransactionStatusType(status) {
      const typeMap = {
        "pending": "info",
        "processing": "warning",
        "completed": "success",
        "cancelled": "danger"
      };
      return typeMap[status] || "info";
    },
    getRegionText(region) {
      return region ? region.join(" - ") : "";
    },
    getAvatarColor(name) {
      const colors = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399"];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
    showAddCustomerDialog() {
      this.editingCustomer = null;
      this.customerForm = {
        name: "",
        contact: "",
        phone: "",
        email: "",
        level: "normal",
        region: [],
        address: ""
      };
      this.customerDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.customerFormRef.resetFields();
      });
    },
    editCustomer(customer) {
      this.editingCustomer = customer;
      this.customerForm = { ...customer };
      this.customerDialogVisible = true;
      this.detailDialogVisible = false;
    },
    viewCustomer(customer) {
      this.detailCustomer = { ...customer };
      this.detailDialogVisible = true;
    },
    deleteCustomer(customer) {
      this.$confirm(`确定要删除客户"${customer.name}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.customers.findIndex(c => c.id === customer.id);
        if (index !== -1) {
          this.customers.splice(index, 1);
          this.totalCustomers = this.customers.length;
          this.$message.success("客户删除成功");
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    saveCustomer() {
      this.$refs.customerFormRef.validate((valid) => {
        if (valid) {
          if (this.editingCustomer) {
            // 编辑客户
            const index = this.customers.findIndex(c => c.id === this.editingCustomer.id);
            if (index !== -1) {
              this.customers[index] = { ...this.editingCustomer, ...this.customerForm };
              this.$message.success("客户信息更新成功");
            }
          } else {
            // 添加客户
            const newCustomer = {
              id: Date.now(),
              createTime: new Date().toLocaleString(),
              ...this.customerForm
            };
            this.customers.push(newCustomer);
            this.totalCustomers = this.customers.length;
            this.$message.success("客户添加成功");
          }
          this.customerDialogVisible = false;
        }
      });
    },
    showAddContactDialog() {
      this.contactForm = {
        contactPerson: "",
        method: "电话",
        content: ""
      };
      this.contactDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.contactFormRef.resetFields();
      });
    },
    saveContact() {
      this.$refs.contactFormRef.validate((valid) => {
        if (valid) {
          this.customerContacts.unshift({
            ...this.contactForm,
            date: new Date().toLocaleString()
          });
          this.$message.success("联系记录添加成功");
          this.contactDialogVisible = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.customer-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .customer-name {
    display: flex;
    align-items: center;
  }
  
  .customer-avatar-detail {
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