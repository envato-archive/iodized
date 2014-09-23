var React = require("react/addons");

var OperandAnyAll = React.createClass({

  getInitialState: function() {
    return {children: []};
  },

  handleAddBtn: function (event) {
    var children = this.state.children;
    this.setState({children: children.concat([children.length + 1])});
  },

  handleRemoveBtn: function (event) {
    this.setState({children: []});
  },

  handleConditionChange: function (event) {
    console.log(event)
  },

  render: function() {
    return (
      <li className="list-group-item">
        <div className="form-inline" role="form">
          <div className="form-group feature-settings__condition-pre">
            <label>If</label>
          </div>
          <div className="form-group feature-settings__condition">
            <label className="sr-only" htmlFor="">Condition</label>
            <select className="form-control" onChange={this.handleConditionChange}>
              <option value="all">all</option>
              <option value="any">any</option>
              <option value="includeIn">include in</option>
              <option value="is">is</option>
              <option value="percentage">percentage</option>
            </select>
          </div>
          <div className="form-group feature-settings__condition-post">
            <label>of the following is true:</label>
          </div>
          <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
          <a onClick={this.handleAddBtn}><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
        </div>
        {this.state.children.map(function(i) {
          return (
            <Definition id={i} />
          );
        }, this)}
      </li>
    );
  }
});

module.exports = OperandAnyAll;
