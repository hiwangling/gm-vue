import request from '@/utils/request'

export function listdead(query) {
  return request({
    url: '/bury/list',
    method: 'get',
    params: query
  })
}

export function adddead(data) {
  return request({
    url: '/bury/add',
    method: 'post',
    data
  })
}

export function updatedead(data) {
  return request({
    url: '/bury/edit',
    method: 'post',
    data
  })
}

export function deletedead(data) {
  return request({
    url: '/bury/del',
    method: 'post',
    data
  })
}

export function godead(data) {
  return request({
    url: '/bury/an_zhang',
    method: 'post',
    data
  })
}
export function imageslist(query) {
  return request({
    url: '/images/list',
    method: 'get',
    params: query
  })
}
export function imagesdel(query) {
  return request({
    url: '/images/del',
    method: 'get',
    params: query
  })
}
export function imagesdispose(data) {
  return request({
    url: '/images/dispose',
    method: 'post',
    data
  })
}
