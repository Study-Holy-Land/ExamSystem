import breadcrumb from '../../../src/reducers/menu/breadcrumb';
import should from 'should';

describe('breadcrumb', () => {
  it('should return breadcrumb data', () => {
    const expectResult = [{
      id: 2,
      parent: 1,
      level: 2,
      text: '管理首页',
      uri: '/index',
      icon: 'home'
    }];
    should(breadcrumb({}, {type: 'UPDATE_URI', uri: {pathname: '/teacher-admin-web/'}})).deepEqual(expectResult);
  });

  it('should return breadcrumb data', () => {
    const expectResult = [{
      id: 5,
      parent: 1,
      level: 2,
      text: '个人中心',
      uri: '/userCenter',
      icon: 'user-circle'
    }];
    should(breadcrumb({}, {
      type: 'UPDATE_URI',
      uri: {pathname: '/teacher-admin-web/userCenter'}
    })).deepEqual(expectResult);
  });
});
