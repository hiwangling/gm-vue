<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 150px;" placeholder="请输入墓穴名称" />

      <el-select v-model="listQuery.q_id" placeholder="选择墓区" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in area" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.lamp_nd"
        style="width: 120px"
        class="filter-item"
        type="year"
        value-format="yyyy"
        placeholder="点灯时间"
      />
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
      <!--      <el-select v-model="listQuery.pay_type" placeholder="支付类型" clearable style="width: 120px" class="filter-item">-->
      <!--        <el-option v-for="item in pay_type" :key="item.id" :label="item.name" :value="item.id" />-->
      <!--      </el-select>-->
      <!-- <el-select v-model="listQuery.isvoice" placeholder="是否开票" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in isvoice" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <el-button
        v-permission="['GET /api/v1/stat/buy_lightup_list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
      <!-- <el-button v-permission="['POST /api/v1/cemetery/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button> -->
      <!--      <el-button v-permission="['GET /api/v1/stat/export_lightup_stat']" class="filter-item" type="primary"-->
      <!--                 icon="el-icon-print" @click="handleprint">打印-->
      <!--      </el-button>-->
      <!-- <el-input v-model="exportFileName" clearable class="filter-item" style="width: 150px;" placeholder="请输入文件名称" />
      <el-button
        v-permission="['GET /api/v1/stat/export_lightup_stat']"
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出
      </el-button> -->
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <!-- <el-table-column align="center" label="订单号" prop="order_no" /> -->
      <el-table-column align="center" label="墓穴位置" prop="seatname" />
      <el-table-column align="center" label="使用人" prop="muzhu_name" />
      <el-table-column align="center" label="购买人" prop="buyer_name" />
      <el-table-column align="center" label="电话" prop="phone" />
      <el-table-column align="center" label="实收价格" prop="real_price" />
      <el-table-column align="center" label="点灯时间" prop="lamp_nd" />
      <el-table-column align="center" label="支付方式" prop="pay_type" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.pay_type | or_status">
            {{ scope.row.pay_type == 0 ? '线下支付' : '微信支付' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="sellname" />
      <!-- <el-table-column align="center" label="支付方式" prop="isvoice" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isvoice | or_status">
            {{ scope.row.isvoice == 0 ? '未开票' : '已开票' }}
          </el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lampPrint(scope.row)">打印</el-button>

        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <lamp v-show="false" ref="lamp_" />

  </div>
</template>
<script>
import { buy_lightup_list, export_lightup_stat, export_lightup_statdy } from '@/api/stats'

import { get_areas } from '@/api/cemetery'
import lamp from '@/components/Print/lamp'

import Pagination from '@/components/Pagination'

import { page, vuexData } from '@/utils/mixin'

export default {
  name: 'VueSaveList',
  components: { Pagination, lamp },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      export_list: null,
      total: 0,
      listLoading: true,
      area: null,
      garen_id: '',
      downloadLoading: false,
      exportFileName: '',
      pay_type: [{
        id: 0,
        name: '线下支付'
      }, {
        id: 1,
        name: '微信支付'
      }],
      isvoice: [{
        id: 0,
        name: '未开票'
      }, {
        id: 1,
        name: '已开票'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc',
        keyword: undefined,
        q_id: '',
        begindate: null,
        enddate: null,
        lamp_nd: '',
        pay_type: '',
        isvoice: ''
      }
    }
  },
  computed: {},
  created() {
    this.getList()
    this.inquery()
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = { pid: this.garden_id }
      get_areas(data)
        .then(res => {
          this.area = res.data
        })
      buy_lightup_list(this.listQuery)
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
    handleprint() {
      if (this.listQuery.q_id == '') {
        this.$notify.error({
          title: '错误',
          message: '必须选择一个墓区!'
        })
      } else {
        export_lightup_statdy(this.listQuery).then(res => {
          console.log('res11', res)
          let area_ = null
          this.area.forEach(v => {
            if (v.id == this.listQuery.q_id) {
              area_ = v.type_name
            }
          })
          const list_ = res.data
          const data = {
            list: list_,
            area: area_
          }
          this.$refs.lamp_.init(data)
        })
      }
    },
    handleDownload() {
      this.downloadLoading = true
      export_lightup_stat(this.listQuery)
        .then(res => {
          this.export_list = res.data
          for (let i = 0; i < this.export_list.length; i++) {
            if (this.export_list[i].pay_type == 0) {
              this.export_list[i].pay_type = '线下支付'
            } else {
              this.export_list[i].pay_type = '微信支付'
            }
          }
            import('@/vendor/Export2Excel').then(excel => {
              const filterVal = ['seatname', 'muzhu_name', 'buyer_name', 'phone', 'real_price', 'lamp_nd', 'pay_type', 'sellname']
              const tHeader = ['墓穴位置', '使用人', '购买人', '电话', '实收价格', '点灯时间', '支付方式', '操作人']
              const data = this.formatJson(filterVal, this.export_list)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: this.exportFileName === '' ? '点灯统计' : this.exportFileName
              })
              this.downloadLoading = false
            })
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
