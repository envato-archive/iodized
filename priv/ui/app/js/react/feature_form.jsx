var React = require("react");
var jquery = require("jquery");

var FeatureForm = React.createClass({
  getInitialState: function() {
    return {editingFeature: {}, dirty: false}
  },

  componentDidMount: function() {
    var self = this;
    var domNode = jquery(this.getDOMNode());
    domNode.on("hide.bs.modal", function(e) {
      if (this.state.dirty) {
        return false;
      }
    }.bind(this));
  },

  show: function(feature, onSave) {
    var editingFeature = jquery.extend({}, feature);
    this.setState({editingFeature: editingFeature, onSave: onSave, dirty: true}, function(){
        jquery('.new-feature')
            .toggleClass('is-expanded is-collapsed')
            .find("input:first-of-type").focus();
    }.bind(this));
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

  handleSaveFeature: function() {
    var feature = this.state.editingFeature;
    this.state.onSave(feature);
    this.setState({dirty: false}, function(){
        jquery('.new-feature').toggleClass('is-expanded is-collapsed');
    }.bind(this));
  },

  handleCancel: function() {
    this.setState({dirty: false}, function(){
      jquery('.new-feature').toggleClass('is-expanded is-collapsed');
        return false;
    }.bind(this));
  },

  render: function() {
    var feature = this.state.editingFeature;
    return (
        <div className="new-feature__content">
            <a href="#" onClick={this.handleCancel} className="new-feature__close">
                <span className="glyphicon glyphicon-remove"></span>
            </a>
            <form className="featureEditForm" ref="form" role="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="featureTitleInput">Feature Name*</label>
                    <input type="text" className="form-control input-lg" ref="title" id="featureTitleInput" onChange={this.handleChange} />
                    <small>Lower case and underscores only, no spaces</small>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="featureDescriptionInput">Description</label>
                    <textarea className="form-control input-lg" ref="description" rows="3" id="featureDescriptionInput" onChange={this.handleChange}></textarea>
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
                <button type="submit" className="btn btn-default btn-lg new-feature__submit" onClick={this.handleSaveFeature}>Add feature toggle</button>
            </form>
        </div>
//old:
//      <div className="featureEdit modal fade">
//        <div className="modal-dialog modal-lg">
//          <div className="modal-content">
//            <div className="modal-header">
//              <h3 className="modal-title">Add Feature</h3>
//            </div>
//            <div className="modal-body">
//              <form className="featureEditForm" ref="form" role="form">
//                <div className="form-group">
//                  <label>Feature title</label>
//                  <input id="featureTitleInput" className="form-control" type="text" ref="title" value={feature.title} onChange={this.handleChange}/>
//                </div>
//                <div className="form-group">
//                  <label for="featureDescriptionInput">Feature title</label>
//                  <textarea id="featureDescriptionInput" className="form-control" type="text" ref="description" value={feature.description} onChange={this.handleChange}/>
//                </div>
//                <div className="form-group">
//                  <label for="featureMasterSwitchStateInput">Master Switch</label>
//                  <select id="featureMasterSwitchStateInput" value={feature.master_switch_state} className="form-control" ref="master_switch_state" onChange={this.handleChange}>
//                    <option value="dynamic">Dynamic</option>
//                    <option value="on">On</option>
//                    <option value="off">Off</option>
//                  </select>
//                </div>
//              </form>
//            </div>
//            <div className="modal-footer">
//              <button type="button" className="btn" onClick={this.handleCancel}>Cancel</button>
//              <button type="button" className="btn btn-primary" onClick={this.handleSaveFeature}>Save</button>
//            </div>
//          </div>
//        </div>
//      </div>
    );
  }
});

module.exports = FeatureForm;
