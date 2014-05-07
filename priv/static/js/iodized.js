/** @jsx React.DOM */
var FeatureBox = React.createClass({

  getInitialState: function() {
    return {data: [ {
      "title": "enable_foo",
      "description": "I like to foo",
      "master_switch_state": null
    },
    {
      "title": "activate_bar",
      "description": "DEPLOY THE BAR!",
      "master_switch_state": true
    }]};
  },

  render: function() {
    return (
      <div className="featureBox">
        <h2>Features</h2>
        <FeatureList data={this.state.data} />
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
    var featureNodes = this.props.data.map(function (feature, index) {
      return <Feature key={index} title={feature.title} description={feature.description} master_switch_state={feature.master_switch_state}/>
    });
    return (
      <div className="featureList">{featureNodes}</div>
    );
  }
});

var Feature = React.createClass({
  render: function() {
    var switch_state = null;
    switch(this.props.master_switch_state) {
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
      <div className="feature">
        <h3 className="featureTitle">{this.props.title}</h3>
        <div class="featureDescription">{this.props.description}</div>
        <div class="featureMasterSwitchState">{switch_state}</div>
      </div>
    )
  }
});

React.renderComponent(
  <FeatureBox />,
  document.getElementById('container')
);

