var React = require("react/addons");
var SettingsBranch = require("./branch.jsx");
var SettingsNode = require("./node.jsx");


var SettingsBranch = React.createClass({

  getInitialState: function() {
    return {
      definition: this.props.definition,
      definitions: this.props.definition.definitions || []
    };
  },

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
  handleConditionChange: function (event) {
  },

  handleRemoveChild: function (i, key) {
    var definitions = this.state.definitions;
    console.log("remove at index", i, key);

    definitions.splice(i, 1);
    this.forceUpdate();
  },

  render: function() {
    
    return (
      <div className="list-group-item feature-settings__child-node">
        <div className="form-inline" role="form">
          <label>If </label>
          <label className="sr-only" htmlFor="">Condition</label>
          <select value={this.state.definition.operand} className="form-control feature-settings__condition" onChange={this.handleConditionChange}>
            <option value="all">all</option>
            <option value="any">any</option>
            <option value="none">none</option>
          </select>
          <label>of the following is true:</label>
          <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
          <a onClick={this.handleAddBtn}><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
          <a onClick={this.handleAddParent}><span className="glyphicon glyphicon-download feature__setting-icon pull-right"></span></a>

          {this.state.definitions.map(function(definition, i) {
            var node;
            var key = definition.operand + i + Math.random();

            if (definition.operand === "any" || definition.operand === "all" || definition.operand === "none") {
              node = <SettingsBranch key={key} definition={definition} />;
            } else {
              node = <SettingsNode key={key} definition={definition} removeHandler={this.handleRemoveChild.bind(this, i, key)}/>;
            }

            return ( node );
          }, this)}
        </div>
      </div>
    );
  }
});

module.exports = SettingsBranch;

