import request from '@/utils/request'

export function goodslist(data) {
  return request({
    url: '/onlineServices/list',
    method: 'post',
    data
  })
}

export function goodsadd(data) {
  return request({
    url: '/onlineServices/add',
    method: 'post',
    data
  })
}

export function goodsedit(data) {
  return request({
    url: '/onlineServices/edit',
    method: 'post',
    data
  })
}
export function goodsdel(query) {
  return request({
    url: '/onlineServices/del',
    method: 'get',
    params: query
  })
}

export function typelist(data) {
  return request({
    url: '/onlineShoptype/list',
    method: 'post',
    data
  })
}

export function typeadd(data) {
  return request({
    url: '/onlineShoptype/add',
    method: 'post',
    data
  })
}

export function typeedit(data) {
  return request({
    url: '/onlineShoptype/edit',
    method: 'post',
    data
  })
}
export function typedel(query) {
  return request({
    url: '/onlineShoptype/del',
    method: 'get',
    params: query
  })
}

export function orderlist(query) {
  return request({
    url: '/onlineOrder/list',
    method: 'get',
    params: query
  })
}

export function orderinfo(query) {
  return request({
    url: '/onlineOrder/info',
    method: 'get',
    params: query
  })
}
export function orderedit(data) {
  return request({
    url: '/onlineFeedback/edit',
    method: 'post',
    data
  })
}
export function backinfo(query) {
  return request({
    url: '/onlineFeedback/info',
    method: 'get',
    params: query
  })
}
export function orderstate(data) {
  return request({
    url: '/onlineOrder/state',
    method: 'post',
    data
  })
}
// 纪念馆
export function memoriallist(query) {
  return request({
    url: '/onlineMemorial/list',
    method: 'get',
    params: query
  })
}
export function memorialdel(query) {
  return request({
    url: '/onlineMemorial/memorial_del',
    method: 'get',
    params: query
  })
}

export function memorialinfo(query) {
  return request({
    url: '/onlineMemorial/info',
    method: 'get',
    params: query
  })
}
export function memorialstate(data) {
  return request({
    url: '/onlineMemorial/state',
    method: 'post',
    data
  })
}
export function commentslist(query) {
  return request({
    url: '/onlineLeaveword/leaveword_list',
    method: 'get',
    params: query
  })
}
export function commentsdel(query) {
  return request({
    url: '/onlineLeaveword/leaveword_del',
    method: 'get',
    params: query
  })
}
export function memberlist(query) {
  return request({
    url: '/onlineMember/list',
    method: 'get',
    params: query
  })
}
export function memberdel(query) {
  return request({
    url: '/onlineMember/del',
    method: 'get',
    params: query
  })
}

export function imageslist(data) {
  return request({
    url: '/onlineImages/list',
    method: 'post',
    data
  })
}
export function imagesedit(data) {
  return request({
    url: '/onlineImages/edit',
    method: 'post',
    data
  })
}
export function imagesadd(data) {
  return request({
    url: '/onlineImages/add',
    method: 'post',
    data
  })
}
export function imagesdel(query) {
  return request({
    url: '/onlineImages/del',
    method: 'get',
    params: query
  })
}
