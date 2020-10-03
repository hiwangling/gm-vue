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
      style="position: absolute;right: 70px;"
      @click="print"
    >打印</el-button>
    <section ref="print">
      <template v-for="(item,index) in vert">
        <drag :key="index" :child="item" />
      </template>
    </section>

  </div>
</template>
<script>
import Drag from '@/components/Drag'
import { listdead } from '@/api/dead'
import { cemeterybury_print } from '@/api/cemetery'
export default {
  components: { Drag },
  data() {
    return {
      vert: [
        {
          t: '',
          left: '105',
          top: '252',
          id: 0
        },
        {
          t: '',
          left: '205',
          top: '252',
          id: 20
        },
        {
          t: '',
          left: '105',
          top: '315',
          id: 1
        },
        {
          t: '',
          left: '205',
          top: '315',
          id: 21
        },
        {
          t: '',
          left: '105',
          top: '365',
          id: 2
        },
        {
          t: '',
          left: '105',
          top: '425',
          id: 3
        },
        {
          t: '',
          left: '105',
          top: '482',
          id: 4
        },

        {
          t: '',
          left: '105',
          top: '542',
          id: 5
        },

        {
          t: '',
          left: '95',
          top: '612',
          id: 6
        },
        {
          t: '',
          left: '205',
          top: '612',
          id: 7
        },
        {
          t: '',
          left: '284',
          top: '612',
          id: 8
        },
        {
          t: '所在单位',
          left: '105',
          top: '670',
          id: 9
        },
        {
          t: '',
          left: '120',
          top: '620',
          id: 10
        },
        {
          t: '',
          left: '575',
          top: '200',
          id: 11
        },
        {
          t: '',
          left: '145',
          top: '595',
          id: 12
        },
        {
          t: '',
          left: '575',
          top: '450',
          id: 23
        },

        {
          t: '',
          left: '615',
          top: '690',
          id: 25
        },
        {
          t: '',
          left: '700',
          top: '690',
          id: 26
        },
        {
          t: '',
          left: '750',
          top: '690',
          id: 27
        }
      ],
      dead1: null,
      dead2: {
        birth: null,
        death: null,
        bury: null,
        sex: ''
      },
      list: null,
      cemetery: null,
      order: null,
      date: new Date()

    }
  },
  created() {},
  methods: {
    print() {
      this.$print(this.$refs.print)
    },

    async get_print(v) {
      await cemeterybury_print(v).then(res => {
        this.cemetery = res.data.cemeteryData
        // this.order = res.data[]
      })
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

        var sex1 = this.dead1.sex
        var birth1 = this.dead1.birth == null ? '' : this.dead1.birth + '&nbsp;&nbsp;&nbsp;'
        var death1 = this.dead1.death == null ? '' : this.dead1.death + '&nbsp;&nbsp;&nbsp;'
        var bury1 = this.dead1.bury == null ? '' : (this.dead1.bury).substr(0, 10) + '&nbsp;&nbsp;&nbsp;'
        if (this.dead2) {
          var sex2 = this.dead2.sex
          var birth2 = this.dead2.birth == null ? '' : this.dead2.birth
          var death2 = this.dead2.death == null ? '' : this.dead2.death
          var bury2 = this.dead2.bury == null ? '' : (this.dead2.bury).substr(0, 10)
          var vcname = this.dead2.vcname
        }

        this.vert.forEach((n, m) => {
          n.t = ''
        })
        this.vert.forEach(ele => {
          if (ele.id == 0) {
            ele.t = this.dead1.vcname
          }
          if (ele.id == 20) {
            ele.t = vcname
          }
          if (ele.id == 1) {
            ele.t = sex1
          }
          if (ele.id == 21) {
            ele.t = sex2
          }

          if (ele.id == 3) {
            ele.t = birth1 + birth2
          }
          if (ele.id == 4) {
            ele.t = death1 + death2
          }
          if (ele.id == 5) {
            ele.t = bury1 + bury2
          }
          if (ele.id == 6) {
            ele.t = this.cemetery.areaname
          }
          if (ele.id == 7) {
            ele.t = this.cemetery.ix
          }

          if (ele.id == 8) {
            ele.t = this.cemetery.iy
          }
          if (ele.id == 9) {
            ele.t = ''
          }
          if (ele.id == 2) {
            ele.t = ''
          }
          // if (ele.id == 12) {
          //   ele.t = this.cemetery.classify_name + '&nbsp;' + this.cemetery.style_name + '&nbsp;' + this.cemetery.ix + '-' + this.cemetery.iy + '#'
          // }
          // if (ele.id == 11) {
          //   ele.t = this.order.order_no
          // }
          // if (ele.id == 23) {
          //   ele.t = '水桐山公墓'
          // }

          if (ele.id == 25) {
            ele.t = new Date().getFullYear()
          }
          if (ele.id == 26) {
            ele.t = new Date().getMonth() + 1
          }
          if (ele.id == 27) {
            ele.t = new Date().getDate()
          }
        })
        // this.$nextTick(() => {
        //   this.print()
        // })
      })
    }
  }
}
</script>

