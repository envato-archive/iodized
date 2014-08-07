var React = require("react");
var FeatureForm = require("./feature_form.jsx");
var FeatureList = require("./feature_list.jsx");

var FeatureBox = React.createClass({

  getInitialState: function() {
    return {features: []};
  },

  componentWillMount: function() {
    this.refresh();
  },

  refresh: function() {
    this.props.featureRepo.fetchFeatures(function(featureData){
      this.setState({features: featureData});
    }.bind(this));
  },

  handleNewFeature: function() {
    this.newFeature();
    return false;
  },

  newFeature: function() {
    var emptyFeature = {
      title: "",
      description: "",
      master_switch_state: "dynamic"
    }
    this.refs.featureForm.show(emptyFeature, this.createFeature);
  },

  createFeature: function(feature) {
    this.props.featureRepo.createFeature(feature, this.refresh);
  },

  deleteFeature: function(feature) {
    if(confirm("really delete " + feature.title + "?")) {
      this.props.featureRepo.deleteFeature(feature, this.refresh);
    }
  },

  updateFeature: function(feature) {
    this.props.featureRepo.updateFeature(feature, this.refresh);
  },

  render: function() {
    return (
      <div className="featureBox">
        <h2>Features</h2>
          <div className="new-feature">
              <button type="button" className="btn new-feature__add" onClick={this.handleNewFeature} tabIndex="0">
                  <span className="glyphicon glyphicon-plus"></span>
              </button>
              <FeatureForm ref="featureForm"/>
          </div>

          <FeatureList features={this.state.features} updateFeature={this.updateFeature} deleteFeature={this.deleteFeature}/>
      </div>
    );
  }
});

module.exports = FeatureBox;
