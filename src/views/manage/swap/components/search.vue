<template>
  <el-dialog
    id="search"
    :close-on-click-modal="false"
    class="dialog"
    :title="dialogStatus"
    :visible.sync="dialogFormVisible"
    top="5vh"
    append-to-body
  >
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        size="mini"
        clearable
        class="filter-item"
        style="width:150px"
        placeholder="请输入墓穴名称"
      />
      <el-select
        v-model="listQuery.y_id"
        placeholder="选择墓园"
        clearable
        size="mini"
        style="width:120px"
        class="filter-item"
        @change="handle_area"
      >
        <el-option v-for="item in garden" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.q_id"
        style="width:120px"
        size="mini"
        placeholder="选择墓区"
        clearable
        class="filter-item"
      >
        <el-option v-for="item in area" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.type_id"
        style="width:120px"
        size="mini"
        placeholder="选择类型"
        clearable
        class="filter-item"
      >
        <el-option v-for="item in type" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.style_id"
        style="width:120px"
        size="mini"
        placeholder="选择墓型"
        clearable
        class="filter-item"
      >
        <el-option v-for="item in style" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>

      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'sort',order:'ascending'}"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column align="center" label="墓区" prop="classifyname" />
      <el-table-column align="center" label="墓号" prop="cname" />
      <el-table-column align="center" label="墓型" prop="typename" />
      <el-table-column align="center" label="样式" prop="stylename" />
      <el-table-column align="center" label="面积" prop="area" />
      <el-table-column align="center" label="朝向" prop="orientation" />
      <el-table-column align="center" label="价格" prop="sellprice" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </el-dialog>
</template>
<script>
import { page, vuexData } from '@/utils/mixin'
import Pagination from '@/components/Pagination'
import { listGrave } from '@/api/grave'
import { get_styles, get_types } from '@/api/cemetery'
import { classifyList, listArea } from '@/api/area'

export default {
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      total: 0,
      garden: null,
      area: null,
      style: null,
      type: null,

      dialogStatus: '',
      listLoading: true,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'add_time',
        order: 'desc',
        keyword: undefined,
        q_id: '',
        type_id: '',
        style_id: '',
        usestatus: 1
      }
    }
  },
  created() {
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
    async getList() {
      this.listLoading = true
      await listGrave(this.listQuery)
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
    show() {
      this.dialogStatus = '墓穴查询'
      this.dialogFormVisible = true

      this.getList()
    },
    handle_area() {
      this.area = []
      this.listQuery.q_id = ''
      const data = {
        pid: this.listQuery.y_id,
        limit: 100
      }
      console.log(data)
      listArea(data)
        .then(res => {
          this.area = res.data.data
        })
    },
    handleCurrentChange(val) {
      if (val != null) {
        this.dialogFormVisible = false
        this.$emit('getname', val)
      }
    }

  }
}
</script>
<style scope>
#search .el-input--medium .el-input__inner {
  width: auto;
}
</style>

