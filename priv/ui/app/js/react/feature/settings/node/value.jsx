var React = require("react/addons");

var NodeValue = React.createClass({

  getInitialState: function() {
    return { value: this.props.value};
  },

  handleValueChange: function (event) {
    this.setState({ value: event.target.value });
    //this.props.onSettingsChange();
  },

  render: function() {
    return (
      <div className="form-group feature-settings__condition-post--field">
        <label className="sr-only" htmlFor="">Value</label>
        <input ref="value" type="text" className="form-control" id="" value={this.state.value} onChange={this.handleValueChange} placeholder="Free Text" size="40" />
      </div>
    );
  }
});

module.exports = NodeValue;
