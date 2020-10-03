<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓号" />
      <el-button v-permission="['GET /api/v1/service_info/service_infos_by_cemetery']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button
        v-permission="['POST /api/v1/save/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="单位" prop="builder" width="200" />
      <el-table-column align="center" label="姓名" prop="leader" width="120" />
      <el-table-column align="center" label="电话" prop="phone" width="200" />
      <el-table-column align="center" label="开始时间" prop="start_time" />
      <el-table-column align="center" label="结束时间" prop="end_time" />

      <el-table-column align="center" label="操作" class-name="small-padding" width="160">
        <template slot-scope="scope">
          <el-button v-permission="['GET /api/v1/service_info/get_service_bill_by_cid']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['GET /api/v1/service_info/get_service_bill_by_cid']" type="danger" size="mini" @click="handledelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :close-on-click-modal="false" class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh">
      <el-form ref="dataForm" :inline="true" :model="dataForm" :rules="rules" status-icon label-position="left" label-width="110px" style="margin-left:50px;">

        <el-form-item label="单位" prop="builder">
          <el-input v-model="dataForm.builder" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="dataForm.leader" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="dataForm.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="dataForm.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="预算金额" prop="budget_amount">
          <el-input v-model="dataForm.budget_amount" />
        </el-form-item>
        <el-form-item label="实际金额" prop="actual_amount">
          <el-input v-model="dataForm.actual_amount" />
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-input v-model="dataForm.location" />
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="dataForm.desc" />
        </el-form-item>
        <el-form-item label="上传图片">
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
        <el-button v-if="dialogStatus=='create'" type="primary" @click="sendData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { engineering_order_list, engineering_add, engineering_edit, engineering_del_pic, engineering_del, get_engineering_info_by_id } from '@/api/enginee'
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'VueSaveList',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      fileList: [],
      list_service: null,
      operater_name: '',
      total: 0,
      b_urls: [],
      image_url: '',
      flag: false,
      info: null,
      listLoading: true,
      listLoading_: true,
      dialogStatus: '',
      dialogStatus2: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        save_status: '',
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      dataForm: {
        start_time: null,
        end_time: null,
        actual_amount: '',
        budget_amount: '',
        desc: '',
        location: '',
        leader: '',
        builder: '',
        phone: '',
        img_urls: []
      },
      rules: {

      }
    }
  },
  computed: {
    headers() {
      return {
        'token': getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      engineering_order_list(this.listQuery)
        .then(res => {
          this.list = res.data.engineeringlist.data
          this.total = res.data.engineeringlist.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      const data = { id: row.id }
      get_engineering_info_by_id(data).then(res => {
        // this.img_urls = res.data.img_urls
        if (res.data.img_arr) {
          this.fileList = res.data.img_arr
        }
      })
      //   this.fileList = row.img_urls
      this.dialogFormVisible = true
    },

    handleCreate(row) {
      this.flag = false
      this.dataForm.id = row.id
      this.rest()
      this.dialogFormVisible = true

      this.dialogStatus = 'create'
      this.fileList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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

    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除此图片吗？`)
      return this.$confirm(`确定移除此图片吗？`, '移除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = {
          id: file.id,
          rid: this.dataForm.id,
          flag: 'after'
        }
        engineering_del_pic(data).then(res => {
          console.log(res.data)
        }).catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
      })
    },

    rest() {
      this.dataInfo = {
        start_time: null,
        end_time: null,
        leader: '',
        builder: '',
        actual_amount: '',
        budget_amount: '',
        desc: '',
        location: '',
        phone: '',
        img_urls: []
      }
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
    },
    sendData() {
      for (const v of this.fileList) {
        v.type = 1
        delete v.name
        delete v.uid
        delete v.status
      }
      this.dataForm.img_urls = this.fileList
      engineering_add(this.dataForm).then(res => {
        this.dialogFormVisible = false
        this.getList()
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
    },
    updateData() {
      for (const v of this.fileList) {
        delete v.name
        delete v.uid
        delete v.status
      }
      this.dataForm.img_urls = this.fileList
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          engineering_edit(this.dataForm)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新成功'
              })
            })
            .catch(res => {
              this.$message({
                title: '失败',
                message: res
              })
            })
        }
      })
    },
    handledelete(row) {
      this.$confirm(`确定删除吗？`, '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = { id: row.id }
        engineering_del(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除寄存信息成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
          .catch(res => {
            this.$message({
              title: '失败',
              message: res
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
