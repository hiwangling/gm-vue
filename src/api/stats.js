import request from '@/utils/request'

export function AllCount(query) {
  return request({
    url: '/cemetery/tong_ji_xiao_by_qu',
    method: 'get',
    params: query
  })
}
export function az_bury_list(query) {
  return request({
    url: '/stat/buryList',
    method: 'get',
    params: query
  })
}
export function export_bury_stat(query) {
  return request({
    url: '/stat/export_bury_stat',
    method: 'get',
    params: query
  })
}
export function buy_lightup_list(query) {
  return request({
    url: '/stat/buy_lightup_list',
    method: 'get',
    params: query
  })
}
export function export_lightup_stat(query) {
  return request({
    url: '/stat/export_lightup_stat',
    method: 'get',
    params: query
  })
}
export function get_olddata(data) {
  return request({
    url: '/cemetery/get_olddata',
    method: 'post',
    data
  })
}
export function buy_zsjtj_list(query) {
  return request({
    url: '/stat/buy_zsjtj_list',
    method: 'get',
    params: query
  })
}
export function update_bury_status(query) {
  return request({
    // url: '/cemetery/update_bury_status',
    url: '/bury/update_bury_status',
    method: 'get',
    params: query
  })
}
export function an_zhangtz(data) {
  return request({
    url: '/bury/an_zhangtz',
    method: 'post',
    data
  })
}
export function export_lightup_statdy(query) {
  return request({
    url: '/stat/export_lightup_statdy',
    method: 'get',
    params: query
  })
}
export function update_reserve_state(query) {
  return request({
    url: '/reserve/update_reserve_state',
    method: 'get',
    params: query
  })
}
export function export_services_stat(data) {
  return request({
    url: '/stat/export_services_stat',
    method: 'post',
    data
  })
}
export function monthCartogram(query) {
  return request({
    url: '/stat/monthCartogram',
    method: 'get',
    params: query
  })
}
export function classifyCartogram(query) {
  return request({
    url: '/stat/classifyCartogram',
    method: 'get',
    params: query
  })
}
export function statquit(data) {
  return request({
    url: '/stat/quit',
    method: 'post',
    data
  })
}
export function buyYears(query) {
  return request({
    url: '/stat/buyYears',
    method: 'get',
    params: query
  })
}
export function buyMonth(query) {
  return request({
    url: '/stat/buyMonth',
    method: 'get',
    params: query
  })
}
export function buyClassify(query) {
  return request({
    url: '/stat/buyClassify',
    method: 'get',
    params: query
  })
}
export function buyPrice(query) {
  return request({
    url: '/stat/buyPrice',
    method: 'get',
    params: query
  })
}
export function trade(data) {
  return request({
    url: '/stat/trade',
    method: 'post',
    data
  })
}
export function detailStat(data) {
  return request({
    url: '/stat/detailStat',
    method: 'post',
    data
  })
}
export function buryMonth(query) {
  return request({
    url: '/stat/buryMonth',
    method: 'get',
    params: query
  })
}
export function buryType(query) {
  return request({
    url: '/stat/buryType',
    method: 'get',
    params: query
  })
}
export function buyDays(query) {
  return request({
    url: '/stat/buyDays',
    method: 'get',
    params: query
  })
}
export function orderListPage(query) {
  return request({
    url: '/stat/orderListPage',
    method: 'get',
    params: query
  })
}
export function todayOrder(query) {
  return request({
    url: '/stat/todayOrder',
    method: 'get',
    params: query
  })
}
