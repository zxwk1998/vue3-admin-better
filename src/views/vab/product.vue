<template>
  <div class="product-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>产品管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索产品..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="showAddProductDialog">添加产品</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="所有产品" name="all">
          <el-table 
            :data="filteredProducts" 
            style="width: 100%"
            row-key="id"
            v-loading="loading"
          >
            <el-table-column prop="name" label="产品名称" min-width="200">
              <template #default="{ row }">
                <div class="product-name">
                  <el-image 
                    :src="row.image" 
                    fit="cover" 
                    style="width: 40px; height: 40px; border-radius: 4px"
                  />
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="产品分类" width="120" />
            <el-table-column prop="brand" label="品牌" width="120" />
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="100">
              <template #default="{ row }">
                <el-tag :type="getStockType(row.stock)">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
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
                <el-button type="text" @click="viewProduct(row)">查看</el-button>
                <el-button type="text" @click="editProduct(row)">编辑</el-button>
                <el-button type="text" @click="deleteProduct(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="在售产品" name="onsale">
          <el-table 
            :data="onsaleProducts" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="产品名称" min-width="200">
              <template #default="{ row }">
                <div class="product-name">
                  <el-image 
                    :src="row.image" 
                    fit="cover" 
                    style="width: 40px; height: 40px; border-radius: 4px"
                  />
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="产品分类" width="120" />
            <el-table-column prop="brand" label="品牌" width="120" />
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="100">
              <template #default="{ row }">
                <el-tag :type="getStockType(row.stock)">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="viewProduct(row)">查看</el-button>
                <el-button type="text" @click="editProduct(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="缺货产品" name="outofstock">
          <el-table 
            :data="outOfStockProducts" 
            style="width: 100%"
            row-key="id"
          >
            <el-table-column prop="name" label="产品名称" min-width="200">
              <template #default="{ row }">
                <div class="product-name">
                  <el-image 
                    :src="row.image" 
                    fit="cover" 
                    style="width: 40px; height: 40px; border-radius: 4px"
                  />
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="产品分类" width="120" />
            <el-table-column prop="brand" label="品牌" width="120" />
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="100">
              <template #default="{ row }">
                <el-tag :type="getStockType(row.stock)">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="editProduct(row)">补货</el-button>
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
          :total="totalProducts"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑产品对话框 -->
    <el-dialog 
      v-model="productDialogVisible" 
      :title="editingProduct ? '编辑产品' : '添加产品'"
      width="800px"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="productForm.name" />
            </el-form-item>
            
            <el-form-item label="产品分类" prop="category">
              <el-select v-model="productForm.category" placeholder="请选择产品分类" style="width: 100%">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.name"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="productForm.brand" />
            </el-form-item>
            
            <el-form-item label="价格" prop="price">
              <el-input-number 
                v-model="productForm.price" 
                :min="0"
                :step="0.01"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="库存" prop="stock">
              <el-input-number 
                v-model="productForm.stock" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="状态" prop="status">
              <el-select v-model="productForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="在售" value="onsale"></el-option>
                <el-option label="下架" value="offsale"></el-option>
                <el-option label="缺货" value="outofstock"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="产品图片">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
              >
                <img 
                  v-if="productForm.image" 
                  :src="productForm.image" 
                  class="avatar" 
                  alt="Product Image"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            
            <el-form-item label="产品描述" prop="description">
              <el-input 
                v-model="productForm.description" 
                type="textarea"
                :rows="5"
                placeholder="请输入产品描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveProduct"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 产品详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="产品详情"
      width="800px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="product-image-detail">
            <el-image 
              :src="detailProduct.image" 
              fit="cover" 
              style="width: 100%; height: 300px; border-radius: 8px"
            />
          </div>
        </el-col>
        <el-col :span="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="产品名称">{{ detailProduct.name }}</el-descriptions-item>
            <el-descriptions-item label="产品分类">{{ detailProduct.category }}</el-descriptions-item>
            <el-descriptions-item label="品牌">{{ detailProduct.brand }}</el-descriptions-item>
            <el-descriptions-item label="价格">
              <span class="product-price">¥{{ detailProduct.price }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="库存">
              <el-tag :type="getStockType(detailProduct.stock)">
                {{ detailProduct.stock }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(detailProduct.status)">
                {{ getStatusText(detailProduct.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detailProduct.createTime }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
      
      <el-divider>产品描述</el-divider>
      
      <div class="product-description">
        {{ detailProduct.description }}
      </div>
      
      <el-tabs v-model="productActiveTab" style="margin-top: 20px">
        <el-tab-pane label="销售记录" name="sales">
          <el-table :data="productSales" style="width: 100%">
            <el-table-column prop="orderId" label="订单号" width="150" />
            <el-table-column prop="customer" label="客户" width="150" />
            <el-table-column prop="quantity" label="数量" width="100" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ¥{{ row.amount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="date" label="销售时间" width="180" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="评价" name="reviews">
          <el-table :data="productReviews" style="width: 100%">
            <el-table-column prop="customer" label="客户" width="150" />
            <el-table-column label="评分" width="120">
              <template #default="{ row }">
                <el-rate
                  v-model="row.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}分"
                />
              </template>
            </el-table-column>
            <el-table-column prop="content" label="评价内容" />
            <el-table-column prop="date" label="评价时间" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editProduct(detailProduct)">编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from "@element-plus/icons-vue";

export default {
  name: "Product",
  components: {
    Search,
    Plus
  },
  data() {
    return {
      activeTab: "all",
      productActiveTab: "sales",
      searchText: "",
      currentPage: 1,
      pageSize: 10,
      totalProducts: 0,
      loading: false,
      productDialogVisible: false,
      detailDialogVisible: false,
      editingProduct: null,
      products: [
        {
          id: 1,
          name: "iPhone 14 Pro",
          category: "手机",
          brand: "Apple",
          price: 7999.00,
          stock: 50,
          status: "onsale",
          image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "全新iPhone 14 Pro，配备A16仿生芯片，支持5G网络，拥有超瓷晶面板和全天候显示功能。",
          createTime: "2023-01-15 10:30:00"
        },
        {
          id: 2,
          name: "MacBook Pro 14英寸",
          category: "笔记本",
          brand: "Apple",
          price: 15999.00,
          stock: 20,
          status: "onsale",
          image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "搭载M2 Pro芯片的MacBook Pro，性能强劲，续航持久，适合专业用户使用。",
          createTime: "2023-02-20 14:45:00"
        },
        {
          id: 3,
          name: "AirPods Pro",
          category: "耳机",
          brand: "Apple",
          price: 1899.00,
          stock: 0,
          status: "outofstock",
          image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "主动降噪无线耳机，支持空间音频，提供卓越的音质体验。",
          createTime: "2023-03-10 09:15:00"
        },
        {
          id: 4,
          name: "iPad Air",
          category: "平板",
          brand: "Apple",
          price: 4399.00,
          stock: 30,
          status: "onsale",
          image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "轻薄便携的iPad Air，配备绚丽的Liquid Retina显示屏和A14仿生芯片。",
          createTime: "2023-04-05 16:20:00"
        },
        {
          id: 5,
          name: "Apple Watch Series 8",
          category: "智能手表",
          brand: "Apple",
          price: 2999.00,
          stock: 15,
          status: "offsale",
          image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "先进的健康和健身功能，支持心电图和血氧检测，全天候视网膜显示屏。",
          createTime: "2023-05-12 11:30:00"
        }
      ],
      categories: [
        { id: 1, name: "手机" },
        { id: 2, name: "笔记本" },
        { id: 3, name: "平板" },
        { id: 4, name: "耳机" },
        { id: 5, name: "智能手表" }
      ],
      productForm: {
        name: "",
        category: "",
        brand: "",
        price: 0,
        stock: 0,
        status: "onsale",
        image: "",
        description: ""
      },
      detailProduct: {},
      productRules: {
        name: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请选择产品分类", trigger: "change" }
        ],
        brand: [
          { required: true, message: "请输入品牌", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" }
        ],
        stock: [
          { required: true, message: "请输入库存", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      productSales: [
        {
          orderId: "SO202305001",
          customer: "张三",
          quantity: 2,
          amount: 15998,
          date: "2023-05-01 14:30:00"
        },
        {
          orderId: "SO202304015",
          customer: "李四",
          quantity: 1,
          amount: 7999,
          date: "2023-04-15 10:15:00"
        }
      ],
      productReviews: [
        {
          customer: "王五",
          rating: 5,
          content: "产品质量非常好，使用体验很棒！",
          date: "2023-05-10 16:00:00"
        },
        {
          customer: "赵六",
          rating: 4,
          content: "产品不错，性价比高，推荐购买。",
          date: "2023-05-08 09:30:00"
        }
      ]
    };
  },
  computed: {
    filteredProducts() {
      let result = this.products;
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(product => 
          product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchText.toLowerCase()) ||
          product.brand.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    },
    onsaleProducts() {
      return this.products.filter(product => product.status === "onsale");
    },
    outOfStockProducts() {
      return this.products.filter(product => product.stock === 0);
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
        "onsale": "在售",
        "offsale": "下架",
        "outofstock": "缺货"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "onsale": "success",
        "offsale": "info",
        "outofstock": "danger"
      };
      return typeMap[status] || "info";
    },
    getStockType(stock) {
      if (stock === 0) {
        return "danger";
      } else if (stock < 10) {
        return "warning";
      }
      return "success";
    },
    showAddProductDialog() {
      this.editingProduct = null;
      this.productForm = {
        name: "",
        category: "",
        brand: "",
        price: 0,
        stock: 0,
        status: "onsale",
        image: "",
        description: ""
      };
      this.productDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.productFormRef.resetFields();
      });
    },
    editProduct(product) {
      this.editingProduct = product;
      this.productForm = { ...product };
      this.productDialogVisible = true;
      this.detailDialogVisible = false;
    },
    viewProduct(product) {
      this.detailProduct = { ...product };
      this.detailDialogVisible = true;
    },
    deleteProduct(product) {
      this.$confirm(`确定要删除产品"${product.name}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products.splice(index, 1);
          this.totalProducts = this.products.length;
          this.$message.success("产品删除成功");
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    saveProduct() {
      this.$refs.productFormRef.validate((valid) => {
        if (valid) {
          if (this.editingProduct) {
            // 编辑产品
            const index = this.products.findIndex(p => p.id === this.editingProduct.id);
            if (index !== -1) {
              this.products[index] = { ...this.editingProduct, ...this.productForm };
              this.$message.success("产品信息更新成功");
            }
          } else {
            // 添加产品
            const newProduct = {
              id: Date.now(),
              createTime: new Date().toLocaleString(),
              ...this.productForm
            };
            this.products.push(newProduct);
            this.totalProducts = this.products.length;
            this.$message.success("产品添加成功");
          }
          this.productDialogVisible = false;
        }
      });
    },
    handleImageSuccess(response, file) {
      this.productForm.image = URL.createObjectURL(file.raw);
    },
    beforeImageUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("产品图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("产品图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.product-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .product-name {
    display: flex;
    align-items: center;
  }
  
  .product-price {
    font-size: 18px;
    font-weight: bold;
    color: #fa541c;
  }
  
  .product-description {
    line-height: 1.8;
    color: #666;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
  
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
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
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>