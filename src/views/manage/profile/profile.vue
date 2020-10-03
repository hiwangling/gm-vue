<template>
  <div class="container">
    <el-row v-loading="listLoading" type="flex" class="row-bg" justify="space-around">
      <el-col v-for="(item,index) in list" :key="index" :span="6">
        <div class="uploader_photo">
          <div class="avatar-uploader el-upload-list--picture-card">
            <el-image :src="item.photo" class="avatar" :preview-src-list="[item.photo]" />
          </div>
          <p>{{ item.imagetype_name }}{{ item.images_name }}</p>
        </div>
      </el-col>
    </el-row>
    <div v-if="list && list.length == 0" style="height:50px">暂无档案</div>
  </div>
</template>
<script>
import { cemeteryrecord } from '@/api/cemetery'
import { vuexData, page } from '@/utils/mixin'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      list: [],
      index: 6,
      listLoading: false
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id || 88
      }
      cemeteryrecord(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    }

  }
}
</script>
<style scoped>
.uploader_photo {
  width: 180px;
}
</style>
