
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入预定人或墓号"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
      <el-table-column align="center" label="预定人" prop="buyer_name" />
      <el-table-column align="center" label="联系电话" prop="phone" />
      <el-table-column align="center" label="开始时间" prop="order_begin" />
      <el-table-column align="center" label="到期时间" prop="order_end" />
      <el-table-column align="center" label="预定金额" prop="real_price" />
      <el-table-column align="center" label="操作人" prop="sellname" />
      <el-table-column align="center" label="预定状态" prop="guoqi_status" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.guoqi_status | or_status">{{ scope.row.guoqi_days }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="180">
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
    <el-dialog :close-on-click-modal="false" class="dialog" title="编辑" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon :model="dataForm" label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="预定人" prop="buyer_name">
          <el-input v-model="dataForm.buyer_name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="开始时间" prop="order_begin">
          <el-date-picker
            v-model="dataForm.order_begin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="order_end">
          <el-date-picker
            v-model="dataForm.order_end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>

        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { AllReserve, updateReserve, deleteReserve } from '@/api/reserve'
import Pagination from '@/components/Pagination'

export default {
  name: 'VueSaveList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      dialogStatus: '',
      listLoading: true,
      dataForm: {
        cid: '',
        buyer_name: '',
        order_begin: '',
        order_end: '',
        phone: ''
      },
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      rules: {
        buyer_name: [{ required: true, message: '预定人不能为空', trigger: 'blur' }],
        order_begin: [{ required: true, message: '请选择日期', trigger: 'change' }],
        order_end: [{ required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      AllReserve(this.listQuery)
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
          delete this.dataForm['guoqi_days']
          delete this.dataForm['cname']
          delete this.dataForm['guoqi_status']
          updateReserve(this.dataForm)
            .then((res) => {
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '更新预定信息成功'
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
      this.$confirm('是否删除?', '操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        deleteReserve(row)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
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
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>
