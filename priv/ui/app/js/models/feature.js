var Immutable = require("immutable");
var UUID = require("uuid-js");

var Feature = Immutable.Record( {
  id: UUID.create().toString(),
  title: "",
  description: "",
  master_state: false,
  dynamic_state: true,
  definition: null,
  isNew: true
}, "Feature");

Feature.prototype.toggle = function(toggleState) {
  if (toggleState) {
    return this.set("master_state", true);
  } else {
    return this.set("master_state", false);
  }
}

module.exports = Feature;
