import request from '@/utils/request'

export function listDept(data) {
  return request({
    url: '/dept/list',
    method: 'post',
    data
  })
}

export function createDept(data) {
  return request({
    url: '/dept/add',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/dept/edit',
    method: 'post',
    data
  })
}

export function deleteDept(query) {
  return request({
    url: '/dept/del',
    method: 'get',
    params: query
  })
}
