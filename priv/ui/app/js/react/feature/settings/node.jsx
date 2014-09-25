var React = require("react/addons");

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

  handleChange: function () {
    
    // this.setState({ value: event.target.value });
    
  },

  render: function() {
    return (
      <div className="list-group-item feature-settings__child-node">
        <div className="form-group feature-settings__condition-pre--field">
          <label className="sr-only" htmlFor="">Parameter</label>
          <input ref="parameter" type="text" className="form-control" value={this.state.definition.param_name} onChange={this.handleChange} placeholder="Main Attributes" />
        </div>
        <div className="form-group feature-settings__condition">
          <label className="sr-only" htmlFor="">Condition</label>
          <select ref="operand" value={this.state.definition.operand} className="form-control feature-settings__condition" onChange={this.handleChange}>
            <option value="is">is</option>
            <option value="not">not</option>
            <option value="included_in">included in</option>
            <option value="percentage">percentage</option>
          </select>
        </div>
        <div className="form-group feature-settings__condition-post--field">
          <label className="sr-only" htmlFor="">Value</label>
          <input ref="value" type="text" className="form-control" id="" value={this.state.definition.value} onChange={this.handleChange} placeholder="Free Text" size="40" />
        </div>
        <a onClick={this.props.removeHandler}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
      </div>
    );
  }
});

module.exports = SettingsNode;
