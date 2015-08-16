var util = require("util");
function findTarget(creep) {
  var target = util.getClosestRepair(creep);
  if(target)
    return target;

  target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
  if(target)
    return target;

  return null;
}
module.exports = {
  amount: function () {
    if(Memory.stage >= 8) return 3;
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
      var spawn = util.spawnWithEnergy(creep.carryCapacity/4);
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
        var target = findTarget(creep);
        if(target)
          creep.memory.workingAt = target.id;
      }

      if(target) {

        creep.moveByHeart(target);

        if(creep.repair(target) === ERR_INVALID_TARGET)
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
