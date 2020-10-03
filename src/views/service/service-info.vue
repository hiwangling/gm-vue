<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.type_name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入服务名称"
      />
      <el-button
        v-permission="['GET /api/v1/service_info/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
      <el-button
        v-permission="['POST /api/v1/service_info/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="名称" prop="service_name" />
      <el-table-column align="center" label="价格" prop="sell_price" />
      <el-table-column align="center" label="单位" prop="chargeunit" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/service_info/edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['GET /api/v1/service_info/del']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="服务名称" prop="service_name">
          <el-input v-model="dataForm.service_name" />
        </el-form-item>
        <el-form-item label="服务类型" prop="service_type">
          <el-select v-model="dataForm.service_type" placeholder="请选择" style="width:180px">
            <el-option
              v-for="(item,value,index) in service_info_service_type"
              :key="index"
              :label="item"
              :value="value + 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务分类" prop="service_classify">
          <el-select v-model="dataForm.service_classify" placeholder="请选择" style="width:180px">
            <el-option
              v-for="(item,value,index) in service_classify"
              :key="index"
              :label="item"
              :value="value + 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售价格" prop="sell_price">
          <el-input v-model="dataForm.sell_price" />
        </el-form-item>
        <el-form-item label="服务单位" prop="chargeunit">
          <el-input v-model="dataForm.chargeunit" />
        </el-form-item>
        <el-form-item label="负责部门" prop="deptid">
          <el-select v-model="dataForm.deptid" placeholder="请选择" style="width:180px">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.branch_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务描述" prop="vcnote">
          <el-input v-model="dataForm.vcnote" />
        </el-form-item>
        <el-form-item label="服务排序" prop="sort">
          <el-input v-model="dataForm.sort" />
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
import { listService, createService, updateService, deleteService, typeService } from '@/api/service'
import { roleOptions } from '@/api/role'
import Pagination from '@/components/Pagination'
import { vuexData } from '../../utils/mixin'

export default {
  name: 'ServiceCombo',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      typeServices: null,
      roleOptions: null,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        service_name: '',
        service_type: '',
        sell_price: '0.00',
        service_classify: '',
        chargeunit: '',
        sort: '',
        vcnote: '',
        deptid: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        service_name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    // typeService().then(res => {
    //   this.typeServices = res.data
    // })
    roleOptions()
      .then(res => {
        this.roleOptions = res.data
        this.roleOptions.splice(0, 1)
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      listService(this.listQuery)
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
        service_name: '',
        service_type: 3,
        sell_price: '0.00',
        service_classify: '',
        chargeunit: '',
        deptid: '',
        vcnote: ''
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
          console.log(typeof this.dataForm.service_type)
          createService(this.dataForm)
            .then(res => {
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '添加服务成功'
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
      console.log(typeof row.service_type)
      console.log('row', row)
      this.dataForm = Object.assign({}, row)
      this.dataForm.service_type = typeof (row.service_type) === 'string' ? row.service_type.split(',') : row.service_type
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateService(this.dataForm)
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
                message: '更新服务成功'
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
      deleteService(row)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除服务成功'
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
<style scoped>
  .rodios .el-radio {
    margin: 10px;
  }
</style>

