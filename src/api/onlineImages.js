import request from '@/utils/request'

//手机基础设置
//图片管理
export function listOnlineImages(data) {
  return request({
    url: '/onlineImages/list',
    method: 'post',
    data
  })
}

export function createOnlineImages(data) {
  return request({
    url: '/onlineImages/add',
    method: 'post',
    data
  })
}

export function updateOnlineImages(data) {
  return request({
    url: '/onlineImages/edit',
    method: 'post',
    data
  })
}

export function deleteOnlineImages(query) {
  return request({
    url: 'onlineImages/del',
    method: 'get',
    params: query
  })
}

