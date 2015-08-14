Creep.prototype.moveByHeart = function(dst) {
  if(!this.memory.path || this.memory.dst != dst.id){
    this.memory.dst = dst.id;
    this.memory.path = this.pos.findPathTo(dst);
  }
  var error = this.moveByPath(this.memory.path);
  if(error != OK && error != ERR_TIRED)
    this.clearPath();
};

Creep.prototype.clearPath = function(dst) {
  this.memory.path = null;
};

module.exports = {

}
