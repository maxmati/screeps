var util = require("util");
var roles = require("roles");

module.exports = function() {
    var spawns = util.idleSpawns();
    var currentSpawn = 0;

    for (var role in roles) {
        var delta = roles[role].amount() - util.countCreeps(role);

        if (delta < 1) continue;

        for (var i = 0; i < delta; i++) {
            if (currentSpawn < spawns.length) {
                var newName = spawns[currentSpawn++].createCreep(roles[role].body(), undefined, roles[role].init);
            } else break;
        }

        if(currentSpawn >= spawns.length) break
    }

    for (var creepName in Game.creeps) {
        var creep = Game.creeps[creepName];

        if(!creep.memory) continue

        if (creep.memory.role) {
            roles[creep.memory.role].action(creep);
        } else console.log("Creep " + creepName + " is not assigned to any role!");

        if(creep.memory.ticksToLivenumber <= 1)
          creep.memory = null;
    }
};
