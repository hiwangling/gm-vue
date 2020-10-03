<template>
  <div>
    <div style="height:90px">
      <el-form
        ref="bury"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 600px; "
      >
        <div style="margin-bottom:10px">
          <el-button size="mini" type="primary" @click="getCard(0)">逝者信息(1)</el-button>
          <el-button size="mini" type="primary" @click="getCard(1)">逝者信息(2)</el-button>
          <el-button size="mini" type="primary" @click="SeleteCeme(2)">重置数据</el-button>
        </div>
        <el-form-item label="选取人数">
          <el-select v-model="type_id" clearable placeholder="请选择" @change="SeleteCeme">
            <el-option
              v-for="item in cemeteryType"
              :key="item.id"
              :label="item.type_name"
              :value="item.hrm"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <card ref="cardImg" @setImg="setImg" />
    <el-form ref="bury" :inline="true" status-icon label-position="left" label-width="100px">
      <div v-for="(idx,item) in Number(type_id)" :key="idx">
        <el-form-item :label="'墓主(' + (item == 0 ? '1' : '2') + ')'">
          <el-input v-model="bury[item].vcname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="bury[item].sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="bury[item].age" />
        </el-form-item>
        <el-form-item label="籍贯">
          <el-input v-model="bury[item].nativeplace" />
        </el-form-item>
        <el-form-item label="民族">
          <el-input v-model="bury[item].nation" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="bury[item].card_no" class="card" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="bury[item].birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker
            v-model="bury[item].death"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="安葬日期">
          <el-date-picker
            v-model="bury[item].bury"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <br>
        <el-form-item label="身份证(正)">
          <div class="uploader_photo dead_photo">
            <div class="avatar-uploader el-upload-list--picture-card">
              <template v-if="bury[item].card_photo_z">
                <img :src="bury[item].card_photo_z" class="avatar">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span class="el-upload-list__item-delete" @click="bury[item].card_photo_z = ''">
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </template>
              <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(item,1)" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="身份证(反)">
          <div class="uploader_photo dead_photo">
            <div class="avatar-uploader el-upload-list--picture-card">
              <template v-if="bury[item].card_photo_f">
                <img :src="bury[item].card_photo_f" class="avatar">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span class="el-upload-list__item-delete" @click="bury[item].card_photo_f = ''">
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </template>
              <i v-else class="el-icon-plus avatar-uploader-icon" @click="getPic(item,2)" />
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { listType } from '@/api/type'
import { vuexData, page } from '@/utils/mixin'
import { addbuy } from '@/api/buy'
import axios from 'axios'
import card from '@/components/Card'
export default {
  components: { card },
  mixins: [vuexData, page],
  data() {
    return {
      type_id: 2,
      idx: '',
      bury: null,
      cemeteryType: null,
      index: ''
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.Creattype()
        this.SeleteCeme(this.type_id)
      },
      immediate: true
    }
  },
  created() {
    this.Creattype()
    this.type_id = this.cname.type_id
  },
  methods: {
    resetForm() {
      this.bury = [
        {
          cid: this.cems.id,
          card_no: '',
          vcname: '',
          sex: '',
          age: '',
          nation: '',
          nativeplace: '湖北宜昌',
          card_photo_f: null,
          card_photo_z: null,
          birth: null,
          death: null,
          bury: null,
          type_id: this.type_id
        }
      ]
    },
    SeleteCeme(val) {
      this.resetForm()
      for (let i = 0; i < val - 1; i++) {
        this.bury.push({
          cid: this.cems.id,
          card_no: '',
          vcname: '',
          sex: '',
          age: '',
          nation: '',
          nativeplace: '湖北宜昌',
          card_photo_f: null,
          card_photo_z: null,
          birth: null,
          death: null,
          bury: null,
          type_id: this.type_id
        })
      }
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
            this.bury[val].vcname = info.name
            this.bury[val].sex = info.sex
            this.bury[val].nativeplace = info.address
            this.bury[val].card_no = info.cardID
            this.bury[val].nation = info.nation
            var birthday = []
            birthday[0] = info.birthday.substring(0, 4)
            birthday[1] = info.birthday.substring(4, 6)
            birthday[2] = info.birthday.substring(6, 8)
            this.bury[val].birth = birthday.join('-')
            var myDate = new Date()
            var tYear = myDate.getFullYear()
            this.bury[val].age = parseInt(tYear) - (info.birthday.substr(0, 4))
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
    getPic(val, idx) {
      this.$refs.cardImg.show(this.bury[val])
      this.index = val
      this.idx = idx
    },
    setImg(val) {
      if (this.idx == 1) {
        this.bury[this.index].card_photo_z = val
      } else if (this.idx == 2) {
        this.bury[this.index].card_photo_f = val
      }
    },
    addForm(val) {
      const obj = Object.assign({}, this.bury)
      const dead = []
      for (const i in obj) {
        dead.push(obj[i])
      }
      dead.forEach((v, k) => {
        if (v.vcname === '') {
          const index = dead.indexOf(v)
          dead.splice(index, 1)
        }
      })

      val.dead = dead
      addbuy(val)
        .then(res => {
          this.$emit('CloseDialog', false)
          this.$message({
            type: 'success',
            message: '添加购墓信息成功'
          })
        })
        .catch(res => {
          this.$message({
            type: 'warning',
            message: res
          })
        })
    },
    Creattype() {
      const data = { cid: this.cems.id }
      listType(data).then(res => {
        this.cemeteryType = res.data.data
      })
    }
  }
}
</script>
