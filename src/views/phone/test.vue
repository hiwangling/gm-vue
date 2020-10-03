<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <el-table ref="multipleTable" :data="tableData3" border tooltip-effect="dark" style="width: 100%;margin-top: 20px">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="日期" width="120">
          <template scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>

    </el-dialog>

    <div style="margin-top: 20px">
      <el-button @click="openDialog">打开弹框1</el-button>
    </div>

  </div>

</template>

<script>
  export default {
    data() {
      return {

        dialogVisible: false,
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },  {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: []
      }
    },

    methods: {
      openDialog() {
        this.dialogVisible = true
        this.$nextTick(function() {
          this.toggleSelection([this.tableData3[2], this.tableData3[3]])
        })

      },
      toggleSelection(rows) {
        this.$refs.multipleTable.clearSelection()
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      }
    }
  }
</script>
