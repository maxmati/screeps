require("superCreeps");

var population = require("population");
population();

if(!Memory.stage)
  Memory.stage = 1;
// console.log(Game.getUsedCpu());

for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}
