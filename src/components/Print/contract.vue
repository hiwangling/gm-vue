<template>
  <div>
    <div ref="print" style="padding:30px">
      <div class="h1_">公墓墓位使用合同</div>
      <div class="main_">
        <p>  <strong style="line-height:30px">根据《中华人民共和国合同法》以及国务院办公室转发民政部《关于进一步加强公墓管理的通知》（国办【1998】25号）规定等有关法律、法规之规定，经双方协商，现就购买、使用墓位相关事项达成如下协议：</strong></p>
        <strong>第一条 合同双方当事人及双方实地查看约定乙方使用墓位</strong>
        <table class="table_print">
          <tr>
            <td>出售人（甲方）：快云公墓</td>
            <td>购买人（乙方）：{{ buy.link_name }}</td>
          </tr>
          <tr>
            <td>法定代表人：{{ admin_ }} </td>
            <td>住址：{{ buy.address }}</td>
          </tr>
          <tr>
            <td>经办人： {{ user.realname }}</td>
            <td>身份证号码：{{ buy.card_no }}</td>
          </tr>
          <tr>
            <td>地址：宜昌市 </td>
            <td>联系电话：{{ buy.phone }}</td>
          </tr>
          <tr>
            <td>公墓建设批准机构：湖北省民政厅 </td>
            <td rowspan="2">
              <div class="dead">墓位使用人姓名：{{ dead1.vcname }}</div>
              <div class="dead">性别：{{ dead1.sex }}</div>
              <div class="dead">身份证号：{{ dead1.card_no }}</div></td>
          </tr>
          <tr>
            <td>批准文号：【1994】鄂民政字7号 </td>
          </tr>

          <tr>
            <td>经营性质：经营性  </td>
            <td rowspan="2">
              <div class="dead">墓位使用人姓名：{{ dead2.vcname }}</div>
              <div class="dead">性别：{{ dead2.sex }}</div>
              <div class="dead">身份证号：{{ dead2.card_no }}</div></td>
            </td>
          </tr>
          <tr>
            <td>联系电话：0717--7891607</td>
          </tr>
        </table>
        <table id="hall_print" class="table_print">
          <tr>
            <td style="width:2%">约定墓位</td>
            <td>经合同双方实地考察查看，约定乙方使用墓穴位于<u>{{ cname.name }}</u>，墓体质地<u>{{ cemeterys.texture }}</u>，颜色<u>{{ cemeterys.colour }}</u>，墓穴类型<u>{{ typeid == 2 ?'合墓':'单墓' }}</u>（一经使用，不得任意改动),面积<u>{{ cemeterys.area }}</u>平方米。     </td>
          </tr>
          <tr>
            <td style="width:2%">约定墓位</td>
            <td> 墓位总价款为：<u>{{ buy.sell_price }}</u>人民币大写：（￥：<u>{{ dx }}</u>）。
              本合同签订之日，乙方向甲方一次性付清墓位总价款。墓位总价款含墓位使用费建
              墓工料费、维护管理费。</td>
          </tr>
          <tr>
            <td style="width:2%">特别约定</td>
            <td>
              <p> 一、乙方依本合同取得墓位使用权，自本合同签订之日起即视为墓位交付乙方使用或双方约定交付时间，使用权年限为20年。即从<u>{{ begin[0] }}年{{ begin[1] }}月{{ begin[2] }}日</u>到<u>{{ end[0] }}年{{ end[1] }}月{{ end[2] }}日</u>止</p>
              <p> 二、因甲方管理不善等原因，将乙方已购墓位（未下葬）误销售给第三方的，乙方选择以下任意一项方式进行处理。</p>
              <p>1.甲方退还乙方所购墓位款项，并向乙方支付合同总价款<u>2 %</u>的违约金。</p>
              <p>2.甲方在规划区内，向乙方提供同等墓型、同等材质，同等数量的墓位，并向乙方支付合同总价款<u>2%</u>的违约金。</p>
            </td>
          </tr>
        </table>
        <strong>第二条 墓位使用期限届满时需要履行的事宜：</strong>
        <p>一、按相关规定，公墓土地所有权依法归国家所有。甲方依法开展公墓经营活动，保证乙方在合同期内的合法权益。</p>
        <p>二、乙方依本合同取得墓位使用权年限为20年，使用期届满，如乙方需继续使用该墓位时，必须与甲方签订《公墓墓位续用合同》，并按届时规定交付管理维护费。</p>
        <p>三、使用期届满的前一年，甲方应书面通知乙方。因乙方通讯方式变更无法联系时，将以登报公告的方式告知。 从乙方收到书面通知或登报公告之日起满一年内，乙方仍不与甲方签订《公墓墓位续用合同》的，视为乙方同意甲方将墓位内骨灰（遗骨）依法集中处理，原双方已签公墓合同视为终止履行，原墓位由甲方依法收回另行处理。</p>
        <strong>第三条 甲方责任</strong>
        <p>一、甲方未按本合同约定要求交付墓位给乙方安葬使用，甲方应自接到乙方书面通知之日起15天内履行约定事项，违约金按日计算至甲方书面通知交付之日止，每日按本合同总价款的<u>2‰</u>计算。</p>
        <p>二、因甲方原因造成乙方使用人的墓碑碑文、碑体、碑座等错误或制作、安装过程中有严重损坏的，甲方负责免费更正、更换、安装。</p>
        <strong>第四条 乙方责任</strong>
        <p>一、墓碑：应按甲方设计规划样式加工制作。如乙方要求对墓碑进行特殊处理的，甲方在不影响整体环境的前提下，应满足乙方要求，由此增加的费用，由乙方承担。 </p>
        <p>二、碑文：甲方已按乙方所签碑文的清样或小样制作后，乙方若要求更改内容时，在条件具备的情况下，甲方应尊重、满足乙方要求，但由此产生的一切费用，应仍由乙方承担。</p>
        <p>三、乙方因违反甲方的《墓园维护管理规定》造成甲方损失的，应承担赔偿责任。</p>
        <strong>第五条 本合同签订后，未经双方书面协商一致，任何一方均不得擅自迁移墓位、调换墓体或者转让给他人使用。乙方要求迁移使用人骨灰时，应书面通知甲方，并由乙方亲自办理相关手续（若乙方无法亲自办理，须履行相关委托手续后由受委托人办理），乙方迁移骨灰后，即视同乙方放弃该墓位的使用权，双方合同终止。</strong><br>
        <strong>第六条 因不可抗力因素造成墓体损毁、骨灰毁失、碑体损坏时，甲方不承担法律责任。甲方可采取登报公告或书面、电话等方式通知乙方，并采取有效措施降低、减少损失。甲方未尽到通知义务的，应承担相应的赔偿责任。墓碑因自然风化造成碑文风化脱落，合同期内由甲方书面通知乙方后，协商更换；合同续存期外，责任由乙方自行承担。</strong><br>
        <strong>第七条 本合同在履行过程中若发生争议，可由双方当事人协商解决，协商不成，任一方有权向人民法院诉讼解决纠纷。</strong><br>
        <strong>第八条 本合同未尽事宜，由双方约定后，可作为本合同的附件，具有同等法律效力。</strong><br>
        <strong>第九条 本合同一式叁份。甲方贰份，乙方壹份。</strong><br>
        <strong>第十条 本合同自双方签字并支付全款之日生效。</strong><br>
        <div style="display:flex;justify-content:space-between;height:60px;line-height:60px;padding:0 0 0 0px">
          <div> 出售人盖章: <div style="display:inline-block;border-bottom:1px solid #000;width:130px;text-align:center;height:20px;line-height:20px">快云公墓</div> </div>
          <div> 购墓人签字或盖章: <div style="display:inline-block;border-bottom:1px solid #000;width:130px;text-align:center;height:20px;line-height:20px" />  </div>
        </div>
        <div style="text-align:right">签订日期: {{ currentdate }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { vuexData } from '@/utils/mixin'
import { listdead } from '@/api/dead'
import { cemeterybury_print } from '@/api/cemetery'
import { listAdmin } from '@/api/member'
import { listbuy } from '@/api/buy'
import { parseTime } from '@/utils'
export default {
  mixins: [vuexData],
  data() {
    return {
      list: {

      },
      begin: [],
      end: [],
      typeid: '',
      end1: [],
      ewm: '',
      admin_: '',
      dx: '',
      dead1: {
        vcname: '',
        sex: '',
        card_no: ''

      },
      dead2: {
        vcname: '',
        sex: '',
        card_no: ''
      },
      cemeterys: {

      },
      cemetery: {

      },
      buy: {

      },
      orders: {
        sellname: ''
      },
      currentdate: ''
    }
  },
  created() {
    this.getNowFormatDate()
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    async init(v) {
      const data = {
        cid: v.cid
      }
      this.typeid = v.typeid
      await listdead(data).then(res => {
        this.dead1 = res.data[0]
        if (res.data[1]) {
          this.dead2 = res.data[1]
        }
      })
      await listAdmin().then(res => {
        res.data.data.forEach(v => {
          if (v.id == 2) {
            this.admin_ = v.realname
          }
        })
      })
      await cemeterybury_print(data).then(res => {
        this.cemeterys = res.data.cemeteryData
      })
      // await get_cemetery_data(v).then(res => {
      //   this.cemetery = res.data.cemetery
      //   this.ewm = process.env.VUE_APP_BASE + this.cemetery.code
      //   this.orders = res.data.order
      // })
      await listbuy(v).then(res => {
        this.buy = res.data[0]
        this.begin = (this.buy.order_begin).split('-')
        this.end = (this.buy.order_end).split('-')
        const setDate = new Date(this.buy.order_begin)
        setDate.setFullYear(setDate.getFullYear() + 3)
        setDate.setDate(setDate.getDate())
        var end1 = parseTime(setDate, '{y}-{m}-{d}')
        this.end1 = end1.split('-')
        this.dx = this.digitUppercase(this.buy.sell_price)
        this.$nextTick(() => {
          this.print()
        })
      })
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
 .h1_{
     text-align: center;
     font-size: 26px;
     margin-bottom: 10px;
 }
 .main_ p{
     margin: 0;
     text-indent: 2em;
     font-size: 16px;
     line-height: 26px;

 }
 .main_{
   padding: 0 30px
 }
 .fontstyle{
   font-family: '楷体'
 }
 strong{
  line-height: 26px;
 }
 .nonumber{
   position: absolute;
   right:100px;
   top:150px;
   font-size:20px;
 }

.table_print,
.table_print tr td {
  border: 1px solid #000000;
  height: 30px;
    padding-left: 10px;
  width:50%;
}

.table_print tr th{
  text-align: center;
  font-size: 18px;
}
.table_print {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: left;

  border-collapse: collapse;
}
#hall_print{
  margin-top: -1px
}
#hall_print tr td{
  height: 25px;
  line-height: 25px;
}
.dead{
    line-height: 25px;
    height:25px;
}
</style>
