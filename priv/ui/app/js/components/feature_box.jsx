var React = require("react");

var FeatureStore = require("../stores/feature_store.js");
var NewFeatureStore = require("../stores/new_feature_store.js");
var ErrorStore = require("../stores/error_store.js");

var AlertHeader = require("./alert_header.jsx");
var NewFeature = require("./new_feature.jsx");
var FeatureList = require("./feature_list.jsx");

var FeatureServerActions = require("./../actions/feature_server_actions.js");

function getStateFromStores() {
  return {
    newFeature: NewFeatureStore.getNewFeature(),
    features: FeatureStore.getAll(),
    errors: ErrorStore.getErrors()
  };
}

var FeatureBox = React.createClass({

  propTypes: {},

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    FeatureStore.addChangeListener(this._onChange);
    NewFeatureStore.addChangeListener(this._onChange);
    ErrorStore.addChangeListener(this._onChange);
    FeatureServerActions.fetchFeatures();
  },

  componentWillUnmount: function() {
    FeatureStore.removeChangeListener(this._onChange);
    NewFeatureStore.removeChangeListener(this._onChange);
    ErrorStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <AlertHeader errors={this.state.errors} />
        <h2>Features</h2>
        <NewFeature newFeature={this.state.newFeature}/>
        <FeatureList features={this.state.features} editingFeatures={this.state.editingFeatures}/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = FeatureBox;
