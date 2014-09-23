var React = require("react/addons");
var OperandAnyAll = require("./operand_any_all.jsx");
var OperandIs = require("./operand_is.jsx");
var OperandNot = require("./operand_not.jsx");
var OperandIncludedIn = require("./operand_included_in.jsx");
var OperandPercentage = require("./operand_percentage.jsx");

var OperandAnyAll = React.createClass({

  getInitialState: function() {
    return {definitions: this.props.definition.definitions};
  },

  handleAddBtn: function (event) {
    var definitions = this.state.definitions;
    this.setState({definitions: definitions.concat([definitions.length + 1])});
  },

  handleRemoveBtn: function (event) {
    this.setState({definitions: []});
  },

  handleConditionChange: function (event) {
    console.log(event)
  },

  render: function() {
    
    return (
      <div className="form-inline" role="form">
        <div className="form-group feature-settings__condition-pre">
          <label>If</label>
        </div>
        <div className="form-group feature-settings__condition">
          <label className="sr-only" htmlFor="">Condition</label>
          <select value={this.props.definition.operand} className="form-control" onChange={this.handleConditionChange}>
            <option value="all">all</option>
            <option value="any">any</option>
          </select>
        </div>
        <div className="form-group feature-settings__condition-post">
          <label>of the following is true:</label>
        </div>
        <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
        <a onClick={this.handleAddBtn}><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>

        {this.state.definitions.map(function(definition) {
          var node;

          if (definition.operand === "any" || definition.operand === "all") {
            node = <OperandAnyAll definition={definition} />;
          } else if (definition.operand === "is") {
            node = <OperandIs definition={definition} />;
          } else if (definition.operand === "not") {
            node = <OperandNot definition={definition} />;
          } else if (definition.operand === "included_in") {
            node = <OperandIncludedIn definition={definition} />;
          } else if (definition.operand === "percentage") {
            node = <OperandPercentage definition={definition} />;
          }

          return (
            <div className="list-group-item">
              { node }
            </div>
          );
        }, this)}
      </div>
    );
  }
});

module.exports = OperandAnyAll;

