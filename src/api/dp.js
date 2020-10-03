import request from '@/utils/request'

export function getWeather(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/getWeather',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/getWeather',
    method: 'get',
    params: query
  })
}

export function getlyfj(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/lyfj',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/lyfj',
    method: 'get',
    params: query
  })
}

export function getmxzs(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/mxzs',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/mxzs',
    method: 'get',
    params: query
  })
}

export function searchname(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/searchcemeterybyname',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/searchcemeterybyname',
    method: 'get',
    params: query
  })
}

export function a_list(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/a_list',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/a_list',
    method: 'get',
    params: query
  })
}

export function q_list(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/list',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/list',
    method: 'get',
    params: query
  })
}

export function get_num(query) {
  return request({
    // url: 'http://gm.lxygm.com/dp/index/tong_ji_xiao_by_qu',
    url: 'http://kykjgm.lxygm.com/dp/v1/index/tong_ji_xiao_by_qu',
    method: 'get',
    params: query
  })
}

