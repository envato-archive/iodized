var React = require("react/addons");
var SettingsBranch = require("./branch.jsx");
var SettingsNode = require("./node.jsx");
var BranchOperand = require("./branch/operand.jsx");


var SettingsBranch = React.createClass({

  getInitialState: function () {
    return { definition: this.props.definition };
  },

  handleAddBtn: function (event) {
    var definitions = this.props.definition.definitions;
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
    var definitions = this.props.definition.definitions;
    this.setState({definitions: definitions.concat([{
        operand: 'any',
        definitions: []
      }]
    )});
  },

  handleRemoveChild: function (i, key) {
    var definitions = this.props.definition.definitions;
    console.log("remove at index", i, key);

    definitions.splice(i, 1);
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
  },

  handleOperandChange: function (event) {
    var definition = this.props.definition;
    this.setState({ definition: { 
      operand: event.target.value
    }});
  },

  render: function() {
    
    return (
      <div className="list-group-item feature-settings__tree-node">
        <div className="form-inline" role="form">

          <label>If </label>
          <label className="sr-only" htmlFor="">Condition</label>
          <select ref="operand" value={this.state.definition.operand} className="form-control feature-settings__condition" onChange={this.handleOperandChange}>
            <option value="all">all</option>
            <option value="any">any</option>
            <option value="none">none</option>
          </select>
          <label>of the following is true:</label>
          <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
          <a onClick={this.handleAddBtn}><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
          <a onClick={this.handleAddParent}><span className="glyphicon glyphicon-download feature__setting-icon pull-right"></span></a>

          {this.props.definition.definitions.map(function(definition, i) {
            var node, key, branchKey;

            key = this.props.key + '.' + i;
            branchKey = (parseInt(this.props.key.charAt(0)) + 1) + '.' + i;

            if (definition.operand === "any" || definition.operand === "all" || definition.operand === "none") {
              node = <SettingsBranch ref={"definition" + i} key={branchKey} definition={definition} onSettingsEdited={this.props.onSettingsEdited} parent={this} />;
              console.log(branchKey);
            } else {
              node = <SettingsNode ref={"definition" + i} key={key} definition={definition} removeHandler={this.handleRemoveChild.bind(this, i, key)} onSettingsEdited={this.props.onSettingsEdited} parent={this} />;
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

