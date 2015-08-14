var util = require("util");
var roles = require("roles");

module.exports = function() {

    for (var role in roles) {
        var delta = roles[role].amount - util.countCreeps(role);

        if (delta < 1) continue;

        for (var i = 0; i < delta; i++) {
            var spawn = util.idleSpawn();
            if (spawn) {
                var newName = spawn.createCreep(roles[role].body, undefined, roles[role].init);
                // if (typeof(newName) == "string") roles[role].init(Game.creeps[newName]);
            } else break;
        }
    }

    for (var creepName in Game.creeps) {
        var creep = Game.creeps[creepName];

        if (creep.memory.role) {
            roles[creep.memory.role].action(creep);
        } else console.log("Creep " + creepName + " is not assigned to any role!");
    }
};
