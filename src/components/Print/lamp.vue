<template>
  <div>
    <div ref="print" style="padding:20px">
      <!-- <div class="prinr_foot">
        {{ currentdate }}
      </div> -->
      <div v-for="(val,index) in list" :key="index">
        <div v-if="val.length>0" style="height:660px;padding:10px;margin-top:50px ">
          <div style="text-align: center;font-size:20px;width:100%">{{ title }}{{ index }}排</div>
          <div v-for="(item,idx) in val" :key="idx" :class="item.id != null ? 'islamp' : 'islamp_'" style="text-align: center;height:80px;width:135px;float:left;margin:10px 0 0 5px"><p>{{ item.muzhu_name }}</p><p style="font-size:14px; ">{{ item.cname }}</p></div>
        </div>
      </div>

      <!-- <div style="height:700px">
        123
      </div> -->
      <!-- <table id="hall_print" class="table_print">
        <tr>
          <td>墓穴位置</td>
          <td>墓主</td>
          <td>是否点灯</td>

        </tr>
        <tr v-for="(item,idx) in list" :key="idx">
          <td>{{ item.cname }}</td>
          <td>{{ item.muzhu_name }}</td>
          <td>{{ item.id != null ? '√' : '' }}</td>
        </tr>
      </table> -->

    </div>
  </div>
</template>

<script>
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      list: {

      },
      title: '',
      currentdate: '',
      totalprice: ''
    }
  },
  created() {
    this.getNowFormatDate()
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    init(v) {
      this.list = v.list[0]
      this.title = v.area
      this.$nextTick(() => {
        this.print()
      })
    },
    getNowFormatDate() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.currentdate = year + '年' + month + '月' + strDate + '日'
    }
  }
}
</script>
<style scoped>
  #hall_print tr td{
   height:20px;
   line-height: 20px;
   font-size: 12px;
  }
  #hall_print{
    margin: 6px 0
  }
  .print_title{
    margin-top: 0;
    margin-bottom: 5px;
    text-align: center;
  }
  .prinr_foot{
    display: flex;
    font-size: 12px;
    justify-content: space-between
  }
  .table_print,
.table_print tr td {
  border: 1px solid #000000;
  height: 22px;
}
.table_print tr th{
  text-align: center;
  font-size: 16px;
}
.table_print {
  width: 100%;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-collapse: collapse;
}
.islamp{
border:2px solid #000;
border-radius: 7px;
}
.islamp_{
border:none;
/* border:2px solid #000; */
}
</style>
