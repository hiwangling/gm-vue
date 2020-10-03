<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加服务信息</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleMonumen">刻碑</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="handleclear">清空碑文</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" width="110" label="合同号" prop="order_no" />
      <el-table-column align="center" width="80" label="购墓人" prop="buyer_name" />
      <el-table-column align="center" width="100" label="购买日期" prop="create_time">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务项目" prop="service_title" show-overflow-tooltip />
      <el-table-column align="center" width="80" label="服务总价" prop="sum_price" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.order_status == 1">
            <el-button type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <el-button v-else type="info" size="mini" plain disabled>已付款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      id="service"
      :close-on-click-modal="false"
      class="dialog"
      title="选服务"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <service ref="server" v-loading="loading" @service_data="service_data" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createDateServer">确定</el-button>
      </div>
    </el-dialog>
    <Monumen ref="get" @closes="closes" />
    <!-- <el-dialog id="monumen" :close-on-click-modal="false" class="dialog" title="刻碑" :visible.sync="dialogFormVisible_" top="1vh" append-to-body width="1100px">
      <Monumen ref="get" @closes="closes" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_ = false">取消</el-button>
        <el-button type="primary" @click="createDate">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
import Service from './components/index'
import { getsevices, delservices, getTypeAll, buy_services_order_info, addservices, orderPay } from '@/api/buy-service'
import { vuexData, page } from '@/utils/mixin'
import { cemeterytablet } from '@/api/cemetery'
import Monumen from '@/components/Monumen'
export default {
  components: { Service, Monumen },
  mixins: [vuexData, page],
  data() {
    return {
      index: 2,
      id: '',
      list: null,
      status: false,
      linkman_id: '',
      listlink: '',
      linkdata: null,
      dialogFormVisible: false,
      dialogFormVisible_: false,
      listLoading: false,
      loading: false,
      dialogStatus: '',
      dataForm: {
        cid: '',
        id: '',
        lid: '',
        buyer_name: null,
        phone: '',
        services: [],
        service_time: '',
        seller_id: '',
        sellname: '',
        financetype: 3,
        real_price: ''
      }
    }
  },

  watch: {
    order(val) {
      if (val === this.index) {
        this.getList()
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      getsevices(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    getCommon(v) {
      const data = { type: 2 }
      this.loading = true
      getTypeAll(data).then(res => {
        this.server = res.data
        const data = {
          type: v,
          server: this.server
        }
        this.loading = false
        this.$refs.server.showService(data)
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.getCommon(0)
    },
    service_data(data) {
      this.dataForm.id = data.id
      this.dataForm.cid = this.cems.id
      this.dataForm.seller_id = this.user.id
      this.dataForm.sellname = this.user.realname
      this.dataForm.real_price = data.sum_price
      this.dataForm.phone = data.phone
      this.dataForm.lid = data.lid
      this.dataForm.service_time = data.service_time
      this.dataForm.services = data.server
      this.dataForm.buyer_name = data.buyer_name
    },
    createDateServer() {
      addservices(this.dataForm)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getList()
          this.dialogFormVisible = false
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'edit'
      this.getCommon(1)
      this.id = row.id
      const data = { id: row.id, cid: row.cid }
      buy_services_order_info(data).then(res => {
        this.$refs.server.editService(res.data)
      })
    },
    handleMonumen() {
      this.$refs.get.restFun()
    },
    closes(val) {
      this.getList()
    },
    handleclear(row) {
      this.$confirm('确认清空碑文吗?', '清空操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          const data = {
            cid: this.cems.id,
            mentstatus: 0
          }
          cemeterytablet(data)
            .then(res => {
              this.$notify.success({
                title: '成功',
                message: '清空碑文成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
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
    handlePay(row) {
      this.$confirm('付款此订单后服务信息将无法修改和删除, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = {
          id: row.id
        }
        orderPay(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '付款成功'
            })
            this.getList()
          })
          .catch(res => {
            this.$message({
              type: 'warning',
              message: res
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    handleDelete(row) {
      this.$confirm(
        '您确认此操作?',
        '删除操作',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'confirmTop'
        }
      )
        .then(() => {
          const data = {
            id: row.id,
            cid: row.cid,
            financetype: 3
          }
          delservices(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除服务成功'
              })
              this.getList()
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
<style >
#monumen .el-dialog {
  width: 900px;
}
</style>

