var React = require("react/addons");

var OperandPercentage = React.createClass({

  getInitialState: function() {
    return {};
  },

  handleRemoveBtn: function (event) {
  },

  render: function() {
    return (
      <li className="list-group-item">
        <div className="form-inline" role="form">
          <div className="form-group feature-settings__condition-pre--field">
            <label className="sr-only" htmlFor="">Attributes</label>
            <input type="text" className="form-control" id="" placeholder="Main Attributes" />
          </div>
          <div className="form-group feature-settings__condition">
            percentage
          </div>
          <div className="form-group feature-settings__condition-post--field">
            <label className="sr-only" htmlFor="">Free text</label>
            <input type="text" className="form-control" id="" placeholder="Free Text" size="40" />
          </div>
          <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
        </div>
      </li>
    );
  }
});

module.exports = OperandPercentage;
