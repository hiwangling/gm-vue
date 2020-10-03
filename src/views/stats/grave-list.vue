<template>
  <div class="app-container">
    <div class="filter-container" style="height:50px">
      <el-date-picker
        v-show="show == 3 || show == 4"
        v-model="listQuery.years"
        type="year"
        class="filter-item"
        style="width:150px"
        value-format="yyyy"
        placeholder="选择年份"
      />
      <el-date-picker
        v-show="show == 3 || show == 4"
        v-model="listQuery.startime"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-show="show == 3 || show == 4"
        v-model="listQuery.endtime"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />

      <el-button v-show="show != 1" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(show)">查找</el-button>
      <el-radio-group v-model="show" size="small" class="filter-item" style="float:right">
        <el-radio-button :label="1">文字统计</el-radio-button>
        <el-radio-button :label="2">按年度统计</el-radio-button>
        <el-radio-button :label="3">按墓区统计</el-radio-button>
        <el-radio-button :label="4">按金额统计</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="show == 1">
      <div v-loading="listLoading">
        <div v-if="list">
          <div class="title_">
            销售年统计
            <strong>({{ txt }})</strong>
          </div>
          <el-row type="flex" style="flex-wrap:wrap;margin-bottom:10px;">
            <el-col
              v-for="(item,index) in list"
              :key="index"
              class="cols"
              :class="item.years == year_text ? 'active' : ''"
            >
              <ul style="height:90px" @click="getYear(item.years)">
                <li>
                  <span class="text">{{ item.years }}年</span>
                </li>
                <li>
                  <span class="title">已售出 :</span>
                  <span class="text">
                    {{ item.number }}
                    <span v-show="item.number>0">座</span>
                  </span>
                </li>
                <li>
                  <span class="title">总售价 :</span>
                  <span class="text">
                    {{ item.price }}
                    <span v-show="item.price>0">元</span>
                  </span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-loading="listLoading_month">
        <div v-if="month && month.length>0">
          <div class="title_">
            销售月统计
            <strong>({{ year_text }}年)</strong>
          </div>
          <el-row :gutter="20" style="padding-top:5px;border: 1px solid #eee;">
            <el-col
              v-for="(item,index) in month"
              :key="index"
              :span="4"
              class="cols"
              :class="(index + 1) == month_text ? 'active' : ''"
              style="margin-bottom:10px;"
            >
              <ul style="height:90px" class="cols_month" @click="grave_list(index + 1)">
                <li>
                  <span class="text">{{ year_text }}年{{ index + 1 }}月</span>
                </li>
                <li>
                  <span class="title">已售出 :</span>
                  <span class="text">
                    {{ item.number }}
                    <span v-show="item.number>0">座</span>
                  </span>
                </li>
                <li>
                  <span class="title">总售价 :</span>
                  <span class="text">
                    {{ item.price }}
                    <span v-show="item.price>0">元</span>
                  </span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <div v-loading="listLoading_month">
        <div v-if="day && day.length>0">
          <div class="title_">
            销售日统计
            <strong>({{ month_text }}月)</strong>
          </div>
          <el-row
            v-loading="listLoading_day"
            type="flex"
            style="flex-wrap:wrap;padding:15px 5px 5px 5px;border: 1px solid #eee;"
          >
            <el-col v-for="(item,index) in day" :key="index" class="cols" style="margin-bottom:10px;">
              <ul style="height:90px" class="cols_day">
                <li>
                  <span class="text">{{ item.days }}</span>
                </li>
                <li>
                  <span class="title">已售出 :</span>
                  <span class="text">{{ item.count }}座</span>
                </li>
                <li>
                  <span class="title">总售价 :</span>
                  <span class="text">{{ item.sum }}元</span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </div> -->
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
    <el-dialog

      :close-on-click-modal="false"

      title="墓穴销售信息"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <el-table
        v-loading="listLoadings"
        :data="grave"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="墓穴位置" prop="garden_name" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.garden_name }}{{ scope.row.classify_name }}{{ scope.row.cname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="逝者姓名" prop="bury_name" />
        <el-table-column align="center" label="联系人" prop="buyer_name" />
        <el-table-column align="center" label="联系电话" prop="phone" />
        <el-table-column align="center" label="类型" prop="style_name" />
        <el-table-column align="center" label="操作人" prop="sellname" />
        <el-table-column align="center" label="金额" prop="sum_price" width="100">
          <template slot-scope="scope">
            <strong style="color:red">{{ scope.row.sum_price }}</strong>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { buyYears, buyMonth, buyClassify, orderListPage, buyPrice } from '@/api/stats'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
import GraveChart from '@/components/GraveChart'
import PieChart from '@/components/PieChart'
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
      dialogFormVisible: false,
      list: null,
      grave: null,
      total: 0,
      year: 2020,
      lineChartType: true,
      listLoading: true,
      listLoadings: true,
      downloadLoading: false,
      listLoadingserver: false,
      listQuery: {
        page: 1,
        limit: 20,
        years: '2020',
        financetype: 2,
        startime: null,
        endtime: null,
        search_data: '',
        days: '',
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
    this.getmonth()
    this.gettogram()
    this.statbuyPrice()
  },
  methods: {
    getList() {
      this.listLoadings = true
      orderListPage(this.listQuery)
        .then(res => {
          this.grave = res.data.data
          this.total = res.data.total || 0
          this.listLoadings = false
        })
        .catch(() => {
          this.grave = []
          this.total = 0
          this.listLoadings = false
        })
    },
    grave_list(v) {
      this.month_text = v
      this.listQuery.days = `${this.year_text}-${this.addzero(v)}`
      this.dialogFormVisible = true
      this.getList()
    },
    addzero(obj) {
      if (obj < 10) return '0' + '' + obj
      else return obj
    },
    getmonth() {
      this.listLoading = true
      buyYears(this.listQuery)
        .then(res => {
          var lineChartYear = []
          var actualData = []
          var expectedData = []
          this.list = res.data
          this.listLoading = false
          res.data.forEach((v, x) => {
            lineChartYear.push(v.years)
            actualData.push(v.price)
            expectedData.push(v.number)
          })
          this.lineChartData = {
            expectedData: expectedData,
            actualData: actualData
          }
          this.lineChartType = true
          this.lineChartCurrent = 'year'
          this.lineChartYear = lineChartYear
          this.lineLegendData = {
            expectedData: [`销售数量`],
            actualData: [`销售金额`]
          }
          this.lineChartTitle = `墓穴销售数量与金额`
        })
    },
    gettogram() {
      buyClassify(this.listQuery)
        .then(res => {
          // this.PieChartTitle = `${this.listQuery.years}年墓区销售金额和数量统计`
          var list = []
          var Actual = []
          var legend = []
          res.data.forEach((v, x) => {
            var data = { name: v.type_name, value: parseInt(v.price) }
            var data_ = { name: v.type_name, value: parseInt(v.number) }
            legend.push(v.type_name)
            list.push(data)
            Actual.push(data_)
          })

          this.PieChartData = list
          this.PieActualData = Actual
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
    statbuyPrice() {
      buyPrice(this.listQuery)
        .then(res => {
          this.PieChartTitle = `${this.listQuery.years}年销售数量统计`
          var list = []
          var Actual = []
          var legend = []
          res.data.forEach((v, x) => {
            var data = { name: v.sum_price, value: parseInt(v.price) }
            var data_ = { name: v.sum_price, value: parseInt(v.number) }
            legend.push(v.sum_price)
            list.push(data)
            Actual.push(data_)
          })

          this.PieChartData = list
          this.PieActualData = Actual
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

      // this.lineChartData = {
      //   expectedData: [3985, 4888, 7165, 2556, 4000, 5344, 1403, 2455, 1245, 2423, 5035, 2342],
      //   actualData: [8985, 6888, 7665, 4556, 6000, 6344, 1003, 4455, 3445, 3423, 5535, 3342]
      // }
      // this.lineChartType = true
      // this.lineChartCurrent = 'month'
      // this.lineChartYear = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    // getMonths(v) {
    //   var name = v.data.name
    //   this.lineChartData = {
    //     expectedData: [3985, 4888, 7165, 2556, 4000, 5344, 1403, 2455, 1245, 2423, 5035, 2342, 3985, 4888, 7165, 2556, 4000, 5344, 1403, 2455, 1245, 2423, 5035, 2342, 1403, 2455, 1245, 2423, 5035, 2342],
    //     actualData: [8985, 6888, 7665, 4556, 6000, 6344, 1003, 4455, 3445, 3423, 5535, 3342, 8985, 6888, 7665, 4556, 6000, 6344, 1003, 4455, 3445, 3423, 5535, 3342, 8985, 6888, 7665, 4556, 6000, 6344]
    //   }
    //   this.lineChartType = false
    //   this.lineChartYear = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号']
    //   this.lineChartTitle = `${name}墓穴销售数量与金额`
    // },
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
          this.statbuyPrice()
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
