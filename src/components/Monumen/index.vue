<template>
  <el-dialog id="monumen" :close-on-click-modal="false" class="dialog" title="刻碑" :visible.sync="dialogFormVisible_" top="1vh" append-to-body width="1100px">
    <div style="height:700px;position: relative;">
      <el-button type="danger" plain size="small" @click="flag = true">竖碑</el-button>
      <el-button type="danger" plain size="small" @click="flag = false">横碑</el-button>
      <el-button type="primary" plain size="small" @click="rest">重置碑文</el-button>
      <el-button type="primary" plain size="small" @click="print">打印</el-button>
      <section ref="print">
        <div class="mon-main">
          <table style="table-layout:fixed;width:300px" class="tbs">
            <tr>
              <td style="width:100px">墓穴位置</td>
              <td>{{ cname.name }}</td>
            </tr>
            <tr>
              <td>订墓人姓名</td>
              <td>{{ link.link_name }}</td>
            </tr>
            <tr>
              <td>与逝者关系</td>
              <td>{{ link.relation }}</td>
            </tr>

            <tr>
              <td>联系电话</td>
              <td>{{ link.phone }}</td>
            </tr>
            <tr>
              <td>联系人地址</td>
              <td>{{ link.address }}</td>
            </tr>
            <tr>
              <td colspan="2">
                <div style="height:140px">
                  备注
                  <el-input v-model="inscription_remark" type="textarea" :rows="4" placeholder="请输入备注" />
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div style="height:100px">说明：购墓者请仔细核对碑文内容并签字确认，我们将严格按照碑文内容刻字，如出现校对错误，我们概不负责。</div>
              </td>
            </tr>
          </table>
          <div>
            <template v-if="flag">
              <template v-for="(item,index) in vert">
                <drag :key="index" ref="style_" :child="item" />
              </template>
            </template>
            <template v-else>
              <template v-for="(item,index) in hori">
                <drag :key="index" :child="item" />
              </template>
            </template>
          </div>
        </div>
      </section>
    <!-- <p>大字：{{ fn.big }}</p>
    <p>小字：{{ fn.small }}</p>-->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible_ = false">取消</el-button>
      <el-button type="primary" @click="createDate">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { vuexData } from '@/utils/mixin'
import Drag from './components/Drag'
import text from '@/utils/text'
import { listlink } from '@/api/link'
import { listdead } from '@/api/dead'
import { cemeterytablet, getTablet } from '@/api/cemetery'

const initHori = text.initHori
const initVert = text.initVert
export default {
  components: { Drag },
  mixins: [vuexData],
  data() {
    return {
      sex: '男',
      flag: true,
      link: {
        link_name: '',
        relation: '',
        phone: '',
        address: ''
      },
      dead: null,
      inscription_remark: '',
      dialogFormVisible_: false,
      hori: [],
      vert: []
    }
  },
  watch: {

  },
  created() {
  },
  methods: {
    restFun() {
      const data = {
        cid: this.cems.id
      }
      getTablet(data)
        .then(res => {
          if (res.data.inscription_erect !== '' && res.data.inscription_across !== '') {
            this.vert = res.data.inscription_erect
            this.hori = res.data.inscription_across
            this.inscription_remark = res.data.inscription_remark
          } else {
            this.rest()
          }
          this.getBorder()
          this.dialogFormVisible_ = true
        })
      listlink(data)
        .then(res => {
          if (res.data.length > 0) { this.link = res.data[0] }
        })
      listdead(data)
        .then(res => {
          const dead = {
            dead1: '',
            dead2: ''
          }
          res.data.forEach((v, k) => {
            if (v.sex === this.sex) {
              dead.dead1 = res.data[k].vcname
            } else {
              dead.dead2 = res.data[k].vcname
            }
          })
          initVert.forEach((v, k) => {
            if (v.match === 'dead1') {
              v.t = dead.dead1
            } else if (v.match === 'dead2') {
              v.t = dead.dead2
            }
          })
        })
      this.hori = Object.assign([], initHori)
      this.vert = Object.assign([], initVert)
    },
    async print() {
      await this.clearBorder()
      await this.$print(this.$refs.print)
    },
    clearBorder() {
      this.vert.forEach((v, k) => {
        if (v.e) {
          v.e = false
        }
      })
      this.hori.forEach((v, k) => {
        if (v.e) {
          v.e = false
        }
      })
    },
    getBorder() {
      this.vert.forEach((v, k) => {
        if (v.e) {
          v.e = true
        }
      })
      this.hori.forEach((v, k) => {
        if (v.e) {
          v.e = true
        }
      })
    },
    rest() {
      if (this.flag) {
        this.vert = Object.assign([], initVert)
      } else {
        this.hori = Object.assign([], initHori)
      }
    },
    createDate() {
      const data = {
        cid: this.cems.id,
        mentstatus: 1,
        inscription_erect: this.vert,
        inscription_across: this.hori,
        inscription_remark: this.inscription_remark
      }
      cemeterytablet(data)
        .then(res => {
          this.$emit('close')
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogFormVisible_ = false
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    }
  }
}
</script>

<style>
.mon-main {
  position: absolute;
  /* border: 1px solid #ccc; */
  width: 1050px;
  height: 600px;
  margin-top: 10px;
}
.tbs,
.tbs tr th {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border-collapse: collapse;
}
.tbs tr td {
  padding-left: 10px;
  border: 1px solid #ccc;
}
</style>
