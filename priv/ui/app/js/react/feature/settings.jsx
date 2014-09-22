var React = require("react/addons");

var FeatureSettings = React.createClass({

  handleAddNewBtn: function (event) {
    console.log("add", event);
  },

  handleClearAllBtn: function (event) {
    console.log("clear", event);
  },

  render: function() {
    return (
      <ul className="list-group">
        <li className="list-group-item">
          <div className="form-inline" role="form">
            <label>If </label>
            <div className="form-group">
              <label className="sr-only" htmlFor="">Main Condition</label>
              <select className="form-control">
                <option>all</option>
                <option>any</option>
              </select>
            </div>
            <label> of the following is true:</label>
            <div className="pull-right">
              <button type="button" className="btn btn-default" onClick={this.handleAddNewBtn(this)}>Add New</button>
              <button type="button" className="btn btn-default" onClick={this.handleClearAllBtn(this)}>Clear All</button>
            </div>
          </div>
        </li>
        <li className="list-group-item">
          <div className="form-inline" role="form">
            <div className="form-group">
              <label className="sr-only" htmlFor="">Attributes</label>
              <input type="email" className="form-control" id="" placeholder="Main Attributes" />
            </div>
            <div className="form-group">
              <label className="sr-only" htmlFor="">Condition</label>
              <select className="form-control">
                <option value="includeIn">include in</option>
                <option value="is">is</option>
                <option value="percentage">percentage</option>
              </select>
            </div>
            <div className="form-group">
              <label className="sr-only" htmlFor="">Free text</label>
              <input type="email" className="form-control" id="" placeholder="Free Text" size="40" />
            </div>
            <a href="#"><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
            <a href="#"><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
          </div>
        </li>
      </ul>
    );
  }
});

module.exports = FeatureSettings;
