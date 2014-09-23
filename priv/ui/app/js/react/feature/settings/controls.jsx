var React = require("react/addons");

var FeatureControls = React.createClass({

  render: function() {
    return (
      <li className="list-group-item feature-settings__controls">
        <div className="pull-right">
          <button type="button" className="btn btn-default" onClick={this.props.handleAddNewBtn}>Add New</button>
          <button type="button" className="btn btn-default" onClick={this.props.handleClearAllBtn}>Clear All</button>
        </div>
      </li>
    );
  }
});

module.exports = FeatureControls;
