/** @jsx React.DOM */
var FeatureBox = React.createClass({

  getInitialState: function() {
    return {data: []};
  },

  fetchFeatures: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(status, err);
      }
    });
  },

  componentWillMount: function() {
    this.fetchFeatures();
    setInterval(this.fetchFeatures, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="featureBox row">
        <h2>Features</h2>
        <FeatureList data={this.state.data} onEdit={this.onEdit} />
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
    var self = this;
    var featureNodes = this.props.data.map(function (feature, index) {
      return (
        <Feature key={index} feature={feature}/>
      )
    });
    return (
      <div className="featureList">{featureNodes}</div>
    );
  }
});

var Feature = React.createClass({
  handleEdit: function() {
    this.props.onEdit(this.props.feature);
    return false;
  },

  render: function() {
    var feature = this.props.feature;
    var switch_state = null;
    switch(feature.master_switch_state) {
      case true:
        switch_state = "Override on";
        break;
      case false:
        switch_state = "Override off";
        break;
      case null:
        switch_state = "Dynamic";
        break;
    }

    return(
      <div className="feature panel">
        <div className="row">
          <div className="featureTitle columns"><h3>{feature.title}</h3></div>
        </div>
        <div className="row">
          <div className="featureDescription small-9 columns">{feature.description}</div>
          <div className="featureMasterSwitchState small-1 columns"> {switch_state}</div>
          <div className="editFeature small-1 columns"><a href="#" onClick={this.handleEdit}>edit</a></div>
          <div className="deleteFeature small-1 columns">delete</div>
        </div>
        <FeatureForm feature={this.props.feature} />
      </div>
    )
  }
});

var FeatureForm = React.createClass({
  getInitialState: function() {
    var initialFeature = this.props.feature || {}
    var newFeature = $.extend({}, initialFeature);
    return({feature: newFeature})
  },

  handleChange: function() {
    console.log(this);
  },

  render: function() {
    return (
      <div id="featureEditModal">
        <form className="featureEditForm" ref="form">
          <div className="row">
            <div className="small-12 columns">
              <label>
                Feature title
                <input type="text" placeholder="feature_name" ref="title" value={this.state.feature.title} onChange={this.handleChange}/>
              </label>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

React.renderComponent(
  <FeatureBox url="/admin/api/features" pollInterval={2000}/>,
  document.getElementById('container')
);

