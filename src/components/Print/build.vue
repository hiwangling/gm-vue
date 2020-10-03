<template>
  <div>
    <div ref="print" style="padding-right:50px">
      <h3 class="print_title">{{ title }}</h3>
      <div style="text-align: center;">{{ currentdate }}</div>
      <table id="hall_print" class="table_print">
        <tr>
          <td>故者</td>
          <td colspan="2">园区</td>
          <td colspan="7">{{ comont }}</td>
        </tr>
        <tr>
          <td>{{ buryname }}</td>
          <td colspan="2" style="width:50px">{{ name }}</td>
          <td colspan="7"><div style="height:130px;text-align: left;padding-left:20px">{{ sell_title }}</div></td>
        </tr>
        <tr v-if="type != 3">
          <td>立碑日期</td>
          <td colspan="9" style="text-align: left;padding-left:20px">{{ service_time }}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="9" style="text-align: left;padding-left:20px" />
        </tr>
      </table>
      <div class="prinr_foot">
        <span>经办人:{{ operate }}</span>
        <span />
      </div>
    </div>
  </div>
</template>

<script>
import { dy_services_bylb, dy_services_byfw } from '@/api/buy-service'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      list: {

      },
      title: '',
      comont: '',
      name: '',
      type: '',
      operate: '',
      sell_title: null,
      buryname: '',
      service_time: null,
      server: null,
      currentdate: '',
      totalprice: ''
    }
  },
  computed: {
    // count: function() {
    //   if (this.cx.totalprice == undefined) {
    //     this.cx.totalprice = 0
    //   }
    //   if (this.kz.totalprice == undefined) {
    //     this.kz.totalprice = 0
    //   }
    //   return parseInt(this.kz.totalprice) + parseInt(this.cx.totalprice)
    // }
  },
  created() {
    this.getNowFormatDate()
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    solo(arr) {
      var editRow = []
      arr.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    },
    getlist(v) {
      this.rest()
      this.name = v.name
      this.type = v.type
      this.operate = v.operate
      if (v.type == 1) {
        this.title = '夷陵区凌霄园公墓服务单'
        this.comont = '服 务 内 容'
        const data = { id: v.id }
        dy_services_byfw(data).then(res => {
          // console.log(res.data)
          this.$nextTick(() => {
            this.print()
          })
        })
      } else if (v.type == 2) {
        this.title = '夷陵区凌霄园公墓施工单'
        this.comont = '施 工 内 容'
        const data = { id: v.id }
        dy_services_bylb(data).then(res => {
          this.sell_title = res.data.sell_title
          this.buryname = res.data.buryname
          this.service_time = res.data.service_time
          this.$nextTick(() => {
            this.print()
          })
        })
      } else {
        this.buryname = v.buryname
        this.title = '夷陵区凌霄园公墓服务单'
        this.comont = '服 务 内 容'
        this.sell_title = '迁出'
        this.$nextTick(() => {
          this.print()
        })
      }
    },
    rest() {
      this.sell_title = ''
      this.buryname = ''
      this.service_time = null
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
   height:23px;
   line-height: 23px;
   font-size: 14px;
  }
  #hall_print{
    margin: 10px 0
  }
  .print_title{
    margin-top: 0;
    margin-bottom:10px;
    text-align: center;
  }
  .prinr_foot{
    display: flex;
    justify-content: space-between
  }
  .table_print,
.table_print tr td {
  border: 1px solid #000000;
  height: 50px;
}
.table_print tr th{
  text-align: center;
  font-size: 18px;
}
.table_print {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-collapse: collapse;
}
</style>
