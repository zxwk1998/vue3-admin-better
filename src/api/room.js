import request from "@/utils/request";

export function getRoomList(data) {
  return request({
    url: "/room/list",
    method: "post",
    data,
  });
}

export function getRoomDetail(data) {
  return request({
    url: "/room/detail",
    method: "post",
    data,
  });
}

export function addRoom(data) {
  return request({
    url: "/room/add",
    method: "post",
    data,
  });
}

export function updateRoom(data) {
  return request({
    url: "/room/update",
    method: "post",
    data,
  });
}

export function deleteRoom(data) {
  return request({
    url: "/room/delete",
    method: "post",
    data,
  });
}

export function getRoomTypes() {
  return request({
    url: "/room/types",
    method: "post",
  });
}

export function getRoomStatusList() {
  return request({
    url: "/room/statusList",
    method: "post",
  });
}
