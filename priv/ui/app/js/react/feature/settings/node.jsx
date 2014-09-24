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
      <div className="list-group-item feature-settings__child-node">
        <NodeParameter definition={this.state.definition} param_name={this.state.definition.param_name} onSettingsEdited={this.props.onSettingsEdited} />
        <NodeOperand operand={this.state.definition.operand} onSettingsEdited={this.props.onSettingsEdited} />
        <NodeValue value={this.state.definition.value} onSettingsEdited={this.props.onSettingsEdited} />
        <a onClick={this.props.removeHandler}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
      </div>
    );
  }
});

module.exports = SettingsNode;
