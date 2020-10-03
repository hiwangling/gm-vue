import request from '@/utils/request'

export function listReserve(query) {
  return request({
    url: '/reserve/list',
    method: 'get',
    params: query
  })
}

export function createReserve(data) {
  return request({
    url: '/order/dispose',
    method: 'post',
    data
  })
}

export function updateReserve(data) {
  return request({
    url: '/order/buy_cemetery_edit',
    method: 'post',
    data
  })
}

export function deleteReserve(query) {
  return request({
    url: '/reserve/del',
    method: 'get',
    params: query
  })
}

export function AllReserve(query) {
  return request({
    url: '/reserve/all_list',
    method: 'get',
    params: query
  })
}

export function orderrefund(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

