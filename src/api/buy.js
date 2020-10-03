import request from '@/utils/request'

export function listbuy(query) {
  return request({
    // url: '/cemetery/get_buy_cemetery',
    url: '/order/get_buy_cemetery',
    method: 'get',
    params: query
  })
}

export function addbuy(data) {
  return request({
    // url: '/cemetery/buy_cemetery',
    url: '/order/dispose',
    method: 'post',
    data
  })
}

export function editbuy(data) {
  return request({
    // url: '/cemetery/buy_cemetery_edit',
    url: '/order/buy_cemetery_edit',
    method: 'post',
    data
  })
}

export function deletebuy(query) {
  return request({
    // url: '/cemetery/buy_cemetery_del',
    url: '/order/buy_cemetery_del',
    method: 'get',
    params: query
  })
}
export function get_order_status(query) {
  return request({
    // url: '/cemetery/get_order_status',
    url: '/order/get_order_status',
    method: 'get',
    params: query
  })
}
export function pay(data) {
  return request({
    // url: '/cemetery/pay',
    url: '/order/pay',
    method: 'post',
    data
  })
}

