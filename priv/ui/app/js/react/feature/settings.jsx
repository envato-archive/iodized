var React = require("react/addons");
var SettingsBranch = require("./settings/branch.jsx");
var SettingsNode = require("./settings/node.jsx");

var FeatureSettings = React.createClass({

  getInitialState: function() {
    return {definition: this.props.definition};
  },

  onSettingsEdited: function () {
    /*var definition = React.addons.update(this.state.definition, {
      $merge: { this.props.definition }
    });*/
    //this.setState({definition: this.props.definition});
    
    // this.forceUpdate();
    //return false;
  },

  render: function() {
    var rootNode;
    var definition = this.state.definition;

    if (definition.operand === "any" || definition.operand === "all" || definition.operand === "none") {
      rootNode = <SettingsBranch definition={definition} onSettingsEdited={this.onSettingsEdited} />;
    } else {
      rootNode = <SettingsNode definition={definition} removeHandler={this.handleRemoveChild.bind(this, i)} onSettingsEdited={this.onSettingsEdited} />;
    }

    return (
      <div className="list-group feature-settings">
        <div className="list-group-item">
          { rootNode }
        </div>
      </div>
    );
  }
});

module.exports = FeatureSettings;
