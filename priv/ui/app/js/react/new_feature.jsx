var React = require("react");
var FeatureForm = require("./feature_form.jsx");
var jquery = require("jquery");

var NewFeature = React.createClass({
  getInitialState: function() {
    return {feature: {}, dirty: false, expanded: false}
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
    this.replaceState({feature: {}, dirty: false, expanded: true}, function(){
      jquery('.new-feature')
      .find("input:first-of-type").focus();
    }.bind(this));
    return false;
  },

  createFeature: function(feature) {
    this.props.createFeature(feature);
    this.reset();
  },

  handleCancel: function() {
    this.reset();
    return false;
  },

  reset: function() {
    this.replaceState({feature: {}, dirty: false, expanded: false});
  },

  visibilityClass: function() {
    if (this.state.expanded) {
      return "is-expanded";
    } else {
      return "is-collapsed";
    }
  },

  markDirty: function() {
    this.setState({dirty: true});
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
          <FeatureForm feature={this.state.feature} isNewFeature={true} saveFeature={this.createFeature} markDirty={this.markDirty} dirty={this.state.dirty}/>
        </div>
      </div>
    );
  }
});

module.exports = NewFeature;
