import request from '@/utils/request'

//手机基础设置
//服务管理
export function listOnlineOrder(query) {
  return request({
    url: '/onlineOrder/list',
    method: 'get',
    params: query
  })
}

export function feedBackInfo(query) {
  return request({
    url: '/onlineFeedback/info',
    method: 'get',
    params: query
  })
}

export function createFeedBack(data) {
  return request({
    url: '/onlineFeedback/edit',
    method: 'post',
    data
  })
}

export function updateFeedBack(data) {
  return request({
    url: '/onlineOrder/state',
    method: 'post',
    data
  })
}

export function onlineOrderDetail(query) {
  return request({
    url: '/onlineOrder/info',
    method: 'get',
    params: query
  })
}
