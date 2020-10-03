<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button
        :disabled="cname.usestatus == 2"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加预定信息</el-button>
    </div>
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
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <template v-if="scope.row.guoqi_status != 2">
            <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> -->
            <el-button type="warning" size="mini" icon="el-icon-refresh-left" @click="handlePay(scope.row)">退款</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <el-button v-else type="info" size="mini" plain disabled>已完结</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="rules"
        status-icon
        :model="dataForm"
        label-position="left"
        label-width="120px"
        style="margin-left:50px;"
      >
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
        <el-form-item label="预定金额" prop="real_price">
          <el-input v-model.number="dataForm.real_price" />
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
import { listReserve, createReserve, updateReserve, deleteReserve, orderrefund } from '@/api/reserve'
import { vuexData, page } from '@/utils/mixin'
import { parseTime } from '@/utils'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      index: 0,
      list: null,
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        buyer_name: '',
        order_begin: '',
        order_end: '',
        phone: '',
        real_price: '',
        sellname: '',
        seller_id: '',
        financetype: 1
      },
      dialogFormVisible: false,
      rules: {
        buyer_name: [{ required: true, message: '预定人不能为空', trigger: 'blur' }],
        order_begin: [{ required: true, message: '请选择日期', trigger: 'change' }],
        order_end: [{ required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    },
    order: {
      handler(val) {
        if (val === this.index) {
          this.getList()
        }
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.listLoading = false
      const data = { cid: this.cems.id }
      listReserve(data)
        .then(res => {
          this.list = res.data.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        buyer_name: '',
        order_begin: new Date(),
        order_end: '',
        phone: '',
        real_price: '',
        sellname: this.user.realname,
        seller_id: this.user.id,
        financetype: 1
      }
    },
    handleCreate() {
      this.resetForm()
      const setDate = new Date(this.dataForm.order_begin)
      setDate.setDate(setDate.getDate() + 4)
      this.dataForm.order_end = parseTime(setDate, '{y}-{m}-{d}')
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.dataForm.order_begin = parseTime(this.dataForm.order_begin, '{y}-{m}-{d}')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createReserve(this.dataForm)
            .then(res => {
              this.getList()
              this.$emit('v')
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加预定信息成功'
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          delete this.dataForm['guoqi_days']
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
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlePay(row) {
      const data = {
        id: row.id,
        cid: row.cid,
        financetype: row.financetype
      }
      this.$confirm('是否退款?', '操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        orderrefund(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '退款成功'
            })
            this.getList()
            this.$emit('v')
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
    },
    handleDelete(row) {
      const data = {
        id: row.id,
        cid: row.cid,
        financetype: row.financetype
      }
      this.$confirm('是否删除?', '操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        deleteReserve(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
            this.$emit('v')
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
