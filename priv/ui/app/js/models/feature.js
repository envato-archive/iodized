var FeatureModel = function(attrs){
  this.id            = (attrs && attrs.id) || null;
  this.title         = (attrs && attrs.title) || null;
  this.description   = (attrs && attrs.description) || null;
  this.master_state  = (attrs && attrs.master_state) || null;
  this.dynamic_state = (attrs && attrs.dynamic_state) || null;
  this.definition    = (attrs && attrs.definition) || null;
};

FeatureModel.prototype.toggle = function(toggleState) {
  if (toggleState) {
    this.master_state = true;
  } else {
    this.master_state = false;
  }
}

FeatureModel.prototype.isNew = function() {
  return this.id === null;
}

module.exports = FeatureModel;
