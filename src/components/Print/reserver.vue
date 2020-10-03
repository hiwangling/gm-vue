<template>
  <div>
    <div ref="print" style="width:900px">
      <h3 class="print_title">购墓申请单</h3>
      <table id="hall_print" class="table_print" style="width:900px">
        <tr>
          <td rowspan="4">
            <div style="width:10px;padding-left:7px;line-height:20px!important">使用人</div>
          </td>
          <td rowspan="2">姓名</td>
          <td rowspan="2" style="width:90px">{{ dead1.vcname }}</td>
          <td rowspan="2">{{ dead1.sex }}</td>
          <td rowspan="2">证件号码</td>
          <td rowspan="2">{{ dead1.card_no }}</td>
          <td rowspan="2">籍贯</td>
          <td rowspan="2" />
          <td>死亡日期</td>
          <td>{{ dead1.death }}</td>
        </tr>
        <tr>
          <td>安葬日期</td>
          <td>{{ dead1.bury }}</td>
        </tr>
        <tr>
          <td rowspan="2">姓名</td>
          <td rowspan="2">{{ dead2.vcname }}</td>
          <td rowspan="2">{{ dead2.sex }}</td>
          <td rowspan="2">证件号码</td>
          <td rowspan="2">{{ dead2.card_no }}</td>
          <td rowspan="2">籍贯</td>
          <td rowspan="2" />
          <td>死亡日期</td>
          <td>{{ dead2.death }}</td>
        </tr>
        <tr>
          <td>安葬日期</td>
          <td>{{ dead2.bury }}</td>
        </tr>
        <tr>
          <td rowspan="2" style="width:30px">
            <div style="width:10px;padding-left:7px;line-height:20px!important">申请人</div>
          </td>
          <td>姓名</td>
          <td>{{ list.link_name }}</td>
          <td>关系</td>
          <td>{{ list.relation }}</td>
          <td>证件号码</td>
          <td colspan="2">{{ list.card_no }}</td>
          <td>联系电话</td>
          <td>{{ list.phone }}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="3">{{ list.vcnote }}</td>
          <td>住址</td>
          <td colspan="5">
            <div style="position: absolute;top:180px">{{ list.address }}</div>
          </td>
        </tr>
        <tr>
          <td
            colspan="10"
            style="font-size:18px;height:30px;line-height:30px;font-weight:800"
          >以下由经办人填写</td>
        </tr>
        <tr>
          <td colspan="2">墓位区号</td>
          <td colspan="3">{{ cemetery.areaname + cemetery.cname }}</td>
          <td>墓型</td>
          <td>{{ buy.sell_price }}</td>
          <td>发票号码</td>
          <td colspan="2">{{ buy.fph }}</td>
        </tr>
        <tr>
          <td colspan="2">颜色</td>
          <td colspan="3">{{ cemetery.colour }}</td>
          <td>石材种类</td>
          <td>{{ cemetery.texture }}</td>
          <td>购墓日期</td>
          <td colspan="2">{{ buy.order_begin }}</td>
        </tr>
        <tr>
          <td colspan="2" style="width:100px">墓地面积</td>
          <td colspan="5">{{ cemetery.area }} 平方米</td>
          <td>服务年限</td>
          <td colspan="2">20年</td>
        </tr>
      </table>
      <div class="prinr_foot">
        <span style=" font-size: 18px;">经办人:{{ user.realname }}</span>
        <span style=" font-size: 18px;">{{ currentdate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { listlink } from '@/api/link'
import { listbuy } from '@/api/buy'
import { listdead } from '@/api/dead'
import { cemeterybury_print } from '@/api/cemetery'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {

      dead1: {
        vcname: '',
        card: '',
        birth: null,
        death: null,
        bury: null,
        sex: ''
      },
      dead2: {
        vcname: '',
        card: '',
        birth: null,
        death: null,
        bury: null,
        sex: ''
      },
      cemetery: {

      },
      buy: {

      },
      list: {
        link_name: '',
        relation: '',
        card_no: '',
        address: '',
        phone: ''
      },
      server: null,
      currentdate: '',
      totalprice: ''
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

    async getlist(v) {
      await listdead(v).then(res => {
        this.dead1 = res.data[0]
        this.dead2 = {
          sex: '',
          vcname: '',
          birth2: null,
          death2: null,
          bury2: null
        }
        if (res.data[1]) {
          this.dead2 = res.data[1]
        }
      })
      await listlink(v).then(res => {
        this.list = res.data[0]
      })
      await cemeterybury_print(v).then(res => {
        this.cemetery = res.data.cemeteryData
      })
      await listbuy(v).then(res => {
        this.buy = res.data[0]
      })
      await this.print()
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
#hall_print tr td {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
}
#hall_print {
  margin: 0px 0;
}
.print_title {
  margin-top: 0;
  font-size: 22px;
  margin-bottom: 5px;
  text-align: center;
}
.prinr_foot {
  display: flex;
  font-size: 18px;
  justify-content: space-between;
}
.table_print,
.table_print tr td {
  border: 1px solid #000000;
  height: 26px !important;
  line-height: 26px !important;
  font-size: 19px !important;
}

.table_print {
  width: 100%;

  text-align: center;
  border-collapse: collapse;
}
</style>
