var util = require("util");

module.exports = {
  amount: 3,
  body: [MOVE, CARRY, WORK, CARRY, MOVE],
  action: function (creep) {

    if(creep.memory.state == "get"){
      var spawn = util.spawnWithEnergy(creep.carryCapacity);
      if(spawn){
        if(!creep.memory.path)
          creep.memory.path = creep.pos.findPathTo(spawn);
        creep.moveByPath(creep.memory.path);

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
        if(!creep.memory.path)
          creep.memory.path = creep.pos.findPathTo(target);
        creep.moveByPath(creep.memory.path);

        creep.build(target)
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
