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

    if (definition.operand === "any" || definition.operand === "all" || definition.operand === "none") {
      rootNode = <OperandAnyAll definition={definition} />;
    } else {
      rootNode = <OperandIncludedIn definition={definition} removeHandler={this.handleRemoveChild.bind(this, i)}/>;
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
