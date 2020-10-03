<template>

  <div
    v-drag
    class="box"
    :contenteditable="true"
    :style="{
      'top':child.p,
      'left':child.l,
      'width':child.h ? 'auto' : '22px',
      'min-width':'22px',
      'height':'25px',
      'border':child.e ? '1px dashed #ccc' : '',
      'border-bottom':'none',
      'font-size':child.s ? '20px' : '16px'
    }"
    @input="changeTxt"
    @focus="lock=true"
    @blur="lock=false"
    v-html="innerText"
  />

</template>
<script>
export default {
  directives: {
    drag: {
      bind: function(el) {
        const odiv = el // 获取当前元素
        odiv.onmousedown = (e) => {
          // 算出鼠标相对元素的位置
          const disX = e.clientX - odiv.offsetLeft
          const disY = e.clientY - odiv.offsetTop

          document.onmousemove = (e) => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            const left = e.clientX - disX
            const top = e.clientY - disY

            // 绑定元素位置到positionX和positionY上面
            window.positionX = top
            window.positionY = left
            // 移动当前元素
            odiv.style.left = left + 'px'
            odiv.style.top = top + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  props: {
    child: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      innerText: this.child.t,
      lock: false
    }
  },
  watch: {
    child: {
      handler(newValue, oldValue) {
        if (!this.lock) {
          this.innerText = this.child.t
        }
      },
      deep: true
    }
  },
  methods: {
    changeTxt: function(e) {
      console.log(this.$el.style.top)
      this.child.t = this.$el.innerHTML
    }
  }

}
</script>
<style scoped>
 .box{
        position: absolute;
        top: 10px;
        left: 10px;
        width: 22px;
        padding: 2px 0px;
        text-align: center;
        cursor:pointer;
         /* border: 1px dashed #ccc; */
        /* border-top: 3px solid #4a9ff9; */
        outline: none;
    }
       .mon-main{
      position: absolute;
      border: 1px solid #716e6e;
      width: 1050px;
      height: 600px
    }
</style>
