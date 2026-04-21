const { mock } = require('mockjs')

const roomList = []
const count = 50

for (let i = 0; i < count; i++) {
  const floor = Math.floor(i / 10) + 1
  const roomNum = (i % 10) + 1

  roomList.push(
    mock({
      id: i + 1,
      roomNumber: `${floor}${String(roomNum).padStart(2, '0')}`,
      'roomType|1': ['大床房', '双床房', '家庭套房', '豪华套房', '主题房'],
      floor: floor,
      'price|300-2000': 1,
      'area|30-100': 1,
      'beds|1-3': 1,
      'maxGuests|2-6': 1,
      'status|1': ['空闲', '已入住', '维护中', '预订中'],
      'facilities': function() {
        const allFacilities = ['WiFi', '空调', '电视', '独立卫浴', '吹风机', '热水壶', '冰箱', '洗衣机', '阳台', '浴缸']
        return allFacilities.slice(0, Math.floor(Math.random() * 6) + 3)
      },
      'images|3-5': [
        'https://picsum.photos/400/300?random=' + (i + 1),
      ],
      'description': '@cparagraph(2, 4)',
      'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    })
  )
}

module.exports = [
  {
    url: '/room/list',
    type: 'post',
    response(config) {
      const {
        pageNo = 1,
        pageSize = 10,
        roomNumber = '',
        roomType = '',
        status = ''
      } = config.body || {}

      let mockList = roomList.filter((item) => {
        let match = true
        if (roomNumber && item.roomNumber.indexOf(roomNumber) < 0) match = false
        if (roomType && item.roomType !== roomType) match = false
        if (status && item.status !== status) match = false
        return match
      })

      const pageList = mockList.filter(
        (item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
      )

      return {
        code: 200,
        msg: 'success',
        totalCount: mockList.length,
        data: pageList,
      }
    },
  },
  {
    url: '/room/detail',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const room = roomList.find(item => item.id === id)
      if (!room) {
        return {
          code: 404,
          msg: '房源不存在',
          data: null,
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: room,
      }
    },
  },
  {
    url: '/room/add',
    type: 'post',
    response(config) {
      const data = config.body || {}
      const newRoom = {
        id: roomList.length + 1,
        ...data,
        createTime: mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
      }
      roomList.push(newRoom)
      return {
        code: 200,
        msg: '添加成功',
        data: newRoom,
      }
    },
  },
  {
    url: '/room/update',
    type: 'post',
    response(config) {
      const { id, ...data } = config.body || {}
      const index = roomList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '房源不存在',
        }
      }
      roomList[index] = { ...roomList[index], ...data }
      return {
        code: 200,
        msg: '更新成功',
        data: roomList[index],
      }
    },
  },
  {
    url: '/room/delete',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = roomList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '房源不存在',
        }
      }
      roomList.splice(index, 1)
      return {
        code: 200,
        msg: '删除成功',
      }
    },
  },
  {
    url: '/room/types',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: [
          { id: 1, name: '大床房', basePrice: 388, description: '温馨舒适的大床房' },
          { id: 2, name: '双床房', basePrice: 428, description: '宽敞明亮的双床房' },
          { id: 3, name: '家庭套房', basePrice: 688, description: '适合家庭出行的套房' },
          { id: 4, name: '豪华套房', basePrice: 1288, description: '豪华装修的总统套房' },
          { id: 5, name: '主题房', basePrice: 888, description: '独特设计的主题房间' },
        ],
      }
    },
  },
  {
    url: '/room/statusList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: [
          { value: '空闲', label: '空闲' },
          { value: '已入住', label: '已入住' },
          { value: '维护中', label: '维护中' },
          { value: '预订中', label: '预订中' },
        ],
      }
    },
  },
]
