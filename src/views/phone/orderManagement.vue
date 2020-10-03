<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="图片名称"/>
      <el-button v-permission="['POST /api/v1/branch/list']" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">查找
      </el-button>
      <el-button v-permission="['POST /api/v1/branch/add']" class="filter-item" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加
      </el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="订单号" prop="out_trade_no"/>
      <el-table-column align="center" label="墓穴名称" prop="out_trade_no">
        <template slot-scope="scope">
          {{scope.row.classifyname+scope.row.cname}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="购买人" prop="payname"/>
      <el-table-column align="center" label="联系电话" prop="payphone"/>
      <el-table-column align="center" label="金额" prop="totalprice"/>
      <el-table-column align="center" label="支付时间" prop="pay_time"/>
      <el-table-column align="center" label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag :type="matching(scope.row.state,'type')">{{matching(scope.row.state,'state')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleFeedbackInfo(scope.row)">反馈</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="info" v-if="scope.row.state===3" :disabled="scope.row.state===3" size="mini"
                     @click="handleFeedbackState(scope.row)">完结
          </el-button>
          <el-button type="primary" v-else-if="scope.row.state!==3" size="mini" @click="handleFeedbackState(scope.row)">
            完结
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="内容" prop="execnote">
          <el-input type="textarea" v-model="dataForm.execnote"/>
        </el-form-item>
        <el-form-item label="视频路径" prop="video_thumb">
          <el-input v-model="dataForm.video_thumb"/>
        </el-form-item>
        <span style="color:red;margin-left: 25%">只能上传image/jpeg文件，且不超过2M</span>
        <el-upload
          style="width: 75%;margin-left: 25%"
          :headers="headers"
          :action="uploadPath"
          list-type="picture"
          :file-list="dataForm.images"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑订单状态框 -->
    <el-dialog width="30%" :close-on-click-modal="false" title="提示" :visible.sync="dialogFormOrderVisible">
      是否确定已完结？
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormOrderVisible = false">取消</el-button>
        <el-button type="primary" @click="updateState">确定</el-button>
      </div>
    </el-dialog>
    <!--详情对话框-->
    <el-dialog top="20px" :close-on-click-modal="false" title="详情" append-to-body :visible.sync="dialogDetailVisible">
      <order-detail :data="detailInfo" ref="orderDetail"></order-detail>
      <div style="margin-top: 10px" slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handlePrint">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {createFeedBack, feedBackInfo, listOnlineOrder, onlineOrderDetail, updateFeedBack} from '@/api/onlineOrder'
import Pagination from '@/components/Pagination'
import orderDetail from '@/components/Print/orderDetail'
import {imageMap, textMap} from '@/utils/config'
import {uploadPath} from '@/api/upload'
import {getToken} from '@/utils/auth'
import {vuexData} from '@/utils/mixin'

export default {
  name: 'VueGroup',
  computed: {
    headers() {
      return {
        token: getToken()
      }
    }
  },
  components: {Pagination, orderDetail},
  mixins: [vuexData],
  data() {
    return {
      tableData: [],
      uploadPath,
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
        execnote: undefined,
        video_thumb: undefined,
        class: 1,
        images: []
      },
      dialogFormVisible: false,
      dialogFormOrderVisible: false,
      dialogDetailVisible: false,
      dialogStatus: '',
      image_url: '',
      dialogImageUrl: '',
      dialogVisible: false,
      textMap,
      imageMap,
      detailInfo: '',
      orderType: [
        {id: 1, state: '待审核', type: 'info'},
        {id: 2, state: '待执行', type: ''},
        {id: 3, state: '已执行', type: 'success'}
      ],
      stateForm: {
        id: undefined,
        state: undefined
      },
      url: '',
      rules: {
        type: [
          {required: true, message: '请选择图片类型', trigger: 'blur'}
        ]
      }

    }
  },
  created() {
    this.getList()

  },
  methods: {
    getList() {
      this.listLoading = true;
      listOnlineOrder(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          // this.total = 1
          this.total = res.data.total || 0;
          this.listLoading = false

        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        execnote: undefined,
        video_thumb: undefined,
        images: []
      }
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      createFeedBack(this.dataForm).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: 'success',
          message: '添加反馈信息成功'
        });
        this.getList()
      }).catch(res => {
        this.$message({
          type: 'warning',
          message: res
        })
      })
    },
    handleFeedbackInfo(row) {
      this.dialogFormVisible = true;
      feedBackInfo({id: row.id}).then(res => {
        //res.data为null时为新增 否则为编辑
        if (res.data === null) {
          this.resetForm();
          this.dataForm.rid = row.id;
          this.dialogStatus = 'create';
          this.dataForm.operate_id = this.$store.state.user.garden_id;
          this.dataForm.operate_name = this.$store.state.user.name

        } else {
          this.dialogStatus = 'update';
          this.dataForm.operate_id = res.data.operate_id;
          this.dataForm.rid = res.data.rid;
          this.dataForm.id = res.data.id;
          this.dataForm.operate_name = res.data.operate_name;
          this.dataForm.video_thumb = res.data.video_thumb;
          this.dataForm.execnote = res.data.execnote;
          if (res.data.images != undefined) {
            this.dataForm.images = res.data.images
          } else {
            this.dataForm.images = []
          }

        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log('this.dataForm', this.dataForm);
          createFeedBack(this.dataForm)
            .then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '更新反馈信息成功'
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
    handleFeedbackState(row) {
      this.stateForm.id = row.id;
      this.dialogFormOrderVisible = true
    },
    updateState() {
      this.stateForm.state = 3;
      updateFeedBack(this.stateForm).then(res => {
        this.$message({
          type: 'success',
          message: '编辑状态成功'
        });
        this.getList();
        this.dialogFormOrderVisible = false
      })
    },
    matching(id, type) {
      return this.orderType.find(t => t.id === id)[type]
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //遇到一个很奇葩的问题！！！
    handleAvatarSuccess: function (res, file) {
      console.log('res', res, 'file', file);
      this.images = process.env.VUE_APP_BASE + file.response.data;
      let temp = {'url': this.images};
      //回调函数？？？
      this.dataForm.images.push(temp)
    },
    handleDetail(row) {
      this.dialogDetailVisible = true;
      onlineOrderDetail({id: row.id}).then(res => {
        this.detailInfo = res.data
      })

    },
    calcMoney(list) {
      let sum = 0;
      for (let i = 0; i < list.length; i++) {
        sum += Number(list[i].totalprice)
      }

      this.totalMoney = sum
    },
    handlePrint(row) {
      this.$refs.orderDetail.print()
    }
  }

}
</script>
<style scope>
  /*.avatar-uploader .el-upload {*/
  /*  border: 1px dashed #d9d9d9;*/
  /*  border-radius: 6px;*/
  /*  cursor: pointer;*/
  /*  position: relative;*/
  /*  overflow: hidden;*/
  /*}*/

  /*.avatar-uploader .el-upload:hover {*/
  /*  border-color: #409eff;*/
  /*}*/

  /*.avatar-uploader-icon {*/
  /*  font-size: 28px;*/
  /*  color: #8c939d;*/
  /*  width: 178px;*/
  /*  height: 150px;*/
  /*  line-height: 150px;*/
  /*  text-align: center;*/
  /*}*/

  /*.avatar {*/
  /*  width: 178px;*/
  /*  height: 178px;*/
  /*  display: block;*/
  /*}*/

  /*.el-upload--picture-card{*/
  /*  float: left;*/
  /*  width: 30%;*/
  /*}*/
  .el-upload-list--picture-card .el-upload-list__item-actions {
    /*position: relative;*/
    /*float: left;*/
    /*width: 30%;*/
  }


</style>
