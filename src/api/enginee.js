import request from '@/utils/request'

export function engineering_order_list(query) {
  return request({
    url: '/engineering/engineering_order_list',
    method: 'get',
    params: query
  })
}

export function engineering_add(data) {
  return request({
    url: '/engineering/engineering_add',
    method: 'post',
    data
  })
}

export function engineering_del_pic(query) {
  return request({
    url: '/engineering/engineering_del_pic',
    method: 'get',
    params: query
  })
}

export function engineering_edit(data) {
  return request({
    url: '/engineering/engineering_edit',
    method: 'post',
    data
  })
}

export function engineering_del(data) {
  return request({
    url: '/engineering/engineering_del',
    method: 'post',
    data
  })
}
export function get_engineering_info_by_id(query) {
  return request({
    url: '/engineering/get_engineering_info_by_id',
    method: 'get',
    params: query
  })
}

