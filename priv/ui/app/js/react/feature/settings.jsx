var React = require("react/addons");
var OperandAnyAll = require("./settings/operand_any_all.jsx");
var OperandIs = require("./settings/operand_is.jsx");
var OperandNot = require("./settings/operand_not.jsx");
var OperandIncludedIn = require("./settings/operand_included_in.jsx");
var OperandPercentage = require("./settings/operand_percentage.jsx");

var FeatureSettings = React.createClass({

  getInitialState: function() {
    return {definition: this.props.definition};
  },

  render: function() {
    var rootNode;
    var definition = this.state.definition;
    console.log(definition);

    if (definition.operand === "any" || definition.operand === "all") {
      rootNode = <OperandAnyAll definition={definition} />;
    } else if (definition.operand === "is") {
      rootNode = <OperandIs definition={definition} />;
    } else if (definition.operand === "not") {
      rootNode = <OperandNot definition={definition} />;
    } else if (definition.operand === "included_in") {
      rootNode = <OperandIncludedIn definition={definition} />;
    } else if (definition.operand === "percentage") {
      rootNode = <OperandPercentage definition={definition} />;
    }

    return (
      <ul className="list-group feature-settings">
        { rootNode }
      </ul>
    );
  }
});

module.exports = FeatureSettings;
