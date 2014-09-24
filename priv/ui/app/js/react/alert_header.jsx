var React = require("react");

var AlertHeader = React.createClass({
  propTypes: {
    xhrResponse: React.PropTypes.object,
    visible: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      xhrResponse: {},
      visible: 'hide'
    }
  },
  render: function () {
    var responseMessage = this.props.xhrResponse.status + ' ' + this.props.xhrResponse.statusText;
    return(
        <div className={this.props.visible}>
          <div className="navbar-fixed-top">
            <div className="alert alert-danger text-center" role="alert">
              Ajax Error: {responseMessage}
            </div>
          </div>
        </div>
        )
  }
});

module.exports = AlertHeader;


