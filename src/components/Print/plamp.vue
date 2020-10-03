<template>
  <div>
    <div ref="print" style="padding-right:10px">
      <h3 class="print_title"><u>春 节 送 灯 收 款 收 据</u></h3>
      <div style="text-align: center;">{{ currentdate }}</div>
      <div class="lamp_print">
        <div class="lamp_border">
          今收到
        </div>
        <div style="padding-left:40px;position: absolute;height: 40px;line-height: 40px;">
          {{ list.buryname }}{{ list.cname }}{{ list.lamp_nd }}年春节点灯（{{ list.vcnote }}共计{{ list.daycount }}天）
        </div>
        <div style="height:40px" />
        <div class="lamp_border" style=" border-top:1px dashed #000;">
          金额（大写）:{{ dx }}
        </div>
        <div class="note">
          <p>温馨提示:</p>
          <p style="display:inline-block;padding-left:55px">需点灯祭祀的市民，请务必在每年的正月十六至腊月二十五办理点灯缴费手续， </p>
          <p>过期将不在办理。</p>
        </div>
      </div>
      <div class="prinr_foot">
        <span>收款单位:宜昌市夷陵区凌霄园公墓</span>
        <span>经办人:{{ operate }}</span>
      </div>
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

      dx: '',
      operate: ''
    }
  },
  computed: {

  },
  created() {
    this.getNowFormatDate()
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },

    getlist(v) {
      this.list = v.list
      this.name = v.name
      this.operate = v.operate
      this.dx = this.digitUppercase(this.list.real_price)
      this.$nextTick(() => {
        this.print()
      })
    },
    rest() {

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
    },
    digitUppercase(n) {
      var fraction = ['角', '分']
      var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
      var head = n < 0 ? '欠' : ''
      n = Math.abs(n)
      var s = ''
      for (var i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整')
      )
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
    font-size: 24px;
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
.lamp_print{
   width: 100%;
  height: 200px;
margin: 5px 0;
  padding:0 30px;
  border:1px solid #000;
}
.lamp_border{
  border-bottom:1px dashed #000;
  height: 40px;
  line-height: 40px;
}
.note{
  height: 60px;

}
.note p{
margin: 0;
line-height: 25px;
padding: 0;
}
</style>
