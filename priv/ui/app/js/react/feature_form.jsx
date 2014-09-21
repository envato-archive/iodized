var React = require("react/addons");

var FeatureForm = React.createClass({
  propTypes: {
    feature: React.PropTypes.object.isRequired,
    onFeatureEdited: React.PropTypes.func,
    saveFeature: React.PropTypes.func.isRequired,
    deleteFeature: React.PropTypes.func
  },

  getDefaultProps: function(){
    return {
      onFeatureEdited: function(){}
    }
  },

  getInitialState: function(){
    return {editingFeature: this.props.feature};
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.feature !== this.props.feature) {
      this.setState({editingFeature: this.props.feature});
    }
  },

  handleChange: function() {
    var editingFeature = React.addons.update(this.state.editingFeature, {
      $merge: {
        title: this.refs.title.getDOMNode().value,
        description: this.refs.description.getDOMNode().value,
        master_switch_state: this.refs.master_switch_state.getDOMNode().value,
        definition: null
      }
    });
    this.setState({editingFeature: editingFeature});
    this.props.onFeatureEdited();
    return false;
  },

  submitButtonTitle: function() {
    if (this.state.editingFeature.isNew()) {
      return "Add new feature";
    } else {
      return "Update feature";
    }
  },

  handleSaveFeature: function() {
    this.props.saveFeature(this.state.editingFeature);
  },

  render: function() {
    var feature = this.state.editingFeature;
    return (
      <form ref="form" role="form">
        <div className="form-group">
          <label className="control-label" htmlFor="featureTitleInput">Feature Name</label>
          <input type="text" className="form-control input-lg" ref="title" id="featureTitleInput" value={feature.title || ""} onChange={this.handleChange} />
          <small>Lower case and underscores only, no spaces</small>
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="featureDescriptionInput">Description</label>
          <textarea className="form-control input-lg" ref="description" rows="3" id="featureDescriptionInput" value={feature.description || ""} onChange={this.handleChange}></textarea>
          <small>A word or two on what the feature does so it can be easily identified if there are many active feature toggles on the page</small>
        </div>
        <div className="form-group">
          <label htmlFor="featureMasterSwitchStateInput">Master Switch</label>
          <select id="featureMasterSwitchStateInput" value={feature.master_switch_state || "on"} className="form-control" ref="master_switch_state" onChange={this.handleChange}>
            <option value="dynamic">Dynamic</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>
        <div>
          <strong>TODO: FEATURE DEFINITION AWESOMENESS GETS BUILT HERE!</strong>
        </div>
        <button type="submit" className="btn btn-default btn-lg new-feature__submit" onClick={this.handleSaveFeature}>{this.submitButtonTitle()}</button>
      </form>
    );
  }
});

module.exports = FeatureForm;
