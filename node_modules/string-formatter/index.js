var string = {};
/*
    Replaces the format item in a specified string 
    with the string representation of a corresponding object in a specified array.
*/
string.format = function( /*..*/ ) {
    
    var allArgs = [].slice.call(arguments);
    var format = allArgs[0];
    var result = format.substring(0, format.length);

    if (allArgs.length === 2 && typeof allArgs[1] === 'object') {
        // object pass like two argument
        var obj = allArgs[1];
        for (var prop in obj) {
            if (!obj.hasOwnProperty(prop)) continue;
            result = result.replace('{' + prop + '}', obj[prop]);
        }
    } else {
        // many argsmany separate elements
        var args = allArgs.filter(function(item, i, arr) {
            return i > 0;
        });

        for (var i = 0, len = args.length; i < len; i++) {
            result = result.replace('{' + i + '}', args[i]);
        }        
    }

    return result;
}

module.exports = string;