<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">退墓操作</el-button>
      <!-- <el-button v-else type="info" plain disabled>迁出已锁定</el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="联系人" prop="buyer_name" />
      <el-table-column align="center" label="联系电话" prop="phone" />
      <el-table-column align="center" label="操作人" prop="sellname" />
      <el-table-column align="center" label="操作时间" prop="order_begin" />
      <el-table-column align="center" label="金额" prop="sum_price" />
      <el-table-column align="center" label="备注" prop="vcdesc" />
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
        :inline="false"
        status-icon
        label-position="left"
        :model="dataForm"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="墓穴位置">
          <span class="tag">{{ dataForm.cem_name }}</span>
        </el-form-item>
        <el-form-item label="联系人">
          <el-select
            v-model="dataForm.buyer_name"
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
            @change="linkPhone"
          >
            <el-option
              v-for="item in listlink"
              :key="item.id"
              :label="item.link_name"
              :value="item.link_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="金额" prop="real_price">
          <el-input v-model="dataForm.real_price" />
        </el-form-item>
        <el-form-item label="备注" prop="vcdesc">
          <el-input v-model="dataForm.vcdesc" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { change_cemetery, emigrationList } from '@/api/historyinfo'
import { vuexData, page } from '@/utils/mixin'
import { listlink } from '@/api/link'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      list: null,
      index: 4,
      listlink: [],
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        real_price: '',
        lid: '',
        vcdesc: '',
        financetype: 6,
        buyer_name: ''
      },
      dialogFormVisible: false
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
        cid: this.cems.id,
        financetype: 6
      }
      emigrationList(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleCreate() {
      this.resetForm()
      this.link()
      this.dataForm.cem_name = this.cname.name
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        lid: '',
        buyer_name: '',
        vcdesc: '',
        financetype: 6,
        real_price: 0,
        seller_id: this.user.id,
        sellname: this.user.realname
      }
    },
    linkPhone(v) {
      this.listlink.forEach(ele => {
        if (ele.link_name == v) {
          this.dataForm.phone = ele.phone
          this.dataForm.lid = ele.id
        }
      })
    },
    link() {
      const data = {
        cid: this.cems.id
      }
      listlink(data)
        .then(res => {
          this.listlink = res.data
        })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          change_cemetery(this.dataForm)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$emit('v')
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res
              })
            })
        }
      })
    }
  }
}
</script>

