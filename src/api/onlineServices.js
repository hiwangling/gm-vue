import request from '@/utils/request'

//手机基础设置
//服务管理
export function listOnlineServices(data) {
  return request({
    url: '/onlineServices/list',
    method: 'post',
    data
  })
}

export function createOnlineServices(data) {
  return request({
    url: '/onlineServices/add',
    method: 'post',
    data
  })
}

export function updateOnlineServices(data) {
  return request({
    url: '/onlineServices/edit',
    method: 'post',
    data
  })
}

export function deleteOnlineServices(query) {
  return request({
    url: 'onlineServices/del',
    method: 'get',
    params: query
  })
}

