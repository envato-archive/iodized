var React = require("react/addons");

var BranchOperand = React.createClass({

  getInitialState: function() {
    return { operand: this.props.operand};
  },

  handleOperandChange: function (event) {
    this.setState({ operand: event.target.value });
  },

  render: function() {
    return (
      <div>
        <label>If </label>
        <label className="sr-only" htmlFor="">Condition</label>
        <select ref="operand" value={this.state.operand} className="form-control feature-settings__condition" onChange={this.handleOperandChange}>
          <option value="all">all</option>
          <option value="any">any</option>
          <option value="none">none</option>
        </select>
        <label>of the following is true:</label>
        <a onClick={this.props.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
        <a onClick={this.props.handleAddBtn}><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
        <a onClick={this.props.handleAddParent}><span className="glyphicon glyphicon-download feature__setting-icon pull-right"></span></a>
      </div>
    );
  }
});

module.exports = BranchOperand;
