<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 150px;" placeholder="请输入墓穴名称" /> -->
      <!-- <el-select v-model="listQuery.y_id" placeholder="选择墓园" clearable style="width: 120px" class="filter-item" @change="getarea()">
        <el-option v-for="item in cemetery.g" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.q_id" placeholder="选择墓区" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in area" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.type_id" placeholder="选择类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.t" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.style_id" placeholder="选择样式" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.s" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.begindate"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="listQuery.enddate"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      /> -->
      <!-- <el-select v-model="listQuery.usestatus" placeholder="选择状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value, item) in cemetery.u" :key="item" :label="value" :value="item" />
      </el-select> -->

      <el-date-picker
        v-model="listQuery.begindate"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="listQuery.enddate"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-button v-permission="['GET /api/v1/cemetery/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload(1)">导出墓型</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload(2)">导出安葬</el-button>
      <div style="color:red">* 输入时间条件查询时开始与结束必须全部选择，否则无法查询。</div>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;">
        本月统计
      </el-checkbox> -->
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row style="width:50%;float:left">
      <el-table-column align="center" label="墓型名称" prop="type_name" />
      <el-table-column align="center" label="当月销售数" prop="sl" />
    </el-table>
    <el-table :data="lists" element-loading-text="正在查询中。。。" border fit highlight-current-row style="width:50%;float:right">
      <el-table-column align="center" label="安放性别" prop="sex" />
      <el-table-column align="center" label="安放数量" prop="sl" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { buy_zsjtj_list } from '@/api/stats'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'

export default {
  name: 'VueSaveList',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      lists: null,
      export_list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 1000,
        sort: 'add_time',
        order: 'desc'
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
      buy_zsjtj_list(this.listQuery)
        .then(res => {
          this.list = res.data.style
          this.lists = res.data.bury
          // console.log(this.list)
          // this.total = res.data.total || 0
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
    handleDownload(v) {
      const b = v
      buy_zsjtj_list(this.listQuery)
        .then(res => {
          if (b == 1) {
            this.export_list = res.data.style
          } else {
            this.export_list = res.data.bury
          }
        })
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        if (b == 1) {
          const filterVal = ['type_name', 'sl']
          const tHeader = ['墓型名称', '当月销售额']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '墓型销售统计'
          })
        } else {
          const filterVal = ['sex', 'sl']
          const tHeader = ['安放性别', '安放数量']
          const data = this.formatJson(filterVal, this.lists)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '安葬数量统计'
          })
        }
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
