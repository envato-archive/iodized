/** @jsx React.DOM */
var FeatureBox = React.createClass({

  getInitialState: function() {
    return {data: [], selectedFeature: null};
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

  onEdit: function(feature) {
    var newState = $.extend({}, this.state, {selectedFeature: feature});
    this.setState(newState);
  },

  onStopEdit: function() {
    var newState = $.extend({}, this.state, {selectedFeature: null});
    this.setState(newState);
  },

  render: function() {

    return (
      <div className="featureBox row">
        <h2>Features</h2>
        <FeatureList data={this.state.data} onEdit={this.onEdit} />
        <FeatureForm feature={this.state.selectedFeature} onStopEdit={this.onStopEdit}/>
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
    var self = this;
    var featureNodes = this.props.data.map(function (feature, index) {
      return <Feature key={index} feature={feature} onEdit={self.props.onEdit}/>
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
      </div>
    )
  }
});

var FeatureForm = React.createClass({
  componentDidMount: function() {
    self = this;
    $("#featureEditModal").
      foundation("reveal");

    $(document).
      on("closed", "[data-reveal]", function() {
        self.props.onStopEdit();
      });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.feature) {
      $("#featureEditModal").foundation("reveal", "open");
    } else {
      $("#featureEditModal").foundation("reveal", "close");
    }
  },

  render: function() {
    var feature = {};
    if (this.props.feature) {
      feature = this.props.feature;
    }
    return (
      <div id="featureEditModal" className="reveal-modal" data-reveal="true">
        <h2>{feature.title}</h2>
      </div>
    );
  }
});

React.renderComponent(
  <FeatureBox url="/admin/api/features" pollInterval={2000}/>,
  document.getElementById('container')
);

