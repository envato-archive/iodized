/** @jsx React.DOM */

var FeatureBox = React.createClass({

  getInitialState: function() {
    return {features: []};
  },

  componentWillMount: function() {
    this.props.featureRepo.fetchFeatures(function(featureData){
      this.setState({features: featureData});
    }.bind(this));
  },

  handleNewFeature: function() {
    var newFeature = {};
    this.editFeature(newFeature);
    return false;
  },

  editFeature: function(feature) {
    this.refs.featureEditModal.show(feature);
  },

  saveFeature: function(feature) {
    console.log("saving", feature);
  },

  render: function() {
    return (
      <div className="featureBox">
        <h2>Features</h2>
        <button type="button" className="btn btn-primary" onClick={this.handleNewFeature}>New Feature</button>
        <FeatureForm ref="featureEditModal" saveFeature={this.saveFeature}/>
        <FeatureList features={this.state.features} editFeature={this.editFeature} />
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
    var self = this;
    var featureNodes = this.props.features.map(function (feature, index) {
      return (
        <Feature key={index} feature={feature} editFeature={this.props.editFeature}/>
      )
    }.bind(this));
    return (
      <div className="featureList">{featureNodes}</div>
    );
  }
});

var Feature = React.createClass({
  switchState: function(){
    switch(this.props.feature.master_switch_state) {
      case true:
        return "Override on";
      case false:
        return "Override off";
      case null:
        return "Dynamic";
    }
  },

  handleEdit: function(){
    this.props.editFeature(this.props.feature);
    false;
  },

  render: function() {
    var feature = this.props.feature;

    return(
      <div className="feature panel panel-primary">
        <div className="featureTitle panel-heading">
          <h3 className="panel-title">{feature.title}</h3>
        </div>
        <div className="panel-body row">
          <div className="featureDescription col-md-9"> {feature.description} </div>
          <div className="featureMasterSwitchState col-md-1"> {this.switchState()}</div>
          <div className="editFeature col-md-1"> <a href="#" onClick={this.handleEdit}>edit</a></div> <div className="deleteFeature col-md-1">delete</div>
        </div>
      </div>
    )
  }
});

var FeatureForm = React.createClass({
  getInitialState: function() {
    return {editingFeature: {}}
  },

  componentDidMount: function() {
    var self = this;
    var domNode = $(this.getDOMNode());
    domNode.on("hidden.bs.modal", function (e) {
      this.setState({editingFeature: {}});
    }.bind(this));
  },

  show: function(feature) {
    var editingFeature = $.extend({}, feature);
    this.setState({editingFeature: editingFeature})
    $(this.getDOMNode()).modal({keyboard: true});
  },

  handleChange: function(attribute, e) {
    var feature = this.state.editingFeature;
    feature[attribute] = e.target.value
    this.setState({editingFeature: feature});
  },

  modalTitle: function() {
    if (this.state.editingFeature === {}) {
      return "Add Feature";
    } else {
      return "Edit Feature";
    }
  },

  handleSaveFeature: function() {
    this.props.saveFeature(this.state.editingFeature);
    false;
  },

  render: function() {
    return (
      <div className="featureEdit modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{this.modalTitle()}</h3>
            </div>
            <div className="modal-body">
              <form className="featureEditForm" ref="form" role="form">
                <div className="form-group">
                  <label> Feature title</label>
                  <input id="featureTitleInput" className="form-control" type="text" ref="title" value={this.state.editingFeature.title} onChange={this.handleChange.bind(this, "title")}/>
                </div>
                <div className="form-group">
                  <label for="featureDescriptionInput"> Feature title</label>
                  <textarea id="featureDescriptionInput" className="form-control" type="text" ref="description" value={this.state.editingFeature.description} onChange={this.handleChange.bind(this, "description")}/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.handleSaveFeature}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var FeatureRepo = function(url){
  this.url = url;
};

FeatureRepo.prototype.fetchFeatures = function(onSuccess, onError){
  $.ajax({
    url: this.url,
    dataType: 'json',
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  });
};

FeatureRepo.prototype.saveFeature = function(feature, onSuccess, onError){
}

var featureRepo = new FeatureRepo("/admin/api/features");
React.renderComponent(
  <FeatureBox featureRepo={featureRepo}/>,
  document.getElementById("iodized")
);

