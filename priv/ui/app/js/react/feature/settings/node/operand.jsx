var React = require("react/addons");

var NodeOperand = React.createClass({

  getInitialState: function() {
    return { operand: this.props.operand};
  },

  handleOperandChange: function (event) {
    this.setState({ operand: event.target.value });
  },

  render: function() {
    return (
      <div className="form-group feature-settings__condition">
        <label className="sr-only" htmlFor="">Condition</label>
        <select ref="operand" value={this.state.operand} className="form-control" onChange={this.handleOperandChange}>
          <option value="is">is</option>
          <option value="not">not</option>
          <option value="included_in">included in</option>
          <option value="percentage">percentage</option>
        </select>
      </div>
    );
  }
});

module.exports = NodeOperand;
