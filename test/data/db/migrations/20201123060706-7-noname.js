'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "deleted" to table "posts"
 *
 **/

var info = {
    "revision": 7,
    "name": "noname",
    "created": "2020-11-23T09:07:06.953Z",
    "comment": ""
};

var migrationCommands = [ 
{ fn: "addColumn", params: [
    "posts",
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
