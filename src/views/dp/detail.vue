<template>
  <div>
    <div class="header">
      <span>快云公墓</span>
      <img src="../../assets/img/ref.png" alt @click="go">
      <h3>墓位展示( The tomb of a show )</h3>
    </div>
    <div style="padding:10px">
      <div class="filter-container" style="margin-top:10px">
        <el-input
          v-model="listQuery.keyword"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入墓名或者墓号"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilters"
        >查找</el-button>
      </div>
      <div class="manage-tag">
        <el-tag
          v-for="(value,item,idx) in num"
          :key="idx"
          :class="item | getNum"
          style="margin-left:5px"
          @click="handleFilterTag(item)"
        >{{ item | getNumtxt }}({{ value }})</el-tag>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="(item,value) in list"
          :key="value"
          :span="2"
          :class="item.usestatus | getlist"
        >
          <div style="height:100%;">
            <p>{{ item.cname }}</p>
            <p>{{ item.muzhu_name }}</p>
            <p>({{ item.type_id == 1 ? '单墓' : '合墓' }})</p>
          </div>
        </el-col>
      </el-row>
    </div>
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
import { q_list } from '@/api/dp'
import { get_num } from '@/api/dp'
import { vuexData } from '@/utils/mixin'
import Pagination from '@/components/Pagination'

export default {
  name: 'Detail',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      num: null,
      total: 0,
      cid: '',
      filter: false,
      listQuery: {
        q_id: this.$route.query.id,
        page: 1,
        limit: 60,
        usestatus: '',
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    var html = document.getElementsByTagName('html')[0]
    html.style.fontSize = '16px'
    this.getList()
  },
  methods: {
    getList() {
      this.CemeteryStatus()
      q_list(this.listQuery)
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
    CemeteryStatus() {
      const data = { q_id: this.$route.query.id }
      get_num(data).then(res => {
        this.num = res.data
      })
    },
    handleFilters(filter) {
      this.listQuery.page = 1
      this.listQuery.usestatus = ''
      this.listQuery.q_id = this.$route.query.id
      this.getList()
    },
    handleFilterTag(item) {
      this.listQuery.usestatus = item
      this.getList()
    },
    go() {
      this.$router.push('/dp')
    }
  }
}
</script>
<style>
#cemetery .el-dialog {
  width: 900px;
}
.manage-tag span {
  cursor: pointer;
}
.header {
  height: 70px;
  line-height: 70px;
  color: #fff;
  padding-left: 20px;
  background: #2082db;
}
.header span {
  font-size: 32px;
  float: left;
  font-family: '楷体';
}
.header h3 {
  margin: 0;
  color: #fff;
  float: right;
  font-size: 24px;
  font-weight: 100;
}
.header img {
  float: right;
  width: 50px;
  margin: 10px 30px 0px 30px;
  cursor: pointer;
}
</style>

