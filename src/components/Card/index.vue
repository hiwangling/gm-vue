<template>
  <el-dialog
    :close-on-click-modal="false"
    class="dialog"
    width="500px"
    title="扫描存档"
    :visible.sync="dialogFormVisible"
    top="5vh"
    append-to-body
  >
    <div id="noniediv">
      <p class="xform-p" />
      <p id="streamwrap" class="xform-p">
        <img
          id="streamimage"
          class="xform"
          src="http://127.0.0.1:38088/video=stream&camidx=0"
          onerror="onerror=null;src='http://kykjgm.lxygm.com/app_stop.jpg'"
        >
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="getimg">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    getimg() {
      var phi = 0
      var camidx = 0
      var params =
        '{"filepath":"base64","rotate":"' +
        phi.toString() +
        '","camidx":"' +
        camidx.toString() +
        '","cutpage":"' +
        1 +
        '"}'
      var url = 'http://127.0.0.1:38088/video=grabimage'
      axios.post(url, params).then(res => {
        if (res.data.code == 0) {
          this.$emit('setImg', 'data:image/jpg;base64,' + res.data.photoBase64)
          this.$notify.success({
            title: '成功',
            message: '照片保存成功'
          })
          this.dialogFormVisible = false
        }
      })
    },
    show() {
      this.dialogFormVisible = true
    }
  }
}
</script>
<style>
#streamimage {
  width: 100%;
}
</style>

