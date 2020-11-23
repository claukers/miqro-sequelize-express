'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "bla25" from table "posts"
 * addColumn "bla26" to table "posts"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2020-08-18T19:27:03.442Z",
    "comment": ""
};

var migrationCommands = [ 
{ fn: "removeColumn", params: ["posts", "bla25"] }, 
{ fn: "addColumn", params: [
    "posts",
    "bla26",
    { "type": Sequelize.STRING, "field":"bla26", "allowNull":true }
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
