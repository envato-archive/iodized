var React = require("react/addons");

var NodeParameter = React.createClass({

  getInitialState: function() {
    return { param_name: this.props.param_name};
  },

  handleParamChange: function (event) {
    this.setState({ param_name: event.target.value });
  },

  render: function() {
    return (
      <div className="form-group feature-settings__condition-pre--field">
        <label className="sr-only" htmlFor="">Parameter</label>
        <input type="text" className="form-control" value={this.state.param_name} onChange={this.handleParamChange} placeholder="Main Attributes" />
      </div>
    );
  }
});

module.exports = NodeParameter;
