var React = require("react");
var FeatureForm = require("./feature_form.jsx");
var FeatureModel = require("../feature_model.js");
var jquery = require("jquery");

var NewFeature = React.createClass({
  propTypes: {
    createFeature: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {dirty: false, expanded: false, feature: new FeatureModel()};
  },

  componentDidMount: function() {
    var domNode = jquery(".new-feature");
    domNode.on("hide.bs.modal", function(e) {
      if (this.state.dirty) {
        return false;
      } else {
        this.handleCancel();
        return true;
      }
    }.bind(this));
  },

  handleNewFeature: function() {
    this.setState({dirty: false, expanded: true, feature: new FeatureModel()}, function(){
      jquery('.new-feature').find("input:first-of-type").focus();
    }.bind(this));
    return false;
  },

  createFeature: function(feature) {
    this.props.createFeature(feature, this.reset);
  },

  handleCancel: function() {
    this.reset();
    return false;
  },

  markDirty: function() {
    this.setState({dirty: true});
  },

  reset: function() {
    this.setState({dirty: false, expanded: false, feature: new FeatureModel()});
  },

  visibilityClass: function() {
    if (this.state.expanded) {
      return "is-expanded";
    } else {
      return "is-collapsed";
    }
  },

  render: function() {
    var className = "new-feature " + this.visibilityClass();
    return (
      <div className={className}>
        <button type="button" className="btn new-feature__add" onClick={this.handleNewFeature} tabIndex="0">
          <span className="glyphicon glyphicon-plus"></span>
        </button>
        <div className="new-feature__content">
          <a href="#" onClick={this.handleCancel} className="new-feature__close">
            <span className="glyphicon glyphicon-remove"></span>
          </a>
          <FeatureForm feature={this.state.feature} saveFeature={this.createFeature} onFeatureEdited={this.markDirty}/>
        </div>
      </div>
    );
  }
});

module.exports = NewFeature;
