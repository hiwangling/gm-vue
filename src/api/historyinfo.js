import request from '@/utils/request'

// 退换迁历史记录
export function historyinfo(data) {
  return request({
    url: '/historyinfo/get_historyinfo',
    method: 'post',
    data
  })
}

// 退迁
export function move_cemetery(data) {
  return request({
    // url: '/cemetery/move_cemetery_qian',
    url: '/order/move_cemetery_qian',
    method: 'post',
    data
  })
}

// 换墓
export function change_cemetery(data) {
  return request({
    // url: '/cemetery/change_cemetery',
    url: '/order/change_cemetery',
    method: 'post',
    data
  })
}

// 退墓
export function move_cemetery_return(data) {
  return request({
    // url: '/cemetery/move_cemetery',
    url: '/order/move_cemetery',
    method: 'post',
    data
  })
}
export function emigrationList(query) {
  return request({
    url: '/order/emigrationList',
    method: 'get',
    params: query
  })
}

