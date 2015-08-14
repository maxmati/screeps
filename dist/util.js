var _ = require("lodash");

module.exports = {
  creepsByRole: function(role) {
       return _.filter(Game.creeps, function(creep) {
           return creep.memory.role == role;
       });
   },
   countCreeps: function(role) {
       return this.creepsByRole(role).length;
   },
   idleSpawn: function() {
       var spawns = _.filter(Game.spawns, function(spawn) {
           return !spawn.spawning;
       });

       if (!spawns) return null;
       else return spawns[0];
   },
   notFullSpawn: function () {
     var spawns = _.filter(Game.spawns, function (spawn) {
          return spawn.energy < spawn.energyCapacity;
     });

     if (!spawns) return null;
     else return spawns[0];
   },
   spawnWithEnergy: function (energy) {
     var spawns = _.filter(Game.spawns, function (spawn) {
          return spawn.energy >= energy;
     });

     if (!spawns) return null;
     else return spawns[0];
   }
}
