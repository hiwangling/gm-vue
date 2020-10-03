<template>
  <div>
    <div class="header">
      <span>快云公墓</span>
      <img src="../../assets/img/ref.png" alt @click="go">
      <h3>墓位展示( The tomb of a show )</h3>
    </div>
    <div class="main" style="margin-top:10px;padding:10px">
      <el-row :gutter="20" class="area">
        <el-col v-for="(item, index) in list" :key="index" :span="4">
          <router-link :to="{path:'/dp/detail',query:{id:item.id}}" class>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size:16px">{{ item.type_name }}</span>
              </div>
              <div class="component-item">
                <img :src="item.image_url === url ? gmurl : item.image_url" alt class="image">
              </div>
              <div class="manage-tag">
                <el-tag
                  v-for="(value,items,idx) in item.num"
                  :key="idx"
                  size="small"
                  :class="items | getNum"
                  style="margin:5px 6px;"
                >{{ items | getNumtxt }}({{ value }})</el-tag>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { a_list } from '@/api/dp'
import { page, vuexData } from '@/utils/mixin'
export default {
  name: 'VueList',
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      total: 0,
      url: process.env.VUE_APP_BASE,
      gmurl: require('../../assets/img/dy.jpg'),
      sreach: null,
      listLoading: true,
      flag: false,
      listQuery: {
        page: 1,
        limit: 100,
        pid: undefined,
        sort: 'add_time',
        y_id: '',
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
      this.listQuery.y_id = 1
      this.listLoading = true
      a_list(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
          this.list.forEach((v, k) => {
            v.image_url = process.env.VUE_APP_BASE + v.image_url
          })
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    go() {
      this.$router.push('/dp')
    }
  }
}
</script>
 <style  scoped>
.manage-components-container {
  min-height: calc(100vh - 84px);
}

.component-item {
  min-height: 100px;
}
.image {
  width: 100%;
  height: 150px;
  display: block;
}
.manage-tag {
  margin-top: 10px;
  text-align: center;
}
.el-tag--medium {
  margin-right: 10px;
  margin-bottom: 5px;
}
.box-card {
  margin-bottom: 10px;
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
