import request from '@/utils/request'

export function listGrave(query) {
  return request({
    url: '/cemetery/list',
    method: 'get',
    params: query
  })
}

export function createGrave(data) {
  return request({
    url: '/cemetery/add',
    method: 'post',
    data
  })
}

export function updateGrave(data) {
  return request({
    url: '/cemetery/edit',
    method: 'post',
    data
  })
}

export function deleteGrave(query) {
  return request({
    url: '/cemetery/del',
    method: 'get',
    params: query
  })
}

export function update_usestatus(query) {
  return request({
    url: '/cemetery/update_cemetery_usestatus_qian',
    method: 'get',
    params: query
  })
}

export function merge_cemetery_info(data) {
  return request({
    url: '/cemetery/merge_cemetery_info',
    method: 'post',
    data
  })
}
