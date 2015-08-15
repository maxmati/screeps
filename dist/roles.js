var util = require("util");

module.exports = {
  miner: {
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
  },
  carrier: {
    amount: function () {
      if(Memory.stage >= 7) return 6;
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
        var energy = creep.room.find(FIND_DROPPED_ENERGY)[0];
        if(energy){
          creep.moveByHeart(energy);
          creep.pickup(energy);
        }

        if(creep.carry.energy >= creep.carryCapacity)
          creep.memory.state = "put";
      } else if (creep.memory.state == "put") {
        var spawn = util.notFullSpawn(creep.room);
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
  },
  builder: require('builder'),
  controller: {
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
  },
  repairer: {
    amount: function () {
      if(Memory.stage >= 7) return 3;
      return 0;
    },
    body: function () {
      if(Memory.stage >= 7) return [MOVE, CARRY, WORK, WORK, CARRY, WORK, MOVE, WORK, MOVE];
      return [];
    },
    action: function (creep) {
      if(creep.memory.state == "get"){
        var spawn = util.spawnWithEnergy(creep.carryCapacity);
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
        if(!target){
          var target = util.getClosestRepair(creep);
          if(target)
            creep.memory.workingAt = target.id;
        }

        if(target) {
          creep.moveByHeart(target);
          creep.build(target)
        }else {
          util.flag(creep);
        }
      }


    },
    init: {
      role: "repairer",
      state: "get"
    }

  }
}
