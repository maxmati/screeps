var util = require("util");

module.exports = {
  amount: function () {
    if(Memory.stage >= 7) return 4;
    if(Memory.stage >= 3) return 8;
    if(Memory.stage >= 2) return 2;
    if(Memory.stage >= 1) return 1;
  },
  body: function () {
    if(Memory.stage >= 7) return [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE];
    if(Memory.stage >= 5) return [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE];
    if(Memory.stage >= 2) return [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE];
    if(Memory.stage >= 1) return [MOVE, CARRY, CARRY];
  },
  action: function(creep) {

    if(creep.memory.state == "grab") {
      if(!creep.memory.workingAt){
        creep.memory.workingAt = util.getLeastOccupiedSource("carrier", creep.room);
      }
      var source = Game.getObjectById(creep.memory.workingAt);
      var energy = source.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0]

      if(energy){
        creep.moveByHeart(energy);
        creep.pickup(energy);
      }

      if(creep.carry.energy >= creep.carryCapacity)
        creep.memory.state = "put";
    } else if (creep.memory.state == "put") {
      var target = Game.getObjectById(creep.memory.currentSpawn);

      if(target && target.energy >= target.energyCapacity){
        target = null;
        creep.memory.currentSpawn = null;
      }

      if(!target){
        target = util.notFullSpawn(creep);
        if(target)
          creep.memory.currentSpawn = target.id;
      }

      var spawn = target;
      // var spawn = util.notFullSpawn(creep.room);
      if(spawn){
        creep.moveByHeart(spawn);
        creep.transferEnergy(spawn)
      }else if(creep.carry.energy < creep.carryCapacity/4) {
        creep.memory.state = "grab";
      }else {
        util.flag(creep);
      }
      if(creep.carry.energy == 0)
        creep.memory.state = "grab";
    }else
      console.log("Creep in unknown state: " + creep);

  },
  init: {
    role: "carrier",
    state: "grab"
  }
}
