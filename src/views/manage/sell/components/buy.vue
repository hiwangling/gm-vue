<template>
  <div class="container">
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-edit"
      style="margin:0 0 10px 0"
      :disabled="cname.usestatus > 2 || (list && list.length > 0) "
      @click="handleBury"
    >添加购墓信息</el-button>
    <el-button
      class="filter-item"
      type="primary"
      plain
      :disabled="list && list.length == 0"
      icon="el-icon-printer"
      style="margin:0 0 10px 0"
      @click="CemeteryPrint()"
    >购墓申请单</el-button>
    <el-button
      class="filter-item"
      type="primary"
      plain
      :disabled="list && list.length == 0"
      icon="el-icon-printer"
      style="margin:0 0 10px 0"
      @click="handlePay()"
    >购墓合同</el-button>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" label="档案编号" prop="dabh" />
      <el-table-column align="center" label="发票号" prop="fph" />
      <el-table-column align="center" width="80" label="购墓人" prop="buyer_name" />
      <el-table-column align="center" label="购买日期" prop="order_begin" width="120" />
      <el-table-column align="center" label="到期日期" prop="order_end" width="120" />
      <el-table-column align="center" width="80" label="销售金额" prop="sell_price" />
      <el-table-column align="center" width="80" label="实收金额" prop="real_price" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
            v-if="cname.usestatus < 3"
            style="margin-top:5px"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="1vh"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <div style="margin-bottom:10px">
          <el-button size="mini" type="primary" @click="getCard">联系人信息</el-button>
        </div>
        <card ref="cardImg" @setImg="setImg" />
        <el-form-item label="档案编号" prop="dabh">
          <el-input v-model="dataForm.dabh" />
        </el-form-item>
        <el-form-item label="发票号" prop="fph">
          <el-input v-model="dataForm.fph" />
        </el-form-item>
        <el-form-item label="联系人" prop="buyer_name">
          <el-input v-model="dataForm.buyer_name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="dataForm.card_no" class="card" />
        </el-form-item>
        <el-form-item label="关系">
          <el-input v-model="dataForm.relation" />
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="dataForm.address" />
        </el-form-item>
        <el-form-item label="销售金额">
          <el-input v-model="dataForm.sell_price" :disabled="true" />
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker
            v-model="dataForm.order_begin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="changedate"
          />
        </el-form-item>
        <el-form-item label="到期日期">
          <el-date-picker
            v-model="dataForm.order_end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="实收金额" prop="real_price">
          <el-input v-model="dataForm.real_price" />
        </el-form-item>
        <el-form-item label="备注" prop="vcdesc">
          <el-input v-model="dataForm.vcdesc" placeholder="请输入内容" />
        </el-form-item>
        <template v-if="dataFormEdit">
          <el-form-item label="身份证(正)">
            <div class="uploader_photo dead_photo">
              <div class="avatar-uploader el-upload-list--picture-card">
                <template v-if="dataForm.card_photo_z">
                  <img :src="dataForm.card_photo_z" class="avatar">
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span class="el-upload-list__item-delete" @click="dataForm.card_photo_z = ''">
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </template>
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(1)" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="身份证(反)">
            <div class="uploader_photo dead_photo">
              <div class="avatar-uploader el-upload-list--picture-card">
                <template v-if="dataForm.card_photo_f">
                  <img :src="dataForm.card_photo_f" class="avatar">
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span class="el-upload-list__item-delete" @click="dataForm.card_photo_f = ''">
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </template>
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(2)" />
              </div>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <template v-if="dataFormEdit">
        <div class="ele" />
        <Vue-form ref="child" @CloseDialog="CloseDialog" />
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <contract v-show="false" ref="contract_" />
    <reserver v-show="false" ref="reserver_" />
  </div>
</template>
<script>
import { listbuy, editbuy, deletebuy, pay } from '@/api/buy'
import { vuexData, page } from '@/utils/mixin'
import VueForm from './form'
import axios from 'axios'
import card from '@/components/Card'
import contract from '@/components/Print/contract'
import reserver from '@/components/Print/reserver'
import { parseTime } from '@/utils'
export default {
  components: { VueForm, contract, reserver, card },
  mixins: [vuexData, page],
  data() {
    return {
      index: 1,
      flag: '',
      idx: '',
      dataFormEdit: true,
      list: null,
      type_id: 2,
      listlink: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogFormVisiblegm: false,
      dialogStatus: '',
      dataForm: {
        cid: '',
        order_begin: null,
        order_end: null,
        real_price: '',
        buyer_name: '',
        fph: '',
        dabh: '',
        sell_price: '',
        card_photo_z: '',
        card_photo_f: '',
        phone: '',
        card_no: '',
        relation: '',
        sellname: '',
        seller_id: '',
        address: '',
        vcdesc: '',
        financetype: 2,
        dead: []
      },
      rules: {
        real_price: [{ required: true, message: '实收金额不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
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
  created() {

  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      listbuy(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },

    getPic(val) {
      this.idx = val
      this.$refs.cardImg.show()
    },
    setImg(val) {
      if (this.idx == 1) {
        this.dataForm.card_photo_z = val
      } else {
        this.dataForm.card_photo_f = val
      }
    },
    handleBury() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.dataFormEdit = true
      const setDate = new Date(this.dataForm.order_begin)
      setDate.setFullYear(setDate.getFullYear() + 20)
      setDate.setDate(setDate.getDate())
      this.dataForm.order_begin = parseTime(
        this.dataForm.order_begin,
        '{y}-{m}-{d}'
      )
      this.dataForm.order_end = parseTime(setDate, '{y}-{m}-{d}')
      this.dataForm.sell_price = this.cems.sellprice
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$refs.child.addForm(this.dataForm)
        }
      })
    },
    refresh() {
      this.getList()
    },
    changedate() {
      const setDate = new Date(this.dataForm.order_begin)
      setDate.setFullYear(setDate.getFullYear() + 20)
      setDate.setDate(setDate.getDate())
      this.dataForm.order_begin = parseTime(
        this.dataForm.order_begin,
        '{y}-{m}-{d}'
      )
      this.dataForm.order_end = parseTime(setDate, '{y}-{m}-{d}')
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.dataFormEdit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editbuy(this.dataForm)
            .then(res => {
              this.getList()
              this.$emit('v')
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新购墓信息成功'
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
      this.$confirm('是否删除?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          const data = {
            id: row.id,
            cid: row.cid,
            financetype: row.financetype
          }
          deletebuy(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除购墓信息成功'
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
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
    getCard() {
      var url = 'http://127.0.0.1:38088/card=idcard'
      var params = ''
      axios
        .post(url, params)
        .then(res => {
          if (res.data.code == 0) {
            var info = res.data.IDCardInfo
            this.$notify.success({
              title: '成功',
              message: '身份信息获取成功'
            })
            this.dataForm.buyer_name = info.name
            // this.dataForm.sex = info.sex
            this.dataForm.card_no = info.cardID
            this.dataForm.address = info.address
          } else {
            this.$notify.error({
              title: '获取身份信息失败',
              message: res
            })
          }
        })
        .catch(res => {
          this.$notify.error({
            title: '未检测到系统设备',
            message: '网络错误'
          })
        })
    },
    CloseDialog(val) {
      this.dialogFormVisible = false
      this.getList()
      this.$emit('v')
    },
    CemeteryPrint() {
      const data = {
        cid: this.cems.id
      }
      this.$refs.reserver_.getlist(data)
    },
    handlePay() {
      const data = {
        cid: this.cems.id,
        typeid: this.typeid
      }
      if (this.cname.usestatus > 2) {
        this.$refs.contract_.init(data)
      } else {
        this.$confirm(
          '打印合同后视为售出且购墓信息将无法删除, 是否继续?',
          '打印操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'confirmTop'
          }
        )
          .then(() => {
            this.$refs.contract_.init(data)
            pay(data).then(res => {
              this.$emit('v')
            }).catch(res => {
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
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        order_begin: new Date(),
        order_end: null,
        real_price: '',
        buyer_name: '',
        card_no: '',
        fph: '',
        dabh: '',
        card_photo_z: '',
        card_photo_f: '',
        phone: '',
        relation: '',
        address: '',
        vcdesc: '',
        sellname: this.user.realname,
        seller_id: this.user.id,
        financetype: 2
      }
    }
  }
}
</script>

