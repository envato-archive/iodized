var React = require("react");

var AlertHeader = React.createClass({
  getInitialState: function() {
    return {visible: false};
  },
  propTypes: {
    message: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      message: ''
    }
  },
  render: function () {
    var visible = this.state.visible ? '' : 'hide';
    return(
        <div className={visible}>
          <div className="navbar-fixed-top">
            <div className="alert alert-danger text-center" role="alert">
              {this.props.message}
            </div>
          </div>
        </div>
        )
  }
});

module.exports = AlertHeader;


