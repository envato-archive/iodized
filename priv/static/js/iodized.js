/** @jsx React.DOM */
var FeatureBox = React.createClass({

  getInitialState: function() {
    return {data: [], doFetchFeatures: true};
  },

  fetchFeatures: function() {
    if (this.state.doFetchFeatures) {
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
    }
  },

  onStartEditFeature: function() {
    this.setState({doFetchFeatures: false});
  },

  onFinishEditFeature: function() {
    this.setState({doFetchFeatures: true});
  },

  componentWillMount: function() {
    this.fetchFeatures();
    setInterval(this.fetchFeatures, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="featureBox">
        <h2>Features</h2>
        <FeatureList data={this.state.data} onStartEditFeature={this.onStartEditFeature} onFinishEditFeature={this.onFinishEditFeature}/>
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
    var self = this;
    var featureNodes = this.props.data.map(function (feature, index) {
      return (
        <Feature key={index} feature={feature} onStartEditFeature={self.props.onStartEditFeature} onFinishEditFeature={self.props.onFinishEditFeature}/>
      )
    });
    return (
      <div className="featureList">{featureNodes}</div>
    );
  }
});

var Feature = React.createClass({
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
      <div className="feature panel panel-primary">
        <div className="featureTitle panel-heading">
          <h3 className="panel-title">{feature.title}</h3>
        </div>
        <div className="panel-body row">
          <div className="featureDescription col-md-9"> {feature.description} </div>
          <div className="featureMasterSwitchState col-md-1"> {switch_state}</div>
          <div className="editFeature col-md-1"> <a href="#" onClick={this.handleEdit}>edit</a></div> <div className="deleteFeature col-md-1">delete</div>
        </div>
        <FeatureForm ref="featureEditModal" feature={this.props.feature} onStartEditFeature={this.props.onStartEditFeature} onFinishEditFeature={this.props.onFinishEditFeature}/>
      </div>
    )
  },

  handleEdit: function() {
    this.refs.featureEditModal.show();
    return false;
  }
});

var FeatureForm = React.createClass({
  cloneFeature: function() {
    var initialFeature = this.props.feature || {}
    var editingFeature = $.extend({}, initialFeature);
    this.setState({editingFeature: editingFeature})
  },

  getInitialState: function() {
    return {editingFeature: this.props.feature}
  },

  componentDidMount: function() {
    var self = this;
    var domNode = $(this.getDOMNode());
    domNode.on("hidden.bs.modal", function (e) {
      self.props.onFinishEditFeature();
    });
  },

  show: function() {
    this.props.onStartEditFeature();
    this.cloneFeature();
    $(this.getDOMNode()).modal({keyboard: true});
  },

  handleChange: function(e) {
    console.log(e);
  },

  render: function() {
    return (
      <div className="featureEdit modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">edit feature</h3>
            </div>
            <div className="modal-body">
              <form className="featureEditForm" ref="form">
                <div className="row">
                  <div className="small-12 columns">
                    <label>
                      Feature title
                      <input type="text" placeholder="feature_name" ref="title" value={this.state.editingFeature.title} onChange={this.handleChange}/>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <FeatureBox url="/admin/api/features" pollInterval={5000}/>,
  document.getElementById("iodized")
);

