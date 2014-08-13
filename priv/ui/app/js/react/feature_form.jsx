var React = require("react/addons");

var FeatureForm = React.createClass({
  getInitialState: function() {
    return {editingFeature: {}};
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("nextProps", nextProps);
    if (!nextProps.dirty) {
      var editingFeature = React.addons.update(nextProps.feature, {});
      this.setState({editingFeature: editingFeature});
    }
  },

  handleChange: function() {
    var feature = this.state.editingFeature;
    feature.title = this.refs.title.getDOMNode().value;
    feature.description = this.refs.description.getDOMNode().value;
    feature.master_switch_state = this.refs.master_switch_state.getDOMNode().value;
    feature.definition = null;
    this.props.markDirty();
    this.setState({editingFeature: feature});
    return false;
  },

  submitButtonTitle: function() {
    if (this.props.isNewFeature) {
      return "Add new feature";
    } else {
      return "Update feature";
    }
  },

  handleSaveFeature: function() {
    this.props.saveFeature(this.state.editingFeature);
    return false;
  },

  render: function() {
    var feature = this.state.editingFeature;
    return (
      <form ref="form" role="form">
        <div className="form-group">
          <label className="control-label" htmlFor="featureTitleInput">Feature Name*</label>
          <input type="text" className="form-control input-lg" ref="title" id="featureTitleInput" value={feature.title} onChange={this.handleChange} />
          <small>Lower case and underscores only, no spaces</small>
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="featureDescriptionInput">Description</label>
          <textarea className="form-control input-lg" ref="description" rows="3" id="featureDescriptionInput" value={feature.description} onChange={this.handleChange}></textarea>
          <small>A word or two on what the feature does so it can be easily identified if there are many active feature toggles on the page</small>
        </div>
        <div className="form-group">
          <label htmlFor="featureMasterSwitchStateInput">Master Switch</label>
          <select id="featureMasterSwitchStateInput" value={feature.master_switch_state} className="form-control" ref="master_switch_state" onChange={this.handleChange}>
            <option value="dynamic">Dynamic</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>
        <button type="submit" className="btn btn-default btn-lg new-feature__submit" onClick={this.handleSaveFeature}>{this.submitButtonTitle()}</button>
      </form>
    );
  }
});

module.exports = FeatureForm;
