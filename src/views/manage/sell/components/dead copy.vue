<template>
  <div class="container">
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-edit"
      style="margin:10px 0"
      :disabled="cname.type_id > (list ? list.length : 2) ? false :true"
      @click="handleBury"
    >添加墓主信息</el-button>
    <!-- {{ list.length }} -->
    <!-- <el-button v-else type="info" plain disabled style="margin:10px 0">墓位信息</el-button>    v-if=" list ? (list[0] ? list[0].type_id > list.length : true) : true" -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="姓名" prop="vcname" />
      <el-table-column align="center" label="性别" prop="sex" width="50" />
      <el-table-column align="center" label="出生日期" prop="birth" />
      <el-table-column align="center" label="去世日期" prop="death" />
      <el-table-column align="center" label="安葬日期" prop="bury" />
      <el-table-column align="center" label="状态" prop="bury_status" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.bury_status | bury_status"
          >{{ scope.row.bury_status == 0 ? '未安葬' : '已安葬' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.bury_status == 0"
            type="warning"
            size="mini"
            @click="GoBury(scope.row)"
          >安葬</el-button>
          <el-button type="primary" size="mini" @click="photoSearch(scope.row)">查看</el-button>
          <el-button
            type="primary"
            size="mini"
            style="margin-left:0;margin-top:5px"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.bury_status == 0"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      title="查看"
      :visible.sync="searchVisible"
      top="5vh"
      width="420px"
      append-to-body
    >
      <div class="card_photo">
        <div class="uploader_photo">
          <div class="avatar-uploader el-upload-list--picture-card">
            <template v-if="card_photo_z.card_photo">
              <el-image :src="card_photo_z.card_photo" class="avatar" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview">
                  <i class="el-icon-zoom-in" />
                </span>
                <span class="el-upload-list__item-preview" @click="getPic(1)">
                  <i class="el-icon-edit" />
                </span>
                <span class="el-upload-list__item-delete" @click="photoDel(card_photo_z)">
                  <i class="el-icon-delete" />
                </span>
              </span>
            </template>
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(1)" />
          </div>
          <p>身份证(正)</p>
        </div>
        <div class="uploader_photo">
          <div class="avatar-uploader el-upload-list--picture-card">
            <template v-if="card_photo_f.card_photo">
              <el-image :src="card_photo_f.card_photo" class="avatar" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview">
                  <i class="el-icon-zoom-in" />
                </span>
                <span class="el-upload-list__item-preview" @click="getPic(2)">
                  <i class="el-icon-edit" />
                </span>
                <span class="el-upload-list__item-delete" @click="photoDel(card_photo_f)">
                  <i class="el-icon-delete" />
                </span>
              </span>
            </template>
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(2)" />
          </div>
          <p>身份证(反)</p>
        </div>
        <!-- <div class="uploader_photo">
          <div class="avatar-uploader el-upload-list--picture-card">
            <template v-if="dataForm.card_photo_f">
              <img :src="dataForm.card_photo_f" class="avatar">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview">
                  <i class="el-icon-zoom-in" />
                </span>
                <span class="el-upload-list__item-delete" @click="dataForm.card_photo_f = ''">
                  <i class="el-icon-delete" />
                </span>
              </span>
            </template>
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(2)" />
          </div>
          <p>身份证(反)</p>
        </div>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="searchVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="updatePhoto">保存</el-button> -->
      </div>
    </el-dialog>
    <card ref="cardImg" @setImg="setImg" />
    <el-dialog
      id="dead"
      :close-on-click-modal="false"
      class="dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <div style="margin-bottom:10px">
        <el-button size="mini" type="primary" @click="getCard()">逝者信息</el-button>
      </div>
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="rules"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="墓主">
          <el-input v-model="dataForm.vcname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dataForm.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="dataForm.card_no" />
        </el-form-item>

        <el-form-item label="籍贯">
          <el-input v-model="dataForm.nativeplace" />
        </el-form-item>
        <el-form-item label="民族">
          <el-input v-model="dataForm.nation" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="dataForm.birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker
            v-model="dataForm.death"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="安葬日期">
          <el-date-picker
            v-model="dataForm.bury"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
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
import { vuexData, page } from '@/utils/mixin'
import { adddead, listdead, deletedead, updatedead, godead, imageslist, imagesdel, imagesdispose } from '@/api/dead'
import axios from 'axios'
import card from '@/components/Card'
export default {
  components: { card },
  mixins: [vuexData, page],
  data() {
    return {
      n: '',
      index: 1,
      list: null,
      card_photo_z: {
        card_photo: '',
        id: '',
        images_name: '身份证(正)',
        type: 2,
        imgtype: 1,
        step: 1,
        cid: '',
        tid: ''
      },
      card_photo_f: {
        card_photo: '',
        id: '',
        images_name: '身份证(反)',
        type: 2,
        imgtype: 1,
        step: 2,
        cid: '',
        tid: ''
      },
      listLoading: true,
      searchVisible: false,
      dialogFormVisible: false,
      cemeteryType: null,
      dialogStatus: '',
      dataForm: {
        cid: '',
        card_no: '',
        vcname: '',
        nation: '汉',
        nativeplace: '',
        sex: '',
        birth: null,
        death: null,
        bury: null
      },
      buryForm: null,
      rules: {
        // vcname: [{ required: true, message: '墓主不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
        this.getStatus()
      },
      immediate: true
    }
  },
  created() { },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      listdead(data)
        .then(res => {
          this.list = res.data
          // this.type_id = this.list[0].type_id
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
            this.dataForm.vcname = info.name
            this.dataForm.sex = info.sex
            this.dataForm.nativeplace = info.address
            this.dataForm.card_no = info.cardID
            var birthday = []
            birthday[0] = info.birthday.substring(0, 4)
            birthday[1] = info.birthday.substring(4, 6)
            birthday[2] = info.birthday.substring(6, 8)
            this.dataForm.birth = birthday.join('-')
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
    getPic(v) {
      this.$refs.cardImg.show()
      this.n = v
    },
    setImg(v) {
      this.photo(v)
    },
    photo(v) {
      var n = this.n
      switch (n) {
        case 1:
          this.card_photo_z.card_photo = v
          this.dispose(this.card_photo_z)
          break
        case 2:
          this.card_photo_f.card_photo = v
          this.dispose(this.card_photo_f)
          break
        default:
      }
    },
    dispose(v) {
      imagesdispose(v).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        v.id = res.data
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
    },
    handleBury() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm()
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      updatedead(this.dataForm)
        .then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '更新墓主信息成功'
          })
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    photoDel(v) {
      this.$confirm('是否删除?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = { id: v.id }
        imagesdel(data).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          v.card_photo = ''
          v.id = ''
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    photoSearch(row) {
      const data = {
        cid: row.cid,
        tid: row.id,
        imgtype: 1
      }
      this.resetForm()
      this.card_photo_z.cid = row.cid
      this.card_photo_z.tid = row.id
      this.card_photo_f.cid = row.cid
      this.card_photo_f.tid = row.id
      imageslist(data).then(res => {
        res.data.forEach(v => {
          if (v.step == 1) {
            this.card_photo_z.card_photo = v.photo
            this.card_photo_z.id = v.id
          } else {
            this.card_photo_f.card_photo = v.photo
            this.card_photo_f.id = v.id
          }
        })
        this.searchVisible = true
      })
    },

    handleDelete(row) {
      this.$confirm('是否删除?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          const data = { id: row.id, cid: this.cems.id }
          deletedead(data)
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    GoBury(row) {
      const data = {
        id: row.id,
        bury: row.bury
      }
      this.$confirm('是否安葬?', '安葬操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          godead(data)
            .then(res => {
              this.$emit('v')
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getList()
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    createData() {
      this.dataForm.cid = this.cems.id
      adddead(this.dataForm)
        .then(res => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '添加墓主信息成功'
          })
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        card_no: '',
        vcname: '',
        sex: '',
        birth: null,
        death: null,
        nativeplace: '',
        cremation_photo: null,
        death_photo: null,
        bury: null
      }
      this.card_photo_z = {
        card_photo: '',
        id: '',
        images_name: '身份证(正)',
        type: 2,
        imgtype: 1,
        step: 1,
        cid: '',
        tid: ''
      }
      this.card_photo_f = {
        card_photo: '',
        id: '',
        images_name: '身份证(反)',
        type: 2,
        imgtype: 1,
        step: 2,
        cid: '',
        tid: ''
      }
    }
  }
}
</script>
<style>
#dead .el-dialog {
  width: 900px;
}
.card_photo {
  display: flex;
  flex-wrap: wrap;
}
</style>

