import request from '@/utils/request'

export function repairlist(query) {
  return request({
    url: '/repair/get_repair_info_by_cid',
    method: 'get',
    params: query
  })
}

export function repairadd(data) {
  return request({
    url: '/repair/repair_add',
    method: 'post',
    data
  })
}

export function lampdelete(query) {
  return request({
    url: '/cemetery/buy_cemetery_del',
    method: 'get',
    params: query
  })
}

export function repairinfo(query) {
  return request({
    url: '/repair/get_repair_info_by_id',
    method: 'get',
    params: query
  })
}

export function repair_edit(data) {
  return request({
    url: '/repair/repair_edit',
    method: 'post',
    data
  })
}
export function repair_del_pic(query) {
  return request({
    url: '/repair/repair_del_pic',
    method: 'get',
    params: query
  })
}
export function repair_del(query) {
  return request({
    url: '/repair/repair_del',
    method: 'get',
    params: query
  })
}

export function repair_order_list(query) {
  return request({
    url: '/repair/repair_order_list',
    method: 'get',
    params: query
  })
}
export function repair_edit_after(data) {
  return request({
    url: '/repair/repair_edit_after',
    method: 'post',
    data
  })
}
export function repair_edit_pic(data) {
  return request({
    url: '/repair/repair_edit_pic',
    method: 'post',
    data
  })
}

