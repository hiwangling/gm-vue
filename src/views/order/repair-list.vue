<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓号" />
      <el-button v-permission="['GET /api/v1/service_info/service_infos_by_cemetery']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓区" prop="area_name" width="100" />
      <el-table-column align="center" label="墓号" prop="cem_name" width="100" />
      <el-table-column align="center" label="发起人" prop="sname" width="150" />
      <el-table-column align="center" label="发起时间" prop="sub_time" />
      <!-- <el-table-column align="center" label="工时" prop="task_hour" />
      <el-table-column align="center" label="工价" prop="pre_price" />
      <el-table-column align="center" label="总价" prop="total_price" /> -->
      <el-table-column align="center" label="修缮状态" prop="repair_status" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.repair_status | or_status">
            {{ scope.row.repair_status == 1 ? '未修缮' : '已修缮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
        <template slot-scope="scope">
          <el-button v-if="scope.row.repair_status==1" v-permission="['GET /api/v1/service_info/get_service_bill_by_cid']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.repair_status==1" v-permission="['GET /api/v1/service_info/get_service_bill_by_cid']" type="danger" size="mini" @click="SendData(scope.row)">归档</el-button>
          <el-button v-permission="['GET /api/v1/service_info/get_service_bill_by_cid']" type="primary" size="mini" @click="handlelook(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :close-on-click-modal="false" class="dialog" title="编辑" :visible.sync="dialogFormVisible" top="5vh">
      <el-form ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="140px" style="margin-left:50px;">
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
        <!-- <el-form-item label="工时" prop="task_hour">
          <el-input v-model="dataForm.task_hour" />
        </el-form-item>
        <el-form-item label="工价" prop="pre_price">
          <el-input v-model="dataForm.pre_price" />
        </el-form-item>
        <el-form-item label="总价" prop="total_price">
          <el-input v-model="dataForm.total_price" />
        </el-form-item> -->
        <el-form-item label="修缮前照片" prop="b_urls">
          <img v-for="(item,idx) in b_urls" :key="idx" :src="item.url" alt="" width="100" height="70" style="margin-left:5px">
        </el-form-item>
        <el-form-item label="上传修缮后的图片">
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
        <el-button type="primary" @click="EditData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="dialog" title="查看" :visible.sync="dialogFormVisible_info" top="5vh">
      <el-form ref="dataInfo" :model="dataInfo" status-icon label-position="left" label-width="140px" style="margin-left:50px;">
        <el-form-item label="发起人">
          <el-input v-model="dataInfo.sname" :disabled="true" />
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="dataInfo.rname" :disabled="true" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="dataInfo.start_time"
            type="date"
            disabled="true"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="dataInfo.end_time"
            type="date"
            disabled="true"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <!-- <el-form-item label="工时" prop="task_hour">
          <el-input v-model="dataInfo.task_hour" disabled="true" />
        </el-form-item>
        <el-form-item label="工价" prop="pre_price">
          <el-input v-model="dataInfo.pre_price" disabled="true" />
        </el-form-item>
        <el-form-item label="总价" prop="total_price">
          <el-input v-model="dataInfo.total_price" disabled="true" />
        </el-form-item> -->
        <el-form-item label="修缮前照片" prop="b_urls">
          <img v-for="(item,idx) in dataInfo.b_urls" :key="idx" :src="item.url" alt="" width="100" height="70" style="margin-left:5px">
        </el-form-item>
        <el-form-item label="修缮后照片" prop="a_urls">
          <img v-for="(item,idx) in dataInfo.a_urls" :key="idx" :src="item.url" alt="" width="100" height="70" style="margin-left:5px">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_info = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { repair_order_list, repair_edit_after, repair_del_pic, repair_edit_pic, repairinfo } from '@/api/repair'
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
        update: '查看服务',
        create: '修缮执行'
      },
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        save_status: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataInfo: {
        sname: '',
        rname: '',
        start_time: null,
        end_time: null,
        b_urls: [],
        a_urls: [],
        task_hour: '',
        pre_price: '',
        total_price: ''
      },
      dialogFormVisible: false,
      dialogFormVisible_: false,
      dialogFormVisible_info: false,
      dataForm: {
        id: '',
        start_time: null,
        end_time: null,
        task_hour: '',
        pre_price: '',
        total_price: '',
        a_img_urls: []
      },
      rules: {
        execdate: [{ required: true, message: '服务时间不能为空', trigger: 'change' }]
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
      repair_order_list(this.listQuery)
        .then(res => {
          this.list = res.data.repairlist.data
          this.total = res.data.repairlist.total || 0
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
      const data = { id: row.id }
      repairinfo(data).then(res => {
        this.b_urls = res.data.b_urls
        if (res.data.a_urls) {
          this.fileList = res.data.a_urls
        }
      })
      this.dialogFormVisible = true
    },

    handleCreate(row) {
      this.flag = false
      this.dataForm.id = row.id
      this.dialogFormVisible_ = true
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
    handlelook(row) {
      this.rest()
      const data = { id: row.id }
      repairinfo(data).then(res => {
        this.dataInfo = res.data
        this.dialogFormVisible_info = true
      })
    },
    rest() {
      this.dataInfo = {
        sname: '',
        rname: '',
        start_time: null,
        end_time: null,
        b_urls: [],
        a_urls: [],
        task_hour: '',
        pre_price: '',
        total_price: ''
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
    EditData() {
      for (const v of this.fileList) {
        v.type = 1
        delete v.name
        delete v.uid
        delete v.status
      }
      this.dataForm.a_img_urls = this.fileList
      repair_edit_after(this.dataForm).then(res => {
        this.dialogFormVisible = false
        this.getList()
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
    },

    SendData(row) {
      this.$confirm(`确定已经修缮完毕吗？`, '完结操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = { id: row.id }
        repair_edit_pic(data)
          .then(res => {
            this.getList()

            this.$message({
              type: 'success',
              message: '修缮完毕'
            })
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
