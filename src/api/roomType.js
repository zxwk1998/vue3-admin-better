import request from "@/utils/request";

export function getRoomTypeList(data) {
  return request({
    url: "/roomType/list",
    method: "post",
    data,
  });
}

export function getAllRoomTypes() {
  return request({
    url: "/roomType/all",
    method: "post",
  });
}

export function getRoomTypeDetail(data) {
  return request({
    url: "/roomType/detail",
    method: "post",
    data,
  });
}

export function addRoomType(data) {
  return request({
    url: "/roomType/add",
    method: "post",
    data,
  });
}

export function updateRoomType(data) {
  return request({
    url: "/roomType/update",
    method: "post",
    data,
  });
}

export function deleteRoomType(data) {
  return request({
    url: "/roomType/delete",
    method: "post",
    data,
  });
}

export function getRoomTypeStatusList() {
  return request({
    url: "/roomType/statusList",
    method: "post",
  });
}
