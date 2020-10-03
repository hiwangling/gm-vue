<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button v-if="currentStatus != 1" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加点灯服务</el-button>
      <el-button v-else type="info" plain disabled>点灯已锁定</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" label="购买人" prop="buyname" width="100" />
      <el-table-column align="center" label="电话" prop="phone" width="120" />
      <el-table-column align="center" label="点灯时间" prop="lamp_nd" width="150">
        <template slot-scope="scope">
          <span style="font-size: 18px;color:red">
            {{ scope.row.lamp_nd }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态" prop="order_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_status | or_status">
            {{ scope.row.order_status == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.order_status == 1">
            <el-button type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <template v-else>
            <el-button type="info" size="mini" plain disabled>已完结</el-button>
          </template>
          <el-button type="primary" size="mini" @click="lampPrint(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="110px" style="margin-left:50px;">
        <el-form-item label="墓穴名称">
          <span class="tag">{{ cname }}</span>
        </el-form-item>
        <el-form-item label="费用">
          <span class="tag" style="color:red;">{{ dataForm.real_price }} 元</span>
        </el-form-item>
        <el-form-item label="购买人" prop="buyname">
          <el-input v-model="dataForm.buyname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="身份证" prop="sfz">
          <el-input v-model="dataForm.card_no" />
        </el-form-item>
        <el-form-item label="点灯时间">
          <el-input v-model="dataForm.buydate" />
        </el-form-item>

        <!-- <el-form-item label="开始时间">
          <el-date-picker
            v-model="dataForm.buydate"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          />
        </el-form-item> -->
        <!-- <el-form-item label="结束时间">
          <el-date-picker
            v-model="dataForm.enddate"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          />
        </el-form-item> -->
        <el-form-item label="*注:">
          <div style="color:red;font-size:13px"> 选择{{ dataForm.buydate }}年代表年{{ dataForm.buydate }}年春节点灯</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <plamp v-show="false" ref="plamp_" />
  </div>
</template>
<script>
import { lamplist, lampadd, lampdelete, lamppay, lampedit } from '@/api/lamp'
import { vuexData, page } from '@/utils/mixin'
import plamp from '@/components/Print/plamp'
import { lightup_info_list } from '@/api/service'
export default {
  components: { plamp },
  mixins: [vuexData, page],
  data() {
    return {
      list: null,
      index: 3,
      flag: true,
      listLoading: true,
      dialogStatus: '',
      lamp: null,
      dataForm: {
        cid: '',
        buyname: null,
        phone: '',
        real_price: '',
        buydate: '',
        card_no: ''
      },
      dialogFormVisible: false,
      rules: {
        buyname: [{ required: true, message: '购买人不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    order(val) {
      if (val === this.index) {
        this.getStatus()
      }
    },
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = { cid: this.cems.id }
      // lamplist(data)
      //   .then(res => {
      //     this.list = res.data
      //     this.listLoading = false
      //   })
      //   .catch(() => {
      //     this.list = []
      //     this.listLoading = false
      //   })
      // lightup_info_list().then(res => {
      //   this.lamp = res.data.data[0]
      // })
    },
    handleCreate() {
      this.resetForm()
      this.flag = true
      this.dataForm.real_price = this.lamp.sellprice
      this.dataForm.buydate = this.lamp.vcnote
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        buyname: '',
        phone: '',
        buydate: '',
        real_price: '',
        card_no: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          lampadd(this.dataForm)
            .then(res => {
              // this.list.unshift(res.data)
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加成功'
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
      this.flag = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          lampedit(this.dataForm)
            .then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新信息成功'
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
    lampPrint(row) {
      const data = {
        list: row,
        operate: this.user.realname
      }
      this.$refs.plamp_.getlist(data)
    },
    handlePay(row) {
      this.$confirm('付款此订单后将无法修改和删除, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        lamppay(row)
          .then(res => {
            this.$message({
              type: 'success',
              message: '付款服务成功'
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
      lampdelete({ id: row.id })
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
    }
  }
}
</script>

