var React = require("react");
var jquery = require("jquery");
var FeatureForm = require("./feature_form.jsx");

var Feature = React.createClass({
  propTypes: {
    feature: React.PropTypes.object.isRequired,
    updateFeature: React.PropTypes.func.isRequired,
    toggleFeature: React.PropTypes.func.isRequired,
    deleteFeature: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {expanded: false};
  },

  switchState: function (element) {
      if (element === 'checkbox') {
          switch (this.props.feature.master_switch_state) {
              case "on":
              case "dynamic":
                  return true;
              case "off":
                  return false;
          }
      }
      else {
          var expanded_class = this.state.expanded ? "is-expanded" : "is-collapsed";
          switch (this.props.feature.master_switch_state) {
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

  updateFeature: function (feature) {
    this.props.updateFeature(feature);
    this.setState({expanded: false});
    return false;
  },

  handleDelete: function(){
    this.props.deleteFeature(this.props.feature);
    this.setState({expanded: false});
    return false;
  },

  render: function() {
    var feature = this.props.feature;
    return(
      <div className={this.switchState('feature')}>
        <div className="feature__view">
          <a href="#" onClick={this.handleEdit} className="feature__view-edit-button"><span className="glyphicon glyphicon-pencil"></span></a>
          <div className="feature__view-content">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
          <div className="feature__switch">
            <FeatureToggle checkedState={this.switchState('checkbox')} toggleFeature={this.props.toggleFeature} feature={this.props.feature} />
          </div>
        </div>
        <div className="feature__edit">
          <FeatureForm feature={this.props.feature} saveFeature={this.updateFeature}/>
          <button className="btn btn-delete" onClick={this.handleDelete} type="submit">Delete Feature</button>
        </div>
      </div>
    )
  }
});

var FeatureToggle = React.createClass({
    handleToggle: function(e){
        this.props.toggleFeature(this.props.feature, e.target.checked);
        return false;
    },
    render: function() {
        return(
            <label className="feature__toggle">
                <input type="checkbox" checked={this.props.checkedState} onChange={this.handleToggle} /><i></i>
            </label>
        )
    }
});

module.exports = Feature;
