import request from '@/utils/request'

//套餐管理
export function listPackage(query) {
  return request({
    url: '/combo/list',
    method: 'get',
    params: query
  })
}

export function createPackage(data) {
  return request({
    url: '/combo/add',
    method: 'post',
    data
  })
}

export function updatePackage(data) {
  return request({
    url: '/combo/edit',
    method: 'post',
    data
  })
}

export function deletePackage(query) {
  return request({
    url: '/combo/del',
    method: 'get',
    params: query
  })
}
export function getAllService(query) {
  return request({
    url: '/service_info/get_services_all',
    method: 'get',
    params: query
  })
}

//获取编辑时选中的服务项目
export function getSelectedService(query) {
  return request({
    url: '/service_info/get_comboservices_all',
    method: 'get',
    params: query
  })
}
