
<template>
  <div class="flat-app">
    <div class="header">
      <span>快云公墓</span>
    </div>
    <div id="today_container">
      <div>
        <img id="taday" src="../../assets/img/0.png" alt="今日天气" width="10%">
      </div>
      <div style="padding-top: 15px;">
        <div class="main_info">
          <span class="info">{{ weather.city }}</span>|
          <span class="info">{{ weather.ymd }}</span>|
          <span class="info week">{{ weather.week }}</span>|
          <span class="info type">{{ weather.type }}</span>
        </div>
        <div class="more_info">
          <span class="info tempture">今日温度：{{ weather.tempture }}</span>
          <span class="info fl">风力：{{ weather.fl }}</span>
          <span class="info fx">风向：{{ weather.fx }}</span>
          <span class="info sd">湿度: {{ weather.sd }}</span>
          <span class="info quality">空气质量：{{ weather.quality }}</span>
        </div>
      </div>
    </div>
    <div class="grid-dp">
      <div v-for="(item,value,index) in imgs" :key="index">
        <router-link :to="item.url">
          <div class="grid-content">
            <img :src="item.img" alt width>
            <span>{{ item.title }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { getWeather } from '@/api/dp'
export default {
  data() {
    return {
      list: null,
      total: 0,
      imgs: [
        {
          img: require('../../assets/img/01.png'),
          url: '/dp/cemetery',
          title: '墓位展示'
        },
        {
          img: require('../../assets/img/02.png'),
          url: '/dp/show',
          title: '陵园风景'
        },
        {
          img: require('../../assets/img/03.png'),
          url: '/dp/info',
          title: '陵园简介'
        },
        {
          img: require('../../assets/img/04.png'),
          url: '/dp/search',
          title: '墓位查询'
        }
      ],
      weather: {
        city: '城市',
        ymd: '2019-01-01',
        week: '星期一',
        type: '多云',
        tempture: '28',
        fl: '风力',
        fx: '风速',
        sd: '22%',
        quality: '速度'
      }
    }
  },
  computed: {},

  created() {
    var html = document.getElementsByTagName('html')[0]
    html.style.fontSize = '16px'
    this.getList()
  },
  methods: {
    getList() {
      getWeather().then(res => {
        console.log(res)
        var weather = res.data
        var cityInfo = res.data.cityInfo
        this.weather.city = cityInfo.city
        this.weather.week = weather.data.forecast[0].week
        this.weather.type = weather.data.forecast[0].type
        this.weather.tempture = weather.data.wendu
        this.weather.sd = weather.data.shidu
        this.weather.fl = weather.data.forecast[0].fl
        this.weather.fx = weather.data.forecast[0].fx
        this.weather.ymd = weather.data.forecast[0].ymd
        this.weather.quality = weather.data.quality
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.flat-app {
  background: url(../../assets/img/bg.png);
  background-size: cover;
  height: 100%;
  width: 100%;
}
.grid-dp {
  width: 1000px;
  margin: 0 auto;
  margin-top: 50px;
}
.grid-content {
  position: relative;
  float: left;
  margin-right: 55px;
  // margin-right: 50px;
}
.grid-content span {
  position: absolute;
  bottom: 20px;
  left: 50px;
  font-size: 26px;
  color: #fff;
}
#today_container {
  width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 105px;
  overflow: hidden;
}
#today_container div img {
  margin: 0 50px 0 40px;
  float: left;
}
.main_info {
  font-size: 28px;
  margin-bottom: 30px;
  color: #fff;
}
.main_info span {
  margin: 0 15px;
}
.main_info span:first-child {
  margin-left: 0;
}
.more_info {
  margin-top: 3px;
  font-size: 16px;
  color: #fff;
}
.more_info span {
  margin: 0 15px 0 0;
}
.header {
  height: 70px;
  line-height: 70px;
  color: #fff;
  padding-left: 20px;
  background: #2082db;
}
.header span {
  font-size: 32px;
  font-family: '楷体';
}
</style>
