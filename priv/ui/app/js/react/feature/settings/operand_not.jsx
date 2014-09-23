var React = require("react/addons");

var OperandNot = React.createClass({

  getInitialState: function() {
    return { definition: this.props.definition};
  },

  handleRemoveBtn: function (event) {
  },

  render: function() {
    return (
      <li className="list-group-item">
        <div className="form-inline" role="form">
          <div className="form-group feature-settings__condition-pre--field">
            <label className="sr-only" htmlFor="">Attributes</label>
            <input type="textfield" className="form-control" id="" value={this.state.definition.param_name} placeholder="Main Attributes" />
          </div>
          <div className="form-group feature-settings__condition">
            not
          </div>
          <div className="form-group feature-settings__condition-post--field">
            <label className="sr-only" htmlFor="">Free text</label>
            <input type="textfield" className="form-control" id="" value={this.state.definition.value} placeholder="Free Text" size="40" />
          </div>
          <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
        </div>
      </li>
    );
  }
});

module.exports = OperandNot;
