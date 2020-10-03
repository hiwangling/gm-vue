import request from '@/utils/request'

export function listSave(query) {
  return request({
    url: '/save/list',
    method: 'get',
    params: query
  })
}

export function createSave(data) {
  return request({
    url: '/save/add',
    method: 'post',
    data
  })
}

export function updateSave(data) {
  return request({
    url: '/save/edit',
    method: 'post',
    data
  })
}

export function deleteSave(query) {
  return request({
    url: '/save/del',
    method: 'get',
    params: query
  })
}

export function PaySave(data) {
  return request({
    url: '/save/renewAdd',
    method: 'post',
    data
  })
}

export function delay(data) {
  return request({
    url: '/save/out',
    method: 'post',
    data
  })
}

export function lockerlist(query) {
  return request({
    url: '/locker/list',
    method: 'get',
    params: query
  })
}

export function lockerdel(query) {
  return request({
    url: '/locker/del',
    method: 'get',
    params: query
  })
}

export function lockeradd(data) {
  return request({
    url: '/locker/add',
    method: 'post',
    data
  })
}

export function lockeredit(data) {
  return request({
    url: '/locker/edit',
    method: 'post',
    data
  })
}

export function getsavelog(query) {
  return request({
    url: '/save/info',
    method: 'get',
    params: query
  })
}
export function delsavelog(query) {
  return request({
    url: '/order/buy_cemetery_del',
    method: 'get',
    params: query
  })
}

