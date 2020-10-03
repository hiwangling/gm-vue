<template>
  <div>
    <span style="color:red">只能上传{{ imgType }}文件，且不超过{{ imgSize }}M</span>
    <el-upload
      class="avatar-uploader"
      :headers="headers"
      :action="uploadPath"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="image_url" :src="image_url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>
<script>
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
export default {
  name: 'Uploads',
  props: {
    imgSize: {
      type: Number,
      default: 2
    },
    imgType: {
      type: String,
      default: 'image/jpeg'
    }
  },
  data() {
    return {
      uploadPath,
      image_url: ''
    }
  },
  computed: {
    headers() {
      return {
        'token': getToken()
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.image_url = process.env.VUE_APP_BASE + file.response.data
      this.$emit('uploadImg', file.response.data)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === this.imgType
      const isLtSize = file.size / 1024 / 1024 < this.imgSize
      if (!isJPG) {
        this.$message.error(`上传头像图片只能是 ${this.imgType} 格式!`)
      }
      if (!isLtSize) {
        this.$message.error(`上传头像图片大小不能超过 ${this.imgSize}MB!`)
      }
      return isJPG && isLtSize
    }
  }
}
</script>

<style scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

