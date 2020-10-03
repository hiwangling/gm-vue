<template>
  <div style="height:750px">
    <!-- <el-input
      v-model="vert[0].t"
      size="small"
      style="position: absolute;
    right: 140px;
        width: 150px;"
    /> -->
    <el-button
      type="primary"
      plain
      size="small"
      style="position: absolute;
    right: 70px;"
      @click="print"
    >打印</el-button>
    <section ref="print">
      <template>
        <template v-for="(item,index) in vert">
          <drag :key="index" :child="item" />
        </template>
      </template>
    </section>
  </div>
</template>
<script>
import Drag from '@/components/Drag'
import { listbuy } from '@/api/buy'
import { parseTime } from '@/utils'
import { page, vuexData } from '@/utils/mixin'
export default {
  components: { Drag },
  mixins: [page, vuexData],
  data() {
    return {
      vert: [
        {
          t: '',
          left: '95',
          top: '245',
          id: 0
        },
        {
          t: '',
          left: '95',
          top: '290',
          id: 1
        },
        {
          t: '',
          left: '95',
          top: '335',
          id: 2
        },
        {
          t: '',
          left: '95',
          top: '380',
          id: 3
        },
        {
          t: '13123232323',
          left: '95',
          top: '435',
          id: 4
        },

        {
          t: '快云公墓',
          left: '95',
          top: '485',
          id: 5
        },

        {
          t: '宜昌市',
          left: '95',
          top: '535',
          id: 6
        },
        {
          t: '',
          left: '95',
          top: '585',
          id: 7
        },
        {
          t: '0717-6529595',
          left: '95',
          top: '640',
          id: 8
        },
        {
          t: '',
          left: '95',
          top: '685',
          id: 10
        },
        {
          t: '',
          left: '205',
          top: '685',
          id: 11
        },
        // {
        //   t: '20',
        //   left: '482',
        //   top: '315',
        //   id: 12
        // },
        {
          t: '',
          left: '550',
          top: '315',
          id: 13
        },
        {
          t: '',
          left: '625',
          top: '315',
          id: 14
        },
        {
          t: '',
          left: '720',
          top: '315',
          id: 15
        }

      ],
      list: null,
      date: new Date()

    }
  },
  created() {},
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    get_print(v) {
      listbuy(v).then(res => {
        this.list = res.data[0]
        this.vert.forEach(ele => {
          if (ele.id == 0) {
            ele.t = this.list.link_name
          }
          if (ele.id == 1) {
            ele.t = this.list.relation
          }
          if (ele.id == 2) {
            ele.t = ''
          }
          if (ele.id == 3) {
            ele.t = this.list.address
          }
          if (ele.id == 4) {
            ele.t = this.list.phone
          }
          if (ele.id == 7) {
            ele.t = ''
          }
          if (ele.id == 10) {
            ele.t = this.list.order_begin
          }
          if (ele.id == 11) {
            ele.t = this.list.order_end
          }
          // if (ele.id == 13) {
          //   ele.t = this.list.manage_price
          // }
          // if (ele.id == 14) {
          //   ele.t = this.user_name
          // }
          // if (ele.id == 15) {
          //   ele.t = this.list.order_begin
          // }
        })
        // this.$nextTick(() => {
        //   this.print()
        // })
      })
    }
  }
}
</script>

