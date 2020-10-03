<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加置换服务</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="旧墓名" prop="old_cname" />
      <el-table-column align="center" label="新墓名" prop="new_cname" />
      <el-table-column align="center" label="联系人" prop="buyer_name" />
      <el-table-column align="center" label="操作人" prop="sellname" />
      <el-table-column align="center" label="操作时间" prop="begin_time" />
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
        :rules="rules"
        status-icon
        label-position="left"
        :model="dataForm"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="原墓穴">
          <span style="color:#1890ff">{{ cname.name }}</span>
        </el-form-item>
        <el-form-item label="新墓穴">
          <span>{{ newname }}</span>
          <el-button type="primary" icon="el-icon-search" plain size="mini" @click="ChangeCmes()" />
          <el-button
            v-if="newname"
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="newname = ''"
          />
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
    <Swap-search ref="child" @getname="getname" />
  </div>
</template>
<script>
import SwapSearch from './components/search'
import { change_cemetery, historyinfo } from '@/api/historyinfo'
import { listlink } from '@/api/link'
import { page, vuexData } from '@/utils/mixin'

export default {
  components: { SwapSearch },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      listlink: null,
      index: 3,
      newname: '',
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        new_cid: '',
        real_price: '',
        lid: '',
        new_name: '',
        old_name: '',
        vcdesc: '',
        financetype: 4,
        buyer_name: ''
      },
      dialogFormVisible: false,
      rules: {
        // linkman: [{ required: true, message: '购买人不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    order(val) {
      if (val === this.index) {
        this.link()
        this.getList()
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id,
        typeid: 1
      }
      historyinfo(data)
        .then(res => {
          this.list = res.data
          console.log(this.list)
          this.listLoading = false
        })
    },

    handleCreate() {
      this.resetForm()
      this.link()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.newname = ''
      this.dataForm = {
        cid: this.cems.id,
        new_cid: '',
        lid: '',
        buyer_name: '',
        vcdesc: '',
        financetype: 4,
        new_name: '',
        old_name: this.cname.name,
        real_price: 0,
        seller_id: this.user.id,
        sellname: this.user.realname
      }
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
    },
    ChangeCmes() {
      this.$nextTick(() => {
        this.$refs.child.show()
      })
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
    getname(v) {
      this.newname = v.gardenname + v.classifyname + v.cname + ' / ' + v.sellprice + '元'
      this.dataForm.new_name = v.gardenname + v.classifyname + v.cname
      this.dataForm.new_cid = v.id
    }
  }
}
</script>
<style>
</style>

