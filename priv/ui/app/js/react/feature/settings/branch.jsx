var React = require("react/addons");
var SettingsBranch = require("./branch.jsx");
var SettingsNode = require("./node.jsx");
var BranchOperand = require("./branch/operand.jsx");


var SettingsBranch = React.createClass({

  handleAddBtn: function (event) {
    var definition = this.props.definition;
    definition.definitions = definition.definitions.concat([{
        operand: 'is',
        param_name: '',
        value: ''
      }]
    );
    this.props.onSettingsEdited();
  },

  handleRemoveBtn: function (event) {
    this.props.definition.hidden = 'hidden';
    console.log(this.props.definition);

    this.props.onSettingsEdited();
  },

  handleAddParent: function (event) {
    var definition = this.props.definition;
    definition.definitions = definition.definitions.concat([{
        operand: 'any',
        definitions: []
      }]
    );
    this.props.onSettingsEdited();
  },

  handleRemoveChild: function (i, key) {
    var definitions = this.props.definition.definitions;
    console.log("remove at index", i, key);

    // definitions.splice(i, 1);
    definitions[i].hidden = 'hidden';
    //this.forceUpdate();
    
    this.props.onSettingsEdited();
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
      <div className={this.props.definition.hidden || '' + " list-group-item feature-settings__child-node"}>
        <div className="form-inline" role="form">

          <BranchOperand ref="operand" handleRemoveBtn={this.handleRemoveBtn} handleAddBtn={this.handleAddBtn} handleAddParent={this.handleAddParent} />

          {this.props.definition.definitions.map(function(definition, i) {
            var node, key;

            var key = this.props.key + '.' + i;
            var branchKey = (parseInt(this.props.key.charAt(0)) + 1) + '.' + i;

            if (definition.operand === "any" || definition.operand === "all" || definition.operand === "none") {
              node = <SettingsBranch ref={"definition" + i} key={branchKey} definition={definition} onSettingsEdited={this.props.onSettingsEdited} parent={this} hidden={definition.hidden || ''}/>;
              console.log(branchKey);
            } else {
              node = <SettingsNode ref={"definition" + i} key={key} definition={definition} removeHandler={this.handleRemoveChild.bind(this, i, key)} onSettingsEdited={this.props.onSettingsEdited} parent={this} hidden={definition.hidden || ''} />;
              console.log(key);
            }

            return ( node );
          }, this)}

        </div>
      </div>
    );
  }
});

module.exports = SettingsBranch;

