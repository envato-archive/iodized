var React = require("react/addons");
var FeatureSettings = require("./settings.jsx");


var FeatureForm = React.createClass({
  propTypes: {
    deleteButtonVisible: React.PropTypes.bool,
    feature: React.PropTypes.object.isRequired,
    onFeatureEdited: React.PropTypes.func,
    saveFeature: React.PropTypes.func.isRequired,
    deleteFeature: React.PropTypes.func
  },

  getDefaultProps: function(){
    return {
      deleteButtonVisible: true,
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
        master_state: true,
        dynamic_state: this.refs.dynamic_state.getDOMNode().checked,
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
    return false;
  },

  handleDelete: function() {
    this.props.deleteFeature(this.state.editingFeature);
  },

  render: function() {
    var feature = this.state.editingFeature;

    var definition = {
      "operand": "any",
      "definitions": [
      {
        "operand": "all",
        "definitions": [
        {
          "operand": "included_in",
          "param_name": "username",
          "value": [ "madlep", "gstamp" ]
        },
        {
          "operand": "included_in",
          "param_name": "host",
          "value": [ "themeforest.net", "codecanyon.net" ]
        }
        ]
      },
      {
        "operand": "is",
        "param_name": "session_on",
        "value": "true"
      },
      {
        "operand": "included_in",
        "param_name": "role",
        "value": [ "developer" ]
      }
      ]
    };

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
        <div className="form-inline feature-settings__switch pull-right">
          <input type="checkbox" id="featureDynamicStateInput" checked={feature.dynamic_state || false} className="form-control" ref="dynamic_state" onChange={this.handleChange} />
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
