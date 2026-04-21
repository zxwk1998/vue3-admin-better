const { mock } = require('mockjs')

const roomTypeList = [
  {
    id: 1,
    name: '大床房',
    basePrice: 388,
    weekendPrice: 468,
    holidayPrice: 568,
    area: 25,
    beds: 1,
    bedType: '1.8米大床',
    maxGuests: 2,
    facilities: ['WiFi', '空调', '电视', '独立卫浴', '吹风机'],
    description: '温馨舒适的大床房，配备1.8米大床，适合情侣或单人入住。房间采光充足，设施齐全。',
    image: 'https://picsum.photos/400/300?random=101',
    images: [
      'https://picsum.photos/400/300?random=101',
      'https://picsum.photos/400/300?random=102',
      'https://picsum.photos/400/300?random=103',
    ],
    roomCount: 15,
    availableCount: 10,
    sort: 1,
    status: '启用',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    name: '双床房',
    basePrice: 428,
    weekendPrice: 508,
    holidayPrice: 608,
    area: 28,
    beds: 2,
    bedType: '1.2米双床',
    maxGuests: 2,
    facilities: ['WiFi', '空调', '电视', '独立卫浴', '吹风机', '热水壶'],
    description: '宽敞明亮的双床房，配备两张1.2米单人床，适合朋友或家人入住。',
    image: 'https://picsum.photos/400/300?random=201',
    images: [
      'https://picsum.photos/400/300?random=201',
      'https://picsum.photos/400/300?random=202',
    ],
    roomCount: 12,
    availableCount: 8,
    sort: 2,
    status: '启用',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 3,
    name: '家庭套房',
    basePrice: 688,
    weekendPrice: 788,
    holidayPrice: 988,
    area: 45,
    beds: 2,
    bedType: '1.8米大床 + 1.2米小床',
    maxGuests: 4,
    facilities: ['WiFi', '空调', '电视', '独立卫浴', '吹风机', '热水壶', '冰箱', '洗衣机'],
    description: '宽敞舒适的家庭套房，一室一厅布局，配备大床和小床，适合一家三口或四口入住。',
    image: 'https://picsum.photos/400/300?random=301',
    images: [
      'https://picsum.photos/400/300?random=301',
      'https://picsum.photos/400/300?random=302',
      'https://picsum.photos/400/300?random=303',
      'https://picsum.photos/400/300?random=304',
    ],
    roomCount: 8,
    availableCount: 5,
    sort: 3,
    status: '启用',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 4,
    name: '豪华套房',
    basePrice: 1288,
    weekendPrice: 1488,
    holidayPrice: 1888,
    area: 65,
    beds: 1,
    bedType: '2.0米特大床',
    maxGuests: 2,
    facilities: ['WiFi', '中央空调', '智能电视', '独立卫浴', '浴缸', '吹风机', '热水壶', '冰箱', '迷你吧', '保险箱'],
    description: '豪华装修的总统套房，配备特大床和独立客厅，设施齐全，享受尊贵服务体验。',
    image: 'https://picsum.photos/400/300?random=401',
    images: [
      'https://picsum.photos/400/300?random=401',
      'https://picsum.photos/400/300?random=402',
      'https://picsum.photos/400/300?random=403',
    ],
    roomCount: 3,
    availableCount: 2,
    sort: 4,
    status: '启用',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 5,
    name: '主题房',
    basePrice: 888,
    weekendPrice: 1088,
    holidayPrice: 1288,
    area: 35,
    beds: 1,
    bedType: '1.8米大床',
    maxGuests: 2,
    facilities: ['WiFi', '空调', '投影电视', '独立卫浴', '吹风机', '热水壶', '浴缸'],
    description: '独特设计的主题房间，有多种主题可选：北欧风、日式风、ins少女风等，适合情侣入住。',
    image: 'https://picsum.photos/400/300?random=501',
    images: [
      'https://picsum.photos/400/300?random=501',
      'https://picsum.photos/400/300?random=502',
    ],
    roomCount: 6,
    availableCount: 4,
    sort: 5,
    status: '启用',
    createTime: '2024-01-01 10:00:00',
  },
]

module.exports = [
  {
    url: '/roomType/list',
    type: 'post',
    response(config) {
      const {
        pageNo = 1,
        pageSize = 10,
        name = '',
        status = ''
      } = config.body || {}

      let mockList = roomTypeList.filter((item) => {
        let match = true
        if (name && item.name.indexOf(name) < 0) match = false
        if (status && item.status !== status) match = false
        return match
      })

      mockList.sort((a, b) => a.sort - b.sort)

      const start = (pageNo - 1) * pageSize
      const end = start + pageSize
      const pageList = mockList.slice(start, end)

      return {
        code: 200,
        msg: 'success',
        totalCount: mockList.length,
        data: pageList,
      }
    },
  },
  {
    url: '/roomType/all',
    type: 'post',
    response() {
      const list = roomTypeList
        .filter(item => item.status === '启用')
        .sort((a, b) => a.sort - b.sort)
        .map(item => ({
          id: item.id,
          name: item.name,
          basePrice: item.basePrice,
          weekendPrice: item.weekendPrice,
          holidayPrice: item.holidayPrice,
          area: item.area,
          beds: item.beds,
          bedType: item.bedType,
          maxGuests: item.maxGuests,
          roomCount: item.roomCount,
          availableCount: item.availableCount,
        }))

      return {
        code: 200,
        msg: 'success',
        data: list,
      }
    },
  },
  {
    url: '/roomType/detail',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const roomType = roomTypeList.find(item => item.id === id)
      if (!roomType) {
        return {
          code: 404,
          msg: '房型不存在',
          data: null,
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: roomType,
      }
    },
  },
  {
    url: '/roomType/add',
    type: 'post',
    response(config) {
      const data = config.body || {}
      const newRoomType = {
        id: roomTypeList.length + 1,
        ...data,
        roomCount: data.roomCount || 0,
        availableCount: data.roomCount || 0,
        sort: roomTypeList.length + 1,
        status: '启用',
        createTime: mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
      }
      roomTypeList.push(newRoomType)
      return {
        code: 200,
        msg: '添加成功',
        data: newRoomType,
      }
    },
  },
  {
    url: '/roomType/update',
    type: 'post',
    response(config) {
      const { id, ...data } = config.body || {}
      const index = roomTypeList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '房型不存在',
        }
      }
      roomTypeList[index] = { ...roomTypeList[index], ...data }
      return {
        code: 200,
        msg: '更新成功',
        data: roomTypeList[index],
      }
    },
  },
  {
    url: '/roomType/delete',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = roomTypeList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '房型不存在',
        }
      }
      if (roomTypeList[index].roomCount > 0) {
        return {
          code: 500,
          msg: '该房型下还有房间，请先删除房间',
        }
      }
      roomTypeList.splice(index, 1)
      return {
        code: 200,
        msg: '删除成功',
      }
    },
  },
  {
    url: '/roomType/statusList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: [
          { value: '启用', label: '启用' },
          { value: '禁用', label: '禁用' },
        ],
      }
    },
  },
]
