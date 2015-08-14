var util = require("util");

module.exports = {
  miner: {
    amount: 6,
    body: [MOVE, WORK, WORK],
    action: function (creep) {
      var source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
      if (source) {
          creep.moveTo(source);
          creep.harvest(source);
      }
    },
    init: {
      role: "miner"
    }
  },
  carrier: {
    amount: 3,
    body: [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE],
    // body: [MOVE, CARRY],
    action: function(creep) {

      if(creep.memory.state == "grab") {
        var energy = creep.room.find(FIND_DROPPED_ENERGY)[0];
        if(energy){
          creep.moveTo(energy);
          creep.pickup(energy);
        }

        if(creep.carry.energy >= creep.carryCapacity)
          creep.memory.state = "put";
      } else if (creep.memory.state == "put") {
        var spawn = util.notFullSpawn();
        if(spawn){
          creep.moveTo(spawn);
          creep.transferEnergy(spawn)
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
  },
  builder: require('builder')
}
