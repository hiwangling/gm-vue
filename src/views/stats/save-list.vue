<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 160px;"
        placeholder="请输入编号A1-1-1"
      />
      <el-date-picker
        v-model="listQuery.startime"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-button
        v-permission="['GET /api/v1/cemetery/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="寄存编号" prop="classify_name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.classly_name }}{{ scope.row.locker_title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="联系人" prop="buyer_name" />
      <el-table-column align="center" label="寄存时间" prop="savebegindate" />
      <el-table-column align="center" label="取走时间" prop="canceldate" />
      <el-table-column align="center" label="操作人" prop="operater_name" width="120" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlelook(scope.row.id)">查看</el-button>
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
      class="dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="5vh"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        state-icon
        :model="dataForm"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="区" prop="classly">
          <el-select v-model="dataForm.classly" placeholder="请选择" style="width:180px">
            <el-option
              v-for="(item,value,index) in locker_classly"
              :key="index"
              :label="item"
              :value="value + 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排" prop="ix">
          <el-input v-model.number="dataForm.ix" />
        </el-form-item>
        <el-form-item v-if="flag" label="号" prop="start">
          <el-input v-model.number="dataForm.start" />
        </el-form-item>
        <template v-if="!flag">
          <el-form-item label="起" prop="star">
            <el-input v-model.number="dataForm.start" placeholder="1" />
          </el-form-item>
          <el-form-item label="止" prop="star">
            <el-input v-model.number="dataForm.end" placeholder="20" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <template v-if="dialogStatus=='create'">
          <el-button type="primary" @click="createflag">{{ flag == true ? '批量添加' : '单个添加' }}</el-button>
          <el-button type="primary" @click="createData">确定</el-button>
        </template>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      :title="textMaps[dialogSave]"
      :visible.sync="dialogFormVisibleSave"
      top="5vh"
      append-to-body
    >
      <el-form
        ref="save"
        :inline="true"
        :rules="rules"
        state-icon
        label-position="left"
        :model="save"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="逝者姓名">
          <el-input v-model="save.name" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="save.buyer_name" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="save.phone" />
        </el-form-item>

        <el-form-item label="寄存时间">
          <el-date-picker
            v-model="save.savebegindate"
            type="date"
            default-value
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="save.saveenddate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="寄存价格">
          <el-input v-model="save.real_price" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="save.vcnote" />
        </el-form-item>
        <br>
        <template v-if="dialogSave == 'create' || dialogSave == 'update'">
          <el-form-item label="逝者身份证">
            <div class="uploader_photo">
              <div class="avatar-uploader el-upload-list--picture-card">
                <template v-if="save.bury_card_photo_z">
                  <el-image :src="save.bury_card_photo_z" class="avatar" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span class="el-upload-list__item-preview" @click="getPic(0)">
                      <i class="el-icon-edit" />
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="photoDel(dataForm.bury_card_photo_z)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </template>
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(0)" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="联系人身份证">
            <div class="uploader_photo">
              <div class="avatar-uploader el-upload-list--picture-card">
                <template v-if="save.link_card_photo_z">
                  <el-image :src="save.link_card_photo_z" class="avatar" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span class="el-upload-list__item-preview" @click="getPic(1)">
                      <i class="el-icon-edit" />
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="photoDel(save.link_card_photo_z)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </template>
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(1)" />
              </div>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSave = false">取消</el-button>
        <el-button v-if="dialogSave=='create'" type="primary" @click="handleSave">确定</el-button>
        <el-button v-if="dialogSave=='renew'" type="primary" @click="UpdateSave">续费确定</el-button>
        <el-button v-if="dialogSave=='update'" type="primary" @click="HandleEdit">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog id="save" :close-on-click-modal="false" title="寄存明细查看" :visible.sync="dialogForm">
      <div class="temp-content">
        <h1>基本信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p>
                <span>逝者姓名 :</span>
                {{ list_.name }}
              </p>
              <p>
                <span>开始时间 :</span>
                {{ list_.savebegindate }}
              </p>
              <p>
                <span>操作人 :</span>
                {{ list_.sellname }}
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p>
                <span>联系人 :</span>
                {{ list_.buyer_name }}
              </p>
              <p>
                <span>结束时间 :</span>
                {{ list_.order_end }}
              </p>
              <p>
                <span>备注 :</span>
                {{ list_.vcnote }}
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p>
                <span>联系电话 :</span>
                {{ list_.phone }}
              </p>
              <p>
                <span>过期天数 :</span>
                {{ list_.guoqi_days }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="temp-content temp-content-server">
        <h1>缴费记录</h1>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-table
              v-loading="listLoading"
              :data="list_.renewList"
              element-loading-text="正在查询中。。。"
              border
              fit
              highlight-current-row
            >
              <el-table-column align="center" label="开始时间" prop="order_begin" />
              <el-table-column align="center" label="结束时间" prop="order_end" />
              <el-table-column align="center" label="费用" prop="sum_price" />
              <el-table-column align="center" label="经办人" prop="sellname" />
              <el-table-column align="center" label="办理时间" prop="create_time" />
              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                  <template>
                    <el-button
                      v-permission="['GET /api/v1/save/del']"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="handleDeletelog(scope.row)"
                    >删除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取消</el-button>
      </div>
    </el-dialog>

    <card v-show="false" ref="cardImg" @setImg="setImg" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { vuexData } from '@/utils/mixin'
import card from '@/components/Card'
import { listSave, lockerdel, lockeradd, lockeredit, createSave, PaySave, deleteSave, updateSave, delay, delsavelog, getsavelog, discountadd } from '@/api/save'
export default {
  components: { Pagination, card },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      list_: { renewList: null },
      srcList: [],
      flag: true,
      listLoading: true,
      free: 0,
      use: 0,
      total: 0,
      dialogStatus: '',
      dialogSave: '',
      dataForm: {
        classly: '',
        ix: '',
        start: '',
        end: '',
        id: ''
      },
      save: {
        buyer_name: '',
        name: '',
        loid: '',
        phone: '',
        link_card_photo_z: null,
        bury_card_photo_z: null,
        savebegindate: null,
        saveenddate: null,
        vcnote: '',
        real_price: '',
        seller_id: '',
        sellname: ''
      },
      listQuery: {
        page: 1,
        limit: 54,
        state: '',
        classly: '',
        endtime: '',
        startime: '',
        sort: 'add_time',
        order: 'desc',
        keyword: undefined

      },
      dialogFormVisibleSave: false,
      dialogFormVisible: false,
      dialogForm: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      textMaps: {
        create: '创建',
        update: '编辑',
        renew: '续费'
      },
      rules: {
        classly: [{ required: true, message: '区不能为空', trigger: 'blur' }],
        ix: [{ required: true, message: '排不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    cems() {
      return this.$store.state.cemetery.cems
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
    async getList() {
      this.listLoading = false
      await listSave(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    getPic(v) {
      const data = {
        vcname: ''
      }
      this.index = v
      this.$refs.cardImg.show(data)
    },
    setImg(val) {
      if (this.index == 0) {
        this.dataForm.thedead_card = val
      } else if (this.index == 1) {
        this.dataForm.link_card = val
      } else if (this.index == 2) {
        this.dataForm.cremation = val
      } else {
        this.dataForm.bill = val
      }
    },
    handleCommand(command) {
      var id = command && command.split('_')[0]
      switch (Number(command.split('_')[1])) {
        case 1:
          this.handleCreateSave(id)
          break
        case 2:
          this.handleUpdate(id)
          break
        case 3:
          this.handleRenew(id)
          break
        case 4:
          this.handleGo(id)
          break
        case 5:
          this.handlelook(id)
          break
        case 6:
          this.Delete(id)
          break
        default:
          this.$message('无此信息～')
      }
    },
    Delete(id) {
      this.$confirm('确定清空寄存信息吗?', '清空操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          const data = { id: id }
          deleteSave(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除寄存信息成功'
              })
              this.getList()
            })
            .catch(res => {
              this.$message({
                title: '失败',
                message: res.msg
              })
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    reseSave() {
      this.save = {
        buyer_name: '',
        name: '',
        loid: '',
        phone: '',
        link_card_photo_z: null,
        bury_card_photo_z: null,
        savebegindate: new Date(),
        saveenddate: new Date(),
        vcnote: '',
        real_price: '',
        sellname: this.user.realname,
        seller_id: this.user.id
      }
    },
    handleGo(id) {
      const data = { id: id }
      getsavelog(data).then(res => {
        this.$confirm('确定取走?', '取走操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'confirmTop'
        })
          .then(() => {
            const data_ = { id: res.data.id, loid: res.data.loid, operater_id: this.user.id, operater_name: this.user.realname, name: res.data.name }
            delay(data_)
              .then(res => {
                this.getList()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              })
              .catch(res => {
                this.$message({
                  title: '失败',
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
      })
    },
    handleEdit(row) {
      this.dataForm.classly = row.classly
      this.dataForm.ix = row.ix
      this.dataForm.start = row.iy
      this.dataForm.id = row.id
      console.log(this.dataForm)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlelook(id) {
      this.dialogStatus = '寄存记录'
      const data = { id: id }
      getsavelog(data).then(res => {
        this.list_ = res.data
        this.srcList = [this.list_.thedead_card, this.list_.link_card, this.list_.cremation, this.list_.bill]
        this.dialogForm = true
      })
    },
    handleView(row) {

    },
    handleDeletelog(row) {
      const data = { id: row.id, cid: row.cid, financetype: 3 }
      this.$confirm('确定删除吗?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      })
        .then(() => {
          delsavelog(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除缴费信息成功'
              })
              const index = this.list_.renewList.indexOf(row)
              this.list_.renewList.splice(index, 1)
            })
            .catch(res => {
              this.$message({
                title: '失败',
                message: res.msg
              })
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleUpdate(id) {
      const data = { id: id }
      getsavelog(data).then(res => {
        this.save = res.data
        this.dialogFormVisibleSave = true
        this.dialogSave = 'update'
        this.$nextTick(() => {
          this.$refs['save'].clearValidate()
        })
      })
    },
    handleRenew(id) {
      const data = { id: id }
      getsavelog(data).then(res => {
        const star = res.data.order_end
        // this.save.did = res.data.did
        this.save.cid = res.data.id
        this.save.buyer_name = res.data.buyer_name
        this.save.name = res.data.name
        this.save.phone = res.data.phone
        this.save.sellname = this.user.realname
        this.save.seller_id = this.user.id
        this.save.savebegindate = star
        this.save.savebegindate = parseTime(
          this.save.savebegindate,
          '{y}-{m}-{d}'
        )
        const setDate = new Date(this.save.savebegindate)
        setDate.setFullYear(setDate.getFullYear() + 1)
        setDate.setDate(setDate.getDate())
        this.save.saveenddate = parseTime(setDate, '{y}-{m}-{d}')
        this.save.real_price = 120
        this.dialogSave = 'renew'
        this.dialogFormVisibleSave = true
        this.$nextTick(() => {
          this.$refs['save'].clearValidate()
        })
      })
    },
    handleCreateSave(id) {
      this.reseSave()
      this.save.loid = id
      this.save.savebegindate = parseTime(
        this.save.savebegindate,
        '{y}-{m}-{d}'
      )
      const setDate = new Date(this.save.savebegindate)
      setDate.setFullYear(setDate.getFullYear() + 1)
      setDate.setDate(setDate.getDate())
      this.save.saveenddate = parseTime(setDate, '{y}-{m}-{d}')
      this.dialogSave = 'create'
      this.dialogFormVisibleSave = true
      this.$nextTick(() => {
        this.$refs['save'].clearValidate()
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.classly = ''
      this.listQuery.state = ''
      this.getList()
    },

    createflag() {
      if (this.flag == true) {
        this.flag = false
        this.dataForm.iy = ''
      } else {
        this.flag = true
        this.dataForm.star = ''
        this.dataForm.end = ''
      }
    },

    resetForm() {
      this.dataForm = {
        classly: '',
        ix: '',
        start: '',
        end: '',
        id: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          lockeradd(this.dataForm)
            .then(res => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleSave() {
      this.$refs['save'].validate(valid => {
        if (valid) {
          createSave(this.save)
            .then(res => {
              this.getList()
              this.dialogFormVisibleSave = false
              this.$message({
                type: 'success',
                message: '添加寄存信息成功'
              })
            })
            .catch(res => {
              this.$message({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    UpdateSave() {
      this.save.order_end = this.save.saveenddate
      this.$refs['save'].validate(valid => {
        if (valid) {
          PaySave(this.save)
            .then(res => {
              this.getList()
              this.dialogFormVisibleSave = false
              this.$message({
                type: 'success',
                message: '续费成功'
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
    HandleEdit() {
      this.$refs['save'].validate(valid => {
        if (valid) {
          updateSave(this.save)
            .then(() => {
              this.getList()
              this.dialogFormVisibleSave = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    updateData() {
      this.dataForm.iy = this.dataForm.start
      delete this.dataForm.start
      delete this.dataForm.end
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          lockeredit(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res
              })
            })
        }
      })
    },

    handleDelete(row) {
      this.$confirm(
        '您确认此删除操作吗?',
        '删除操作',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'confirmTop'
        }
      )
        .then(() => {
          const data = { id: row.id }
          lockerdel(data)
            .then(res => {
              this.$notify.success({
                title: '成功',
                message: '删除成功'
              })
              this.getList()
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>
<style>
.checks {
  margin: 5px;
  padding: 0px;
  width: 24%;
  padding-left: 10px;
  float: left;
  font-size: 16px;
  text-align: center;
  /* line-height: 150px; */
  height: 120px;
  border-radius: 5px;
}
.checks p,
.checks h3 {
  margin: 0;
  padding: 0;
  margin: 6px 0;
  line-height: 30px;
  font-size: 18px;
}
.checks p {
  text-align: left;
}
.checks h3 {
  margin: 10px 0;
  font-size: 24px;
}
.inlins {
  display: inline-block;
  width: 50px;
  height: 20px;
  position: relative;
  top: 4px;
}
.atives {
  border: 1px solid #f5a4a4;
}
.sell {
  background-color: #42b983 !important;
  border-color: #42b983 !important;
}
.sold {
  background-color: #b9394c !important;
  border-color: #b9394c !important;
}

.bespeakinfo {
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.8rem;
  list-style-type: none;
  width: 200px;
  min-height: 175px;
  float: left;
  margin-left: 1%;
}
/* .bespeakinfo li {
  width: 160px;
} */
.default {
  background: #fff;
}
.actives {
  background: url(../../assets/img/uccv4qe6.png) 100% 100% no-repeat;
  background-size: 35%;
  background-position: 75px 97px;
  color: #000 !important;
}
.bespeakinfo li:first-child {
  border-bottom: 1px solid #eee;
}
.bespeakinfo .title {
  display: inline-block;
  line-height: 1.8rem;
  min-width: 4rem;
}
.border-li {
  /* border-bottom: 1px solid #eee; */
}
.default .title {
  color: #999;
}
.bespeakinfo .text {
  text-align: left;
}
.default .text {
  color: #000;
}
.actives .text,
.actives .title {
  color: #999;
}
.menu .menu-centent {
  /* display: flex; */
}
#save .el-dialog {
  width: 700px;
}
</style>
