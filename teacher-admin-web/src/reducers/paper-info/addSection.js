const addSection = (data, section) => {
  data.sections.push(section);
  let newData = Object.assign({}, data);

  return newData;
};

export default addSection;
