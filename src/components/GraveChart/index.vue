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
      default: '550px'
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
    chartCurrent: {
      type: String,
      default: 'year'
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartYear: {
      type: Array,
      required: true
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
        backgroundColor: '#323a5e',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        title: {
          text: this.chartTitle,
          textStyle: {
            fontSize: 22,
            fontWeight: 'normal',
            color: '#fff'
          },
          top: 10,
          x: 'center'
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '14%',
          top: '16%',
          containLabel: true
        },
        legend: {
          data: [expectedTitle, actualDataTitle],
          top: 50,
          textStyle: {
            color: '#fff'
          },
          x: 'center',
          itemWidth: 12,
          itemHeight: 10
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: this.chartYear,
          axisLine: {
            lineStyle: {
              color: 'white'

            }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          }
        },
        yAxis: [{
          type: 'value',
          name: '金额',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisLabel: {
            formatter: '{value} 元'
          }
        }, {
          type: 'value',
          scale: true,
          name: '数量',

          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisLabel: {
            formatter: '{value} 座'
          }

        }],
        series: [
          {
            name: this.legendData.actualData,
            type: 'bar',
            barWidth: '15%',
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#fccb05'
                }, {
                  offset: 1,
                  color: '#f5804d'
                }]),
                barBorderRadius: 0
              }
            },
            data: actualData
          }, {
            name: this.legendData.expectedData,
            type: 'bar',
            barWidth: '15%',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#248ff7'
                }, {
                  offset: 1,
                  color: '#6851f1'
                }]),
                barBorderRadius: 0
              }
            },
            data: expectedData
          }]

      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
      this.chart.on('click', (parm) => {
        if (this.chartType) {
          const data = {
            type: this.chartCurrent,
            data: parm
          }
          this.$emit('xData', data.data.name)
        }
      },
      )
    }

  }
}
</script>
