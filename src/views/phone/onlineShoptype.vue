<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入配置名称"
      />
      <el-button
        v-permission="['POST /api/v1/branch/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /api/v1/branch/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column align="center" label="服务名称" prop="title" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">可用</span>
          <span v-if="scope.row.status===0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="create_time" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 添加或修改对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="图片名称" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item label="上传图片">
          <span style="color:red">只能上传image/jpeg文件，且不超过2M</span>
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
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="默认为0" />
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

import {
  createOnlineShoptype,
  deleteOnlineShoptype,
  listOnlineShoptype,
  updateOnlineShoptype
} from '@/api/onlineShoptype'
import Pagination from '@/components/Pagination'

import { textMap } from '@/utils/config'
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
import { vuexData } from '@/utils/mixin'

export default {
  name: 'VueGroup',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      uploadPath,
      image_url: '',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined
        // type: undefined,
        // title: null,
        // group: '',
        // extra: '',
        // describe: '',
        // value: '',
        // sort: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        branch_name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      textMap

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
    // this.getDeptList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listOnlineShoptype(this.listQuery)
        .then(res => {
          this.list = res.data.data
          console.log('this.list', this.list)
          // this.total = 1
          this.total = res.data.total || 0
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
    resetForm() {
      this.image_url = ''
      this.dataForm = {
        id: undefined,
        name: undefined,
        desc: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('hello world')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createOnlineShoptype(this.dataForm)
            .then(res => {
              this.getList()
              console.log('res', res)
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加部门成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                title: '失败',
                message: res,
                duration: 800
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.image_url = row.thumb
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateOnlineShoptype(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新配置信息成功'
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
    handleDelete(row) {
      const delPara = { id: row.id }
      deleteOnlineShoptype(delPara).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.image_url = process.env.VUE_APP_BASE + file.response.data
      this.dataForm.thumb = this.image_url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
</style>
