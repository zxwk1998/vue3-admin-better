import request from "@/utils/request";

export function getOrderList(data) {
  return request({
    url: "/order/list",
    method: "post",
    data,
  });
}

export function getOrderDetail(data) {
  return request({
    url: "/order/detail",
    method: "post",
    data,
  });
}

export function addOrder(data) {
  return request({
    url: "/order/add",
    method: "post",
    data,
  });
}

export function updateOrder(data) {
  return request({
    url: "/order/update",
    method: "post",
    data,
  });
}

export function confirmOrder(data) {
  return request({
    url: "/order/confirm",
    method: "post",
    data,
  });
}

export function checkInOrder(data) {
  return request({
    url: "/order/checkIn",
    method: "post",
    data,
  });
}

export function checkOutOrder(data) {
  return request({
    url: "/order/checkOut",
    method: "post",
    data,
  });
}

export function cancelOrder(data) {
  return request({
    url: "/order/cancel",
    method: "post",
    data,
  });
}

export function deleteOrder(data) {
  return request({
    url: "/order/delete",
    method: "post",
    data,
  });
}

export function getOrderStatusList() {
  return request({
    url: "/order/statusList",
    method: "post",
  });
}

export function getOrderSourceList() {
  return request({
    url: "/order/sourceList",
    method: "post",
  });
}

export function getOrderStatistics() {
  return request({
    url: "/order/statistics",
    method: "post",
  });
}
