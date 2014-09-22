var React = require("react/addons");
var Definition = require("./settings/definition.jsx");

var FeatureSettings = React.createClass({

  getInitialState: function() {
    return {definitions: []};
  },

  handleAddNewBtn: function (event) {
    var defs = this.state.definitions;
    this.setState({definitions: defs.concat([defs.length + 1])});
  },

  handleClearAllBtn: function (event) {
    this.setState({definitions: []});
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
              <button type="button" className="btn btn-default" onClick={this.handleAddNewBtn}>Add New</button>
              <button type="button" className="btn btn-default" onClick={this.handleClearAllBtn}>Clear All</button>
            </div>
          </div>
        </li>
        
        {this.state.definitions.map(function(i) {
          return (
            <Definition id={i}/>
          );
        }, this)}

      </ul>
    );
  }
});

module.exports = FeatureSettings;
