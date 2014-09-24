var React = require("react/addons");
var SettingsBranch = require("./settings/branch.jsx");
var SettingsNode = require("./settings/node.jsx");

var FeatureSettings = React.createClass({

  render: function() {
    return (
      <div className="list-group feature-settings">
        <div className="list-group-item">
          <SettingsBranch definition={this.props.definition} />
        </div>
      </div>
    );
  }
});

module.exports = FeatureSettings;
