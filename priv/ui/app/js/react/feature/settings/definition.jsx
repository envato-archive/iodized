var React = require("react/addons");

var Definition = React.createClass({

  getInitialState: function() {
    return {children: []};
  },

  render: function() {
    return (
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
        {this.state.children.map(function(children, i) {
          return (
            <Definition />
          );
        }, this)}
      </li>
    );
  }
});

module.exports = Definition;

