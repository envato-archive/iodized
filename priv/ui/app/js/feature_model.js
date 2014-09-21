var FeatureModel = function(attrs){
  this.id                  = (attrs && attrs.id) || null;
  this.title               = (attrs && attrs.title) || null;
  this.description         = (attrs && attrs.description) || null;
  this.master_switch_state = (attrs && attrs.master_switch_state) || null;
  this.definition          = (attrs && attrs.definition) || null;
};

FeatureModel.prototype.toggle = function(toggleState) {
  if (toggleState) {
    this.master_switch_state = this.definition === null ? "on" : "dynamic";
  } else {
    this.master_switch_state = "off";
  }
}

FeatureModel.prototype.isNew = function() {
  return this.id === null;
}

module.exports = FeatureModel;
