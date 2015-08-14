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
   idleSpawns: function() {
       var spawns = _.filter(Game.spawns, function(spawn) {
           return !spawn.spawning;
       });

       return spawns
   },
   notFullSpawn: function (room) {
     var extensions = room.find(FIND_MY_STRUCTURES,	{filter: function (struct) {
       return struct.structureType === STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity;
     }});
     if(extensions.length) return extensions[0];

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
