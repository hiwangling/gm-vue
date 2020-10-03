
<template>
  <div class="flat-app">
    <div class="header">
      <span>快云公墓</span>
      <img src="../../assets/img/ref.png" alt @click="go">
      <h3>陵园简介( Introduction of the mausoleum )</h3>
    </div>
    <div style="padding:50px">
      <h1 style="text-align: center;    font-family: '楷体';">快云公墓简介</h1>
      <p class="info_p">
        快云公墓始建于1992年,前身为县公墓管理处，性质为公益性福利事业单位。同年原县政府将长岭岗约550亩土地无偿划拨给公墓管理处，建立凌霄园公墓，经省民政厅批准为经营性公墓,于 1994年正式启动公墓建设，同年在工商部门注册为全民所有制企业。</p>
      <p class="info_p">目前，快云公墓与殡葬管理所合署办公，承担着推进我区殡葬改革与殡葬法规宣传、提供殡仪礼仪服务、遗体火化等社会服务职能。同时，承担着殡葬惠民政策的落实、突发事件死亡人员及无名尸体的处置等公益性社会责任。</p>
      <p class="info_p"> 经过近二十年的发展，形成了综合服务区、殡仪服务区、墓区“三区”格局。综合服务区：办丧祭祀业务安排、墓位销售、碑文制作、惠民减免墓区环境维护及饮食、休息、娱乐等后勤服务工作。殡仪服务区：吊唁大厅和灵堂布置安排；提供水晶馆、告别台、音响及丧葬用品等设施设备；提供敛衣、冷冻、整容化妆、守灵、管乐、火化、安葬等殡仪服务。墓区：按园林式的设计、花园式的规划、区域式的布局为办丧市民提供不同层次的墓位和多形式的丧葬模式。快云公墓在执行政府定价、政府指导价和选择服务价的基础上，并严格落实殡葬惠民相关政策。</p>
      <p class="info_p">快云公墓与森林公园、金狮洞风景区相毗邻，四面环山，环境开阔，园内绿树成荫；温馨的标牌提示，整洁的园区小道，独具匠心的墓位设计，同完美的景色构筑出“生如春花之烂漫，逝如秋叶之静美”的意境。在这里，安魂落魄，是逝者之幸，后辈之福。</p>

    </div>
  </div>
</template>
<script>
// import { getlyfj } from '@/api/dp'
export default {
  data() {
    return {
      list: null,
      total: 0

    }
  },
  computed: {},

  created() {
    var html = document.getElementsByTagName('html')[0]
    html.style.fontSize = '16px'
    this.getList()
  },
  methods: {
    getList() {},
    go() {
      this.$router.push('/dp')
    }
  }
}
</script>
<style lang="scss" scoped>
.flat-app {
  height: 100%;
  width: 100%;

}
.card {
  text-align: center;
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
  float: left;
  font-family: '楷体';
}
.info_p{
  text-indent:2em;
  line-height: 2;
      width: 100%;
      float: right;
    margin: 0;
  text-align: left;
     font-size: 24px;
    font-family: '楷体';
}
.header h3 {
  margin: 0;
  color: #fff;
  float: right;
  font-size: 32px;
  font-weight: 100;
}
.header img {
  float: right;
  width: 50px;
  margin: 10px 30px 0px 30px;
  cursor: pointer;
}
</style>
