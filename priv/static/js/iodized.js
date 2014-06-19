/** @jsx React.DOM */

var FeatureBox = React.createClass({

  getInitialState: function() {
    return {features: []};
  },

  componentWillMount: function() {
    this.refresh();
  },

  refresh: function() {
    this.props.featureRepo.fetchFeatures(function(featureData){
      this.setState({features: featureData});
    }.bind(this));
  },

  handleNewFeature: function() {
    this.newFeature();
    return false;
  },

  newFeature: function() {
    var emptyFeature = {
      title: "",
      description: "",
      master_switch_state: "dynamic"
    }
    this.refs.featureEditModal.show(emptyFeature, this.createFeature);
  },

  createFeature: function(feature) {
    this.props.featureRepo.createFeature(feature, this.refresh);
  },

  editFeature: function(feature) {
    this.refs.featureEditModal.show(feature, this.updateFeature);
  },

  deleteFeature: function(feature) {
    if(confirm("really delete " + feature.title + "?")) {
      this.props.featureRepo.deleteFeature(feature, this.refresh);
    }
  },

  updateFeature: function(feature) {
    this.props.featureRepo.updateFeature(feature, this.refresh);
  },

  render: function() {
    return (
      <div className="featureBox">
        <h2>Features</h2>
        <div className="panel">
          <button type="button" className="btn btn-primary" onClick={this.handleNewFeature}>New Feature</button>
        </div>
        <FeatureList features={this.state.features} editFeature={this.editFeature} deleteFeature={this.deleteFeature}/>

        <FeatureForm ref="featureEditModal"/>
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
    var self = this;
    var featureNodes = this.props.features.map(function (feature, index) {
      return (
        <Feature key={index} feature={feature} editFeature={this.props.editFeature} deleteFeature={this.props.deleteFeature}/>
      )
    }.bind(this));
    return (
      <div className="featureList">{featureNodes}</div>
    );
  }
});

var Feature = React.createClass({
  switchState: function (element) {
      if (element === 'checkbox') {
          switch (this.props.feature.master_switch_state) {
              case "on":
              case "dynamic":
                  return 'yes'
          }
      }
      else {
          switch (this.props.feature.master_switch_state) {
              case "on":
              case "dynamic":
                  return 'feature--on is-collapsed'
              case "off":
                  return 'feature--off is-collapsed'
          }
      }
  },

  handleEdit: function(){
    this.props.editFeature(this.props.feature);
    false;
  },

  handleDelete: function(){
    this.props.deleteFeature(this.props.feature);
    false;
  },

  render: function() {
    var feature = this.props.feature;

    /* old:
     <div className="feature panel panel-primary">
     <div className="featureTitle panel-heading">
     <h3 className="panel-title">{feature.title}</h3>
     </div>
     <div className="panel-body row">
     <div className="featureDescription col-md-9"> {feature.description} </div>
     <div className="featureMasterSwitchState col-md-1"> {this.switchState()}</div>
     <div className="editFeature col-md-1"><button className="btn" onClick={this.handleEdit}>edit</button></div>
     <div className="deleteFeature col-md-1"><button className="btn btn-danger" onClick={this.handleDelete}>delete</button></div>
     </div>
     </div>
       */

    return(
      <div className={this.switchState('feature')}>
          <div className="feature__view">
              <a href="#" className="feature__view-edit-button"><span className="glyphicon glyphicon-pencil"></span></a>
              <div className="feature__view-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
              </div>
              <div className="feature__switch">
                  <input type="checkbox" defaultChecked={this.switchState('checkbox')} className="js-switch" />
              </div>
          </div>
          <div className="feature__edit">
            [edit options here]
          </div>
      </div>
    )
  }
});

var FeatureForm = React.createClass({
  getInitialState: function() {
    return {editingFeature: {}, dirty: false}
  },

  componentDidMount: function() {
    var self = this;
    var domNode = $(this.getDOMNode());
    domNode.on("hide.bs.modal", function(e) {
      if (this.state.dirty) {
        return false;
      }
    }.bind(this));
  },

  show: function(feature, onSave) {
    var editingFeature = $.extend({}, feature);
    this.setState({editingFeature: editingFeature, onSave: onSave, dirty: true}, function(){
      $(this.getDOMNode()).modal({keyboard: false});
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

  modalTitle: function() {
    if (this.state.editingFeature === {}) {
      return "Add Feature";
    } else {
      return "Edit Feature";
    }
  },

  handleSaveFeature: function() {
    var feature = this.state.editingFeature;
    this.state.onSave(feature);
    this.setState({dirty: false}, function(){
      $(this.getDOMNode()).modal('hide');
    }.bind(this));
  },

  handleCancel: function() {
    this.setState({dirty: false}, function(){
      $(this.getDOMNode()).modal('hide');
    }.bind(this));
  },

  render: function() {
    var feature = this.state.editingFeature;
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
                  <label>Feature title</label>
                  <input id="featureTitleInput" className="form-control" type="text" ref="title" value={feature.title} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <label for="featureDescriptionInput">Feature title</label>
                  <textarea id="featureDescriptionInput" className="form-control" type="text" ref="description" value={feature.description} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <label for="featureMasterSwitchStateInput">Master Switch</label>
                  <select id="featureMasterSwitchStateInput" value={feature.master_switch_state} className="form-control" ref="master_switch_state" onChange={this.handleChange}>
                    <option value="dynamic">Dynamic</option>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={this.handleCancel}>Cancel</button>
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

FeatureRepo.prototype.createFeature = function(feature, onSuccess, onError){
  $.ajax({
    url: this.url,
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(feature),
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  });
}

FeatureRepo.prototype.updateFeature = function(feature, onSuccess, onError){
  $.ajax({
    url: this.url + "/" + feature.id,
    contentType: 'application/json',
    type: 'PUT',
    data: JSON.stringify(feature),
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  });
}

FeatureRepo.prototype.deleteFeature = function(feature, onSuccess, onError){
  $.ajax({
    url: this.url + "/" + feature.id,
    type: 'DELETE',
    success: onSuccess,
    error: onError || function(xhr, status, err) {
      console.log(status, err);
    }
  })
}

var featureRepo = new FeatureRepo("/admin/api/features");
React.renderComponent(
  <FeatureBox featureRepo={featureRepo}/>,
  document.getElementById("iodized")
);

