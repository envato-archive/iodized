var React = require("react/addons");

var Definition = React.createClass({

  getInitialState: function() {
    return {children: []};
  },

  handleAddBtn: function (event) {
    console.log("here", this.state.children);
    var children = this.state.children;
    this.setState({children: children.concat([children.length + 1])});
  },

  handleRemoveBtn: function (event) {
    this.setState({children: []});
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
          <a onClick={this.handleRemoveBtn}><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
          <a onClick={this.handleAddBtn}><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
        </div>
        {this.state.children.map(function(i) {
          return (
            <Definition id={i} />
          );
        }, this)}
      </li>
    );
  }
});

module.exports = Definition;

