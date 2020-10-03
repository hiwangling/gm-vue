<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入墓穴名称"
      />
      <el-select
        v-model="listQuery.y_id"
        placeholder="选择墓园"
        clearable
        style="width: 120px"
        class="filter-item"
        @change="handle_area"
      >
        <el-option v-for="item in garden" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.q_id"
        placeholder="选择墓区"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option v-for="item in area" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.type_id"
        placeholder="选择类型"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option v-for="item in type" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.style_id"
        placeholder="选择墓型"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option v-for="item in style" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.usestatus"
        placeholder="选择状态"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="(item,value,index) in cemetery_usestatus"
          :key="index"
          :label="item"
          :value="value+1"
        />
      </el-select>
      <el-button
        v-permission="['GET /api/v1/cemetery/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /api/v1/cemetery/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <!-- <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>-->
    </div>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'sort',order:'ascending'}"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="墓区" prop="classifyname" />
      <el-table-column align="center" label="墓号" prop="cname" />
      <el-table-column align="center" label="墓型" prop="typename" />
      <el-table-column align="center" label="样式" prop="stylename" />
      <el-table-column align="center" label="面积" prop="area" />
      <el-table-column align="center" label="朝向" prop="orientation" />
      <el-table-column align="center" label="状态" prop="usestatus">
        <template slot-scope="{row}">
          <el-tag :type="row.usestatus | statusFilter">{{ row.usestatus | userstatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" prop="sellprice" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
        <template slot-scope="{row}">
          <el-button
            v-permission="['POST /api/v1/cemetery/edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            v-if="row.usestatus == 1"
            v-permission="['GET /api/v1/cemetery/del']"
            type="danger"
            size="mini"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页展示-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="墓园选择" prop="classify_id">
          <el-select
            v-model="dataForm.garden_id"
            placeholder="选择墓园"
            clearable
            class="filter-item"
            @change="handle_area"
          >
            <el-option
              v-for="item in garden"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="墓区选择" prop="classify_id">
          <el-select v-model="dataForm.classify_id" clearable placeholder="请选择">
            <el-option
              v-for="item in area"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型选择" prop="style_id">
          <el-select v-model="dataForm.style_id" clearable placeholder="请选择" @change="getstyle">
            <el-option
              v-for="item in style"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="墓型选择" prop="type_id">
          <el-select v-model="dataForm.type_id" clearable placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model.number="dataForm.area" />
        </el-form-item>
        <el-form-item label="朝向" prop="orientation">
          <el-input v-model.number="dataForm.orientation" />
        </el-form-item>
        <el-form-item label="排" prop="ix">
          <el-input v-model.number="dataForm.ix" />
        </el-form-item>
        <el-form-item v-if="flag" label="号" prop="iy">
          <el-input v-model.number="dataForm.iy" />
        </el-form-item>
        <template v-if="!flag">
          <el-form-item label="起" prop="star">
            <el-input v-model.number="dataForm.star" placeholder="1" />
          </el-form-item>
          <el-form-item label="止" prop="end">
            <el-input v-model.number="dataForm.end" placeholder="20" />
          </el-form-item>
        </template>
        <el-form-item label="价格" prop="sellprice">
          <el-input v-model="dataForm.sellprice" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <template v-if="dialogStatus=='create'">
          <el-button type="primary" @click="createflag">{{ flag == true ? '批量添加' : '单座添加' }}</el-button>
          <el-button type="primary" @click="createData">确定</el-button>
        </template>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listGrave, createGrave, updateGrave, deleteGrave } from '@/api/grave'
import { get_styles, get_types } from '@/api/cemetery'
import { parseTime } from '@/utils'
import { classifyList, listArea } from '@/api/area'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'

export default {
  name: 'VueArea',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      list: [],
      total: 0,
      garden: null,
      area: null,
      style: null,
      type: null,
      flag: false,
      listLoading: true,
      downloadLoading: false,
      dialogFormVisibles: false,
      listQuery: {
        page: 1,
        limit: 40,
        sort: 'add_time',
        order: 'desc',
        keyword: '',
        y_id: '',
        q_id: '',
        type_id: '',
        style_id: '',
        usestatus: '',
        ismerge: 1
      },
      dataForm: {
        garden_id: '',
        classify_id: '',
        type_id: '',
        style_id: '',
        ix: '',
        iy: '',
        area: '',
        orientation: '',
        sellprice: ''
      },

      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        // vno: [{ required: true, message: '墓号不能为空', trigger: 'blur' }],
        classify_id: [{ required: true, message: '墓区不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {
    this.getList()
    classifyList().then(res => {
      this.garden = res.data
    })
    get_styles().then(res => {
      this.style = res.data
    })
    get_types().then(res => {
      this.type = res.data.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      listGrave(this.listQuery)
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
    handle_area() {
      this.area = []
      this.listQuery.q_id = ''
      this.dataForm.classify_id = ''
      const data = {
        pid: this.listQuery.y_id || this.dataForm.garden_id,
        limit: 100
      }
      listArea(data)
        .then(res => {
          this.area = res.data.data
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    resetForm() {
      this.dataForm = {
        garden_id: '',
        classify_id: '',
        type_id: '',
        style_id: '',
        ix: '',
        iy: '',
        area: '',
        orientation: '',
        sellprice: '',
        star: '',
        end: ''
      }
      this.area = []
      this.listQuery.q_id = ''
      this.listQuery.y_id = ''
    },
    createflag() {
      if (this.flag == true) {
        this.flag = false
        this.dataForm.iy = ''
      } else {
        this.flag = true
        this.dataForm.star = ''
        this.dataForm.end = ''
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
          createGrave(this.dataForm)
            .then(res => {
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '添加墓穴成功'
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
    getstyle() {
      this.style.forEach(v => {
        if (v.id == this.dataForm.style_id) {
          this.dataForm.sellprice = v.price
        }
      })
    },

    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.handle_area()
      this.dataForm.classify_id = row.classify_id
      this.flag = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateGrave(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '更新墓穴成功'
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
      deleteGrave(row)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除墓穴成功'
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['cname', 'y_name', 'usestatus']
        const filterVal = ['cname', 'y_name', 'usestatus']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '公墓管理'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    matching(arr, id) {
      return arr.find(item => item.id === id)
    }

  }
}
</script>
<style>
#cemeterys .el-dialog {
  width: 900px;
}
</style>
