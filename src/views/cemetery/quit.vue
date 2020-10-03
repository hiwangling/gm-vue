<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓位名称" />
      <el-button v-permission="['GET /api/v1/cemetery_classify/g_list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓位名称" prop="old_name" />
      <el-table-column align="center" label="逝者姓名" prop="buryname" />
      <el-table-column align="center" label="联系人" prop="linkname" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="备注" prop="vcnote" />
      <el-table-column align="center" label="操作时间" prop="create_time" />
      <el-table-column align="center" label="操作人" prop="operate_name" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button v-permission="['GET /api/v1/cemetery/del']" type="primary" size="mini" @click="handlereturn(scope.row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>
<script>
import { get_historyList_bymove, move_cemetery_revoke } from '@/api/cemetery'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'

export default {
  name: 'VueGarden',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: '',
        photo: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        type_name: [{ required: true, message: '墓园名称不能为空', trigger: 'blur' }]
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
      get_historyList_bymove(this.listQuery)
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

    handlereturn(row) {
      this.$confirm('您确认撤销吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          cid: row.old_cid
        }
        move_cemetery_revoke(data).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getList()
        }).catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>
