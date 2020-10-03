<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入配置名称"
      />
      <el-button
        v-permission="['POST /api/v1/branch/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /api/v1/branch/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="配置标题" prop="title" />
      <el-table-column align="center" label="配置名称" prop="name" />
      <el-table-column align="center" label="配置说明" prop="describe" />
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog
      id="configuration"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item class="typeForm" label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="用于config函数调用" />
        </el-form-item>
        <el-form-item class="typeForm" label="标题" prop="title">
          <el-input v-model="dataForm.title" placeholder="用于后台显示的配置标题" />
        </el-form-item>
        <el-form-item class="typeForm" label="类型" prop="type">
          <el-select v-model="dataForm.type" clearable placeholder="根据类型解析配置值">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="typeForm" label="配置项" prop="extra">
          <el-input v-model="dataForm.extra" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="typeForm" label="配置分组" prop="group">
          <el-select v-model="dataForm.group" clearable placeholder="配置分组">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item class="typeForm" label="描述" prop="describe">-->
        <!--          <el-input type="textarea" autosize v-model="dataForm.describe" placeholder="用于分组显示的顺序，默认为0"/>-->
        <!--        </el-form-item>-->
        <el-form-item class="typeForm" label="排序" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="0" />
        </el-form-item>
        <el-form-item class="typeForm" label="描述" prop="describe">
          <el-input
            v-model="dataForm.describe"
            type="textarea"
            autosize
            placeholder="用于分组显示的顺序，默认为0"
          />
        </el-form-item>
        <el-form-item class="typeForm" label="配置值" prop="value">
          <el-input v-model="dataForm.value" type="textarea" autosize placeholder="配置取值" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { createConfig, deleteConfig, listConfig, updateConfig } from '@/api/configuration'
import Pagination from '@/components/Pagination'

import { typeOptions, groupOptions, textMap } from '@/utils/config'

export default {
  name: 'VueGroup',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        type: undefined,
        title: null,
        group: '',
        extra: '',
        describe: '',
        value: '',
        sort: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        branch_name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      permissionForm: {
        id: undefined,
        permissions: []
      },
      typeOptions,
      groupOptions,
      textMap

    }
  },
  created() {
    this.getList()
    // this.getDeptList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listConfig(this.listQuery)
        .then(res => {
          this.list = res.data.data
          // this.total = 1
          this.total = res.data.total || 0
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
        id: undefined,
        name: undefined,
        desc: undefined
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
      console.log('hello world')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createConfig(this.dataForm)
            .then(res => {
              this.getList()
              console.log('res', res)
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加部门成功'
              })
            })
            .catch(res => {
              console.log('res', res)
              this.$message({
                type: 'warning',
                title: '失败',
                message: res,
                duration: 800
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateConfig(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新配置信息成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res.data.msg
              })
            })
        }
      })
    },
    handleDelete(row) {
      const delPara = { id: row.id }
      deleteConfig(delPara).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
    }
  }

}
</script>
<style>
#configuration .el-dialog {
  width: 1000px;
}
</style>
