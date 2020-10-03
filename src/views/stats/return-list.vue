<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-show="show == 1"
        v-model="listQuery.search_data"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入关键字"
      />
      <el-date-picker
        v-show="show == 2 || show == 3"
        v-model="listQuery.contrast_years"
        type="year"
        class="filter-item"
        style="width:150px"
        value-format="yyyy"
        placeholder="选择年份"
      />
      <el-date-picker
        v-show="show == 3 || show == 1"
        v-model="listQuery.startime"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-show="show == 3 || show == 1"
        v-model="listQuery.endtime"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(show)">查找</el-button>
      <el-radio-group v-model="show" size="small" class="filter-item" style="float:right">
        <el-radio-button :label="1">表格统计</el-radio-button>
        <el-radio-button :label="2">年度统计</el-radio-button>
        <el-radio-button :label="3">墓区统计</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="show == 1">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="墓穴位置" prop="classify_name" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.garden_name }}{{ scope.row.classify_name }}{{ scope.row.cname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人" prop="buyer_name" />
        <el-table-column align="center" label="联系电话" prop="phone" />
        <el-table-column align="center" label="操作人" prop="sellname" />
        <el-table-column align="center" label="操作时间" prop="order_begin" />
        <el-table-column align="center" label="金额" prop="sum_price" />
        <el-table-column align="center" label="备注" prop="vcdesc" />
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <line-chart
      v-if="show == 2"
      :chart-data="lineChartData"
      :auto-resize="true"
      :legend-data="lineLegendData"
      :chart-year="lineChartYear"
      :chart-title="lineChartTitle"
    />
    <pie-chart
      v-if="show == 3"
      :chart-data="PieChartData"
      :char-title="PieChartTitle"
      :legend-data="PieChartlegend"
      :actual-data="PieActualData"
      rose-type
    />
  </div>
</template>
<script>
import { monthCartogram, classifyCartogram, statquit } from '@/api/stats'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
import LineChart from '@/components/LineChart'
import PieChart from '@/components/PieChart'
export default {
  name: 'VueGarden',
  components: { LineChart, Pagination, PieChart },
  mixins: [vuexData],
  data() {
    return {
      show: 1,
      lineChartData: {},
      lineChartYear: [],
      lineLegendData: [],
      PieChartData: {},
      PieChartTitle: [],
      PieChartlegend: {},
      PieActualData: {},
      lineChartTitle: '',
      list: null,
      total: 0,
      year: 2020,
      listLoading: true,
      downloadLoading: false,
      listLoadingserver: false,
      listQuery: {
        page: 1,
        limit: 20,
        contrast_years: null,
        startime: null,
        endtime: null,
        search_data: '',
        financetype: 6,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  computed: {},
  watch: {
    show: {
      handler(val) {
        this.listQueryRest()
        this.handleFilter(val)
      }
    }
  },
  created() {
    this.getList()
    this.getmonth()
    this.gettogram()
  },
  methods: {
    getList() {
      this.listLoading = true
      statquit(this.listQuery)
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
    getmonth() {
      monthCartogram(this.listQuery)
        .then(res => {
          this.lineChartData = {
            expectedData: res.data.contrast_price || [],
            actualData: res.data.price
          }
          this.lineChartYear = res.data.month
          this.lineLegendData = {
            expectedData: this.listQuery.contrast_years == null ? [] : [`${this.listQuery.contrast_years}年退墓统计`],
            actualData: [`${this.year}年退墓统计`]
          },
          this.lineChartTitle = '退墓统计'
        })
    },
    gettogram() {
      classifyCartogram(this.listQuery)
        .then(res => {
          this.PieChartTitle = '各墓区退墓占比'
          var list = []
          var legend = []
          var Actual = []
          res.data.forEach((v, x) => {
            var data = { name: v.type_name, value: parseInt(v.price) }
            var data_ = { name: v.type_name, value: parseInt(v.number) }
            legend.push(v.type_name)
            list.push(data)
            Actual.push(data_)
          })
          this.PieActualData = Actual
          this.PieChartData = list
          this.PieChartlegend = {
            type: 'scroll',
            orient: 'vertical',
            right: 100,
            borderColor: '#ccc',
            top: 0,
            bottom: 20,
            data: legend
          }
        })
    },
    listQueryRest() {
      this.listQuery = {
        page: 1,
        limit: 20,
        contrast_years: null,
        startime: null,
        endtime: null,
        search_data: '',
        financetype: 6,
        sort: 'add_time',
        order: 'desc'
      }
    },
    handleFilter(v) {
      this.listQuery.page = 1
      switch (v) {
        case 1:
          this.getList()
          break
        case 2:
          this.getmonth()
          break
        case 3:
          this.gettogram()
          break
        default:
      }
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   statservices(this.listQuery)
    //     .then(res => {
    //       this.export_list = res.data
    //       import('@/vendor/Export2Excel').then(excel => {
    //         const filterVal = ['title', 'count_id', 'sum_price', 's_type']
    //         const tHeader = ['服务名称', '数量', '总价', '服务类型']
    //         const data = this.formatJson(filterVal, this.export_list)
    //         excel.export_json_to_excel({
    //           header: tHeader,
    //           data,
    //           filename: '服务单'
    //         })
    //         this.downloadLoading = false
    //       })
    //     })
    // },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }

  }
}
</script>
<style  >
</style>
