import request from '@/utils/request'

export function getsevices(query) {
  return request({
    url: '/order/get_services_order_list',
    method: 'get',
    params: query
  })
}

export function get_mentstatus(query) {
  return request({
    url: '/cemetery/get_mentstatus',
    method: 'get',
    params: query
  })
}
export function buy_services_order_info(query) {
  return request({
    url: '/order/buy_services_order_info',
    method: 'get',
    params: query
  })
}

export function addservices(data) {
  return request({
    url: '/order/buy_services',
    method: 'post',
    data
  })
}

export function upload_tablet_photo(data) {
  return request({
    url: '/order/upload_tablet_photo',
    method: 'post',
    data
  })
}

export function editservices(data) {
  return request({
    url: '/order/buy_services_edit',
    method: 'post',
    data
  })
}

export function delservices(query) {
  return request({
    url: '/order/buy_cemetery_del',
    method: 'get',
    params: query
  })
}

export function orderPay(data) {
  return request({
    url: '/order/orderPay',
    method: 'post',
    data
  })
}

export function getEditService(query) {
  return request({
    // url: '/cemetery/buy_services_one_list',
    url: '/order/buy_services_one_list',
    method: 'get',
    params: query
  })
}

export function getServiceOne(query) {
  return request({
    url: '/service_info/get_services_all',
    method: 'get',
    params: query
  })
}

export function dy_services_bylb(query) {
  return request({
    // url: '/cemetery/dy_services_bylb',
    url: '/order/dy_services_bylb',
    method: 'get',
    params: query
  })
}

export function dy_services_byfw(query) {
  return request({
    // url: '/cemetery/dy_services_byfw',
    url: '/order/dy_services_byfw',
    method: 'get',
    params: query
  })
}
export function getTypeAll(query) {
  return request({
    url: '/service_info/get_services_all',
    method: 'get',
    params: query
  })
}

