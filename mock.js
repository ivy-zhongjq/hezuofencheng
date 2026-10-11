// mock.js — 抖店认款系统模拟数据
// 单页应用数据中心，所有页面数据来源于此

const DB = {
  // 当前登录用户
  currentUser: {
    name: '管理员',
    status: '在线'
  },

  // 侧边栏菜单
  sidebarMenus: [
    { label: '认款管理', icon: 'receipt', children: [
      { label: '抖店认款订单', key: 'renkuan-list', active: true },
      { label: '已认款明细', key: 'yirenkuan-mingxi' },
      { label: '新零售已认款订单', key: 'xinlingshou-yirenkuan' },
    ]},
  ],

  // 顶部标签页
  topTabs: [
    { label: '抖店认款订单', key: 'renkuan-list', active: true },
  ],

  // 认款订单列表
  orders: [
    {
      totalOrderNo: '6925165121833041575',
      orderAmount: 198,
      userPaid: 187.5,
      platformSubsidy: 9,
      paymentDiscount: 1.5,
      influencerCommission: 9.9,
      influencerServiceFee: 0.99,
      platformCommission: 9.9,
      settlementAmount: 178.2,
      recognizedAmount: 187.11,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '平台补贴、支付优惠、达人佣金、平台佣金都有',
      recognizer: ''
    },
    {
      totalOrderNo: '6925180932148788326',
      orderAmount: 198,
      userPaid: 193,
      platformSubsidy: 0,
      paymentDiscount: 5,
      influencerCommission: 9.9,
      influencerServiceFee: 0.99,
      platformCommission: 9.9,
      settlementAmount: 178.2,
      recognizedAmount: 187.11,
      recognizeTime: '2026-09-01',
      ourInvoice: '部分开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '只有支付优惠、达人佣金、平台佣金',
      recognizer: ''
    },
    {
      totalOrderNo: '6925150126368325030',
      orderAmount: 198,
      userPaid: 198,
      platformSubsidy: 0,
      paymentDiscount: 0,
      influencerCommission: 0,
      influencerServiceFee: 0,
      platformCommission: 1.19,
      settlementAmount: 196.81,
      recognizedAmount: 196.81,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '（此单只收了平台佣金）',
      recognizer: ''
    },
    {
      totalOrderNo: '6925223516209053190',
      orderAmount: 198,
      userPaid: 166.83,
      platformSubsidy: 31.17,
      paymentDiscount: 0,
      influencerCommission: 0,
      influencerServiceFee: 0,
      platformCommission: 19.8,
      settlementAmount: 178.2,
      recognizedAmount: 178.2,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '只有平台补贴（此单支出合计包含平台服务费和站外推广费，都需平台开票）',
      recognizer: ''
    },
    {
      totalOrderNo: '6951628017741076249',
      orderAmount: 198,
      userPaid: 198,
      platformSubsidy: 0,
      paymentDiscount: 0,
      influencerCommission: 9.9,
      influencerServiceFee: 0.99,
      platformCommission: 9.9,
      settlementAmount: 178.2,
      recognizedAmount: 187.11,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '只有达人佣金、平台佣金',
      recognizer: ''
    }
  ],

  // 订单详情 - 点击总订单号弹窗展示的关联订单
  orderDetails: {
    '6925165121833041575': [
      {
        relatedOrderNo: '6925165121833041575',
        orderAmount: 187.5,
        recognizeStatus: '已认款',
        recognizedAmount: 167.7,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 187.5,
        remark: '用户实付',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575-A',
        orderAmount: 9,
        recognizeStatus: '已认款',
        recognizedAmount: 9,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京有竹居网络技术有限公司',
        invoiceStatus: '已开票',
        invoiceAmount: 9,
        remark: '平台补贴',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575-B',
        orderAmount: 1.5,
        recognizeStatus: '已认款',
        recognizedAmount: 1.5,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京字跳网络技术有限公司',
        invoiceStatus: '已开票',
        invoiceAmount: 1.5,
        remark: '支付优惠',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575',
        orderAmount: 8.91,
        recognizeStatus: '已认款',
        recognizedAmount: 8.91,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '无需开票',
        invoiceAmount: '-',
        remark: '达人佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575',
        orderAmount: 9.9,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '-',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 9.9,
        remark: '平台佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6925180932148788326': [
      {
        relatedOrderNo: '6925180932148788326',
        orderAmount: 187.5,
        recognizeStatus: '已认款',
        recognizedAmount: 167.7,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 193,
        remark: '用户实付',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925180932148788326-B',
        orderAmount: 1.5,
        recognizeStatus: '已认款',
        recognizedAmount: 5,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京字跳网络技术有限公司',
        invoiceStatus: '待开票',
        invoiceAmount: '-',
        remark: '支付优惠',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925180932148788326',
        orderAmount: 8.91,
        recognizeStatus: '已认款',
        recognizedAmount: 8.91,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '无需开票',
        invoiceAmount: '-',
        remark: '达人佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925180932148788326',
        orderAmount: 9.9,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '-',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 9.9,
        remark: '平台佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6925150126368325030': [
      {
        relatedOrderNo: '6925150126368325030',
        orderAmount: 198,
        recognizeStatus: '已认款',
        recognizedAmount: 196.81,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 198,
        remark: '用户实付',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925150126368325030',
        orderAmount: 1.19,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '-',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 1.19,
        remark: '平台佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6925223516209053190': [
      {
        relatedOrderNo: '6925223516209053190',
        orderAmount: 166.83,
        recognizeStatus: '已认款',
        recognizedAmount: 147.03,
        fundCategory: '卡片',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 166.83,
        remark: '用户实付',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925223516209053190-A',
        orderAmount: 31.17,
        recognizeStatus: '已认款',
        recognizedAmount: 31.17,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京字跳网络技术有限公司',
        invoiceStatus: '已开票',
        invoiceAmount: 31.17,
        remark: '平台补贴',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925223516209053190',
        orderAmount: 19.8,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '-',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 19.8,
        remark: '平台佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6951628017741076249': [
      {
        relatedOrderNo: '6951628017741076249',
        orderAmount: 198,
        recognizeStatus: '已认款',
        recognizedAmount: 178.2,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 198,
        remark: '用户实付',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6951628017741076249',
        orderAmount: 8.91,
        recognizeStatus: '已认款',
        recognizedAmount: 8.91,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '无需开票',
        invoiceAmount: '-',
        remark: '达人佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6951628017741076249',
        orderAmount: 9.9,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '-',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 9.9,
        remark: '平台佣金',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ]
  },

  // 筛选选项
  filterOptions: {
    isSettled: ['全部', '已结清', '未结清'],
    isRecognized: ['全部', '已认款', '未认款'],
    douyinInvoice: ['全部', '已开票', '未开票'],
    ourInvoice: ['全部', '已开票', '部分开票', '未开票']
  },

  // 款项类别 / 月份 / 客户 / 认领人（供「已认款明细」「新零售已认款订单」筛选）
  fundCategories: ['礼品', '卡片', '信息服务费'],
  fundMonths: ['2026-04', '2026-05', '2026-06', '2026-09'],
  customers: ['抖音零售客户', '北京有竹居网络技术有限公司', '北京字跳网络技术有限公司'],
  recognizers: ['饶子杰', '李婉', '陈晓'],

  // 新零售已认款订单（世宇商城渠道）
  newRetailOrders: [
    {
      orderNo: 'SY202609180001',
      orderTime: '2026-09-18',
      orderAmount: 398,
      userPaid: 398,
      recognizedAmount: 398,
      fundCategory: '礼品',
      fundMonth: '2026-09',
      customerName: '抖音零售客户',
      recognizer: '饶子杰',
      recognizeTime: '2026-09-20',
      remark: '世宇商城自营订单'
    },
    {
      orderNo: 'SY202609150036',
      orderTime: '2026-09-15',
      orderAmount: 198,
      userPaid: 188,
      recognizedAmount: 188,
      fundCategory: '礼品',
      fundMonth: '2026-09',
      customerName: '抖音零售客户',
      recognizer: '李婉',
      recognizeTime: '2026-09-17',
      remark: '含平台补贴10元'
    },
    {
      orderNo: 'SY202609120117',
      orderTime: '2026-09-12',
      orderAmount: 597,
      userPaid: 597,
      recognizedAmount: 597,
      fundCategory: '卡片',
      fundMonth: '2026-09',
      customerName: '北京有竹居网络技术有限公司',
      recognizer: '陈晓',
      recognizeTime: '2026-09-14',
      remark: '企业批量采购'
    },
    {
      orderNo: 'SY202606082210',
      orderTime: '2026-06-08',
      orderAmount: 298,
      userPaid: 288,
      recognizedAmount: 288,
      fundCategory: '信息服务费',
      fundMonth: '2026-06',
      customerName: '北京字跳网络技术有限公司',
      recognizer: '饶子杰',
      recognizeTime: '2026-06-15',
      remark: '支付优惠10元，信息服务费'
    },
    {
      orderNo: 'SY202606030042',
      orderTime: '2026-06-03',
      orderAmount: 198,
      userPaid: 198,
      recognizedAmount: 198,
      fundCategory: '礼品',
      fundMonth: '2026-06',
      customerName: '抖音零售客户',
      recognizer: '李婉',
      recognizeTime: '2026-06-10',
      remark: ''
    },
    {
      orderNo: 'SY202605210078',
      orderTime: '2026-05-21',
      orderAmount: 498,
      userPaid: 448,
      recognizedAmount: 448,
      fundCategory: '信息服务费',
      fundMonth: '2026-05',
      customerName: '北京有竹居网络技术有限公司',
      recognizer: '陈晓',
      recognizeTime: '2026-05-28',
      remark: '平台补贴50元'
    }
  ]
};
