<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.type_name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入套餐名称"
      />
      <el-button
        v-permission="['GET /api/v1/combo/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /api/v1/combo/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称" prop="service_name" />
      <el-table-column align="center" label="原始价格" prop="unit_price" />
      <el-table-column align="center" label="实际价格" prop="sell_price" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/combo/edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['GET /api/v1/combo/del']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <el-dialog
      id="service"
      :close-on-click-modal="false"
      class="dialog"
      title="创建套餐"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <service ref="server" @service_data="service_data" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listCombo, createCombo, updateCombo, deleteCombo, getCombo } from '@/api/combo'
import { getTypeAll } from '@/api/buy-service'
import Pagination from '@/components/Pagination'
import Service from './components/index'
export default {
  name: 'VueCombo',
  components: { Pagination, Service },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      getservice: null,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        service_name: '',
        id: '',
        sell_price: '',
        unit_price: '',
        vcnote: '',
        server: null,
        services: [],
        sort: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        tao_name: [{ required: true, message: '套餐名称不能为空', trigger: 'blur' }]
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
      listCombo(this.listQuery)
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
    getCommon(v) {
      const data = { type: 1 }
      getTypeAll(data).then(res => {
        this.server = res.data
        const data = {
          type: v,
          server: this.server
        }
        this.$refs.server.showService(data)
      })
    },

    handleCreate() {
      this.dialogStatus = 'create'
      this.getCommon(0)
      this.dialogFormVisible = true
    },
    createData(data) {
      if (this.dataForm.service_name == '') {
        this.$message({
          type: 'warning',
          message: '套餐名称不能为空'
        })
        return false
      }
      console.log(this.dataForm)
      if (this.dataForm.sell_price == '') {
        this.$message({
          type: 'warning',
          message: '套餐价格不能为空'
        })
        return false
      }
      createCombo(this.dataForm)
        .then(res => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '添加套餐成功'
          })
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    async handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      await this.getCommon(1)
      const data = { id: row.id }
      await getCombo(data).then(res => {
        this.$refs.server.editService(res.data)
      })
    },
    updateData() {
      if (this.dataForm.service_name == '') {
        this.$message({
          type: 'warning',
          message: '套餐名称不能为空'
        })
        return false
      }
      if (this.dataForm.sell_price == '') {
        this.$message({
          type: 'warning',
          message: '套餐价格不能为空'
        })
        return false
      }
      updateCombo(this.dataForm)
        .then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '更新套餐成功'
          })
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    service_data(data) {
      this.dataForm = {
        service_name: data.service_name,
        sell_price: data.totalprice,
        unit_price: data.services_totalprice,
        sort: data.sort,
        id: data.id,
        services: data.services
      }
    },
    handleDelete(row) {
      deleteCombo(row)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除套餐成功'
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
<style>
.package .el-dialog {
  width: 700px;
}
</style>

