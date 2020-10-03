<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.rolename" clearable class="filter-item" style="width: 200px;" placeholder="请输入部门名称" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'end', order: 'ascending'}" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="序号" prop="id" width="80" />
      <el-table-column align="center" label="名称" prop="title" />
      <el-table-column align="center" label="类型" prop="type" />
      <el-table-column align="center" label="接口" prop="url">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="父级导航" prop="pid" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.pid == 0 ? 'danger' : ''">{{ scope.row.pid == 0 ? '顶级导航' : scope.row.ptitle }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否禁用" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 0 ? 'danger' : ''">{{ scope.row.status == 0 ? '禁用' : '可用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :inline="true" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="导航名称" prop="title">
          <el-input v-model="dataForm.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="顶级导航" prop="pid">
          <el-select v-model="pid" placeholder="选择是否" clearable class="filter-item" style="width:180px" @change="clearpid">
            <el-option label="是" :value="0" />
            <el-option label="否" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="pid == 1" label="父级导航" prop="ptitle">
          <el-input v-model="ptitle" placeholder="点击选择导航" clearable style="width:180px" @focus="handlePermission" />
        </el-form-item>
        <el-form-item v-if="pid == 1" label="导航类型" prop="type">
          <el-input v-model="dataForm.type" placeholder="post / get" />
        </el-form-item>
        <el-form-item v-if="pid == 1" label="接口路径" prop="url">
          <el-input v-model="dataForm.url" placeholder="api." />
        </el-form-item>
        <el-form-item label="是否禁用" prop="status">
          <el-select v-model="dataForm.status" placeholder="选择是否" clearable class="filter-item" style="width:180px" @change="clearpid">
            <el-option label="是" :value="0" />
            <el-option label="否" :value="1" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="permissionDialogFormVisible" title="请选择">
      <el-tree
        ref="tree"
        :data="systemPermissions"
        :default-checked-keys="assignedPermissions"
        show-checkbox
        node-key="ids"
        highlight-current
        @check="handleCheckChange"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.title }}</span>
          <el-tag v-if="data.url" type="success" size="mini">{{ data.url }}</el-tag>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { auth_rulelist, auth_ruleadd, auth_ruleedit, auth_ruledel, getPermissions } from '@/api/role'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueGroup',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      pid: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      ptitle: '',
      dataForm: {
        id: undefined,
        pid: '',
        title: '',
        type: '',
        url: '',
        status: 1,
        ismenu: 1,
        ordernum: 0,
        code: '',
        webui_url: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      permissionForm: {
        id: undefined,
        permissions: []
      }
    }
  },
  computed: {
    filterData: function(v) {
      return 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      auth_rulelist(this.listQuery)
        .then(res => {
          res.data.forEach(v => {
            res.data.forEach(n => {
              if (v.id == n.pid) {
                this.$set(n, 'ptitle', v.title)
              }
            })
          })
          this.list = res.data
          this.total = 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: '',
        pid: '',
        title: '',
        type: '',
        url: '',
        status: 1,
        ismenu: 1,
        ordernum: 0,
        code: '',
        webui_url: ''
      }
      this.ptitle = ''
      this.pid = 1
    },
    handleCheckChange(data) {
      this.ptitle = data.title
      this.dataForm.pid = data.id
      this.permissionDialogFormVisible = false
    },
    clearpid() {
      if (this.pid == 0) {
        this.dataForm.pid = ''
        this.ptitle = ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      delete this.dataForm.ptitle
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          auth_ruleadd(this.dataForm)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.pid = row.pid == 0 ? row.pid : 1
      this.ptitle = row.ptitle
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      delete this.dataForm.ptitle
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          auth_ruleedit(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleDelete(row) {
      auth_ruledel(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.data.errmsg
          })
        })
    },
    handlePermission(row) {
      this.permissionDialogFormVisible = true
      getPermissions()
        .then(res => {
          this.systemPermissions = res.data
        })
    }

  }
}
</script>
