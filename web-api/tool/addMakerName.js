function addMakerName(resp, data) {
  let homeworks;

  if (resp.body.userList) {
    const userList = resp.body.userList;
    homeworks = data.map((homework) => {
      let makerName = userList.find(user => user.id === homework.makerId).userName;
      return Object.assign(homework.toJSON(), {makerName});
    });
  } else {
    homeworks = data.map((homework) => {
      const makerName = resp.body.userName;
      return Object.assign(homework.toJSON(), {makerName});
    });
  }

  return homeworks;
}

module.exports = addMakerName;
