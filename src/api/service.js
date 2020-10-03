import request from '@/utils/request'

export function listService(query) {
  return request({
    url: '/service_info/list',
    method: 'get',
    params: query
  })
}

export function createService(data) {
  return request({
    url: '/service_info/add',
    method: 'post',
    data
  })
}

export function updateService(data) {
  return request({
    url: '/service_info/edit',
    method: 'post',
    data
  })
}

export function deleteService(query) {
  return request({
    url: '/service_info/del',
    method: 'get',
    params: query
  })
}

export function typeService(query) {
  return request({
    url: '/service_info/get_services',
    method: 'get',
    params: query
  })
}

export function lampplanlist(query) {
  return request({
    url: '/lampplan/list',
    method: 'get',
    params: query
  })
}
export function lampplandel(query) {
  return request({
    url: '/lampplan/del',
    method: 'get',
    params: query
  })
}
export function lampplanadd(data) {
  return request({
    url: '/lampplan/add',
    method: 'post',
    data
  })
}

export function lampplanedit(data) {
  return request({
    url: '/lampplan/edit',
    method: 'post',
    data
  })
}
export function lightup_info_list(query) {
  return request({
    url: '/service_info/lightup_info_list',
    method: 'get',
    params: query
  })
}

export function lightup_info_edit(data) {
  return request({
    url: '/service_info/lightup_info_edit',
    method: 'post',
    data
  })
}

// 获取业务大厅里面的所有服务
export function getComboservicesList(query) {
  return request({
    url: '/service_info/get_comboservices_list',
    method: 'get',
    params: query
  })
}
// 根据套餐ID获取套餐服务的详细信息
export function getServicesInfo(query) {
  return request({
    url: '/combo/servicesinfo',
    method: 'get',
    params: query
  })
}
