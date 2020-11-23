'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "bla27" from table "posts"
 * addColumn "bla28" to table "posts"
 *
 **/

var info = {
    "revision": 4,
    "name": "noname",
    "created": "2020-08-18T19:27:15.147Z",
    "comment": ""
};

var migrationCommands = [ 
{ fn: "removeColumn", params: ["posts", "bla27"] }, 
{ fn: "addColumn", params: [
    "posts",
    "bla28",
    { "type": Sequelize.STRING, "field":"bla28", "allowNull":true }
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
