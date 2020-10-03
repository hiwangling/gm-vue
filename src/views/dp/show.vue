
<template>
  <div class="flat-app">
    <div class="header">
      <span>快云公墓</span>
      <img src="../../assets/img/ref.png" alt @click="go">
      <h3>陵园风景( Cemetery landscape )</h3>
    </div>
    <div>
      <el-row>
        <el-col v-for="(item,value,index) in list" :key="index" :span="6">
          <div style="width:100%;height:100%" @click="look(item.image_url)">
            <el-card class="card">
              <img :src="item.image_url" class="image" height="200">
              <div style="padding: 14px;text-align: center;">
                <span>{{ item.title }}</span>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :close-on-click-modal="false" title="查看" class="look_dialog" :visible.sync="dialogForm">
      <img :src="record_show" alt="" width="100%">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getlyfj } from '@/api/dp'
export default {
  data() {
    return {
      list: null,
      total: 0,
      record_show: '',
      dialogForm: false
    }
  },
  computed: {},

  created() {
    var html = document.getElementsByTagName('html')[0]
    html.style.fontSize = '16px'
    this.getList()
  },
  methods: {
    getList() {
      getlyfj().then(res => {
        this.list = res.data
      })
    },
    look(v) {
      this.record_show = v
      this.dialogForm = true
    },
    go() {
      this.$router.push('/dp')
    }
  }
}
</script>
<style lang="scss" scoped>
.flat-app {
  height: 100%;
  width: 100%;
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
.card {
  text-align: center;
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
