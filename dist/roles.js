var util = require("util");

module.exports = {
  miner: {
    amount: function () {
      if(Memory.stage >= 5) return 3;
      if(Memory.stage >= 3) return 6;
      if(Memory.stage >= 2) return 3;
      if(Memory.stage >= 1) return 1;
    },
    body: function () {
      if(Memory.stage >= 5) return [MOVE, WORK, WORK, WORK, WORK, WORK];
      if(Memory.stage >= 2) return [MOVE, WORK, WORK];
      if(Memory.stage >= 1) return [MOVE, WORK];
    },
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
    amount: function () {
      if(Memory.stage >= 5) return 2;
      if(Memory.stage >= 3) return 4;
      if(Memory.stage >= 2) return 2;
      if(Memory.stage >= 1) return 1;
    },
    body: function () {
      if(Memory.stage >= 5) return [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE];
      if(Memory.stage >= 2) return [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE];
      if(Memory.stage >= 1) return [MOVE, CARRY, CARRY];
    },
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
  builder: require('builder'),
  controller: {
    amount: function () {
      if(Memory.stage >= 4) return 8;
      if(Memory.stage >= 3) return 4;
      return 0;
    },
    body: function () {
      if(Memory.stage >= 5) return [MOVE, CARRY, WORK, WORK, CARRY, WORK, MOVE];
      return [MOVE, CARRY, WORK, WORK];
    },
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
          creep.memory.state = "upgrade";
          creep.memory.path = null;
        }
      }

      if(creep.memory.state == "upgrade"){
        var target = creep.room.controller;

        if(!creep.memory.path)
          creep.memory.path = creep.pos.findPathTo(target);
        creep.moveByPath(creep.memory.path);

        creep.upgradeController(target)

        if(creep.carry.energy == 0){
          creep.memory.state = "get";
          creep.memory.path = null;
        }
      }

    },
    init: {
      role: "controller",
      state: "get"
    }
  }
}
