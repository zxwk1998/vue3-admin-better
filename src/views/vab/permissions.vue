<template>
  <div class="permissions-container">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="角色权限" name="role">
          <el-table :data="roles" style="width: 100%" row-key="id">
            <el-table-column prop="name" label="角色名称" width="180" />
            <el-table-column label="权限">
              <template #default="{ row }">
                <el-tag
                  v-for="permission in row.permissions"
                  :key="permission"
                  style="margin-right: 10px"
                >
                  {{ permissionMap[permission] || permission }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="{ row }">
                <el-button type="text" @click="editRole(row)">编辑</el-button>
                <el-button type="text" @click="deleteRole(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="user">
          <el-table :data="users" style="width: 100%" row-key="id">
            <el-table-column prop="name" label="用户名" width="180" />
            <el-table-column label="角色">
              <template #default="{ row }">
                <el-tag
                  v-for="role in row.roles"
                  :key="role"
                  style="margin-right: 10px"
                >
                  {{ roleMap[role] || role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="200" />
            <el-table-column label="操作" width="180">
              <template #default="{ row }">
                <el-button type="text" @click="editUser(row)">编辑</el-button>
                <el-button type="text" @click="deleteUser(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 角色编辑对话框 -->
    <el-dialog v-model="roleDialogVisible" title="编辑角色" width="500px">
      <el-form :model="currentRole" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="currentRole.name" />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="currentRole.permissions">
            <el-checkbox
              v-for="(label, key) in permissionMap"
              :key="key"
              :label="key"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用户编辑对话框 -->
    <el-dialog v-model="userDialogVisible" title="编辑用户" width="500px">
      <el-form :model="currentUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="currentUser.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="currentUser.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="currentUser.roles">
            <el-checkbox
              v-for="(label, key) in roleMap"
              :key="key"
              :label="key"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Permissions",
  data() {
    return {
      activeTab: "role",
      roleDialogVisible: false,
      userDialogVisible: false,
      currentRole: {
        id: "",
        name: "",
        permissions: [],
      },
      currentUser: {
        id: "",
        name: "",
        email: "",
        roles: [],
      },
      roles: [
        {
          id: "1",
          name: "管理员",
          permissions: ["user:create", "user:edit", "user:delete", "role:assign"],
        },
        {
          id: "2",
          name: "编辑者",
          permissions: ["user:create", "user:edit"],
        },
        {
          id: "3",
          name: "访客",
          permissions: [],
        },
      ],
      users: [
        {
          id: "1",
          name: "张三",
          email: "zhangsan@example.com",
          roles: ["1"],
        },
        {
          id: "2",
          name: "李四",
          email: "lisi@example.com",
          roles: ["2"],
        },
        {
          id: "3",
          name: "王五",
          email: "wangwu@example.com",
          roles: ["3"],
        },
      ],
      permissionMap: {
        "user:create": "创建用户",
        "user:edit": "编辑用户",
        "user:delete": "删除用户",
        "role:assign": "分配角色",
      },
      roleMap: {
        "1": "管理员",
        "2": "编辑者",
        "3": "访客",
      },
    };
  },
  methods: {
    editRole(role) {
      this.currentRole = { ...role };
      this.roleDialogVisible = true;
    },
    deleteRole(role) {
      this.$message.warning(`删除角色: ${role.name}`);
    },
    saveRole() {
      this.$message.success("角色保存成功");
      this.roleDialogVisible = false;
    },
    editUser(user) {
      this.currentUser = { ...user };
      this.userDialogVisible = true;
    },
    deleteUser(user) {
      this.$message.warning(`删除用户: ${user.name}`);
    },
    saveUser() {
      this.$message.success("用户保存成功");
      this.userDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.permissions-container {
  padding: 20px;

  .el-tag {
    margin-bottom: 5px;
  }
}
</style>