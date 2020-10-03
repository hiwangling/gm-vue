<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加修缮服务</el-button>

    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="操作人" prop="sname" />
      <el-table-column align="center" label="发起时间" prop="sub_time" width="180" />
      <!-- <el-table-column align="center" label="电话" prop="phone" width="120" /> -->
      <!-- <el-table-column align="center" label="点灯时间" prop="lamp_nd" width="150">
        <template slot-scope="scope">
          <span style="font-size: 18px;color:red">
            {{ scope.row.lamp_nd }}
          </span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="修缮状态" prop="repair_status" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.repair_status | or_status">
            {{ scope.row.repair_status == 1 ? '未修缮' : '已修缮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <template>
            <el-button v-if="scope.row.repair_status == 1" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.repair_status == 1" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="140px" style="margin-left:50px;">
        <el-form-item label="描述信息" prop="desc">
          <el-input
            v-model="dataForm.desc"
            type="textarea"
            :rows="4"
          />
        </el-form-item><br>
        <el-form-item label="上传修缮前的图片">
          <el-upload
            class="upload-demo"
            :headers="headers"
            :action="uploadPath"
            :on-preview="handlePreview"
            :name="dataForm.title"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :before-remove="beforeRemove"
            multiple
            :limit="10"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { repairlist, repairadd, repairinfo, repair_del, repair_edit, repair_del_pic } from '@/api/repair'
import { vuexData, page } from '@/utils/mixin'
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      uploadPath,
      list: null,
      id: '',
      rid: '',
      index: 5,
      flag: true,
      listLoading: true,
      dialogStatus: '',
      fileList: [],
      dataForm: {
        cid: '',
        desc: '',
        b_img_urls: []
      },
      dialogFormVisible: false,
      rules: {
        buyname: [{ required: true, message: '购买人不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        token: getToken()
      }
    }
  },
  watch: {
    order(val) {
      if (val === this.index) {
        this.getStatus()
      }
    },
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
      const data = { cid: this.cems.id }
      repairlist(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleCreate() {
      this.resetForm()
      this.flag = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        desc: '',
        b_img_urls: []
      }
      this.fileList = []
    },
    createData() {
      for (const v of this.fileList) {
        v.type = 2
        delete v.name
        delete v.uid
        delete v.status
      }
      this.dataForm.b_img_urls = this.fileList
      console.log(this.dataForm)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          repairadd(this.dataForm)
            .then(res => {
              // this.list.unshift(res.data)
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.fileList = []

      // this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dataForm.id = row.id
      const data = { id: row.id }
      repairinfo(data).then(res => {
        // res.data.b_urls.forEach(v => {
        //   var data = {
        //     url: v
        //   }
        //   this.fileList.push(data)
        // })
        if (res.data.b_urls) {
          this.fileList = res.data.b_urls
        }
        this.dataForm.desc = res.data.desc
      })

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.cid = this.cems.id
      for (const v of this.fileList) {
        v.type = 2
        delete v.name
        delete v.uid
        delete v.status
      }
      this.dataForm.b_img_urls = this.fileList
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          repair_edit(this.dataForm)
            .then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res
              })
            })
        }
      })
    },
    handlePay(row) {
      this.$confirm('付款此订单后将无法修改和删除, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        lamppay(row)
          .then(res => {
            this.$message({
              type: 'success',
              message: '付款服务成功'
            })
            this.getList()
          })
          .catch(res => {
            this.$message({
              type: 'warning',
              message: res
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleDelete(row) {
      const data = { id: row.id }
      repair_del(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    handleRemove(file, fileList) {
      for (const v of this.fileList) {
        if (v.uid === file.uid) {
          const index = this.fileList.indexOf(v)
          this.fileList.splice(index, 1)
          break
        }
      }
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除此图片吗？`, '移除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = {
          id: file.id,
          rid: this.dataForm.id,
          flag: 'before'
        }
        repair_del_pic(data).then(res => {
          console.log(res.data)
        }).catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
      })
    },
    handleAvatarSuccess(res, file) {
      var url = process.env.VUE_APP_BASE + file.response.data
      const data = {
        name: file.name,
        url: url
      }
      this.fileList.push(data)
      this.$notify.success({
        title: '成功',
        message: '上传成功'
      })
    },

    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        this.handleRemove(file)
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.handleRemove(file)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scope>
/* .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
} */
</style>
