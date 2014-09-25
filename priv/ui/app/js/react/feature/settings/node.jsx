var React = require("react/addons");
var NodeParameter = require("./node/parameter.jsx");
var NodeOperand = require("./node/operand.jsx");
var NodeValue = require("./node/value.jsx");

var SettingsNode = React.createClass({

  getInitialState: function() {
    return { definition: this.props.definition};
  },

  render: function() {
    return (
      <div className="list-group-item feature-settings__tree-node--end-point">
        <NodeParameter param_name={this.state.definition.param_name} />
        <NodeOperand operand={this.state.definition.operand} />
        <NodeValue value={this.state.definition.value} />
        <a onClick={this.props.removeHandler}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
      </div>
    );
  }
});

module.exports = SettingsNode;
