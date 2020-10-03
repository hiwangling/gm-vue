import request from '@/utils/request'
// 获取全部墓园
export function get_gardens(query) {
  return request({
    url: '/cemetery_classify/get_gardens',
    method: 'get',
    params: query
  })
}
// 获取全部墓区
export function get_areas(query) {
  return request({
    url: '/cemetery_classify/get_areas',
    method: 'get',
    params: query
  })
}
// 获取全部样式
export function get_styles(query) {
  return request({
    url: '/cemetery_style/all',
    method: 'get',
    params: query
  })
}
// 获取全部类型
export function get_types(query) {
  return request({
    url: '/cemetery_type/list',
    method: 'get',
    params: query
  })
}
// 获取全部状态
export function get_status(query) {
  return request({
    url: '/cemetery/get_uses_satus',
    method: 'get',
    params: query
  })
}

export function get_name(query) {
  return request({
    // url: '/cemetery/get_cemetery_Info_name',
    url: '/cemetery/get_cemetery_Info',
    method: 'get',
    params: query
  })
}

export function get_num(query) {
  return request({
    url: '/cemetery/tong_ji_xiao_by_qu',
    method: 'get',
    params: query
  })
}

export function get_historylist(query) {
  return request({
    url: '/historyinfo/get_historylist',
    method: 'get',
    params: query
  })
}
export function get_images_byzid(query) {
  return request({
    // url: '/cemetery/get_images_byzid',
    url: '/images/get_images_byzid',
    method: 'get',
    params: query
  })
}

export function update_images(data) {
  return request({
    // url: '/cemetery/update_images',
    url: '/images/update_images',
    method: 'post',
    data
  })
}
export function cemeterybury_print(query) {
  return request({
    url: '/cemetery/cemeterybury_print',
    method: 'get',
    params: query
  })
}
export function get_historyList_bymerge(query) {
  return request({
    url: '/historyinfo/get_historyList_bymerge',
    method: 'get',
    params: query
  })
}
export function merge_cemetery_info_revoke(query) {
  return request({
    url: '/cemetery/merge_cemetery_info_revoke',
    method: 'get',
    params: query
  })
}
export function move_cemetery_qian_revoke(query) {
  return request({
    // url: '/cemetery/move_cemetery_qian_revoke',
    url: '/order/move_cemetery_qian_revoke',
    method: 'get',
    params: query
  })
}
export function get_historyList_bymove(query) {
  return request({
    url: '/historyinfo/get_historyList_bymove',
    method: 'get',
    params: query
  })
}
export function move_cemetery_revoke(query) {
  return request({
    url: '/order/move_cemetery_revoke',
    method: 'get',
    params: query
  })
}
export function cemeterytablet(data) {
  return request({
    url: '/cemetery/tablet',
    method: 'post',
    data
  })
}
export function getTablet(query) {
  return request({
    url: '/cemetery/getTablet',
    method: 'get',
    params: query
  })
}
export function cemeteryrecord(query) {
  return request({
    url: '/cemetery/record',
    method: 'get',
    params: query
  })
}
