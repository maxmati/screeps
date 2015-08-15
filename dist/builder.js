var util = require("util");

module.exports = {
  amount: function () {
    if(Memory.stage >= 6) return 4;
    if(Memory.stage >= 5) return 1;
    if(Memory.stage >= 4) return 4;
    return 0;
  },
  body: function () {
    if(Memory.stage >= 7) return [MOVE, CARRY, WORK, CARRY, MOVE, WORK, CARRY, CARRY, MOVE, WORK, CARRY, MOVE, MOVE];
    if(Memory.stage >= 5) return [MOVE, CARRY, WORK, CARRY, MOVE, WORK, CARRY, CARRY, MOVE];
    return [MOVE, CARRY, WORK, CARRY, MOVE];
  },
  action: function (creep) {

    if(creep.memory.state == "get"){
      var spawn = util.spawnWithEnergy(creep.carryCapacity);
      if(spawn){
        creep.moveByHeart(spawn);
        spawn.transferEnergy(creep);
      }
      if(creep.carry.energy >= creep.carryCapacity){
        creep.memory.state = "build";
        creep.memory.path = null;
      }
    } else if(creep.memory.state == "build") {

      var target = Game.getObjectById(creep.memory.workingAt);
      if(!target){
        creep.memory.path = null;
        var target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
        if(target)
          creep.memory.workingAt = target.id;
      }

      if(target) {

        creep.moveByHeart(target);

        creep.build(target)
      }else {
        util.flag(creep);
      }

      if(creep.carry.energy == 0){
        creep.memory.state = "get";
        creep.memory.path = null;
      }
    }
  },
  init: {
    role: "builder",
    state: "get"
  }
}
