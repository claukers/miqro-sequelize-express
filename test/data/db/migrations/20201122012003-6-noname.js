'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "amount" to table "posts"
 *
 **/

var info = {
    "revision": 6,
    "name": "noname",
    "created": "2020-11-22T04:20:03.983Z",
    "comment": ""
};

var migrationCommands = [ 
{ fn: "addColumn", params: [
    "posts",
    "amount",
    { "type": Sequelize.INTEGER, "field":"amount" }
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
