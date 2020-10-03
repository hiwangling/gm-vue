<template>
  <div>
    <div ref="print" style="margin-top: -60px">
      <h3
        style="text-align:center;display:inline-block;height:40px;font-size:28px;font-family: 宋体 ;width:100%;margin-top:60px;"
      >
        订单详情</h3>
      <div style="width:100%; height:300px; margin-top: 10px; font-family: 宋体; font-size: 16px;">
        <table class="yctzbm">
          <tbody>

            <tr>
              <td>购买人</td>
              <td>{{ data.payname }}</td>
              <td>联系电话</td>
              <td>{{ data.payphone }}</td>

            </tr>
            <tr>
              <td colspan="2"> 订单号</td>
              <td colspan="2">{{ data.out_trade_no }}</td>

            </tr>
            <tr>
              <td colspan="2">墓穴位置</td>
              <td colspan="2">{{ data.classifyname+data.cname }}</td>

            </tr>
            <tr>
              <td colspan="4" style="text-align: center">已选服务项目</td>
            </tr>
            <tr>
              <td>服务名称</td>
              <td>数量</td>
              <td>单价</td>
              <td>合计</td>
            </tr>
            <tr v-for="item in data.services">
              <td>{{ item.title }}</td>
              <td>{{ item.number }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.totalprice }}</td>
            </tr>
            <tr>
              <td>总计</td>
              <td colspan="2" />
              <td>{{ data.totalprice }}</td>
            </tr>
          </tbody>

        </table>
        <!--        <div style=" line-height:40px;">-->
        <!--          <span class="info" style="float: left;">业务员：{{$store.state.user.name}}</span>-->
        <!--          <span class="info" style="margin-left: 230px">施工人员：</span>-->
        <!--          <span class="info" style="float: right;margin-right: 60px">核对人员:</span>-->
        <!--        </div>-->
      </div>

    </div>
  </div>
</template>
<script>
// import { get_graveinfo } from '@/api/buy-service'
// import { burialSignature, permitburySignature } from '@/api/signature'
// import { listOnlineOrder, feedBackInfo, createFeedBack, updateFeedBack, onlineOrderDetail } from '@/api/onlineOrder'

export default {
  props: ['data'],
  data() {
    return {
      list: {},
      info: undefined,
      param: '',
      // eslint-disable-next-line vue/no-dupe-keys
      data: '',
      year: '',
      moon: '',
      day: ''
    }
  },
  created() {
    // this.getDetailInfo()
  },
  methods: {
    // getDetailInfo(param) {
    //   console.log('getDetailInfo xx',param)
    //   // this.info = { cid: this.bury_id, id:this.dead_id}
    //   //请求安葬单的里面的详细数据
    //   burialSignature(param).then(
    //     res => {
    //       //没有将数据传进去
    //       this.data = res.data
    //     })
    // },
    print() {
      this.$print(this.$refs.print)
    },
    init(row) {
      // 初始化时间
      // onlineOrderDetail({ id: row.id }).then(res => {
      //   this.info = res.data
      // })
      var date = new Date()
      this.year = date.getFullYear()
      this.moon = date.getMonth() + 1
      this.day = date.getDate()
      // this.$nextTick(() => {
      //   this.print()
      // })
    }
  }
}
</script>
<style>

  .user-info {
    position: fixed;
    left: 30px;
    top: 50px;
    border: dotted 1px #808080;
    width: 200px;
    padding: 10px;
    font-size: 12px;
    line-height: 22px;
    color: black;
  }

  .yctzbm {
    border-collapse: collapse;
    border: 1px solid #000;
    width: 100%;
    font-size: 18px;
  }

  .row {
    text-align: center;
  }

  .yctzbm td {
    /*text-align: center;*/
    border: 1px solid #000;
    padding: 8px 0 8px 12px;
    line-height: 24px;
    font-size: 18px
  }

  .tc {
    text-align: center;
    letter-spacing: 4px;
    line-height: 32px;
    height: 70px;
  }

  .info {

    line-height: 32px;
    height: 50px;
    font-family: 宋体;
    font-size: 16px;
  }

  .tb {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    padding-left: 20px;
    font-size: 16px;
    color: #000;
    /* border-collapse: collapse; */
  }

  @media print {
    .pagenext {
      page-break-after: always;
      margin: 1px 0;
    }

    .user-info {
      display: none;
    }
  }
</style>
