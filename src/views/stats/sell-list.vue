<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.search_data"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入墓穴名称"
      />

      <el-date-picker
        v-model="listQuery.paystartime"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="listQuery.payendtime"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />

      <el-button
        v-permission="['GET /api/v1/stat/az_bury_list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" label="墓穴位置" prop="classify_name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.garden_name }}{{ scope.row.classify_name }}{{ scope.row.cname }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="逝者姓名" prop="bury_name" /> -->
      <el-table-column align="center" label="联系人" prop="buyer_name" />
      <el-table-column align="center" label="联系电话" prop="phone" />

      <el-table-column align="center" label="销售金额" prop="sum_price" />
      <el-table-column align="center" label="销售类型" prop="financetype_name">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.financetype_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="sellname" />
      <el-table-column align="center" label="操作时间" prop="order_begin" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { todayOrder } from '@/api/stats'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'

export default {
  name: 'VueSaveList',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      export_list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: undefined,
        paystartime: '',
        payendtime: '',
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
      todayOrder(this.listQuery)
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
    }

  }
}
</script>
