<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓园名称" />
      <el-button v-permission="['GET /api/v1/cemetery_classify/g_list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/cemetery_classify/g_add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="名称" prop="type_name" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /api/v1/cemetery_classify/g_edit']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['GET /api/v1/cemetery_classify/g_del']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="墓园名称" prop="type_name">
          <el-input v-model="dataForm.type_name" />
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
import { listGarden, createGarden, updateGarden, deleteGarden } from '@/api/garden'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueGarden',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: '',
        type_name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        type_name: [{ required: true, message: '墓园名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listGarden(this.listQuery)
        .then(res => {
          this.list = res.data.data
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
        type_name: undefined
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createGarden(this.dataForm)
            .then(res => {
              this.list.unshift(res.data)
              this.dialogFormVisible = false

              this.$message({
                type: 'success',
                message: '添加墓园成功'
              })
              this.getList()
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res
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
          updateGarden(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新墓园成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res
              })
            })
        }
      })
    },
    handleDelete(row) {
      deleteGarden(row)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除墓园成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    }
  }
}
</script>
