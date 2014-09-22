var React = require("react/addons");

var FeatureSettings = React.createClass({

  render: function() {
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item">
            <form className="form-inline" role="form">
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
              <button type="button" className="btn btn-default">Add New</button>
              <button type="button" className="btn btn-default">Clear All</button>
              </div>
            </form>
          </li>
          <li className="list-group-item">
            <form className="form-inline" role="form">
              <div className="form-group">
                <label className="sr-only" htmlFor="">Attributes</label>
                <input type="email" className="form-control" id="" placeholder="Main Attributes" />
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="">Condition</label>
                <select className="form-control">
                  <option>IncludeIn</option>
                  <option>Is</option>
                  <option>Percentage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="">Free text</label>
                <input type="email" className="form-control" id="" placeholder="Free Text" size="40" />
              </div>
              <a href="#"><span className="glyphicon glyphicon-minus-sign feature__setting-icon  pull-right"></span></a>
              <a href="#"><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
            </form>
          </li>
          <li className="list-group-item">
            <form className="form-inline" role="form">
              <div className="form-group">
                <label className="sr-only" htmlFor="">Attributes</label>
                <input type="email" className="form-control" id="" placeholder="Attributes" />
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="">Condition</label>
                <select className="form-control" value="percentage">
                  <option value="includeIn">IncludeIn</option>
                  <option value="is">Is</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="">Free text</label>
                <input value="percent" type="number" className="form-control" id="" min="1" max="5" min="0" max="100" size="5" />
                <label>To</label>
                <input value="percent" type="number" className="form-control" id="" min="1" max="5" size="5" />
                <label>%</label>
              </div>
              <a href="#"><span className="glyphicon glyphicon-minus-sign feature__setting-icon pull-right"></span></a>
              <a href="#"><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
            </form>
          </li>
          <li className="list-group-item">
            <form className="form-inline" role="form">
              <div className="form-group">
                <label className="sr-only" htmlFor="">Attributes</label>
                <input type="email" className="form-control" id="" placeholder="Attributes" />
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="">Condition</label>
                <select className="form-control" value="includeIn">
                  <option value="includeIn">IncludeIn</option>
                  <option value="is">Is</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="">Description</label>
                <textarea className="form-control" rows="3" cols="40" id="" placeholder="Include more text"></textarea>
              </div>
              <a href="#"><span className="glyphicon glyphicon-minus-sign feature__setting-icon pull-right"></span></a>
              <a href="#"><span className="glyphicon glyphicon-plus-sign feature__setting-icon pull-right"></span></a>
            </form>
          </li>
          <small>Some description explaining the rules behind the settings and how to make it more effective for this awesome feature toggling.</small>
        </ul>
      </div>
    );
  }
});

module.exports = FeatureSettings;
