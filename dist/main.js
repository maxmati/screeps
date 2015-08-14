var population = require("population");
population();

if(!Memory.stage)
  Memory.stage = 1;
console.log(Game.getUsedCpu());
