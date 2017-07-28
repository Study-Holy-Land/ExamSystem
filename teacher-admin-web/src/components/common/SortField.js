import {Component} from 'react';

export default class TableHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStateIndex: this.props.currentStateIndex,
      fields: []
    };
  }

  componentWillMount() {
    let fields = this.props.fields.map((field) => {
      return Object.assign({}, field, {state: 'fa fa-sort'});
    });
    fields[this.state.currentStateIndex].state = 'fa fa-sort-desc';

    this.setState({
      fields
    });
  }

  sortChange() {
    let field = this.state.fields[this.state.currentStateIndex];
    if (!field.isNeedSort) {
      return;
    }
    let order;
    let sort = field.sort;
    let state = field.state;
    if (state === 'fa fa-sort-asc') {
      order = 1;
    } else if (state === 'fa fa-sort-desc') {
      order = -1;
    }
    this.props.sortChange(sort, order);
  }

  handleClick(index) {
    if (!this.state.fields[index].isNeedSort) {
      return;
    }
    let fields = this.state.fields.map((item, order) => {
      return order === index ? Object.assign({}, item) : Object.assign({}, item, {state: 'fa fa-sort'});
    });

    if (fields[index].state === 'fa fa-sort' || fields[index].state === 'fa fa-sort-desc') {
      fields[index].state = 'fa fa-sort-asc';
    } else {
      fields[index].state = 'fa fa-sort-desc';
    }

    this.setState({
      fields,
      currentStateIndex: index
    }, this.sortChange);
  }

  render() {
    return (
      <tr>
        <th><input type='checkbox' checked={this.props.checked}
                   onClick={this.props.onChange}/></th>
        {
          this.state.fields.map(({name, state, isNeedSort}, index) => {
            return (
              <th key={index} onClick={this.handleClick.bind(this, index)}>{name}
                {isNeedSort
                  ? (<i
                  className={'pull-right ' + (index === this.state.currentStateIndex ? state : 'fa fa-sort')}></i>)
                  : '' }</th>
            );
          })
        }
      </tr>
    );
  }
}
