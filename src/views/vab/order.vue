<template>
  <div class="order-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索订单..."
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
              <el-option label="待付款" value="pending"></el-option>
              <el-option label="待发货" value="paid"></el-option>
              <el-option label="已发货" value="shipped"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="已取消" value="cancelled"></el-option>
            </el-select>
            <el-button type="primary" @click="exportOrders">导出订单</el-button>
          </div>
        </div>
      </template>
      
      <el-table 
        :data="filteredOrders" 
        style="width: 100%"
        row-key="id"
        v-loading="loading"
      >
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="products" label="商品" min-width="250">
          <template #default="{ row }">
            <div 
              v-for="product in row.products" 
              :key="product.id"
              class="order-product"
            >
              <el-image 
                :src="product.image" 
                fit="cover" 
                style="width: 40px; height: 40px; border-radius: 4px; margin-right: 10px"
              />
              <div class="product-info">
                <div>{{ product.name }}</div>
                <div class="product-meta">
                  <span>¥{{ product.price }} × {{ product.quantity }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="viewOrder(row)">查看</el-button>
            <el-button 
              v-if="row.status === 'paid'" 
              type="text" 
              @click="shipOrder(row)"
            >
              发货
            </el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              type="text" 
              @click="cancelOrder(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalOrders"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 订单详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="订单详情"
      width="800px"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="订单号">{{ detailOrder.id }}</el-descriptions-item>
            <el-descriptions-item label="客户">{{ detailOrder.customer }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ detailOrder.phone }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">{{ detailOrder.address }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(detailOrder.status)">
                {{ getStatusText(detailOrder.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ detailOrder.createTime }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ detailOrder.payTime }}</el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ detailOrder.shipTime }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div class="order-amount">
            <div class="amount-label">订单总额</div>
            <div class="amount-value">¥{{ detailOrder.totalAmount?.toLocaleString() }}</div>
          </div>
        </el-col>
      </el-row>
      
      <el-divider>商品信息</el-divider>
      
      <el-table :data="detailOrder.products" style="width: 100%">
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            <div class="product-cell">
              <el-image 
                :src="row.image" 
                fit="cover" 
                style="width: 60px; height: 60px; border-radius: 4px; margin-right: 10px"
              />
              <div>
                <div>{{ row.name }}</div>
                <div class="product-spec">{{ row.spec }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="subtotal" label="小计" width="100">
          <template #default="{ row }">
            ¥{{ row.subtotal }}
          </template>
        </el-table-column>
      </el-table>
      
      <el-divider>物流信息</el-divider>
      
      <el-steps :active="getLogisticsStep(detailOrder.status)" finish-status="success" simple>
        <el-step title="已下单" :description="detailOrder.createTime" />
        <el-step title="已付款" :description="detailOrder.payTime" />
        <el-step title="已发货" :description="detailOrder.shipTime" />
        <el-step title="已完成" />
      </el-steps>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button 
            v-if="detailOrder.status === 'paid'" 
            type="primary" 
            @click="shipOrder(detailOrder)"
          >
            立即发货
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "Order",
  components: {
    Search
  },
  data() {
    return {
      searchText: "",
      filterStatus: "",
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      loading: false,
      detailDialogVisible: false,
      orders: [
        {
          id: "SO202305001",
          customer: "张三",
          phone: "13800138001",
          address: "北京市朝阳区某某大厦101室",
          totalAmount: 15998,
          status: "shipped",
          createTime: "2023-05-01 14:30:00",
          payTime: "2023-05-01 14:35:00",
          shipTime: "2023-05-02 09:15:00",
          products: [
            {
              id: 1,
              name: "iPhone 14 Pro",
              spec: "128GB 深空黑",
              price: 7999,
              quantity: 2,
              subtotal: 15998,
              image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            }
          ]
        },
        {
          id: "SO202305002",
          customer: "李四",
          phone: "13800138002",
          address: "上海市浦东新区某某路1001号",
          totalAmount: 7999,
          status: "paid",
          createTime: "2023-05-03 10:15:00",
          payTime: "2023-05-03 10:20:00",
          products: [
            {
              id: 1,
              name: "iPhone 14 Pro",
              spec: "128GB 银色",
              price: 7999,
              quantity: 1,
              subtotal: 7999,
              image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            }
          ]
        },
        {
          id: "SO202305003",
          customer: "王五",
          phone: "13800138003",
          address: "广州市天河区某某广场201室",
          totalAmount: 2999,
          status: "pending",
          createTime: "2023-05-05 16:45:00",
          products: [
            {
              id: 5,
              name: "Apple Watch Series 8",
              spec: "45mm GPS版",
              price: 2999,
              quantity: 1,
              subtotal: 2999,
              image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            }
          ]
        },
        {
          id: "SO202304015",
          customer: "赵六",
          phone: "13800138004",
          address: "深圳市南山区科技园南路1001号",
          totalAmount: 1899,
          status: "completed",
          createTime: "2023-04-15 10:15:00",
          payTime: "2023-04-15 10:20:00",
          shipTime: "2023-04-16 14:30:00",
          completeTime: "2023-04-20 16:45:00",
          products: [
            {
              id: 3,
              name: "AirPods Pro",
              spec: "第二代",
              price: 1899,
              quantity: 1,
              subtotal: 1899,
              image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            }
          ]
        },
        {
          id: "SO202304010",
          customer: "孙七",
          phone: "13800138005",
          address: "杭州市西湖区某某路501室",
          totalAmount: 4399,
          status: "cancelled",
          createTime: "2023-04-10 09:30:00",
          cancelTime: "2023-04-10 10:15:00",
          products: [
            {
              id: 4,
              name: "iPad Air",
              spec: "64GB 深空灰",
              price: 4399,
              quantity: 1,
              subtotal: 4399,
              image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            }
          ]
        }
      ],
      detailOrder: {}
    };
  },
  computed: {
    filteredOrders() {
      let result = this.orders;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(order => 
          order.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
          order.customer.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 状态过滤
      if (this.filterStatus) {
        result = result.filter(order => order.status === this.filterStatus);
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
        "pending": "待付款",
        "paid": "待发货",
        "shipped": "已发货",
        "completed": "已完成",
        "cancelled": "已取消"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "pending": "info",
        "paid": "warning",
        "shipped": "",
        "completed": "success",
        "cancelled": "danger"
      };
      return typeMap[status] || "info";
    },
    getLogisticsStep(status) {
      const stepMap = {
        "pending": 0,
        "paid": 1,
        "shipped": 2,
        "completed": 3,
        "cancelled": 0
      };
      return stepMap[status] || 0;
    },
    viewOrder(order) {
      this.detailOrder = { ...order };
      this.detailDialogVisible = true;
    },
    shipOrder(order) {
      this.$confirm(`确定要为订单${order.id}发货吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index].status = "shipped";
          this.orders[index].shipTime = new Date().toLocaleString();
          this.$message.success("订单已发货");
          
          // 如果在详情对话框中操作，更新详情订单状态
          if (this.detailOrder.id === order.id) {
            this.detailOrder.status = "shipped";
            this.detailOrder.shipTime = this.orders[index].shipTime;
          }
        }
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
    cancelOrder(order) {
      this.$confirm(`确定要取消订单${order.id}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index].status = "cancelled";
          this.orders[index].cancelTime = new Date().toLocaleString();
          this.$message.success("订单已取消");
          
          // 如果在详情对话框中操作，更新详情订单状态
          if (this.detailOrder.id === order.id) {
            this.detailOrder.status = "cancelled";
            this.detailOrder.cancelTime = this.orders[index].cancelTime;
          }
        }
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
    exportOrders() {
      this.$message.success("订单导出成功");
    }
  }
};
</script>

<style lang="scss" scoped>
.order-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .order-product {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .product-info {
      .product-meta {
        font-size: 12px;
        color: #999;
        margin-top: 3px;
      }
    }
  }
  
  .order-amount {
    text-align: center;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 4px;
    
    .amount-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .amount-value {
      font-size: 24px;
      font-weight: bold;
      color: #fa541c;
    }
  }
  
  .product-cell {
    display: flex;
    align-items: center;
    
    .product-spec {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>