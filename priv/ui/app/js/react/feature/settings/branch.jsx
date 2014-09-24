var React = require("react/addons");
var SettingsBranch = require("./branch.jsx");
var SettingsNode = require("./node.jsx");
var BranchOperand = require("./branch/operand.jsx");


var SettingsBranch = React.createClass({

  handleAddBtn: function (event) {
    var definitions = this.state.definitions;
    this.setState({definitions: definitions.concat([{
        operand: 'is',
        param_name: '',
        value: ''
      }]
    )});
  },

  handleRemoveBtn: function (event) {
    this.setState({definitions: []});
  },

  handleAddParent: function (event) {
    var definitions = this.state.definitions;
    this.setState({definitions: definitions.concat([{
        operand: 'any',
        definitions: []
      }]
    )});
  },

  handleRemoveChild: function (i, key) {
    var definitions = this.state.definitions;
    console.log("remove at index", i, key);

    definitions.splice(i, 1);
    this.forceUpdate();
  },

  buildDefinition: function() {
    return {
      operand: this.refs.operand.refs.operand.getDOMNode().value,
      definitions: this.props.definition.definitions.map(function(definition, i){
        return this.refs["definition" + i].buildDefinition();
      }, this)
    }
    //return definitionComponents.map(function(component){
    //  return component.buildDefinition();
    //});
  },

  render: function() {
    
    return (
      <div className="list-group-item feature-settings__child-node">
        <div className="form-inline" role="form">

          <BranchOperand ref="operand" handleRemoveBtn={this.handleRemoveBtn} handleAddBtn={this.handleAddBtn} handleAddParent={this.handleAddParent} />

          {this.props.definition.definitions.map(function(definition, i) {
            var node;
            var key = definition.operand + i + Math.random();

            if (definition.operand === "any" || definition.operand === "all" || definition.operand === "none") {
              node = <SettingsBranch ref={"definition" + i} key={key} definition={definition} onSettingsEdited={this.props.onSettingsEdited}/>;
            } else {
              node = <SettingsNode ref={"definition" + i} key={key} definition={definition} removeHandler={this.handleRemoveChild.bind(this, i, key)} onSettingsEdited={this.props.onSettingsEdited}/>;
            }

            return ( node );
          }, this)}
        </div>
      </div>
    );
  }
});

module.exports = SettingsBranch;

