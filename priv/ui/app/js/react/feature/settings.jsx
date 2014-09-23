var React = require("react/addons");
var Definition = require("./settings/definition.jsx");
var Controls = require("./settings/controls.jsx");

var FeatureSettings = React.createClass({

  getInitialState: function() {
    return {definitions: []};
  },

  handleAddNewBtn: function (event) {
    var defs = this.state.definitions;
    this.setState({definitions: defs.concat([defs.length + 1])});
  },

  handleClearAllBtn: function (event) {
    this.setState({definitions: []});
  },

  render: function() {
    return (
      <ul className="list-group feature-settings">
        <Controls handleAddNewBtn={this.handleAddNewBtn} handleClearAllBtn={this.handleClearAllBtn} />
        
        {this.state.definitions.map(function(i) {
          return (
            <Definition id={i}/>
          );
        }, this)}

      </ul>
    );
  }
});

module.exports = FeatureSettings;
