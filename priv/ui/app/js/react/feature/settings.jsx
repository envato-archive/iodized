var React = require("react/addons");
var SettingsBranch = require("./settings/branch.jsx");
var SettingsNode = require("./settings/node.jsx");

var FeatureSettings = React.createClass({

  getInitialState: function() {
    return {definition: this.props.definition};
  },

  onSettingsEdited: function () {
    
    var currentDefinitions = this.state.definition.definitions;

    var newDefinition = this.refs.branch.buildDefinition();

    this.setState({definition: newDefinition});
  },

  render: function() {
    var rootNode;
    var definition = this.state.definition;

    return (
      <div className="list-group feature-settings">
        <div className="list-group-item">
          <SettingsBranch ref="branch" definition={definition} onSettingsEdited={this.onSettingsEdited} />
        </div>
      </div>
    );
  }
});

module.exports = FeatureSettings;
