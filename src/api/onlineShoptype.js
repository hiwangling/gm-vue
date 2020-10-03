import request from '@/utils/request'

//手机基础设置
//服务分类
export function listOnlineShoptype(data) {
  return request({
    url: '/onlineShoptype/list',
    method: 'post',
    data
  })
}

export function createOnlineShoptype(data) {
  return request({
    url: '/onlineShoptype/add',
    method: 'post',
    data
  })
}

export function updateOnlineShoptype(data) {
  return request({
    url: '/onlineShoptype/edit',
    method: 'post',
    data
  })
}

export function deleteOnlineShoptype(query) {
  return request({
    url: 'onlineShoptype/del',
    method: 'get',
    params: query
  })
}

