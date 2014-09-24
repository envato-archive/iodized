var React = require("react/addons");

var SettingsNode = React.createClass({

  getInitialState: function() {
    return { definition: this.props.definition};
  },

  handleParamChange: function (event) {
    this.setState({
      definition: {
        param_name: event.target.value
      }
    });
  },

  handleConditionChange: function (event) {
    console.log("param change");
    this.setState({
      definition: {
        operand: event.target.value
      }
    });
  },

  render: function() {
    return (
      <div>
        <div className="form-group feature-settings__condition-pre--field">
          <label className="sr-only" htmlFor="">Attributes</label>
          <input type="text" className="form-control" value={this.state.definition.param_name} onChange={this.handleParamChange} placeholder="Main Attributes" />
        </div>
        <div className="form-group feature-settings__condition">
          <label className="sr-only" htmlFor="">Condition</label>
          <select value={this.state.definition.operand} className="form-control feature-settings__condition" onChange={this.handleConditionChange}>
            <option value="is">is</option>
            <option value="not">not</option>
            <option value="included_in">included in</option>
            <option value="percentage">percentage</option>
          </select>
        </div>
        <div className="form-group feature-settings__condition-post--field">
          <label className="sr-only" htmlFor="">Free text</label>
          <input type="text" className="form-control" id="" value={this.state.definition.value} placeholder="Free Text" size="40" />
        </div>
        <a onClick={this.props.removeHandler}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
      </div>
    );
  }
});

module.exports = SettingsNode;
