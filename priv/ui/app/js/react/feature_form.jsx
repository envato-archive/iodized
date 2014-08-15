var React = require("react/addons");

var FeatureForm = React.createClass({
  handleChange: function() {
    var feature = React.addons.update(this.props.feature, {
      $merge: {
        title: this.refs.title.getDOMNode().value,
        description: this.refs.description.getDOMNode().value,
        master_switch_state: this.refs.master_switch_state.getDOMNode().value,
        definition: null
      }
    });
    this.props.onFeatureEdited(feature);
    return false;
  },

  submitButtonTitle: function() {
    if (this.props.isNewFeature) {
      return "Add new feature";
    } else {
      return "Update feature";
    }
  },

  render: function() {
    var feature = this.props.feature;
    return (
      <form ref="form" role="form">
        <div className="form-group">
          <label className="control-label" htmlFor="featureTitleInput">Feature Name*</label>
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
        <button type="submit" className="btn btn-default btn-lg new-feature__submit" onClick={this.props.handleSaveFeature}>{this.submitButtonTitle()}</button>
      </form>
    );
  }
});

module.exports = FeatureForm;
