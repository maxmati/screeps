var util = require("util");

module.exports = {
  amount: function () {
    if(Memory.stage >= 7) return 2;
    if(Memory.stage >= 3) return 4;
    if(Memory.stage >= 2) return 3;
    if(Memory.stage >= 1) return 1;
  },
  body: function () {
    if(Memory.stage >= 7) return [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
    if(Memory.stage >= 5) return [MOVE, WORK, WORK, WORK, WORK, WORK];
    if(Memory.stage >= 2) return [MOVE, WORK, WORK];
    if(Memory.stage >= 1) return [MOVE, WORK];
  },
  action: function (creep) {
    if(!creep.memory.workingAt){
      creep.memory.workingAt = util.getLeastOccupiedSource("miner", creep.room);
    }
    var source = Game.getObjectById(creep.memory.workingAt);

    if (source) {
        creep.moveByHeart(source);
        creep.harvest(source);
    }
  },
  init: {
    role: "miner"
  }
}
