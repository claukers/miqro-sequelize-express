'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "posts", deps: []
 * createTable "post2s", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2020-08-18T19:26:07.179Z",
    "comment": ""
};

var migrationCommands = [ 
{ fn: "createTable", params: [
    "posts",
     { 
      "id": { "type": Sequelize.INTEGER, "field":"id", "autoIncrement":true, "primaryKey":true, "allowNull":false }, 
      "name": { "type": Sequelize.STRING, "field":"name" }, 
      "email": { "type": Sequelize.STRING, "field":"email" }, 
      "text": { "type": Sequelize.STRING, "field":"text" }, 
      "bla25": { "type": Sequelize.STRING, "field":"bla25", "allowNull":true }, 
      "blo": { "type": Sequelize.STRING, "field":"blo", "allowNull":true }, 
      "createdAt": { "type": Sequelize.DATE, "field":"createdAt", "allowNull":false }, 
      "updatedAt": { "type": Sequelize.DATE, "field":"updatedAt", "allowNull":false }
     },
    {}
] }, 
{ fn: "createTable", params: [
    "post2s",
     { 
      "id": { "type": Sequelize.INTEGER, "field":"id", "autoIncrement":true, "primaryKey":true, "allowNull":false }, 
      "name": { "type": Sequelize.STRING, "field":"name" }, 
      "email": { "type": Sequelize.STRING, "field":"email" }, 
      "text": { "type": Sequelize.STRING, "field":"text" }, 
      "bla7": { "type": Sequelize.STRING, "field":"bla7", "allowNull":true }, 
      "blo": { "type": Sequelize.STRING, "field":"blo", "allowNull":true }, 
      "createdAt": { "type": Sequelize.DATE, "field":"createdAt", "allowNull":false }, 
      "updatedAt": { "type": Sequelize.DATE, "field":"updatedAt", "allowNull":false }
     },
    {}
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
