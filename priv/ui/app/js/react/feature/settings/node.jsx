var React = require("react/addons");
var NodeParameter = require("./node/parameter.jsx");
var NodeOperand = require("./node/operand.jsx");
var NodeValue = require("./node/value.jsx");

var SettingsNode = React.createClass({

  getInitialState: function() {
    return { definition: this.props.definition};
  },

  buildDefinition: function() {
    return {
      operand: this.refs.operand.refs.operand.getDOMNode().value,
      param_name: this.refs.parameter.refs.parameter.getDOMNode().value,
      value: this.refs.value.refs.value.getDOMNode().value 
    }
  },

  render: function() {
    return (
      <div className="list-group-item feature-settings__child-node">
        <NodeParameter ref="parameter" param_name={this.state.definition.param_name} onSettingsEdited={this.props.onSettingsEdited} />
        <NodeOperand ref="operand" operand={this.state.definition.operand} onSettingsEdited={this.props.onSettingsEdited} />
        <NodeValue ref="value" value={this.state.definition.value} onSettingsEdited={this.props.onSettingsEdited} />
        <a onClick={this.props.removeHandler}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
      </div>
    );
  }
});

module.exports = SettingsNode;
