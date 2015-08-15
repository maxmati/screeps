var util = require("util");

module.exports = {
  amount: function () {
    if(Memory.stage >= 7) return 6;
    if(Memory.stage >= 5) return 8;
    if(Memory.stage >= 4) return 6;
    if(Memory.stage >= 3) return 4;
    return 0;
  },
  body: function () {
    if(Memory.stage >= 7) return [MOVE, CARRY, WORK, WORK, CARRY, WORK, MOVE, WORK, WORK];
    if(Memory.stage >= 5) return [MOVE, CARRY, WORK, WORK, CARRY, WORK, MOVE];
    return [MOVE, CARRY, WORK, WORK];
  },
  action: function (creep) {
    if(creep.memory.state == "get"){
      var spawn = util.spawnWithEnergy(creep.carryCapacity);
      if(spawn){
        creep.moveByHeart(spawn)

        spawn.transferEnergy(creep);
      } else {
        creep.continueMove();
      }
      if(creep.carry.energy >= creep.carryCapacity){
        creep.memory.state = "upgrade";
      }
    }

    if(creep.memory.state == "upgrade"){
      var target = creep.room.controller;

      creep.moveByHeart(target);

      creep.upgradeController(target)

      if(creep.carry.energy == 0){
        creep.memory.state = "get";
      }
    }

  },
  init: {
    role: "controller",
    state: "get"
  }
}
