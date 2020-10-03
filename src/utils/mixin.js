import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  get_name
} from '@/api/cemetery'

var that
export const vuexData = {
  filters: {
    group_list(v) {
      var obj = {}
      that.config_group_list.forEach((item, index) => {
        obj[index + 1] = item
      })
      return obj[v]
    },
    recetype_list(v) {
      var obj = {}
      that.recetypes.forEach((item, index) => {
        obj[index + 1] = item
      })
      return obj[v]
    },
    obituary_list(v) {
      var obj = {}
      that.obituarystate.forEach((item, index) => {
        obj[index + 1] = item
      })
      return obj[v]
    },
    service_stype(v) {
      var obj = {}
      that.servicestype.forEach((item, index) => {
        obj[index + 1] = item
      })
      return obj[v]
    },
    cremationstate_stype(v) {
      var obj = {}
      that.cremationstate.forEach((item, index) => {
        obj[index + 1] = item
      })
      return obj[v]
    },
    type_list(v) {
      var obj = Object.assign({}, that.config_type_list)
      return obj[v]
    },
    carFilter(v) {
      const statusMap = {
        1: 'primary',
        2: 'success',
        3: 'danger',
        4: 'info',
        5: 'warning'
      }
      return statusMap[v]
    },
    carState(v) {
      const statusMap = {
        1: '签收',
        2: '出车',
        3: '出车',
        4: '回馆'
      }
      return statusMap[v]
    }
  },
  data() {
    return {
      online_images_type: 123,
      online_services_category: '',
      cemetery_usestatus: '',
      service_classify: '',
      unit: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  computed: {
    ...mapGetters([
      'cems',
      'order',
      'payStatus',

      'user',
      'cname',
      'config',
      'garden_id'
    ])
  },
  beforeCreate: function() {
    that = this
  },
  created() {
    this.online_images_type = this.filter(this.config.online_images_type)
    this.online_services_category = this.filter(this.config.online_services_category)
    this.unit = this.filter(this.config.unit)
    this.cemetery_usestatus = this.filter(this.config.cemetery_usestatus)
    this.service_info_service_type = this.filter(this.config.service_info_service_type)
    this.service_classify = this.filter(this.config.service_classify)
    this.locker_classly = this.filter(this.config.locker_classly)

    // this.service_info_service_type = this.filter(this.config.service_info_service_type)
  },
  methods: {
    ...mapActions({
      addCemetery: 'cemetery/addCemetery',
      changeOrders: 'cemetery/changeOrders',
      pay: 'cemetery/pay',
      addCname: 'cemetery/addCname'

    }),
    filter(str) {
      return (((str.replace(/\s*/g, '')).replace(/\d+/g, '')).substring(1)).split(':')
    }
  }
}

export const page = {
  data() {
    return {

      currentStatus: ''

    }
  },
  methods: {

    getStatus() {
      const data = {
        cid: this.cems.id
      }
      get_name(data)
        .then(res => {
          this.currentStatus = Number(res.data.usestatus)
        })
    }
  }
}
