import request from '@/utils/request'

export function lamplist(query) {
  return request({
    // url: '/cemetery/lightup_list_byid',
    url: '/order/lightup_list_byid',
    method: 'get',
    params: query
  })
}

export function lampadd(data) {
  return request({
    // url: '/cemetery/lightup_add',
    url: '/order/lightup_add',
    method: 'post',
    data
  })
}

export function lampdelete(query) {
  return request({
    // url: '/cemetery/buy_cemetery_del',
    url: '/order/buy_cemetery_del',
    method: 'get',
    params: query
  })
}

export function lampedit(data) {
  return request({
    // url: '/cemetery/lightup_edit',
    url: '/order/lightup_edit',
    method: 'post',
    data
  })
}

export function lamppay(data) {
  return request({
    // url: '/cemetery/lightup_pay',
    url: '/order/lightup_pay',
    method: 'post',
    data
  })
}

