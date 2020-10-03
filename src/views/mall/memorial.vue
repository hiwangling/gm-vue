<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入服务名称" />
      <el-button v-permission="['GET /api/v1/service_info/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/service_info/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div> -->

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="纪念馆名称" prop="title" />
      <el-table-column align="center" label="逝者名称" prop="buryname" />
      <el-table-column align="center" label="创建人" prop="member_realname" />
      <el-table-column align="center" label="联系电话" prop="member_mobile" />
      <el-table-column align="center" label="审核状态" prop="state">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.state == 1" type="danger">待审核</el-tag>
          <el-tag v-show="scope.row.state == 2">不通过</el-tag>
          <el-tag v-show="scope.row.state == 3" type="success">通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="250">
        <template slot-scope="scope">
          <el-button v-permission="['POST /api/v1/service_info/edit']" type="primary" size="mini" @click="handleinfo(scope.row)">详情</el-button>
          <el-button v-permission="['POST /api/v1/service_info/edit']" type="primary" size="mini" @click="getComments(scope.row)">留言管理</el-button>
          <el-button v-permission="['POST /api/v1/service_info/edit']" type="danger" size="mini" @click="handledelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" class="comments" title="留言列表" :visible.sync="dialogFormVisible">
      <el-table v-loading="listLoadings" :data="comments" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" label="留言人" prop="realname">
          <template slot-scope="scope">
            <span>{{ scope.row.realname || scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="留言内容" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">{{ scope.row.leaveword }}</span>
            <el-tag v-else type="danger">{{ scope.row.sid == 16 ? '献花' :'献灯' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="留言时间" prop="create_time" />
        <el-table-column align="center" label="操作" class-name="small-padding" width="120">
          <template slot-scope="scope">
            <el-button v-permission="['POST /api/v1/service_info/edit']" type="danger" size="mini" @click="handledel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="totals>0" :total="totals" :page.sync="listQuerys.page" :limit.sync="listQuerys.limit" @pagination="getComments" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible= false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormVisinfo">
      <div class="menus">
        <div v-for="(item,index) in info.people" :key="index" class="menu_box">
          <div class="menu-centent">
            <div>
              <img :src="info.vitrotype ? info.vitrotype : headimg" alt="" width="100">
            </div>
            <ul class="bespeakinfo default">
              <li>
                <span class="title">逝者姓名</span>
                <span class="text">{{ item.username }}</span>
              </li>
              <li>
                <span class="title">逝者性别</span>
                <span class="text">{{ item.sex }}</span>
              </li>
              <li>
                <span class="title">生辰日期</span>
                <span class="text">{{ item.birthday }}</span>
              </li>
              <li>
                <span class="title">逝世日期</span>
                <span class="text">{{ item.dieday }}</span>
              </li>
            </ul>
          </div>
          <h3>生平简介</h3>
          <div class="menu-centent txt_p">
            <p>{{ item.introduction }}</p>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisinfo= false">取消</el-button>
        <el-button v-show="info.state == 1 || info.state == 2" type="primary" @click="handleUpdate(3)">通过</el-button>
        <el-button v-show="info.state == 1 || info.state == 3" type="primary" @click="handleUpdate(2)">不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { memoriallist, memorialinfo, memorialstate, commentslist, commentsdel, memorialdel } from '@/api/goods'
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
      headimg: require('@/assets/img/head.png'),
      list: null,
      comments: null,
      info_: {},
      total: 0,
      totals: 0,
      listLoading: true,
      listLoadings: true,
      filename: '',
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      listQuerys: {
        page: 1,
        limit: 5,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc',
        mid: ''
      },

      info: {},

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
      memoriallist(this.listQuery)
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
    getComments(row) {
      this.listLoadings = true
      if (row) {
        this.listQuerys.mid = row.id
      }

      commentslist(this.listQuerys)
        .then(res => {
          this.comments = res.data.data
          this.totals = res.data.total || 0
          this.listLoadings = false
          this.dialogFormVisible = true
        })
        .catch(() => {
          this.comments = []
          this.totals = 0
          this.listLoadings = false
        })
    },
    handledel(row) {
      this.$confirm('您确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { id: row.id }
        commentsdel(data).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getComments()
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
    handledelete(row) {
      this.$confirm('您确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { id: row.id }
        memorialdel(data).then(res => {
          if (res.code == 0) {
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
    handleUpdate(v) {
      const data = {
        id: this.info.id,
        state: v,
        uid: this.info.uid,
        reason: ''
      }
      this.$confirm('确认执行此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        memorialstate(data).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
            this.dialogFormVisinfo = false
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
    handleinfo(row) {
      const data = { id: row.id }
      memorialinfo(data).then(res => {
        this.info = res.data
        this.dialogFormVisinfo = true
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

.menus {
    padding: 10px;
}
.menu_box{
 border: 1px solid #ebedf0;
 background-color: #f6f6f6;
}
.bespeakinfo li{
    list-style-type: none;
    height: 35px;
    line-height: 35px;
}
.menu_box > h3{
    height: 35px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 5px;
    margin: 0;
    text-align: center;
    border-top: 1px solid #eee;
}
.menu-centent{
 display: flex;
 justify-content:space-between
}
.menu-centent > div{
    padding: 10px
}
.bespeakinfo{
    flex: 1;
    text-align: left;
    margin: 0;
    border-radius:5px;
    padding:5px;
    font-size:16px;
    margin-top: 0;

}
.default {
    /* background: #fff; */
}
.actives{
    background: #15a892;
}
.bespeakinfo li:first-child{
  border-bottom: 1px solid #eee;
}
.bespeakinfo .title {
    display: inline-block;
    line-height: 22px;
    min-width: 22px;
}
.txt_p{
    text-indent:2em;
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
.actives .text, .actives .title {
    color: #fff;
}
</style>

