import request from '@/utils/request'

export function listConfig(data) {
  return request({
    url: '/config/list',
    method: 'post',
    data
  })
}

export function createConfig(data) {
  return request({
    url: '/config/add',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/config/edit',
    method: 'post',
    data
  })
}

export function deleteConfig(query) {
  return request({
    url: '/config/del',
    method: 'get',
    params: query
  })
}
