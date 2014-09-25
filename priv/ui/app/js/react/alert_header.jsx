var React = require("react");

var AlertHeader = React.createClass({
  propTypes: {
    xhrResponse: React.PropTypes.object
  },
  getDefaultProps: function() {
    return {
      xhrResponse: {}
    }
  },
  render: function () {
    if (!Object.keys(this.props.xhrResponse).length) {
      return null;
    }
    var responseMessage = this.props.xhrResponse.status + ' ' + this.props.xhrResponse.statusText;
    return(
          <div className="navbar-fixed-top">
            <div className="alert alert-danger text-center" role="alert">
              Ajax Error: {responseMessage}
            </div>
          </div>
        )
  }
});

module.exports = AlertHeader;


