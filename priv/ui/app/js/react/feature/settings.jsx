var React = require("react/addons");
var SettingsBranch = require("./settings/branch.jsx");
var SettingsNode = require("./settings/node.jsx");
var Dispatcher = require('flux').Dispatcher;

var FeatureSettings = React.createClass({

  getInitialState: function() {
    return {definition: this.props.definition};
  },

  onSettingsEdited: function () {
    
    var newDefinition = this.refs.branch.buildDefinition();

    console.log(newDefinition);
    
    this.setState({definition: newDefinition});

  },

  render: function() {
    return (
      <div className="feature-settings">
        <div className="list-group">
          <SettingsBranch ref="branch" definition={this.props.definition} onSettingsEdited={this.onSettingsEdited} key="1.0" />
        </div>
      </div>
    );
  }
});

module.exports = FeatureSettings;
