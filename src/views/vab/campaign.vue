<template>
  <div class="campaign-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>营销活动</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索活动..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddCampaignDialog">创建活动</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="所有活动" name="all">
          <el-table 
            :data="filteredCampaigns" 
            style="width: 100%"
            row-key="id"
            v-loading="loading"
          >
            <el-table-column prop="name" label="活动名称" min-width="200">
              <template #default="{ row }">
                <div class="campaign-name">
                  <el-avatar :size="32" :style="{ backgroundColor: getCampaignColor(row.type) }">
                    <el-icon><component :is="getCampaignIcon(row.type)" /></el-icon>
                  </el-avatar>
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="活动类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getCampaignType(row.type)">
                  {{ getCampaignText(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" min-width="200">
              <template #default="{ row }">
                <div>{{ row.startTime }} 至 {{ row.endTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="参与人数" width="100">
              <template #default="{ row }">
                {{ row.participants }}
              </template>
            </el-table-column>
            <el-table-column label="转化率" width="100">
              <template #default="{ row }">
                {{ row.conversionRate }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="text" @click="viewCampaign(row)">查看</el-button>
                <el-button type="text" @click="editCampaign(row)">编辑</el-button>
                <el-button 
                  v-if="row.status === 'draft' || row.status === 'pending'" 
                  type="text" 
                  @click="startCampaign(row)"
                >
                  启动
                </el-button>
                <el-button 
                  v-if="row.status === 'active'" 
                  type="text" 
                  @click="stopCampaign(row)"
                >
                  停止
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="进行中" name="active">
          <el-table 
            :data="activeCampaigns" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="活动名称" min-width="200">
              <template #default="{ row }">
                <div class="campaign-name">
                  <el-avatar :size="32" :style="{ backgroundColor: getCampaignColor(row.type) }">
                    <el-icon><component :is="getCampaignIcon(row.type)" /></el-icon>
                  </el-avatar>
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="活动类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getCampaignType(row.type)">
                  {{ getCampaignText(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" min-width="200">
              <template #default="{ row }">
                <div>{{ row.startTime }} 至 {{ row.endTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="参与人数" width="100">
              <template #default="{ row }">
                {{ row.participants }}
              </template>
            </el-table-column>
            <el-table-column label="转化率" width="100">
              <template #default="{ row }">
                {{ row.conversionRate }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="viewCampaign(row)">查看</el-button>
                <el-button type="text" @click="stopCampaign(row)">停止</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="已结束" name="ended">
          <el-table 
            :data="endedCampaigns" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="活动名称" min-width="200">
              <template #default="{ row }">
                <div class="campaign-name">
                  <el-avatar :size="32" :style="{ backgroundColor: getCampaignColor(row.type) }">
                    <el-icon><component :is="getCampaignIcon(row.type)" /></el-icon>
                  </el-avatar>
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="活动类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getCampaignType(row.type)">
                  {{ getCampaignText(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" min-width="200">
              <template #default="{ row }">
                <div>{{ row.startTime }} 至 {{ row.endTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="参与人数" width="100">
              <template #default="{ row }">
                {{ row.participants }}
              </template>
            </el-table-column>
            <el-table-column label="转化率" width="100">
              <template #default="{ row }">
                {{ row.conversionRate }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="text" @click="viewCampaign(row)">查看</el-button>
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
          :total="totalCampaigns"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 创建/编辑活动对话框 -->
    <el-dialog 
      v-model="campaignDialogVisible" 
      :title="editingCampaign ? '编辑活动' : '创建活动'"
      width="800px"
    >
      <el-form
        ref="campaignFormRef"
        :model="campaignForm"
        :rules="campaignRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="campaignForm.name" />
            </el-form-item>
            
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="campaignForm.type" placeholder="请选择活动类型" style="width: 100%">
                <el-option label="折扣活动" value="discount">
                  <el-icon><Discount /></el-icon>
                  <span style="margin-left: 10px">折扣活动</span>
                </el-option>
                <el-option label="满减活动" value="reduction">
                  <el-icon><Coin /></el-icon>
                  <span style="margin-left: 10px">满减活动</span>
                </el-option>
                <el-option label="赠品活动" value="gift">
                  <el-icon><Present /></el-icon>
                  <span style="margin-left: 10px">赠品活动</span>
                </el-option>
                <el-option label="秒杀活动" value="seckill">
                  <el-icon><Lightning /></el-icon>
                  <span style="margin-left: 10px">秒杀活动</span>
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="活动时间" prop="timeRange">
              <el-date-picker
                v-model="campaignForm.timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="目标用户" prop="targetUsers">
              <el-select 
                v-model="campaignForm.targetUsers" 
                multiple 
                placeholder="请选择目标用户"
                style="width: 100%"
              >
                <el-option label="所有用户" value="all"></el-option>
                <el-option label="新用户" value="new"></el-option>
                <el-option label="老用户" value="old"></el-option>
                <el-option label="VIP用户" value="vip"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item 
              v-if="campaignForm.type === 'discount'" 
              label="折扣率" 
              prop="discountRate"
            >
              <el-input-number 
                v-model="campaignForm.discountRate" 
                :min="0"
                :max="100"
                controls-position="right"
                style="width: 100%"
              >
                <template #append>%</template>
              </el-input-number>
            </el-form-item>
            
            <el-form-item 
              v-if="campaignForm.type === 'reduction'" 
              label="满减条件" 
              prop="reductionCondition"
            >
              <el-input v-model="campaignForm.reductionCondition" placeholder="例如：满300减50">
                <template #prepend>满</template>
                <template #append>元减</template>
              </el-input>
            </el-form-item>
            
            <el-form-item 
              v-if="campaignForm.type === 'gift'" 
              label="赠品" 
              prop="gift"
            >
              <el-input v-model="campaignForm.gift" placeholder="请输入赠品信息" />
            </el-form-item>
            
            <el-form-item 
              v-if="campaignForm.type === 'seckill'" 
              label="秒杀价" 
              prop="seckillPrice"
            >
              <el-input-number 
                v-model="campaignForm.seckillPrice" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input-number>
            </el-form-item>
            
            <el-form-item label="适用商品">
              <el-select 
                v-model="campaignForm.products" 
                multiple 
                filterable 
                remote 
                :remote-method="searchProducts"
                :loading="searchingProducts"
                placeholder="请选择适用商品"
                style="width: 100%"
              >
                <el-option
                  v-for="product in availableProducts"
                  :key="product.id"
                  :label="product.name"
                  :value="product.id"
                >
                  <span style="float: left">{{ product.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    ¥{{ product.price }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="活动预算" prop="budget">
              <el-input-number 
                v-model="campaignForm.budget" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="campaignDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveCampaign"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 活动详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="活动详情"
      width="1000px"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="活动名称">{{ detailCampaign.name }}</el-descriptions-item>
            <el-descriptions-item label="活动类型">
              <el-tag :type="getCampaignType(detailCampaign.type)">
                {{ getCampaignText(detailCampaign.type) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="活动时间">
              {{ detailCampaign.startTime }} 至 {{ detailCampaign.endTime }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(detailCampaign.status)">
                {{ getStatusText(detailCampaign.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="目标用户">{{ getTargetUsersText(detailCampaign.targetUsers) }}</el-descriptions-item>
            <el-descriptions-item label="活动规则">{{ getCampaignRule(detailCampaign) }}</el-descriptions-item>
            <el-descriptions-item label="活动预算">¥{{ detailCampaign.budget }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detailCampaign.createTime }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div class="campaign-icon-detail" :style="{ backgroundColor: getCampaignColor(detailCampaign.type) }">
            <el-icon :size="60"><component :is="getCampaignIcon(detailCampaign.type)" /></el-icon>
          </div>
        </el-col>
      </el-row>
      
      <el-tabs v-model="campaignActiveTab" style="margin-top: 20px">
        <el-tab-pane label="数据统计" name="statistics">
          <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :span="6">
              <el-card class="stat-card" shadow="never">
                <div class="stat-title">参与人数</div>
                <div class="stat-value">{{ detailCampaign.participants }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card" shadow="never">
                <div class="stat-title">订单数量</div>
                <div class="stat-value">{{ detailCampaign.orders }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card" shadow="never">
                <div class="stat-title">销售额</div>
                <div class="stat-value">¥{{ detailCampaign.sales }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card" shadow="never">
                <div class="stat-title">转化率</div>
                <div class="stat-value">{{ detailCampaign.conversionRate }}%</div>
              </el-card>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="never">
                <div ref="conversionChart" style="height: 300px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never">
                <div ref="salesChart" style="height: 300px"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="参与用户" name="participants">
          <el-table :data="campaignParticipants" style="width: 100%">
            <el-table-column prop="id" label="用户ID" width="100" />
            <el-table-column prop="name" label="用户名" width="150" />
            <el-table-column prop="phone" label="手机号" width="150" />
            <el-table-column prop="orderTime" label="下单时间" width="180" />
            <el-table-column prop="orderAmount" label="订单金额" width="120">
              <template #default="{ row }">
                ¥{{ row.orderAmount }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button 
            v-if="detailCampaign.status === 'draft' || detailCampaign.status === 'pending'" 
            type="primary" 
            @click="startCampaign(detailCampaign)"
          >
            启动活动
          </el-button>
          <el-button 
            v-if="detailCampaign.status === 'active'" 
            type="danger" 
            @click="stopCampaign(detailCampaign)"
          >
            停止活动
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Discount, Coin, Present, Lightning } from "@element-plus/icons-vue";
import * as echarts from "echarts";

export default {
  name: "Campaign",
  components: {
    Search,
    Discount,
    Coin,
    Present,
    Lightning
  },
  data() {
    return {
      activeTab: "all",
      campaignActiveTab: "statistics",
      searchText: "",
      currentPage: 1,
      pageSize: 10,
      totalCampaigns: 0,
      loading: false,
      searchingProducts: false,
      campaignDialogVisible: false,
      detailDialogVisible: false,
      editingCampaign: null,
      campaigns: [
        {
          id: 1,
          name: "618年中大促",
          type: "discount",
          startTime: "2023-06-01 00:00",
          endTime: "2023-06-18 23:59",
          status: "active",
          targetUsers: ["all"],
          discountRate: 80,
          participants: 1256,
          orders: 342,
          sales: 128500,
          conversionRate: 27.3,
          budget: 50000,
          createTime: "2023-05-15 10:30:00"
        },
        {
          id: 2,
          name: "新品首发优惠",
          type: "reduction",
          startTime: "2023-05-20 00:00",
          endTime: "2023-05-27 23:59",
          status: "ended",
          targetUsers: ["new"],
          reductionCondition: "满200减30",
          participants: 865,
          orders: 210,
          sales: 65420,
          conversionRate: 24.3,
          budget: 20000,
          createTime: "2023-05-10 14:45:00"
        },
        {
          id: 3,
          name: "会员专享秒杀",
          type: "seckill",
          startTime: "2023-05-25 10:00",
          endTime: "2023-05-25 12:00",
          status: "pending",
          targetUsers: ["vip"],
          seckillPrice: 1999,
          participants: 0,
          orders: 0,
          sales: 0,
          conversionRate: 0,
          budget: 10000,
          createTime: "2023-05-20 09:15:00"
        },
        {
          id: 4,
          name: "开学季赠品活动",
          type: "gift",
          startTime: "2023-08-20 00:00",
          endTime: "2023-09-10 23:59",
          status: "draft",
          targetUsers: ["all"],
          gift: "购买指定商品即赠精美书签一套",
          participants: 0,
          orders: 0,
          sales: 0,
          conversionRate: 0,
          budget: 5000,
          createTime: "2023-05-25 16:20:00"
        }
      ],
      campaignForm: {
        name: "",
        type: "discount",
        timeRange: [],
        targetUsers: [],
        discountRate: 90,
        reductionCondition: "",
        gift: "",
        seckillPrice: 0,
        products: [],
        budget: 0
      },
      detailCampaign: {},
      availableProducts: [
        { id: 1, name: "iPhone 14 Pro", price: 7999 },
        { id: 2, name: "MacBook Pro 14英寸", price: 15999 },
        { id: 3, name: "AirPods Pro", price: 1899 },
        { id: 4, name: "iPad Air", price: 4399 },
        { id: 5, name: "Apple Watch Series 8", price: 2999 }
      ],
      campaignRules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择活动类型", trigger: "change" }
        ],
        timeRange: [
          { required: true, message: "请选择活动时间", trigger: "change" }
        ],
        targetUsers: [
          { required: true, message: "请选择目标用户", trigger: "change" }
        ],
        budget: [
          { required: true, message: "请输入活动预算", trigger: "blur" }
        ]
      },
      campaignParticipants: [
        {
          id: "U1001",
          name: "张三",
          phone: "138****8001",
          orderTime: "2023-06-01 10:30:00",
          orderAmount: 7999
        },
        {
          id: "U1002",
          name: "李四",
          phone: "138****8002",
          orderTime: "2023-06-01 14:45:00",
          orderAmount: 15998
        }
      ],
      conversionChart: null,
      salesChart: null
    };
  },
  computed: {
    filteredCampaigns() {
      let result = this.campaigns;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(campaign => 
          campaign.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    },
    activeCampaigns() {
      return this.campaigns.filter(campaign => campaign.status === "active");
    },
    endedCampaigns() {
      return this.campaigns.filter(campaign => campaign.status === "ended");
    }
  },
  mounted() {
    // 初始化图表
    this.initCharts();
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.conversionChart) this.conversionChart.dispose();
    if (this.salesChart) this.salesChart.dispose();
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
    getCampaignText(type) {
      const typeMap = {
        "discount": "折扣活动",
        "reduction": "满减活动",
        "gift": "赠品活动",
        "seckill": "秒杀活动"
      };
      return typeMap[type] || type;
    },
    getCampaignType(type) {
      const typeMap = {
        "discount": "primary",
        "reduction": "success",
        "gift": "warning",
        "seckill": "danger"
      };
      return typeMap[type] || "info";
    },
    getCampaignIcon(type) {
      const iconMap = {
        "discount": "Discount",
        "reduction": "Coin",
        "gift": "Present",
        "seckill": "Lightning"
      };
      return iconMap[type] || "Discount";
    },
    getCampaignColor(type) {
      const colorMap = {
        "discount": "#409EFF",
        "reduction": "#67C23A",
        "gift": "#E6A23C",
        "seckill": "#F56C6C"
      };
      return colorMap[type] || "#909399";
    },
    getStatusText(status) {
      const statusMap = {
        "draft": "草稿",
        "pending": "待启动",
        "active": "进行中",
        "ended": "已结束"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "draft": "info",
        "pending": "warning",
        "active": "success",
        "ended": ""
      };
      return typeMap[status] || "info";
    },
    getTargetUsersText(targetUsers) {
      const textMap = {
        "all": "所有用户",
        "new": "新用户",
        "old": "老用户",
        "vip": "VIP用户"
      };
      
      if (!targetUsers || targetUsers.length === 0) return "未设置";
      
      return targetUsers.map(user => textMap[user] || user).join("、");
    },
    getCampaignRule(campaign) {
      switch (campaign.type) {
        case "discount":
          return `全场${campaign.discountRate}折`;
        case "reduction":
          return campaign.reductionCondition;
        case "gift":
          return campaign.gift;
        case "seckill":
          return `秒杀价¥${campaign.seckillPrice}`;
        default:
          return "未设置";
      }
    },
    showAddCampaignDialog() {
      this.editingCampaign = null;
      this.campaignForm = {
        name: "",
        type: "discount",
        timeRange: [],
        targetUsers: [],
        discountRate: 90,
        reductionCondition: "",
        gift: "",
        seckillPrice: 0,
        products: [],
        budget: 0
      };
      this.campaignDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.campaignFormRef.resetFields();
      });
    },
    editCampaign(campaign) {
      this.editingCampaign = campaign;
      this.campaignForm = {
        name: campaign.name,
        type: campaign.type,
        timeRange: [campaign.startTime, campaign.endTime],
        targetUsers: campaign.targetUsers,
        discountRate: campaign.discountRate || 90,
        reductionCondition: campaign.reductionCondition || "",
        gift: campaign.gift || "",
        seckillPrice: campaign.seckillPrice || 0,
        products: campaign.products || [],
        budget: campaign.budget
      };
      this.campaignDialogVisible = true;
    },
    viewCampaign(campaign) {
      this.detailCampaign = { ...campaign };
      this.detailDialogVisible = true;
      this.$nextTick(() => {
        this.updateCharts();
      });
    },
    startCampaign(campaign) {
      this.$confirm(`确定要启动活动"${campaign.name}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.campaigns.findIndex(c => c.id === campaign.id);
        if (index !== -1) {
          this.campaigns[index].status = "active";
          this.$message.success("活动已启动");
          
          // 如果在详情对话框中操作，更新详情活动状态
          if (this.detailCampaign.id === campaign.id) {
            this.detailCampaign.status = "active";
          }
        }
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
    stopCampaign(campaign) {
      this.$confirm(`确定要停止活动"${campaign.name}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.campaigns.findIndex(c => c.id === campaign.id);
        if (index !== -1) {
          this.campaigns[index].status = "ended";
          this.$message.success("活动已停止");
          
          // 如果在详情对话框中操作，更新详情活动状态
          if (this.detailCampaign.id === campaign.id) {
            this.detailCampaign.status = "ended";
          }
        }
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
    saveCampaign() {
      this.$refs.campaignFormRef.validate((valid) => {
        if (valid) {
          if (this.editingCampaign) {
            // 编辑活动
            const index = this.campaigns.findIndex(c => c.id === this.editingCampaign.id);
            if (index !== -1) {
              this.campaigns[index] = {
                ...this.editingCampaign,
                ...this.campaignForm,
                startTime: this.campaignForm.timeRange[0],
                endTime: this.campaignForm.timeRange[1],
                status: "draft"
              };
              this.$message.success("活动更新成功");
            }
          } else {
            // 创建活动
            const newCampaign = {
              id: Date.now(),
              createTime: new Date().toLocaleString(),
              status: "draft",
              participants: 0,
              orders: 0,
              sales: 0,
              conversionRate: 0,
              ...this.campaignForm,
              startTime: this.campaignForm.timeRange[0],
              endTime: this.campaignForm.timeRange[1]
            };
            this.campaigns.push(newCampaign);
            this.totalCampaigns = this.campaigns.length;
            this.$message.success("活动创建成功");
          }
          this.campaignDialogVisible = false;
        }
      });
    },
    searchProducts(query) {
      if (query !== '') {
        this.searchingProducts = true;
        setTimeout(() => {
          this.searchingProducts = false;
        }, 200);
      } else {
        this.availableProducts = [];
      }
    },
    initCharts() {
      // 转化率图表
      this.conversionChart = echarts.init(this.$refs.conversionChart);
      this.conversionChart.setOption(this.getConversionChartOption());
      
      // 销售额图表
      this.salesChart = echarts.init(this.$refs.salesChart);
      this.salesChart.setOption(this.getSalesChartOption());
    },
    updateCharts() {
      if (this.conversionChart) {
        this.conversionChart.setOption(this.getConversionChartOption());
      }
      if (this.salesChart) {
        this.salesChart.setOption(this.getSalesChartOption());
      }
    },
    getConversionChartOption() {
      return {
        title: {
          text: '转化率趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [20, 25, 28, 30, 27, 32, 27.3],
            type: 'line',
            smooth: true
          }
        ]
      };
    },
    getSalesChartOption() {
      return {
        title: {
          text: '销售额趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [15000, 22000, 28000, 32000, 29000, 35000, 32000],
            type: 'line',
            smooth: true
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.campaign-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .campaign-name {
    display: flex;
    align-items: center;
  }
  
  .campaign-icon-detail {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto;
  }
  
  .stat-card {
    text-align: center;
    
    .stat-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>