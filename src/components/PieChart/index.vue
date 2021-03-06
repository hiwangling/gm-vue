<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    chartData: {
      required: true
    },
    charTitle: {
      type: String,
      default: ''
    },
    legendData: {
      default: []
    },
    actualData: {
      default: []
    },
    roseType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      total_chartData: 0,
      total_actualData: 0
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.initChart()
      }
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    changeSell(sell) {
      let sum_price = 0
      sell.forEach((v, k) => {
        sum_price = sum_price + parseInt(v.value)
      })
      return sum_price
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({

        tooltip: [{
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        }],

        legend: this.legendData,
        calculable: true,
        title: [{
          text: '金额比例',
          subtext: `总计 ${this.changeSell(this.chartData)} (元)`,
          left: '20%',

          textAlign: 'center'
        }, {
          text: '数量比例',
          subtext: `总计 ${this.changeSell(this.actualData)} (个)`,
          right: '39%',
          textAlign: 'center'
        }],
        series: [
          {
            type: 'pie',
            radius: [0, '50%'],
            center: ['20%', '45%'],

            emphasis: {
              label: {
                show: true
              }
            },
            data: this.chartData
          },
          {
            type: 'pie',
            radius: [0, '50%'],
            center: ['55%', '45%'],

            data: this.actualData
          }
        ]

      })
    }
  }
}
</script>
