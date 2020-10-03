<template>
  <div class="container">
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-edit"
      style="margin:10px 0"
      @click="handlelink"
    >增加联系人</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="姓名" prop="link_name" />
      <el-table-column align="center" label="电话" prop="phone" />
      <el-table-column align="center" label="关系" prop="relation" />
      <el-table-column align="center" label="住址" prop="address" />
      <el-table-column align="center" label="身份证(正)" prop="card_photo_z">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.card_photo_z"
            alt
            width="50"
            :preview-src-list="[scope.row.card_photo_z]"
          >
            <div slot="error" class="image-slot" />
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证(反)" prop="card_photo_f">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.card_photo_f"
            alt
            width="50"
            :preview-src-list="[scope.row.card_photo_f]"
          >
            <div slot="error" class="image-slot" />
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdatelink(scope.row)">编辑</el-button>
          <el-button
            v-show="scope.row.c_sure != 1"
            style="margin:5px 0 0 0 "
            type="danger"
            size="mini"
            @click="handleDeletelink(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 增加联系人 -->
    <card ref="cardImg" @setImg="setImg" />
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      append-to-body
      top="5vh"
    >
      <div style="margin-bottom:10px">
        <el-button size="mini" type="primary" @click="getCard()">联系人信息</el-button>
      </div>
      <div class="linkman">
        <el-form
          ref="dataForm"
          :inline="true"
          :rules="rules"
          :model="dataForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="margin-left:50px;"
          class="dataFormman"
        >
          <el-form-item label="姓名" prop="link_name">
            <el-input v-model="dataForm.link_name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="dataForm.phone" />
          </el-form-item>
          <el-form-item label="身份证" prop="card_no">
            <el-input v-model="dataForm.card_no" />
          </el-form-item>
          <el-form-item label="关系" prop="relation">
            <el-input v-model="dataForm.relation" />
          </el-form-item>
          <el-form-item label="住址" prop="address">
            <el-input v-model="dataForm.address" />
          </el-form-item>
          <br>
          <el-form-item label="身份证(正)">
            <div class="uploader_photo">
              <div class="avatar-uploader el-upload-list--picture-card">
                <template v-if="dataForm.card_photo_z">
                  <el-image :src="dataForm.card_photo_z" class="avatar" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span class="el-upload-list__item-preview" @click="getPic(1)">
                      <i class="el-icon-edit" />
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="photoDel(dataForm.card_photo_z)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </template>
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(1)" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="身份证(反)">
            <div class="uploader_photo">
              <div class="avatar-uploader el-upload-list--picture-card">
                <template v-if="dataForm.card_photo_f">
                  <el-image :src="dataForm.card_photo_f" class="avatar" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span class="el-upload-list__item-preview" @click="getPic(2)">
                      <i class="el-icon-edit" />
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="photoDel(dataForm.card_photo_f)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </template>
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(2)" />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDatalink">确定</el-button>
        <el-button v-else type="primary" @click="updateDatalink">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listlink, createlink, updatelink, deletelink } from '@/api/link'
import { vuexData } from '@/utils/mixin'

import axios from 'axios'
import card from '@/components/Card'
export default {
  components: { card },
  mixins: [vuexData],
  data() {
    return {
      index: 1,
      idx: '',
      list: null,
      listLoading: true,
      searchVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dataForm: {
        cid: '',
        link_name: '',
        phone: '',
        card_no: '',
        card_photo_z: '',
        card_photo_f: '',
        relation: '',
        address: ''
      },
      rules: {
        link_name: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }]
      }
    }
  },

  watch: {
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    },
    order: {
      handler(val) {
        if (val === this.index) {
          this.getList()
        }
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      listlink(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    refresh() {
      this.getList()
    },
    getPic(val) {
      this.$refs.cardImg.show(this.dataForm)
      this.idx = val
    },
    setImg(val) {
      if (this.idx == 1) {
        this.dataForm.card_photo_z = val
      } else {
        this.dataForm.card_photo_f = val
      }
    },
    handlelink() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.dataForm = {
        cid: '',
        link_name: '',
        phone: '',
        card_no: '',
        relation: '',
        address: ''
      }
    },
    createDatalink() {
      this.dataForm.cid = this.cems.id
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createlink(this.dataForm)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加联系人成功'
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
    getCard(val) {
      var url = 'http://127.0.0.1:38088/card=idcard'
      var params = ''
      axios
        .post(url, params)
        .then(res => {
          if (res.data.code == 0) {
            var info = res.data.IDCardInfo
            this.$notify.success({
              title: '成功',
              message: '身份信息获取成功'
            })
            this.dataForm.link_name = info.name
            this.dataForm.address = info.address
            this.dataForm.card_no = info.cardID
          } else {
            this.$notify.error({
              title: '获取身份信息失败',
              message: res
            })
          }
        })
        .catch(res => {
          this.$notify.error({
            title: '未检测到系统设备',
            message: '网络错误'
          })
        })
    },

    handleUpdatelink(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateDatalink() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updatelink(this.dataForm)
            .then(() => {
              if (this.dataForm.c_sure == 1) {
                this.$emit('v')
                console.log(2)
              }
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '更新联系人成功'
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
    handleDeletelink(row) {
      this.$confirm('是否删除?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          const data = { id: row.id, cid: row.cid }
          deletelink(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除联系人成功'
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
<style scoped>
</style>

