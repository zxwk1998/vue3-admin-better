const { mock } = require('mockjs')

const orderList = []
const count = 100

const statusMap = {
  '待确认': { color: '#ff9800', value: 0 },
  '已确认': { color: '#4caf50', value: 1 },
  '已入住': { color: '#2196f3', value: 2 },
  '已退房': { color: '#9e9e9e', value: 3 },
  '已完成': { color: '#607d8b', value: 4 },
  '已取消': { color: '#f44336', value: 5 },
}

for (let i = 0; i < count; i++) {
  const checkInDate = new Date()
  checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) - 15)
  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 5) + 1)

  const roomTypes = ['大床房', '双床房', '家庭套房', '豪华套房', '主题房']
  const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]
  const basePrice = roomType === '豪华套房' ? 1288 : roomType === '主题房' ? 888 : roomType === '家庭套房' ? 688 : roomType === '双床房' ? 428 : 388
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
  const totalPrice = basePrice * nights

  orderList.push(
    mock({
      id: i + 1,
      orderNo: `HS${String(Date.now()).slice(-8)}${String(i).padStart(4, '0')}`,
      roomType: roomType,
      roomNumber: `${Math.floor(Math.random() * 6) + 1}${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
      customerName: '@cname',
      customerPhone: /^1[3-9]\d{9}$/,
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0],
      nights: nights,
      adults: Math.floor(Math.random() * 3) + 1,
      children: Math.floor(Math.random() * 3),
      basePrice: basePrice,
      totalPrice: totalPrice,
      'status|1': Object.keys(statusMap),
      'payMethod|1': ['微信支付', '支付宝', '银行卡', '现金'],
      'source|1': ['线上预订', '到店预订', '电话预订', '第三方平台'],
      'remark': function() {
        const remarks = ['无', '需要安静的房间', '高楼层优先', '靠近电梯', '无烟房', '需要加床']
        return remarks[Math.floor(Math.random() * remarks.length)]
      },
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      confirmTime: function() {
        return this.status === '待确认' ? null : mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      },
      checkInTime: function() {
        return ['已入住', '已退房', '已完成'].includes(this.status)
          ? `${this.checkInDate} ${Math.floor(Math.random() * 6) + 14}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
          : null
      },
      checkOutTime: function() {
        return ['已退房', '已完成'].includes(this.status)
          ? `${this.checkOutDate} ${Math.floor(Math.random() * 3) + 10}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
          : null
      },
    })
  )
}

module.exports = [
  {
    url: '/order/list',
    type: 'post',
    response(config) {
      const {
        pageNo = 1,
        pageSize = 10,
        orderNo = '',
        customerName = '',
        status = '',
        source = '',
        checkInDate = '',
        checkOutDate = ''
      } = config.body || {}

      let mockList = orderList.filter((item) => {
        let match = true
        if (orderNo && item.orderNo.indexOf(orderNo) < 0) match = false
        if (customerName && item.customerName.indexOf(customerName) < 0) match = false
        if (status && item.status !== status) match = false
        if (source && item.source !== source) match = false
        if (checkInDate && item.checkInDate < checkInDate) match = false
        if (checkOutDate && item.checkOutDate > checkOutDate) match = false
        return match
      })

      mockList.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

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
    url: '/order/detail',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const order = orderList.find(item => item.id === id)
      if (!order) {
        return {
          code: 404,
          msg: '订单不存在',
          data: null,
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: order,
      }
    },
  },
  {
    url: '/order/add',
    type: 'post',
    response(config) {
      const data = config.body || {}
      const newOrder = {
        id: orderList.length + 1,
        orderNo: `HS${String(Date.now()).slice(-8)}${String(orderList.length + 1).padStart(4, '0')}`,
        ...data,
        status: '待确认',
        createTime: mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
      }
      orderList.unshift(newOrder)
      return {
        code: 200,
        msg: '添加成功',
        data: newOrder,
      }
    },
  },
  {
    url: '/order/update',
    type: 'post',
    response(config) {
      const { id, ...data } = config.body || {}
      const index = orderList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '订单不存在',
        }
      }
      orderList[index] = { ...orderList[index], ...data }
      return {
        code: 200,
        msg: '更新成功',
        data: orderList[index],
      }
    },
  },
  {
    url: '/order/confirm',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = orderList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '订单不存在',
        }
      }
      orderList[index].status = '已确认'
      orderList[index].confirmTime = mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      return {
        code: 200,
        msg: '确认成功',
        data: orderList[index],
      }
    },
  },
  {
    url: '/order/checkIn',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = orderList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '订单不存在',
        }
      }
      orderList[index].status = '已入住'
      orderList[index].checkInTime = mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      return {
        code: 200,
        msg: '入住成功',
        data: orderList[index],
      }
    },
  },
  {
    url: '/order/checkOut',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = orderList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '订单不存在',
        }
      }
      orderList[index].status = '已退房'
      orderList[index].checkOutTime = mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      return {
        code: 200,
        msg: '退房成功',
        data: orderList[index],
      }
    },
  },
  {
    url: '/order/cancel',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = orderList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '订单不存在',
        }
      }
      orderList[index].status = '已取消'
      return {
        code: 200,
        msg: '取消成功',
        data: orderList[index],
      }
    },
  },
  {
    url: '/order/delete',
    type: 'post',
    response(config) {
      const { id } = config.body || {}
      const index = orderList.findIndex(item => item.id === id)
      if (index === -1) {
        return {
          code: 404,
          msg: '订单不存在',
        }
      }
      orderList.splice(index, 1)
      return {
        code: 200,
        msg: '删除成功',
      }
    },
  },
  {
    url: '/order/statusList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: Object.keys(statusMap).map(key => ({
          value: key,
          label: key,
          color: statusMap[key].color,
        })),
      }
    },
  },
  {
    url: '/order/sourceList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: [
          { value: '线上预订', label: '线上预订' },
          { value: '到店预订', label: '到店预订' },
          { value: '电话预订', label: '电话预订' },
          { value: '第三方平台', label: '第三方平台' },
        ],
      }
    },
  },
  {
    url: '/order/statistics',
    type: 'post',
    response() {
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = orderList.filter(o => o.checkInDate === today || o.checkOutDate === today)
      const todayCheckIn = orderList.filter(o => o.checkInDate === today).length
      const todayCheckOut = orderList.filter(o => o.checkOutDate === today).length
      const occupied = orderList.filter(o => o.status === '已入住').length
      const confirmed = orderList.filter(o => o.status === '已确认').length

      const totalRevenue = orderList
        .filter(o => ['已入住', '已退房', '已完成'].includes(o.status))
        .reduce((sum, o) => sum + o.totalPrice, 0)

      return {
        code: 200,
        msg: 'success',
        data: {
          todayOrders: todayOrders.length,
          todayCheckIn,
          todayCheckOut,
          occupied,
          confirmed,
          totalRevenue,
        },
      }
    },
  },
]
