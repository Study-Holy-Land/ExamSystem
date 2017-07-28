class AbstractSection {
  constructor(data) {
    this.data = data;
  }

  toJSON() {
    return Object.assign({}, {
      status: this.getStatus(),
      type: this.data.constructor.modelName
    });
  }
}

module.exports = AbstractSection;
