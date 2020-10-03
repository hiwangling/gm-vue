
<template>
  <div class="flat-app">
    <div class="wrapper">
      <div id="viewer1" class="viewer" style="text-align: center;">
        <!-- <img src="../../assets/img/ydgm.jpg" style="height: 900px;width:1276px"> -->
      </div>
    </div>
    <div id="pointer" ref="point" class="shine" />
    <div class="location">
      <div class="info-ares">
        <h3 class="sysTit">
          墓位查询系统
          <img
            src="../../assets/img/ref.png"
            alt
            style="width: 25px;
    position: absolute;
    top: 24px;
    margin-left: 25px;"
            @click="go"
          >
        </h3>
        <div class="serInput">
          <input
            id="text_"
            ref="input"
            v-model="textname"
            v-focus="focusState"
            type="text"
            placeholder="请输入逝者姓名或亲属姓名"
            @keyup.enter="getList"
          >
          <span ref="serarch" class="search" @click="getList()">查&nbsp;询</span>
          <span class="reindex" @click="clear">清&nbsp;除</span>
        </div>
        <div v-show="isshow" class="info-xx null">
          <p style="text-align: center;color: #fff;" v-html="notice" />
        </div>
        <div v-show="!isshow" class="info-xx basInfo">
          <h3 style="padding-left:0.0781rem;">基本信息</h3>
          <template v-for="(v,index,item) in list">
            <div
              :key="item"
              class="info-bor"
              :data-index="index"
              :class="{'active':index==active}"
              style="cursor:pointer;    border-bottom: 1px solid #fff; "
              @click="search(v.area_name,$event)"
            >
              <p>
                <span><b>使用人姓名</b>：{{ v.muzhu_name }}</span>
              </p>
              <p>
                <span><b>所在位置</b>：{{ v.area_name }}{{ v.cname }}</span>
              </p>
              <p>
                <span><b>亲属姓名</b>：{{ v.link_name }}</span>
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 定位坐标
var objects = [
  {
    address: "A'区",
    x: 1075,
    y: 437,
    r: 20,
    isInObject: isInCircle,
    getCenter: getCircleCenter
  },
  {
    address: 'A区',
    x: 1145,
    y: 335,
    r: 20,
    isInObject: isInCircle,
    getCenter: getCircleCenter
  },
  {
    address: 'B区',
    x: 1140,
    y: 260,
    r: 20,
    isInObject: isInCircle,
    getCenter: getCircleCenter
  },
  {
    address: 'C区',
    x: 1125,
    y: 193,
    r: 20,
    isInObject: isInCircle,
    getCenter: getCircleCenter
  },
  {
    address: 'D区',
    x: 1055,
    y: 142,
    r: 20,
    isInObject: isInCircle,
    getCenter: getCircleCenter
  }

]
function isInCircle(x, y) {
  var relative_x = x - this.x
  var relative_y = y - this.y
  return Math.sqrt(relative_x * relative_x + relative_y * relative_y) <= this.r
}
function getCircleCenter() {
  return { x: this.x, y: this.y }
}

var each = function(object, callback) {
  [].every.call(object, function(v, i) {
    return callback.call(v, i, v) !== false
  })
}

function showMe() {
  each(objects, function(i, object) {
    var center = object.getCenter()
    var pointer = document.querySelector('#pointer')
    if (pointer) {
      pointer.style.display = 'block'
      pointer.style.left = center.x + 'px'
      pointer.style.top = center.y + 'px'
    }
  })
}
import { searchname } from '@/api/dp'
export default {
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  data() {
    return {
      list: [],
      isshow: true,
      textname: '',
      active: -1,
      focusState: true,
      clone_objects: objects,
      notice: '点击查询之后即可看到基本信息<br>并且可以看到你所要找的位置'
    }
  },
  computed: {},
  watch: {
    textname: function(newValue, oldValue) {
      if (newValue === '') {
        this.isshow = true
        this.cancelStar()
      }
    }
  },
  created() {
    this.getList()
    var html = document.getElementsByTagName('html')[0]
    html.style.fontSize = '150px'
  },
  methods: {
    getList: function() {
      // 初始化没有点击被选中的样式
      this.active = -1
      if (this.textname === '') {
        const h = this.$createElement
        this.$notify({
          title: '提示',
          showClose: false,
          duration: 800,
          message: h('i', { style: 'color: teal' }, '请输入逝者姓名或亲属姓名')
        })
        this.focusState = true
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: '查询中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {
        name: this.textname
      }
      searchname(data)
        .then(res => {
          var list = res.data
          console.log(list)
          loading.close()
          if (list && list.length > 0) {
            this.list = list
            this.isshow = false
          } else {
            this.isshow = true
            this.notice = '没有查询到任何信息!'
          }
        })
        .catch(() => {
          this.list = []
          loading.close()
          this.isshow = true
          this.notice = '没有查询到任何信息!'
          this.focusState = true
        })
    },
    search: function(areaname, event) {
      var target = event.currentTarget
      var index = Number(target.getAttribute('data-index'))
      this.active = index
      var array = []
      var flag = false
      var temp = ''
      for (let i = 0; i < this.clone_objects.length; i++) {
        if (this.clone_objects[i].address === areaname) {
          temp = this.clone_objects[i]
          flag = true
          break
        }
      }
      flag
        ? array.push(temp)
        : array.push(this.clone_objects[this.clone_objects.length - 1])
      objects = array
      showMe()
    },
    cancelStar: function() {
      var pointer = document.querySelector('#pointer')
      pointer.style.display = 'none'
    },
    // getList() {},
    go() {
      this.$router.push('/dp')
    },
    clear() {
      this.textname = ''
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
.viewer {
  height: 100%;
  position: relative;
}
.wrapper {
  position: absolute;
  top: 0.01563rem;
  left: 0.48rem;
  bottom: 0.01563rem;
  right: 0.0052rem;
  width: 69%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.052rem;
  padding: 0 0.16rem;
  margin: 1%;
}
#pointer {
  background-image: url(../../assets/img/arrow.png);
  width: 40px;
  height: 40px;
  position: absolute;
}
.info-ares {
  color: #666;
  overflow: auto;
  position: relative;
  height: 100%;
  width: 100%;
}
.info-ares input {
  border-radius: 0.052rem;
  border: none;
  outline: none;
  position: relative;
  margin: 0.177rem 0;
  width: 50%;
  font-size: 0.1041rem;
  background: rgba(255, 255, 255, 0.15);
  height: 0.2604rem;
  color: #fff;
  line-height: 0.2604rem;
  padding-left: 0.078rem;
}
input::-webkit-input-placeholder {
  color: #fff;
}
.info-xx {
  color: #fff;
  height: 1.83rem;
}
.reindex {
  position: absolute;
  width: 21%;
  cursor: pointer;
  margin-top: 0.172rem;
  text-decoration: none;
  right: 0;
  background: #6dc0d3;
  color: #fff;
  text-align: center;
  height: 0.2604rem;
  line-height: 0.2604rem;
  font-size: 0.125rem;
  border-radius: 0.052rem;
}
.info-xx h3 {
  border-left: 0.0416rem solid #6dc0d3;
  color: #fff;
  font-weight: bold;
  font-size: 0.1354rem;
}
.info-xx p {
  line-height: 0.22rem;
  font-size: 0.104rem;
}
.location {
  padding: 0 0.16rem;
  width: 24%;
  line-height: 0.2395rem;
  font-size: 0.1354rem;
  border-radius: 0.052rem;
  background: rgba(255, 255, 255, 0.15);
  position: absolute;
  top: 0.01563rem;
  margin: 1%;
  right: 0.01563rem;
  bottom: 0.01563rem;
  right: 0.0052rem;
}
/* .location .info-ares div{width: 2.5rem;} */
.active {
  color: #111;
}

.search {
  position: absolute;
  cursor: pointer;
  width: 21%;
  margin-top: 0.172rem;
  text-decoration: none;
  right: 100px;
  background: #6dc0d3;
  color: #fff;
  text-align: center;
  height: 0.2604rem;
  line-height: 0.2604rem;
  font-size: 0.125rem;
  border-radius: 0.052rem;
}
.null img {
  width: 26%;
  display: block;
  margin: auto;
}
.info-xx .basInfo {
  overflow: auto;
  display: none;
  position: fixed;
  overflow: auto;
  height: 90%;
  width: 24%;
  color: #fff;
}
.baseTit {
  top: 57%;
  height: 38.5%;
  max-height: 39%;
  overflow: auto;
}
.sysTit {
  margin: 0;
  text-align: left;
  padding-top: 5%;
  font-weight: bold;
  letter-spacing: 0.0125rem;
  color: #fff;
  font-size: 0.14rem;
}
small {
  font-family: '华文隶书';
  font-size: 0.12rem;
  letter-spacing: 0.0125rem;
  padding: 0 4%;
  font-weight: 500;
}

.shine {
  animation: opacity-change 1s ease-in-out infinite;
  display: none;
}
@keyframes opacity-change {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes opacity-change {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes opacity-change {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes opacity-change {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
