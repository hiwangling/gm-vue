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
      <el-table-column align="center" label="原墓位" prop="old_cname" />
      <el-table-column align="center" label="新墓位" prop="new_cname" />
      <el-table-column align="center" label="逝者姓名" prop="bury_name" />
      <el-table-column align="center" label="联系人" prop="buyer_name" />

      <el-table-column align="center" label="操作人" prop="sellname" />
      <el-table-column align="center" label="操作时间" prop="create_time" />
      <el-table-column align="center" label="金额" prop="sum_price" />

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
import { trade } from '@/api/stats'
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

        keyword: undefined,

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

      trade(this.listQuery)
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
