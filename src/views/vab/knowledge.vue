<template>
  <div class="knowledge-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never" class="category-sidebar">
          <template #header>
            <div class="card-header">
              <span>知识分类</span>
              <el-button type="primary" icon="Plus" circle size="small" @click="showAddCategoryDialog" />
            </div>
          </template>
          
          <el-tree
            :data="categories"
            :props="categoryProps"
            :expand-on-click-node="false"
            :default-expanded-keys="[1]"
            node-key="id"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="category-node">
                <el-icon v-if="data.icon"><component :is="data.icon" /></el-icon>
                <span style="margin-left: 5px">{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </el-card>
        
        <el-card shadow="never" style="margin-top: 20px">
          <template #header>
            <span>热门标签</span>
          </template>
          
          <div class="tag-cloud">
            <el-tag 
              v-for="tag in tags" 
              :key="tag.id"
              :type="tag.type"
              effect="plain"
              style="margin: 5px; cursor: pointer"
              @click="filterByTag(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <el-card shadow="never" class="content-main">
          <template #header>
            <div class="card-header">
              <span>{{ currentCategory.name || '全部知识' }}</span>
              <div class="header-actions">
                <el-input
                  v-model="searchText"
                  placeholder="搜索知识..."
                  clearable
                  style="width: 200px; margin-right: 10px"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button type="primary" @click="showAddKnowledgeDialog">添加知识</el-button>
              </div>
            </div>
          </template>
          
          <div class="knowledge-list">
            <el-card 
              v-for="knowledge in filteredKnowledges" 
              :key="knowledge.id"
              class="knowledge-item"
              shadow="hover"
              @click="viewKnowledge(knowledge)"
            >
              <div class="knowledge-header">
                <h3>{{ knowledge.title }}</h3>
                <el-tag :type="getCategoryType(knowledge.categoryId)">
                  {{ getCategoryName(knowledge.categoryId) }}
                </el-tag>
              </div>
              
              <div class="knowledge-content">
                {{ knowledge.summary }}
              </div>
              
              <div class="knowledge-meta">
                <div class="meta-item">
                  <el-icon><User /></el-icon>
                  <span>{{ knowledge.author }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ knowledge.createTime }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><View /></el-icon>
                  <span>{{ knowledge.views }} 次浏览</span>
                </div>
              </div>
              
              <div class="knowledge-tags">
                <el-tag 
                  v-for="tag in knowledge.tags" 
                  :key="tag"
                  :type="getTagType(tag)"
                  style="margin-right: 5px"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </el-card>
          </div>
          
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="totalKnowledges"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 添加/编辑分类对话框 -->
    <el-dialog 
      v-model="categoryDialogVisible" 
      :title="editingCategory ? '编辑分类' : '添加分类'"
      width="500px"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        
        <el-form-item label="图标">
          <el-select v-model="categoryForm.icon" placeholder="请选择图标" style="width: 100%">
            <el-option label="文档" value="Document">
              <el-icon><Document /></el-icon>
              <span style="margin-left: 10px">文档</span>
            </el-option>
            <el-option label="指南" value="Guide">
              <el-icon><Guide /></el-icon>
              <span style="margin-left: 10px">指南</span>
            </el-option>
            <el-option label="教程" value="Reading">
              <el-icon><Reading /></el-icon>
              <span style="margin-left: 10px">教程</span>
            </el-option>
            <el-option label="FAQ" value="QuestionFilled">
              <el-icon><QuestionFilled /></el-icon>
              <span style="margin-left: 10px">FAQ</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="父级分类">
          <el-tree-select
            v-model="categoryForm.parentId"
            :data="categoryTree"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            node-key="id"
            style="width: 100%"
            placeholder="请选择父级分类"
            clearable
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveCategory"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑知识对话框 -->
    <el-dialog 
      v-model="knowledgeDialogVisible" 
      :title="editingKnowledge ? '编辑知识' : '添加知识'"
      width="800px"
    >
      <el-form
        ref="knowledgeFormRef"
        :model="knowledgeForm"
        :rules="knowledgeRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="标题" prop="title">
              <el-input v-model="knowledgeForm.title" />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="knowledgeForm.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="摘要" prop="summary">
          <el-input 
            v-model="knowledgeForm.summary" 
            type="textarea"
            :rows="3"
            placeholder="请输入知识摘要"
          />
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="knowledgeForm.content" 
            type="textarea"
            :rows="10"
            placeholder="请输入知识详细内容"
          />
        </el-form-item>
        
        <el-form-item label="标签">
          <el-select 
            v-model="knowledgeForm.tags" 
            multiple 
            filterable 
            allow-create 
            default-first-option
            placeholder="请选择或创建标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="作者">
          <el-input v-model="knowledgeForm.author" disabled />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="knowledgeDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveKnowledge"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 知识详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      :title="detailKnowledge.title"
      width="800px"
    >
      <div class="knowledge-detail">
        <div class="detail-meta">
          <el-tag :type="getCategoryType(detailKnowledge.categoryId)">
            {{ getCategoryName(detailKnowledge.categoryId) }}
          </el-tag>
          <span class="meta-item">
            <el-icon><User /></el-icon>
            {{ detailKnowledge.author }}
          </span>
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            {{ detailKnowledge.createTime }}
          </span>
          <span class="meta-item">
            <el-icon><View /></el-icon>
            {{ detailKnowledge.views }} 次浏览
          </span>
        </div>
        
        <div class="detail-content">
          {{ detailKnowledge.content }}
        </div>
        
        <div class="detail-tags" v-if="detailKnowledge.tags && detailKnowledge.tags.length > 0">
          <el-tag 
            v-for="tag in detailKnowledge.tags" 
            :key="tag"
            :type="getTagType(tag)"
            style="margin-right: 10px"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editKnowledge(detailKnowledge)">编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { 
  Search, 
  User, 
  Calendar, 
  View, 
  Document, 
  Guide, 
  Reading, 
  QuestionFilled,
  Plus
} from "@element-plus/icons-vue";

export default {
  name: "Knowledge",
  components: {
    Search,
    User,
    Calendar,
    View,
    Document,
    Guide,
    Reading,
    QuestionFilled,
    Plus
  },
  data() {
    return {
      searchText: "",
      currentPage: 1,
      pageSize: 10,
      totalKnowledges: 0,
      categoryDialogVisible: false,
      knowledgeDialogVisible: false,
      detailDialogVisible: false,
      editingCategory: null,
      editingKnowledge: null,
      currentCategory: {},
      categories: [
        {
          id: 1,
          name: "技术文档",
          icon: "Document",
          children: [
            {
              id: 2,
              name: "前端开发",
              icon: "Document"
            },
            {
              id: 3,
              name: "后端开发",
              icon: "Document"
            }
          ]
        },
        {
          id: 4,
          name: "使用指南",
          icon: "Guide",
          children: [
            {
              id: 5,
              name: "系统安装",
              icon: "Guide"
            },
            {
              id: 6,
              name: "功能说明",
              icon: "Guide"
            }
          ]
        },
        {
          id: 7,
          name: "教程视频",
          icon: "Reading"
        },
        {
          id: 8,
          name: "常见问题",
          icon: "QuestionFilled"
        }
      ],
      categoryProps: {
        children: "children",
        label: "name"
      },
      categoryForm: {
        name: "",
        icon: "",
        parentId: null
      },
      categoryRules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      knowledges: [
        {
          id: 1,
          title: "Vue 3 Composition API 使用指南",
          summary: "详细介绍Vue 3中Composition API的使用方法和最佳实践",
          content: "Vue 3 Composition API 是Vue 3中引入的一种新的组织和复用组件逻辑的方式。它提供了一种更灵活的方式来组织组件代码，使得组件更容易理解和维护。",
          categoryId: 2,
          author: "张三",
          createTime: "2023-05-01",
          views: 128,
          tags: ["Vue", "前端", "教程"]
        },
        {
          id: 2,
          title: "Element Plus 表单验证详解",
          summary: "深入讲解Element Plus中表单验证的各种用法和技巧",
          content: "Element Plus 提供了强大的表单验证功能，支持多种验证规则和自定义验证器。通过合理使用表单验证，可以有效提升用户体验和数据质量。",
          categoryId: 2,
          author: "李四",
          createTime: "2023-05-05",
          views: 96,
          tags: ["Element Plus", "表单", "验证"]
        },
        {
          id: 3,
          title: "数据库设计规范",
          summary: "介绍数据库设计的基本原则和规范，帮助提高数据库性能和可维护性",
          content: "良好的数据库设计是系统稳定运行的基础。本指南介绍了数据库设计的基本原则，包括范式设计、索引优化、表结构设计等方面的内容。",
          categoryId: 3,
          author: "王五",
          createTime: "2023-05-10",
          views: 75,
          tags: ["数据库", "设计", "规范"]
        },
        {
          id: 4,
          title: "系统安装与部署",
          summary: "详细说明系统的安装和部署步骤，包括环境要求和配置说明",
          content: "系统安装需要满足一定的环境要求，包括操作系统、数据库、Web服务器等。本指南详细介绍了在不同环境下的安装和部署步骤。",
          categoryId: 5,
          author: "赵六",
          createTime: "2023-04-28",
          views: 210,
          tags: ["安装", "部署", "环境"]
        },
        {
          id: 5,
          title: "常见问题解答",
          summary: "整理了用户在使用过程中遇到的常见问题及其解决方案",
          content: "本FAQ整理了用户在使用系统过程中经常遇到的问题，并提供了详细的解决方案。通过查阅本FAQ，可以快速解决大部分常见问题。",
          categoryId: 8,
          author: "钱七",
          createTime: "2023-05-12",
          views: 185,
          tags: ["FAQ", "问题", "解答"]
        }
      ],
      knowledgeForm: {
        title: "",
        summary: "",
        content: "",
        categoryId: null,
        author: "当前用户",
        tags: []
      },
      detailKnowledge: {},
      knowledgeRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请输入摘要", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请选择分类", trigger: "change" }
        ]
      },
      tags: [
        { id: 1, name: "Vue", type: "primary" },
        { id: 2, name: "Element Plus", type: "success" },
        { id: 3, name: "数据库", type: "warning" },
        { id: 4, name: "教程", type: "danger" },
        { id: 5, name: "前端", type: "info" },
        { id: 6, name: "后端", type: "" },
        { id: 7, name: "安装", type: "primary" },
        { id: 8, name: "FAQ", type: "success" }
      ],
      allTags: ["Vue", "Element Plus", "数据库", "教程", "前端", "后端", "安装", "FAQ", "表单", "验证", "设计", "规范", "环境", "问题", "解答"]
    };
  },
  computed: {
    categoryTree() {
      return this.categories.map(category => ({
        id: category.id,
        name: category.name,
        children: category.children ? category.children.map(child => ({
          id: child.id,
          name: child.name
        })) : undefined
      }));
    },
    filteredKnowledges() {
      let result = this.knowledges;
      
      // 分类过滤
      if (this.currentCategory.id) {
        result = result.filter(knowledge => 
          knowledge.categoryId === this.currentCategory.id || 
          this.isChildCategory(knowledge.categoryId, this.currentCategory.id)
        );
      }
      
      // 搜索过滤
      if (this.searchText) {
        result = result.filter(knowledge => 
          knowledge.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          knowledge.summary.toLowerCase().includes(this.searchText.toLowerCase()) ||
          knowledge.content.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    }
  },
  methods: {
    handleNodeClick(data) {
      this.currentCategory = data;
      this.currentPage = 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getCategoryName(categoryId) {
      for (const category of this.categories) {
        if (category.id === categoryId) {
          return category.name;
        }
        if (category.children) {
          for (const child of category.children) {
            if (child.id === categoryId) {
              return child.name;
            }
          }
        }
      }
      return "未知分类";
    },
    getCategoryType(categoryId) {
      const typeMap = {
        1: "primary",
        2: "success",
        3: "warning",
        4: "danger",
        5: "info",
        6: "",
        7: "primary",
        8: "success"
      };
      return typeMap[categoryId] || "info";
    },
    getTagType(tag) {
      const tagObj = this.tags.find(t => t.name === tag);
      return tagObj ? tagObj.type : "info";
    },
    isChildCategory(childId, parentId) {
      const parent = this.categories.find(c => c.id === parentId);
      if (parent && parent.children) {
        return parent.children.some(child => child.id === childId);
      }
      return false;
    },
    showAddCategoryDialog() {
      this.editingCategory = null;
      this.categoryForm = {
        name: "",
        icon: "",
        parentId: null
      };
      this.categoryDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.categoryFormRef.resetFields();
      });
    },
    showAddKnowledgeDialog() {
      this.editingKnowledge = null;
      this.knowledgeForm = {
        title: "",
        summary: "",
        content: "",
        categoryId: null,
        author: "当前用户",
        tags: []
      };
      this.knowledgeDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.knowledgeFormRef.resetFields();
      });
    },
    editKnowledge(knowledge) {
      this.editingKnowledge = knowledge;
      this.knowledgeForm = { ...knowledge };
      this.knowledgeDialogVisible = true;
      this.detailDialogVisible = false;
    },
    viewKnowledge(knowledge) {
      this.detailKnowledge = { ...knowledge };
      // 增加浏览量
      this.detailKnowledge.views = (this.detailKnowledge.views || 0) + 1;
      this.detailDialogVisible = true;
    },
    filterByTag(tag) {
      this.searchText = tag.name;
    },
    saveCategory() {
      this.$refs.categoryFormRef.validate((valid) => {
        if (valid) {
          if (this.editingCategory) {
            // 编辑分类
            this.$message.success("分类更新成功");
          } else {
            // 添加分类
            this.$message.success("分类添加成功");
          }
          this.categoryDialogVisible = false;
        }
      });
    },
    saveKnowledge() {
      this.$refs.knowledgeFormRef.validate((valid) => {
        if (valid) {
          if (this.editingKnowledge) {
            // 编辑知识
            const index = this.knowledges.findIndex(k => k.id === this.editingKnowledge.id);
            if (index !== -1) {
              this.knowledges[index] = { ...this.editingKnowledge, ...this.knowledgeForm };
              this.$message.success("知识更新成功");
            }
          } else {
            // 添加知识
            const newKnowledge = {
              id: Date.now(),
              createTime: new Date().toISOString().split('T')[0],
              views: 0,
              ...this.knowledgeForm
            };
            this.knowledges.push(newKnowledge);
            this.totalKnowledges = this.knowledges.length;
            this.$message.success("知识添加成功");
          }
          this.knowledgeDialogVisible = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.knowledge-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .category-sidebar {
    height: calc(100vh - 120px);
    
    :deep(.el-tree) {
      background-color: transparent;
      border: 0;
    }
    
    .category-node {
      display: flex;
      align-items: center;
    }
  }
  
  .content-main {
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
    
    .knowledge-list {
      flex: 1;
      overflow-y: auto;
      
      .knowledge-item {
        margin-bottom: 15px;
        cursor: pointer;
        
        .knowledge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          h3 {
            margin: 0;
            font-size: 16px;
          }
        }
        
        .knowledge-content {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }
        
        .knowledge-meta {
          display: flex;
          margin-bottom: 10px;
          
          .meta-item {
            display: flex;
            align-items: center;
            margin-right: 15px;
            font-size: 12px;
            color: #999;
            
            .el-icon {
              margin-right: 3px;
            }
          }
        }
        
        .knowledge-tags {
          margin-top: 10px;
        }
      }
    }
  }
  
  .tag-cloud {
    text-align: center;
  }
  
  .knowledge-detail {
    .detail-meta {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ebeef5;
      
      .el-tag {
        margin-right: 15px;
      }
      
      .meta-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        color: #999;
        font-size: 14px;
        
        .el-icon {
          margin-right: 5px;
        }
      }
    }
    
    .detail-content {
      line-height: 1.8;
      margin-bottom: 20px;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>