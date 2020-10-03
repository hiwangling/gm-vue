<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓位名称" />
      <el-button v-permission="['GET /api/v1/cemetery_classify/g_list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="原墓位" prop="old_name" />
      <el-table-column align="center" label="联系人" prop="linkname" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="逝者姓名" prop="buryname" />
      <el-table-column align="center" label="迁出时间" prop="create_time" />
      <el-table-column align="center" label="操作人" prop="operate_name" />
      <el-table-column align="center" label="创建时间" prop="create_time" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <!-- <el-button v-permission="['GET /api/v1/cemetery/del']" type="primary" size="mini" @click="handleExcep(scope.row)">处理</el-button> -->
          <el-button v-permission="['GET /api/v1/cemetery/del']" type="primary" size="mini" @click="handlereturn(scope.row)">撤销</el-button>
          <el-button v-permission="['POST /api/v1/cemetery_classify/g_edit']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /api/v1/cemetery_classify/g_edit']" type="primary" size="mini" @click="handlePrint(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dataForm.photo.length > 0" label="照片" prop="photo">
          <img v-for="(val,idx) in dataForm.photo" :key="idx" preview="1" :src="val" alt="" width="80" height="50" style="margin-left:10px">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dataForm.photo = []">清空照片</el-button>
        <el-button type="primary" @click="createmove">上传照片</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <card ref="cardImg" @setImg="setImg" />
    <build v-show="false" ref="build_" />
  </div>
</template>
<script>
import { get_historylist, get_images_byzid, update_images, move_cemetery_qian_revoke } from '@/api/cemetery'
import { update_usestatus } from '@/api/grave'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'
import card from '@/components/Card'
import build from '@/components/Print/build'
export default {
  name: 'VueGarden',
  components: { Pagination, card, build },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: '',
        fjids: [],
        photo: []
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        type_name: [{ required: true, message: '墓园名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      get_historylist(this.listQuery)
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    createmove() {
      this.$refs.cardImg.show()
    },
    setImg(val) {
      this.dataForm.photo.push(val)
    },
    handleExcep(row) {
      const data = { id: row.id, old_cid: row.old_cid }
      update_usestatus(data)
        .then(res => {
          console.log(res.data)
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    handleUpdate(row) {
      // this.dataForm = Object.assign({}, row)
      this.dataForm.id = row.id
      var imgid = (row.fjids).split(',')
      this.dataForm.fjids = imgid
      const data = { id: row.id, fjids: imgid }
      get_images_byzid(data).then(res => {
        var arr = []
        res.data.forEach(v => {
          arr.push(v.photo)
        })
        this.dataForm.photo = arr
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update_images(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '编辑成功'
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
    handlePrint(row) {
      const data = {
        type: 3,
        name: row.old_name,
        operate: row.operate_name,
        buryname: row.buryname
      }
      this.$refs.build_.getlist(data)
    },
    handlereturn(row) {
      this.$confirm('您确认撤销吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          cid: row.old_cid
        }
        move_cemetery_qian_revoke(data).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getList()
        }).catch(res => {
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
