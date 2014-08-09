var React = require("react");
var jquery = require("jquery");

var Feature = React.createClass({
  getInitialState: function() {
    var editingFeature = jquery.extend({}, this.props.feature);
    return {editingFeature: editingFeature, expanded: false};
  },

  switchState: function (element) {
      if (element === 'checkbox') {
          switch (this.state.editingFeature.master_switch_state) {
              case "on":
              case "dynamic":
                  return true;
              case "off":
                  return false;
          }
      }
      else {
          var expanded_class = this.state.expanded ? "is-expanded" : "is-collapsed";
          switch (this.state.editingFeature.master_switch_state) {
              case "on":
              case "dynamic":
                  return 'feature--on ' + expanded_class;
              case "off":
                  return 'feature--off ' + expanded_class;
          }
      }
  },

  handleEdit: function(){
    this.setState({expanded: !this.state.expanded})
    return false;
  },

  handleToggle: function(e){
    var feature = this.state.editingFeature;
    if (e.target.checked) {
      feature.master_switch_state = feature.definition == null ? "on" : "dynamic";
    } else {
      feature.master_switch_state = "off";
    }
    this.setState({editingFeature: feature, exanded: false});
    this.props.updateFeature(this.state.editingFeature);
    return false;
  },

  handleUpdate: function () {
    this.props.updateFeature(this.state.editingFeature);
    this.handleEdit();
    return false;
  },

  handleDelete: function(){
    this.props.deleteFeature(this.state.editingFeature);
    false;
  },

  handleChange: function() {
    var feature = this.state.editingFeature;
    feature.title = this.refs.title.getDOMNode().value;
    feature.description = this.refs.description.getDOMNode().value;
    feature.master_switch_state = this.refs.master_switch_state.getDOMNode().value;
    feature.definition = null;
    this.setState({editingFeature: feature});
    return true;
  },

  render: function() {
    var feature = this.state.editingFeature;
    return(
      <div className={this.switchState('feature')}>
          <div className="feature__view">
              <a href="#" onClick={this.handleEdit} className="feature__view-edit-button"><span className="glyphicon glyphicon-pencil"></span></a>
              <div className="feature__view-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
              </div>
              <div className="feature__switch">
                  <input type="checkbox" checked={this.switchState('checkbox')} className="js-switch" onChange={this.handleToggle}/>
              </div>
          </div>
          <div className="feature__edit">
              <form ref="form" role="form">
                  <div className="form-group">
                      <label className="control-label" htmlFor="featureTitleInput">Feature Name*</label>
                      <input type="text" className="form-control input-lg" ref="title" id="featureTitleInput" value={feature.title} onChange={this.handleChange}/>
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
                  <button className="btn btn-delete" onClick={this.handleDelete} type="submit">Delete Feature</button>
                  <button className="btn btn-default btn-lg pull-right" onClick={this.handleUpdate} type="submit">Update Feature</button>
              </form>
          </div>
      </div>
    )
  }
});

module.exports = Feature;
