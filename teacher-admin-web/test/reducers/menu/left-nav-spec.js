import navigator from '../../../src/reducers/menu/left-nav';

describe('navigator', () => {
  it('should return navmenu data', () => {
    let result = navigator([], {type: 'UPDATE_URI', uri: {pathname: '/teacher-admin-web/'}}).length;
    result.should.equal(10);
  });

  it('should return navmenu data', () => {
    let result = navigator([], {type: 'UPDATE_URI', uri: {pathname: '/teacher-admin-web/homeworks'}}).length;
    result.should.equal(10);
  });
});
