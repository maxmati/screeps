var util = require("util");

module.exports = {
  amount: function () {
    if(Memory.stage >= 7) return 3;
    if(Memory.stage >= 7) return 2;
    return 0;
  },
  body: function () {
    if(Memory.stage >= 7) return [MOVE, CARRY, WORK, WORK, CARRY, WORK, MOVE, WORK, MOVE];
    return [];
  },
  action: function (creep) {
    if(creep.memory.state == "get"){
      var spawn = util.spawnWithEnergy(creep.carryCapacity/2);
      if(spawn){
        creep.moveByHeart(spawn);
        spawn.transferEnergy(creep);
      }
      if(creep.carry.energy >= creep.carryCapacity){
        creep.memory.state = "repair";
      }
    }
    if(creep.memory.state === "repair"){
      var target = Game.getObjectById(creep.memory.workingAt);

      if(target && util.structIsFull(target)){
        target = null;
        creep.memory.workingAt = null;
      }
      if(!target){
        var target = util.getClosestRepair(creep);
        if(target)
          creep.memory.workingAt = target.id;
      }


      if(target) {
        creep.moveByHeart(target);
        creep.repair(target)
      }else {
        util.flag(creep);
      }

      if(creep.carry.energy === 0){
        creep.memory.state = "get";
      }

    }


  },
  init: {
    role: "repairer",
    state: "get"
  }

}
