<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入购买人"
      />
      <el-select
        v-model="listQuery.state"
        placeholder="选择状态"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option label="待执行" :value="0" />
        <el-option label="已执行" :value="3" />
      </el-select>
      <el-button
        v-permission="['GET /api/v1/service_info/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="订单编号" prop="out_trade_no" width="220" />
      <el-table-column align="center" label="墓穴位置" prop="cname" />
      <el-table-column align="center" label="购买人" prop="payname" width="120" />
      <el-table-column align="center" label="联系电话" prop="payphone" width="140" />
      <el-table-column align="center" label="支付时间" prop="pay_time" width="180" />
      <el-table-column align="center" label="支付金额" prop="totalprice" width="120" />

      <el-table-column align="center" label="反馈状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 3" type="danger">已反馈</el-tag>
          <el-tag v-if="scope.row.state == 2" type="warning">反馈中</el-tag>
          <el-tag v-if="scope.row.state == 1">待反馈</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/service_info/edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['POST /api/v1/service_info/edit']"
            type="primary"
            size="mini"
            @click="handleinfo(scope.row)"
          >详情</el-button>
          <el-button
            v-show="scope.row.state != 3"
            v-permission="['GET /api/v1/service_info/del']"
            type="primary"
            size="mini"
            @click="handleDelete(scope.row)"
          >完结</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        inline
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="回复内容" prop="execnote">
          <el-input v-model="dataForm.execnote" type="textarea" />
        </el-form-item>
        <el-form-item label="视频地址" prop="video_thumb">
          <el-input v-model="dataForm.video_thumb" />
        </el-form-item>
        <el-upload
          class="upload-demo"
          :headers="headers"
          :action="uploadPath"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="dataForm.images"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2mb</div>
        </el-upload>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormVisinfo">
      <div class="temp-content">
        <h1>订单详情</h1>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content">
              <p>
                <span>购买人 :</span>
                {{ info.payname }}
              </p>
              <p>
                <span>备注 :</span>
                {{ info.vcnote }}
              </p>
              <p>
                <span>提货时间 :</span>
                {{ info.picktime }}
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p>
                <span>联系电话 :</span>
                {{ info.payphone }}
              </p>
              <p>
                <span>支付时间 :</span>
                {{ info.create_time }}
              </p>
              <p>
                <span>提货地点 :</span>
                {{ info.pick == 1 ?'自提' :'园内' }}
              </p>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <p>
                <span>墓穴位置 :</span>
                {{ info.cname }}
              </p>
              <p>
                <span>订单编号 :</span>
                {{ info.out_trade_no }}
              </p>
              <p>
                <span>祭祀日期 :</span>
                {{ info.sacrificetime }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-if="server ? server.length>0 : false" class="temp-content temp-content-server">
        <h1>服务信息</h1>
        <template>
          <el-row :gutter="20">
            <div v-for="(item,index) in server" :key="index">
              <el-col :span="10">
                <div class="grid-content">
                  <p>
                    <span>商品名称 :</span>
                    {{ item.title }}
                  </p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <p>
                    <span>数量 :</span>
                    {{ item.number }}
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p>
                    <span>合计 :</span>
                    {{ item.totalprice }}
                  </p>
                </div>
              </el-col>
            </div>
          </el-row>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <span style="color:red;font-size:14px;margin-right:10px;font-weight: 800;">
          总价：
          <b>{{ info.totalprice == null ? 0 : info.totalprice }}</b> 元
        </span>
        <el-button @click="dialogFormVisinfo= false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { orderlist, orderinfo, orderedit, backinfo, orderstate } from '@/api/goods'
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'
export default {
  name: 'ServiceCombo',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      uploadPath,
      dialogFormVisinfo: false,
      list: null,
      info_: {},
      total: 0,
      listLoading: true,
      filename: '',
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        state: 0,
        sort: 'add_time',
        order: 'desc'
      },
      server: [],
      info: {

      },
      back_info: {},
      dataForm: {
        id: '',
        rid: '',
        operate_id: '',
        operate_name: '',
        execnote: '',
        video_thumb: '',
        images: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      type: [],

      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {

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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      orderlist(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handlePreview() {

    },
    handleinfo(v) {
      const data = { id: v.id }
      orderinfo(data).then(res => {
        this.info = res.data
        this.server = res.data.services
        this.getList()
        this.dialogFormVisinfo = true
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    handleUpdate(row) {
      const data = { id: row.id }
      this.rest()
      backinfo(data).then(res => {
        if (res.data) {
          this.dataForm = res.data
        }
      })
      this.info_ = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData(v) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // this.dataForm.id = this.info_.id
          this.dataForm.rid = this.info_.id
          this.dataForm.operate_id = this.user.id
          this.dataForm.operate_name = this.user.realname
          orderedit(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '反馈成功'
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
    rest() {
      this.dataForm = {
        id: '',
        rid: '',
        operate_id: '',
        operate_name: '',
        execnote: '',
        video_thumb: '',
        images: []
      }
    },
    handleAvatarSuccess(res, file) {
      var imgaes = file.response.data
      const img = {
        name: this.filename,
        url: imgaes
      }
      this.dataForm.images.push(img)
    },
    handleRemove(file, fileList) {
      this.dataForm.images = fileList
    },
    beforeAvatarUpload(file) {
      this.filename = file.name
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleDelete(row) {
      this.$confirm('您确认完结此订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { id: row.id, state: 3 }
        orderstate(data).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
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
}
.upload-demo {
  padding-left: 15px;
}
</style>

