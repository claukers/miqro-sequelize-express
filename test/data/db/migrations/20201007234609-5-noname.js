'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "deleted" to table "post2s"
 *
 **/

var info = {
    "revision": 5,
    "name": "noname",
    "created": "2020-10-08T02:46:09.646Z",
    "comment": ""
};

var migrationCommands = [ 
{ fn: "addColumn", params: [
    "post2s",
    "deleted",
    { "type": Sequelize.BOOLEAN, "field":"deleted" }
] } 
];


module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
