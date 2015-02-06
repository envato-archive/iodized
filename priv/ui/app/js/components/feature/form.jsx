var React = require("react/addons");
var FeatureSettings = require("./settings.jsx");
var FeatureViewActions = require("../../actions/feature_view_actions.js");

var FeatureForm = React.createClass({
  propTypes: {
    feature: React.PropTypes.object.isRequired
  },

  changeHandler: function(fieldName, accessor) {
    return function(e) {
      if (accessor === undefined) {
        accessor = 'value'
      }
      var feature = this.props.feature;
      var value = this.refs[fieldName].getDOMNode()[accessor]
      feature = feature.set(fieldName, value);
      FeatureViewActions.editFeature(feature, false);
    }.bind(this);
  },

  handleSaveFeature: function(e) {
    e.preventDefault();
    FeatureViewActions.saveFeature(this.props.feature);
  },

  submitButtonTitle: function() {
    if (this.props.feature.isNew) {
      return "Add new feature";
    } else {
      return "Update feature";
    }
  },

  render: function() {
    var feature = this.props.feature;

    var definition = {
      "operand": "any",
      "definitions": [
      {
        "operand": "included_in",
        "param_name": "username",
        "value": [ "bob", "alice", "john" ]
      },
      {
        "operand": "percentage",
        "param_name": "ip",
        "value": "10"
      }
      ]
    };

    return (
      <form ref="form" role="form">
        <div className="form-group">
          <label className="control-label" htmlFor="featureTitleInput">Feature Name</label>
          <input type="text" className="form-control input-lg" ref="title" id="featureTitleInput" value={feature.title || ""} onChange={this.changeHandler("title")} />
          <small>Lower case and underscores only, no spaces</small>
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="featureDescriptionInput">Description</label>
          <textarea className="form-control input-lg" ref="description" rows="3" id="featureDescriptionInput" value={feature.description || ""} onChange={this.changeHandler("description")}></textarea>
          <small>A word or two on what the feature does so it can be easily identified if there are many active feature toggles on the page</small>
        </div>
        <div className="form-inline feature-settings__switch pull-right">
          <input type="checkbox" id="featureDynamicStateInput" checked={feature.dynamic_state} className="form-control" ref="dynamic_state" onChange={this.changeHandler("dynamic_state", "checked")} />
          <label htmlFor="featureDynamicStateInput">Dynamic On/Off</label>
        </div>
        <div className="feature-settings">
          <label className="control-label">Feature Settings</label>
          <FeatureSettings definition={definition} />
        </div>

        <button type="submit" className="btn btn-default btn-lg pull-left new-feature__submit" onClick={this.handleSaveFeature}>{this.submitButtonTitle()}</button>
        <div className={!this.props.deleteButtonVisible ? 'hide' : 'pull-right'}>
          <button className="btn btn-delete" onClick={this.handleDelete} type="submit">Delete Feature</button>
        </div>
      </form>
    );
  }
});

module.exports = FeatureForm;
