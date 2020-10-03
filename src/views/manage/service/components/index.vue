<template>
  <div>
    <el-form
      ref="dataForm"
      :inline="true"
      :model="dataForm"
      status-icon
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="付款人" prop="buyer_name" style="margin-bottom:0">
        <el-select
          v-model="dataForm.buyer_name"
          filterable
          style="width:140px!important"
          size="mini"
          allow-create
          default-first-option
          placeholder="请选择"
          @change="linkPhone"
        >
          <el-option
            v-for="item in link"
            :key="item.id"
            :label="item.link_name"
            :value="item.link_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone" style="margin-bottom:0px">
        <el-input
          v-model="dataForm.phone"
          size="mini"
          placeholder="请输入电话"
          style="width:120px"
          @blur="changeSell"
        />
      </el-form-item>
      <el-form-item label="服务时间" style="margin-bottom:0">
        <el-date-picker
          v-model="dataForm.service_time"
          style="width:140px!important"
          size="mini"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <el-tabs v-model="active" tab-position="top" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tab" :key="index" :label="item.label" :name="item.label">
        <el-table
          ref="sellTable"
          border
          highlight-current-row
          :data="item.list"
          tooltip-effect="dark"
          style="width: 100%;margin-bottom:10px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="service_name" align="center" label="服务名称" width="150" />
          <el-table-column prop="chargeunit" align="center" label="单位" width="60" />
          <el-table-column prop="sell_price" align="center" label="服务价格" show-overflow-tooltip>
            <template slot-scope="{row}">
              <template>
                <el-input
                  v-model="row.sell_price"
                  class="edit-input"
                  size="mini"
                  style="width:80px"
                  @blur="confirmEdit(row)"
                />
                <el-input-number
                  v-model="row.amount"
                  :min="1"
                  :max="100"
                  label
                  size="mini"
                  @change="handleChange(row)"
                />
                <!-- <el-button v-if="row.service_id" size="mini" type="info" plain @click="info(row)">详情</el-button>
                <el-button v-else size="mini" type="info" plain @click="getinfo(row)">详情</el-button>-->
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="vcnote" align="center" label="备注" width="200">
            <template slot-scope="{row}">
              <el-input v-model="row.vcnote" class="edit-input" size="mini" style="width:130px" />
            </template>
          </el-table-column>
        </el-table>
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">已选项目</div>
        </div>
      </el-tab-pane>
      <el-table :show-header="false" show-summary :data="sell">
        <el-table-column type="index" width="50" />
        <el-table-column prop="service_name" width="200" />
        <el-table-column prop="sell_price" width="100" />
        <el-table-column prop="amount" width="100" />
        <el-table-column prop="totalprice" />
      </el-table>
    </el-tabs>
  </div>
</template>
<script>
import { listlink } from '@/api/link'
import { vuexData, page } from '@/utils/mixin'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      dataForm: {
        buyer_name: '',
        id: '',
        lid: '',
        phone: '',
        service_time: ''
      },
      link: [],
      service: [],
      sell: [],
      list: null,
      clear: 0,
      row: null,
      num: 1,
      tab: [],
      index: 0,
      sum_price: 0,
      active: ''
    }
  },
  watch: {
    sell: {
      handler() {
        this.changeSell()
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    async getList() {
      this.init()
      this.$nextTick(async() => {
        for (let i = 0; i < this.tab.length; i++) {
          if (this.clear == 0) {
            this.$refs.sellTable[i].clearSelection()
            this.rest()
            this.init()
          } else {
            await this.edit(i)
            await this.edit(0)
          }
        }
      })
    },
    linkData() {
      const data = {
        cid: this.cems.id
      }
      listlink(data)
        .then(res => {
          this.link = res.data
        })
        .catch(() => {
          this.link = []
        })
    },
    handleChange(v) {
      v.totalprice = v.amount * v.sell_price
      this.changeSell()
    },
    handleClick(tab, event) {
      this.index = tab.index
    },
    linkPhone(v) {
      this.link.forEach(ele => {
        if (ele.link_name == v) {
          this.dataForm.phone = ele.phone
          this.dataForm.lid = ele.id
        }
      })
      this.changeSell()
    },
    init() {
      var tab = []
      this.active = this.list[0].title || ''
      this.list.map(v => {
        v.services.map(k => {
          this.$set(k, 'amount', 1)
          this.$set(k, 'totalprice', k.sell_price)
        })

        tab.push({
          label: v.title,
          list: v.services,
          sells: []
        })
      })
      this.tab = tab
    },
    edit(i) {
      this.index = i
      this.$nextTick(() => {
        this.$refs.sellTable[i].clearSelection()
        this.service.forEach((v, k) => {
          var server = []
          server = v.services
          server.forEach(n => {
            this.$refs.sellTable[i].data.forEach(t => {
              // eslint-disable-next-line no-unused-vars
              for (var key in t) {
                if (t.id == n.sid) {
                  t.sell_price = n.sell_price
                  t.totalprice = n.totalprice
                  t.amount = n.amount
                  t.vcnote = n.vcnote
                }
              }
            })
            this.$refs.sellTable[i].toggleRowSelection(
              this.$refs.sellTable[i].data.find(item => item.id === n.sid),
              true
            )
          })
        })
      })
    },
    showService(v) {
      this.clear = v.type
      this.list = v.server
      this.getList()
      this.linkData()
    },
    editService(v) {
      this.rest()
      this.dataForm = {
        buyer_name: v.buyer_name,
        phone: v.phone,
        id: v.id,
        lid: v.lid,
        service_time: v.service_time
      }

      this.service = v.services
      this.getList()
    },
    rest() {
      this.dataForm = {
        buyer_name: '',
        phone: '',
        id: '',
        lid: '',
        service_time: ''
      }
    },
    confirmEdit(row) {
      this.changeSell()
      this.handleChange(row)
      this.$refs.sellTable[this.index].toggleRowSelection(row, true)
    },
    changeSell() {
      let sum_price = 0
      if (this.sell) {
        this.sell.forEach((v, k) => {
          sum_price = sum_price + parseInt(v.totalprice)
        })
      }
      this.sum_price = sum_price
      const data = {
        id: this.dataForm.id,
        sum_price: this.sum_price,
        buyer_name: this.dataForm.buyer_name,
        phone: this.dataForm.phone,
        lid: this.dataForm.lid,
        service_time: this.dataForm.service_time,
        server: this.sell
      }
      this.$emit('service_data', data)
    },
    handleSelectionChange(val) {
      this.tab[this.index].sells = val.filter(item => item != undefined)
      var sell = []
      this.tab.forEach((v, k) => {
        sell.push(this.tab[k].sells)
      })
      sell = [].concat.apply([], sell)
      this.sell = sell
    }
  }
}
</script>
<style>
</style>
