var React = require("react/addons");
var SettingsBranch = require("./settings/branch.jsx");
var SettingsNode = require("./settings/node.jsx");

var FeatureSettings = React.createClass({

  render: function() {
    return (
      <div className="feature-settings">
        <div className="list-group">
          <SettingsBranch definition={this.props.definition} />
        </div>
      </div>
    );
  }
});

module.exports = FeatureSettings;
