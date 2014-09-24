var React = require("react");
var AlertHeader = require("./alert_header.jsx");
var NewFeature = require("./new_feature.jsx");
var FeatureList = require("./feature_list.jsx");

var FeatureBox = React.createClass({

  propTypes: {
    featureRepo: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {features: []};
  },

  componentWillMount: function() {
    this.refresh();
  },

  refresh: function() {
    this.props.featureRepo.fetchFeatures(function(featureData){
      this.replaceState({features: featureData});
    }.bind(this));
  },

  ajaxError: function(xhr) {
    this.setState({alertXHR: xhr})
  },

  createFeature: function(feature) {
    this.props.featureRepo.createFeature(feature, this.refresh, this.ajaxError);
  },

  updateFeature: function(feature) {
    this.props.featureRepo.updateFeature(feature, this.refresh, this.ajaxError);
  },

  toggleFeature: function(feature, toggleState){
    feature.toggle(toggleState);
    this.props.featureRepo.updateFeature(feature, this.refresh, this.ajaxError);
  },

  deleteFeature: function(feature) {
    if(confirm("really delete " + feature.title + "?")) {
      this.props.featureRepo.deleteFeature(feature, this.refresh, this.ajaxError);
    }
  },

  render: function() {
    return (
      <div>
        <AlertHeader xhrResponse={this.state.alertXHR} />
        <h2>Features</h2>
        <NewFeature createFeature={this.createFeature}/>
        <FeatureList features={this.state.features} updateFeature={this.updateFeature} toggleFeature={this.toggleFeature} deleteFeature={this.deleteFeature}/>
      </div>
    );
  }
});

module.exports = FeatureBox;
