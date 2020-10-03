<template>
  <div class="app-container">
    <div class="filter-container" style="height:50px">
      <el-input
        v-show="show == 1"
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入关键字"
      />
      <el-date-picker
        v-show="show == 2"
        v-model="listQuery.years"
        type="year"
        class="filter-item"
        style="width:150px"
        value-format="yyyy"
        placeholder="选择年份"
      />
      <el-date-picker
        v-show="show == 1"
        v-model="listQuery.startime"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-show="show == 1"
        v-model="listQuery.endtime"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />

      <el-button v-show="show == 1 || show == 2" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(show)">查找</el-button>
      <el-radio-group v-model="show" size="small" class="filter-item" style="float:right">
        <el-radio-button :label="1">文字统计</el-radio-button>
        <el-radio-button :label="2">按年度统计</el-radio-button>
        <el-radio-button :label="3">年龄统计</el-radio-button>
        <el-radio-button :label="4">性别统计</el-radio-button>
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
        <el-table-column align="center" label="墓位" prop="area_name" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.garden_name }}{{ scope.row.classify_name }}{{ scope.row.cname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" prop="style_name" />
        <el-table-column align="center" label="使用人" prop="vcname" />
        <el-table-column align="center" label="性别" prop="sex" />
        <el-table-column align="center" label="出生日期" prop="birth" />
        <el-table-column align="center" label="死亡日期" prop="death" />
        <el-table-column align="center" label="安葬日期" prop="bury" />

      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <grave-chart
      v-if="show == 2"
      :chart-data="lineChartData"
      :chart-type="lineChartType"
      :chart-title="lineChartTitle"
      :chart-current="lineChartCurrent"
      :auto-resize="true"
      :legend-data="lineLegendData"
      :chart-year="lineChartYear"
      @xData="handleTooltip"
    />

    <pie-chart
      v-if="show == 3 || show == 4"
      :chart-data="PieChartData"
      :char-title="PieChartTitle"
      :legend-data="PieChartlegend"
      :actual-data="PieActualData"
      rose-type
    />

  </div>
</template>
<script>
import { buryMonth, buyMonth, buryType, az_bury_list } from '@/api/stats'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
import GraveChart from '@/components/LineChart'
import PieChart from '@/components/PieChart/order'
export default {
  name: 'VueGarden',
  components: { GraveChart, Pagination, PieChart },
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
      lineChartCurrent: 'year',
      list: null,
      total: 0,
      year: 2020,
      lineChartType: true,
      listLoading: true,
      downloadLoading: false,
      listLoadingserver: false,
      listQuery: {
        page: 1,
        limit: 20,
        years: '2020',
        financetype: 2,
        startime: null,
        endtime: null,
        keyword: '',
        sort: 'add_time',
        order: 'desc'
      },
      txt: '全部园区',

      month: null,
      day: null,

      area: [],

      listLoading_month: false,
      listLoading_day: false,

      year_: '2020',
      year_text: '',
      month_text: '',
      classify: '',
      sum: 0
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
      az_bury_list(this.listQuery)
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
      this.listLoading = true
      buryMonth(this.listQuery)
        .then(res => {
          this.listLoading = false
          this.lineChartData = {
            expectedData: [],
            actualData: res.data.number
          }
          this.lineChartType = false
          this.lineChartCurrent = 'year'
          this.lineChartYear = res.data.month
          this.lineLegendData = {
            expectedData: [],
            actualData: [`安葬人数`]
          }
          this.lineChartTitle = `${this.listQuery.years}年安葬人数`
        })
    },
    gettogram() {
      buryType()
        .then(res => {
          var age
          age = this.show == 3 ? res.data.age : res.data.sex
          this.PieChartTitle = this.show == 3 ? `各年龄段占比` : `男女占比`
          console.log(age)
          var list = []
          var legend = []
          age.forEach((v, x) => {
            var data = { name: v.title, value: parseInt(v.number) }
            legend.push(v.title)
            list.push(data)
          })

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

    handleTooltip(v) {
      this.getYear(v)
    },
    getYear(v) {
      this.year_text = v
      const data = { years: v || this.listQuery.years }
      buyMonth(data)
        .then(res => {
          this.lineChartData = {
            expectedData: res.data.number,
            actualData: res.data.price
          }
          this.lineChartType = false
          this.lineChartCurrent = 'year'
          this.lineChartYear = res.data.month
          this.month = res.data.list
          this.lineLegendData = {
            expectedData: [`销售数量`],
            actualData: [`销售金额`]
          }
          this.lineChartTitle = `${v}年墓穴销售数量与金额`
        })
    },

    listQueryRest() {
      this.listQuery = {
        page: 1,
        limit: 20,
        years: '2020',
        startime: null,
        endtime: null,
        search_data: '',
        financetype: 2,
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
        case 4:
          this.gettogram()
          break
        default:
      }
    }

  }
}
</script>
<style>
.cols {
  border: 1px solid #ddd;
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
  width: 200px;
}
.cols .title {
  display: inline-block;
  line-height: 20px;
  min-width: 40px;
  font-size: 14px;
}
.cols ul {
  padding: 0;
  margin: 0;
}
.cols li {
  height: 25px;
  list-style-type: none;
  line-height: 25px;
  cursor: pointer;
}
.cols li:first-child {
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.cols .title {
  color: #868383;
}
.cols .text {
  font-size: 16px;
  color: #e64a4a;
  font-weight: 800;
}
.cols_month .text {
  color: #068faf;
}
.cols_day .text {
  color: #6369bd;
}
.title_ {
  font-size: 14px;
  height: 25px;
  line-height: 25px;
  text-align: left;
  padding-left: 16px;
  margin: 5px 0;
  color: #323233;
  border-left: 4px solid #4ebff1;
}
.title_ strong {
  color: #e64a4a;
}
.active{
  background: #5ba4a7;
  border: 1px solid #5ba4a7;
  }
.active .text,.active .title{
  color: #fff;
}
</style>
