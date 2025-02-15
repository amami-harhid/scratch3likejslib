class Man2
    constructor: (@name, @age) ->
      
    greet: (arg) ->
        alert 'Hello I\'m ' + @name + "!";

module.exports =
    Man2: Man2
