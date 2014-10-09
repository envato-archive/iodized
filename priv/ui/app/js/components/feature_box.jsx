var React = require("react");

var NewFeatureStore = require("../stores/new_feature_store.js");
var FeatureStore = require("../stores/feature_store.js");
var EditingFeatureStore = require("../stores/editing_feature_store.js");
var ErrorStore = require("../stores/error_store.js");

var AlertHeader = require("./alert_header.jsx");
var NewFeature = require("./new_feature.jsx");
var FeatureList = require("./feature_list.jsx");

function getStateFromStores() {
  return {
    newFeature: NewFeatureStore.getNewFeature(),
    features: FeatureStore.getAll(),
    editingFeatures: EditingFeatureStore.getAll(),
    errors: ErrorStore.getErrors()
  };
}

var FeatureBox = React.createClass({

  propTypes: {
    featureRepo: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    NewFeatureStore.addChangeListener(this._onChange);
    FeatureStore.addChangeListener(this._onChange);
    EditingFeatureStore.addChangeListener(this._onChange);
    ErrorStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NewFeatureStore.removeChangeListener(this._onChange);
    FeatureStore.removeChangeListener(this._onChange);
    EditingFeatureStore.removeChangeListener(this._onChange);
    ErrorStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <AlertHeader errors={this.state.errors} />
        <h2>Features</h2>
        <NewFeature newFeature={this.newFeature}/>
        <FeatureList features={this.state.features} editingFeatures={this.state.editingFeatures}/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = FeatureBox;
