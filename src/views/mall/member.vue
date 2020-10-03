<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入服务名称" />
      <el-button v-permission="['GET /api/v1/service_info/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/service_info/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>-->

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" prop="id" />
      <el-table-column align="center" label="头像" prop="headimgurl">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt width="30">
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名" prop="realname" />
      <el-table-column align="center" label="微信名" prop="nickname" />
      <el-table-column align="center" label="手机号" prop="mobile" />
      <el-table-column align="center" label="所属城市" prop="city" />
      <el-table-column align="center" label="性别" prop="sex">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sex == 1 ? '男' : '女' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" prop="create_time" />
      <!-- <el-table-column align="center" label="openid" prop="openid" /> -->
      <!-- <el-table-column align="center" label="操作" class-name="small-padding" width="120">
        <template slot-scope="scope">
          <el-button v-permission="['POST /api/v1/service_info/edit']" type="danger" size="mini" @click="handledel(scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
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
import { memberlist, memberdel } from '@/api/goods'
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'
export default {
  name: 'ServiceCombo',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      uploadPath,
      dialogFormVisinfo: false,
      list: null,
      info_: {},
      total: 0,
      listLoading: true,
      filename: '',
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      server: [],
      info: {

      },
      back_info: {},
      dataForm: {
        id: '',
        rid: '',
        operate_id: '',
        operate_name: '',
        execnote: '',
        video_thumb: '',
        images: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      type: [],

      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {

      }
    }
  },
  computed: {
    headers() {
      return {
        token: getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      memberlist(this.listQuery)
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

    handleDelete(row) {
      this.$confirm('您确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { id: row.id }
        memberdel(data).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }

  }
}
</script>
<style>
.menu {
  padding: 10px;
}
.menu_box {
  border: 1px solid #ebedf0;
  background-color: #f6f6f6;
}
.bespeakinfo li {
  list-style-type: none;
  height: 35px;
  line-height: 35px;
}
.menu_box > h3 {
  height: 35px;
  line-height: 40px;
  font-size: 16px;
  padding-left: 5px;
  margin: 0;
  text-align: center;
  border-top: 1px solid #eee;
}
.menu-centent {
  display: flex;
  justify-content: space-between;
}
.menu-centent > div {
  padding: 10px;
}
.bespeakinfo {
  flex: 1;
  text-align: left;
  margin: 0;
  border-radius: 5px;
  padding: 5px;
  font-size: 16px;
  margin-top: 0;
}
.default {
  /* background: #fff; */
}
.actives {
  background: #15a892;
}
.bespeakinfo li:first-child {
  border-bottom: 1px solid #eee;
}
.bespeakinfo .title {
  display: inline-block;
  line-height: 22px;
  min-width: 22px;
}
.txt_p {
  text-indent: 2em;
  color: #666;
  text-align: justify;
  line-height: 25px;
  font-size: 14px;
  padding: 5px;
}
.txt_p p {
  margin: 0;
}
.default .title {
  color: #999;
}
.bespeakinfo .text {
  text-align: left;
}
.default .text {
  color: #000;
}
.actives .text,
.actives .title {
  color: #fff;
}
</style>

