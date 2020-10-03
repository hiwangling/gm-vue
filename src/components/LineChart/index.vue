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
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    legendData: {
      required: true
    },
    chartType: {
      type: Boolean,
      default: true
    },
    chartYear: {
      type: Array,
      required: true
    },
    chartTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ expectedData, actualData } = {}) {
      if (this.legendData.expectedData || this.legendData.actualData) {
        var expectedTitle = this.legendData.expectedData[0]
        var actualDataTitle = this.legendData.actualData[0]
      }
      this.chart.setOption({
        title: {
          text: this.chartTitle,
          top: 0,
          x: 'center'
        },
        xAxis: {
          data: this.chartYear,
          boundaryGap: true
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 20,
          top: 80,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 5]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [expectedTitle, actualDataTitle],
          top: 30
        },
        series: [{
          name: this.legendData.expectedData, itemStyle: {
            normal: {
              color: '#003366'
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          // eslint-disable-next-line no-dupe-keys
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(15,197,243,1)' }, { offset: 1, color: 'rgba(15,197,243,0)' }]),
              borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(180,240,255,1)' }, { offset: 1, color: 'rgba(15,197,243,1)' }]),
              borderWidth: 2
            }
          },
          type: 'bar',
          data: expectedData
        }, {
          name: this.legendData.actualData,
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(61,126,235, 1)'
              },
              {
                offset: 1,
                color: 'rgba(61,126,235, 0)'
              }
              ]),
              borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(160,196,225, 1)'
              },
              {
                offset: 1,
                color: 'rgba(61,126,235, 1)'
              }
              ]),
              borderWidth: 2
            }
          },
          data: actualData

        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
      this.chart.on('click', (data) => {
        if (this.chartType) {
          this.$emit('xData', data.data.name)
        }
      },
      )
    }

  }
}
</script>
