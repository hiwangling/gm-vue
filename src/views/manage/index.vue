<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        size="small"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入逝者姓名或墓号"
        @keyup.enter.native="handleFilters"
      />
      <el-button
        size="small"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilters"
      >查找</el-button>
      <el-radio-group v-model="isCollapse" size="small" class="filter-item" style="float:right">
        <el-radio-button :label="false">业务</el-radio-button>
        <el-radio-button :label="true">墓位</el-radio-button>
      </el-radio-group>
    </div>

    <el-container>
      <el-main>
        <div v-loading="listLoading" class="menu">
          <el-menu class="el-menu-vertical-demo" :default-active="String(listQuery.q_id)">
            <el-submenu v-for="(item,index) in area" :key="index" :index="String(index)">
              <template slot="title">
                <i class="el-icon-more-outline" />
                <span>{{ item.type_name }}</span>
              </template>
              <el-menu-item-group v-for="(val,idx) in item.children" :key="idx">
                <el-menu-item
                  :index="String(val.id)"
                  @click="handleFilter(val.id)"
                >{{ val.type_name }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
        <el-row>
          <el-col :span="24">
            <div style="display:block" :style="!isCollapse ? '':'padding-left: 38px;'">
              <el-tag
                v-for="(value,item,idx) in num"
                v-show="item != 7"
                :key="idx"
                size="small"
                :class="item | getNum"
                style="margin-left:5px"
                @click="handleFilterTag(item)"
              >{{ item | getNumtxt }}({{ value }})</el-tag>
            </div>
            <template v-if="!isCollapse">
              <div v-loading="listLoading" style="display:inline-block">
                <el-row type="flex" style="flex-wrap:wrap">
                  <el-col
                    v-for="(item,value) in list"
                    :key="value"
                    style="width:137px"
                    :class="item.usestatus | getlist"
                  >
                    <div style="height:100%;" @click="createCemetery(item)">
                      <div style="height:100px">
                        <p style="font-size: 14px;">{{ item.classifyname }}{{ item.cname }}</p>
                        <p>{{ item.bury_name }}</p>
                      </div>
                      <p>
                        <svg-icon icon-class="one" class-name="customs-class" />
                        <svg-icon
                          v-if="item.type_id == 2"
                          class-name="customs-class"
                          icon-class="one"
                        />
                      </p>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList"
              />
            </template>
            <template v-else>
              <div v-for="(item,index) in tralist" :key="index" class="tralist">
                <span>{{ item.title }}</span>
                <div class="tralist-li">
                  <div
                    v-for="(val,idx) in item.cemetery"
                    :key="idx"
                    :style="val.id == 0 ? 'visibility:hidden' : ''"
                    :class="val.usestatus | getlist"
                  >{{ val.iy }}</div>
                </div>
              </div>
            </template>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog
      id="cemetery"
      :close-on-click-modal="false"
      :title="dialogStatus"
      :visible.sync="dialogFormVisible"
      top="5vh"
      @open="activeName = 'sell'"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tab" :key="index" :label="item.label" :name="item.name">
          <component :is="item.name" @v="v" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { classifyList, tralist } from '@/api/area'
import { listGrave } from '@/api/grave'
import { get_num, get_name } from '@/api/cemetery'
import { page, vuexData } from '@/utils/mixin'
import Pagination from '@/components/Pagination'
import Service from './service/service'
import Sell from './sell/sell'
import Reserve from './reserve/reserve'
// import monument from './monumen/monumen'
import lamp from './lamp/lamp'
import repair from './repair/repair'
import swap from './swap/swap'
import move from './move/move'
import profile from './profile/profile'
import returns from './returns/returns'
export default {
  name: 'VueList',
  components: { Pagination, Service, Sell, Reserve, lamp, repair, swap, move, returns, profile },
  mixins: [page, vuexData],
  data() {
    return {
      isCollapse: false,
      tralist: null,
      list: null,
      area: null,
      num: null,
      total: 0,
      url: process.env.VUE_APP_BASE,
      activeName: 'sell',
      sreach: null,
      tab: [
        { label: '预定', name: 'reserve' },
        { label: '购墓', name: 'sell' },
        { label: '服务', name: 'service' },
        // { label: '碑文', name: 'monument' },
        { label: '换墓', name: 'swap' },
        { label: '退墓', name: 'returns' },
        { label: '迁出', name: 'move' },
        { label: '档案', name: 'profile' }
        // { label: '点灯', name: 'lamp' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      listLoading: true,
      gardens: null,
      flag: false,
      listQuery: {
        page: 1,
        limit: 24,
        q_id: 3,
        keyword: '',
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
    this.gettralist()
  },
  methods: {
    getList() {
      this.listLoading = true
      listGrave(this.listQuery).then(res => {
        this.list = res.data.data
        this.total = res.data.total || 0
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
      get_num(this.listQuery).then(res => {
        this.num = res.data
      })
      classifyList().then(res => {
        this.area = res.data
      })
    },
    handleFilter(v) {
      this.listQuery.q_id = v
      this.listQuery.page = 1
      this.getList()
      this.gettralist()
    },
    handleFilterTag(item) {
      this.listQuery.usestatus = item
      this.getList()
    },
    gettralist() {
      tralist(this.listQuery).then(res => {
        this.tralist = res.data
        this.tralist.forEach(v => {
          for (let i = 0; i < v.cemetery.length; i++) {
            const item = v.cemetery[i]
            if (i + 1 != item.iy) {
              v.cemetery.splice(i, 0, { id: 0 })
            }
          }
        })
      })
    },
    handleFilters() {
      this.listQuery.page = 1
      this.getList()
    },
    createCemetery(item) {
      this.addCemetery(item)
      const data = { cid: item.id }
      get_name(data)
        .then(res => {
          this.dialogStatus = res.data.name
          this.addCname(res.data)
        })
      if (item.usestatus == 6 || item.usestatus == 5) {
        this.dialogFormVisible = false
      } else {
        this.dialogFormVisible = true
      }
    },
    handleClick(tab) {
      this.changeOrders(tab.index)
    },
    v() {
      this.getList()
      this.createCemetery(this.cems)
    }

  }
}
</script>
 <style  scoped>
.tralist {
  margin-top: 5px;
  display: flex;
}
.tralist span {
  color: #6f4444;
  line-height: 50px;
  font-weight: 800;
  width: 40px;
  text-align: center;
}
.tralist-li {
  display: flex;
  margin-bottom: 3px;
}
.tralist-li div {
  width: 50px;
  height: 50px;
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
  border-radius: 3px;
  line-height: 50px;
  color: #fff;
  margin-left: 3px !important;
  background: #00aa9f;
}
</style>
