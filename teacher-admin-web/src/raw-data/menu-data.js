export default [
  {
    id: 1,
    parent: 0,
    level: 1,
    text: '后台管理',
    uri: '/teacher-admin-web',
    icon: 'home',
    role: [0, 1, 2, 3, 4, 9]
  },
  {
    id: 2,
    parent: 1,
    level: 2,
    text: '个人中心',
    uri: '/userCenter',
    icon: 'user-circle',
    role: [0, 1, 2, 3, 4, 9]
  },
  {
    id: 3,
    parent: 1,
    level: 2,
    text: '系统配置',
    uri: '/index',
    icon: 'home',
    role: [9]
  }, {
    id: 4,
    parent: 1,
    level: 2,
    text: '试卷管理',
    uri: '/papers',
    icon: 'book',
    role: [2, 9]
  }, {
    id: 5,
    parent: 1,
    level: 2,
    text: '试题管理',
    uri: '/homeworks',
    icon: 'tachometer',
    role: [1, 9]
  },
  {
    id: 6,
    parent: 1,
    level: 2,
    text: '权限管理',
    uri: '/roleManagement',
    icon: 'cog',
    role: [9]
  }, {
    id: 7,
    parent: 1,
    level: 2,
    text: '学生管理',
    uri: '/mentor',
    icon: 'bookmark',
    role: [4, 9]
  }, {
    id: 8,
    parent: 1,
    level: 2,
    text: '消息中心',
    uri: '/messageCenter',
    icon: 'bell',
    role: [4, 9]
  }, {
    id: 9,
    parent: 1,
    level: 2,
    text: '技术栈管理',
    uri: '/stacks',
    icon: 'stack-overflow',
    role: [1, 9]
  }, {
    id: 10,
    parent: 1,
    level: 2,
    text: 'program管理',
    uri: '/programs',
    icon: 'users',
    role: [3, 9]
  },
  {
    id: 11,
    parent: 1,
    level: 2,
    text: '学生 che 管理',
    uri: '/che',
    icon: 'connectdevelop',
    role: [0, 1, 2, 3, 4, 9]
  }
];
