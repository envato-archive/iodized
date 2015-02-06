var React = require("react");
var FeatureForm = require("./form.jsx");
var FeatureToggle = require("./feature_toggle.jsx");

var Feature = React.createClass({
  propTypes: {
    feature: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {expanded: false};
  },

  switchState: function (element) {
      if (element === 'checkbox') {
          return this.props.feature.master_state;
      }
      else {
          var expanded_class = this.state.expanded ? "is-expanded" : "is-collapsed";
          if (this.props.feature.master_state) {
              return 'feature--on ' + expanded_class;
          } else {
              return 'feature--off ' + expanded_class;
          }
      }
  },

  toggleCSSClass: function () {
      if (this.props.feature.dynamic_state) {
          return 'feature-toggle--dynamic';
      } else {
          return 'feature-toggle';
      }
  },

  handleEdit: function(){
    this.setState({expanded: !this.state.expanded})
    return false;
  },

  updateFeature: function (feature) {
    this.props.updateFeature(feature);
    this.setState({expanded: false});
  },

  handleDelete: function(feature){
    this.props.deleteFeature(feature);
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
            <FeatureToggle cssClass={this.toggleCSSClass()} checkedState={this.switchState('checkbox')} toggleFeature={this.props.toggleFeature} feature={this.props.feature} />
          </div>
        </div>
        <div className="feature__edit">
          <FeatureForm feature={this.props.feature} deleteFeature={this.handleDelete} saveFeature={this.updateFeature}/>
        </div>
      </div>
    )
  }
});

module.exports = Feature;
