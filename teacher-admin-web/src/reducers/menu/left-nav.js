import navData from '../../raw-data/menu-data';
export default (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_URI': {
      let path = action.uri.pathname.replace('/admin', '');
      let uri = (path[path.length - 1] === '/' ? '/userCenter' : path);
      return navData.filter((nav) => nav.level === 2)
        .map(nav => Object.assign({}, nav, {selected: (uri.indexOf(nav.uri) >= 0)}));
    }
  }
  return state;
};
