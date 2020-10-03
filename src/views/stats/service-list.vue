<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-select
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
      </el-select> -->
      <el-date-picker
        v-model="listQuery.startime"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-button
        v-permission="['GET /api/v1/stat/buy_services_list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="dialogFormVisible = true"
      >筛选服务
      </el-button>
      <!-- <el-select v-model="listQuery.usestatus" placeholder="选择状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value, item) in cemetery.u" :key="item" :label="value" :value="item" />
      </el-select> -->
      <el-button
        v-permission="['GET /api/v1/stat/buy_services_list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
      <el-radio-group v-model="show" size="small" class="filter-item" style="float:right">
        <el-radio-button :label="1">表格统计</el-radio-button>
        <el-radio-button :label="2">图表统计</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="show == 1">
      <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" label="服务项目" prop="sell_title" />
        <el-table-column align="center" label="单位" prop="chargeunit" />
        <el-table-column align="center" label="数量" prop="number" />
        <el-table-column align="center" label="金额" prop="price" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      title="选择服务"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="listQuery.sid">
        <el-checkbox
          v-for="(value, item) in getservice"
          :key="item"
          style="width:110px"
          :label="value.id"
        >{{ value.service_name }}
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelData">取消</el-button>
        <el-button type="primary" @click="checkData">确定</el-button>
      </div>
    </el-dialog>

    <pie-chart
      v-if="show == 2"
      :chart-data="PieChartData"
      :char-title="PieChartTitle"
      :legend-data="PieChartlegend"
      :actual-data="PieActualData"
      rose-type
    />
  </div>
</template>
<script>

import { detailStat } from '@/api/stats'
import { listService } from '@/api/service'
import { classifyList, listArea } from '@/api/area'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'
import PieChart from '@/components/PieChart'
export default {
  name: 'VueSaveList',
  components: { Pagination, PieChart },
  mixins: [page, vuexData],
  data() {
    return {
      show: 1,
      PieChartData: {},
      PieChartTitle: [],
      PieChartlegend: {},
      PieActualData: {},
      list: null,
      export_list: null,
      total: 0,
      listLoading: true,
      area: null,
      garden: '',
      checkAll: false,
      getservice: null,
      isIndeterminate: true,
      dialogFormVisible: false,
      downloadLoading: false,
      exportFileName: '',
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        q_id: '',
        y_id: '',
        // type_id: '',
        // style_id: '',
        startime: '',
        endtime: '',
        sort: 'add_time',
        order: 'desc',
        sid: []
      }
    }
  },
  computed: {},
  created() {
    this.getList()
    classifyList().then(res => {
      this.garden = res.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = { limit: 1000 }
      listService(data)
        .then(res => {
          this.getservice = res.data.data
        })
        .catch(() => {
          this.getservice = []
        })
      detailStat(this.listQuery)
        .then(res => {
          this.list = res.data
          this.total = 0
          this.listLoading = false

          var list = []
          var Actual = []
          var legend = []
          res.data.forEach((v, x) => {
            var data = { name: v.sell_title, value: parseInt(v.price) }
            var data_ = { name: v.sell_title, value: parseInt(v.number) }
            legend.push(v.sell_title)
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
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handle_area() {
      this.area = []
      this.listQuery.q_id = ''
      const data = {
        pid: this.listQuery.y_id,
        limit: 100
      }
      listArea(data)
        .then(res => {
          this.area = res.data.data
        })
    },
    checkData() {
      this.dialogFormVisible = false
    },
    cancelData() {
      this.dialogFormVisible = false
      this.listQuery.sid = []
    },
    handleCheckAllChange(val) {
      if (val) {
        this.getservice.forEach((v, k) => {
          this.listQuery.sid.push(v.id)
        })
      } else {
        this.listQuery.sid = []
      }
      this.isIndeterminate = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      export_services_stat(this.listQuery)
        .then(res => {
          this.export_list = res.data
            import('@/vendor/Export2Excel').then(excel => {
              const filterVal = ['seatname', 'typename', 'stylename', 'muzhu_name', 'sell_title', 'unit_price', 'amount', 'real_price']
              const tHeader = ['墓穴位置', '墓位类型', '墓穴样式', '使用人姓名', '服务项目', '单价', '数量', '实收价格']
              const data = this.formatJson(filterVal, this.export_list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: this.exportFileName === '' ? '服务统计' : this.exportFileName
              })
              this.downloadLoading = false
            })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.orderlist.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
