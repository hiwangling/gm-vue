<template>
  <div>
    <el-button @click="handleClick">弹出对话框</el-button>
    <el-dialog :visible.sync="dialogVisible">
      <div>
        <el-form
          ref="dafaForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 600px; "
        >
          <el-form-item label="服务类型选择">
            <el-select v-model="type_id" clearable placeholder="请选择" @change="selectService">
              <!--  循环输出数据  -->
              <el-option
                v-for="(item) in allService"
                :key="item.key"
                :label="item.title"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @select="select"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="日期"
            prop="service_name"
            width="120">
          </el-table-column>
          <el-table-column
            prop="sellprice"
            label="姓名"
            width="120">
          </el-table-column>
        </el-table>
        <!--        <div class="el-divider el-divider&#45;&#45;horizontal">-->
        <!--          <div class="el-divider__text is-left">已选项目</div>-->
        <!--        </div>-->
        <!--        <el-table-->
        <!--          :show-header="false"-->
        <!--          show-summary-->
        <!--          :data="multipleSelection"-->
        <!--          @select="select"-->
        <!--        >-->
        <!--          <el-table-column type="index" width="50"/>-->
        <!--          <el-table-column prop="name" width="200"/>-->
        <!--          <el-table-column prop="sellprice"/>-->
        <!--        </el-table>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllService, listPackage, createPackage, updatePackage, deletePackage } from '@/api/package'

  export default {
    created() {
      this.getService()
      this.multipleSelection = new Map()
    },
    data() {
      return {
        type_id: 1,
        list: '',
        tableData: [],
        tableData1: [{
          id: 1,
          date: '2016-05-01',
          name: '王一',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-02',
          name: '王二',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 3,
          date: '2016-05-03',
          name: '王三',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 4,
          date: '2016-05-04',
          name: '王四',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        tableData2: [
          {
            id: 5,
            date: '2016-05-05',
            name: '王五',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 6,
            date: '2016-05-06',
            name: '王六',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 7,
            date: '2016-05-07',
            name: '王七',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 8,
            date: '2016-05-08',
            name: '王八',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        tableData3: [
          {
            id: 9,
            date: '2016-05-09',
            name: '王9',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 10,
            date: '2016-05-10',
            name: '王10',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 11,
            date: '2016-05-11',
            name: '王11',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: 12,
            date: '2016-05-12',
            name: '王12',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        serviceType: [
          { id: 1, name: '服务一' },
          { id: 2, name: '服务二' },
          { id: 3, name: '服务三' }
        ],
        multipleSelection: null,
        dialogVisible: false,
        allService: null
      }
    },
    methods: {
      getService() {
        getAllService().then(res => {
          this.allService = res.data
        })
      },
      toggleSelection(rows) {
        this.$nextTick(function() {
          if (rows) {
            rows.forEach(row => {
              console.log('row', row)
              console.log('this.$refs.multipleTable', this.$refs.multipleTable)
              this.$refs.multipleTable.toggleRowSelection(row)
            })
          }
        })
      },
      select(selection, row) {
        console.log(selection)
        this.multipleSelection.set(this.type_id, selection)
        this.formatmultipleSelection()
      },
      selectService() {
        const res = this.allService.find(item => item.key === this.type_id)
        try {
          this.tableData = res['service']
          //切换选中
          const temp = this.multipleSelection.get(this.type_id)
          console.log('temp', temp)
          this.toggleSelection(temp)
        } catch (e) {
          this.tableData = []
        }

      },
      formatmultipleSelection() {
        this.allSelected = []
        let that = this
        this.multipleSelection.forEach(function(value, key) {
          for (let i = 0; i < value.length; i++) {
            that.allSelected.push(value[i])
          }
        })
      },
      handleClick() {
        this.dialogVisible = this.dialogVisible === false
      }
    }
  }
</script>
