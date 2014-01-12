/**
 *
 * Created by Borbás Geri on 1/5/14
 * Copyright (c) 2014 eppz! development, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */


function Class() {}
Class.prototype.construct = function() {};
Class.prototype.className = 'Class';
Class.className = 'Class';


/**
 *
 * Creates a class with the given implementations.
 * Add a class method called 'extend'.
 * Add an superclass reference called 'super'.
 *
 * @param implementation An object with all the class implementation.
 * Can define properties, instance methods (function properties),
 * and class methods (function properties prefixed with '_').
 *
 * Identical class implementation will have identical class names.
 *
 */
Class.extend = function(implementation)
{
    /**
     * Get class name (in a relentlessly hacky way).
     * Textual search for the implementation in the code of the calling function,
     * then carefully crawl towards the variable name.
     */

        implementationString = stripAlmostEverything(objectToString(implementation));
        declarationString = stripAlmostEverything(arguments.callee.caller.toString());

        ____ = declarationString.split(implementationString)[0];
        ___ = ____.split('=');
        __ = ___[___.length - 2];
        _ = __.split('var');
        newClassName = _[_.length-1];


    /**
     * Create 'super' proxy object.
     * Wraps methods into a function that calls appropriate implementation always with the caller as 'this'.
     */

        var _super = new Object;
            _super.className = this.className;

        for (var eachMethodName in this.prototype)
        {
            var eachMethod = this.prototype[eachMethodName];
            if (eachMethod instanceof Function == false) continue;

            _super[eachMethodName] = function()
            {
                var methodName = arguments.callee.methodName;
                var superclassInstance = arguments.callee.superclassInstance;
                var callingInstance = this.callingInstance;

                superclassInstance[methodName].apply(callingInstance, arguments);
            }
            _super[eachMethodName].methodName = eachMethodName;
            _super[eachMethodName].superclassInstance = this.prototype;
        }


    /**
     * Create the new class (also in a resolutely hacky way).
     * Constructor name is set for the constructor function at declaration time, so eval() comes handy below.
     *
     * Seems a bit expensive: http://jsperf.com/eppz-class-creation (may turn it off in production).
     */

        var constructorFunction = function()
        {
            // Call construct only if 'new' was called outside this function.
            if(arguments[0] == "skip") return;

            // Equip constants.
            copyPropertiesOfObjectTo(implementation, this);

            // Add awesome getter for 'super'.
            Object.defineProperty(this, 'super', { get : function()
            {
                var super_ = arguments.callee.caller._super; // Get '_super' reference bound to the calling function.
                super_.callingInstance = this; // Bind current instance as caller.
                return super_;
            }});

            this.construct.apply(this, arguments);
        };

        eval('var '+newClassName+' = '+constructorFunction.toString());
        eval('var Class = '+newClassName+';');


    /**
     * Equip methods.
     */

        /**
         * Instance
         */

            // Inherit current instance methods.
            Class.prototype = new this("skip");

            // Equip implemented instance methods (overwrite inherited).
            copyMethodsOfObjectTo(implementation, Class.prototype, _super);

        /**
         * Class
         */

            // Inherit current class methods.
            copyMethodsOfObjectTo(this, Class, _super);

            // Equip implemented class methods (overwirite inherited).
            copyClassMethodsOfObjectTo(implementation, Class, _super);


    /**
     * Class names.
     */

        Class.prototype.superclassName = this.className;
        Class.superclassName = this.className;

        Class.prototype.className = newClassName;
        Class.className = newClassName;


    return Class;
}


/**
 * Helpers
 */

function copyMethodsOfObjectTo(from, to, _super)
{
    var classMethodNamePrefix = '_';
    for (var eachMethodName in from)
    {
        var eachMethod = from[eachMethodName];
        if (eachMethod instanceof Function == false) continue;
        if (eachMethodName.charAt(0) == classMethodNamePrefix) continue;

        to[eachMethodName] = eachMethod;
        to[eachMethodName]._super = _super;
    }
}

function copyClassMethodsOfObjectTo(from, to, _super)
{
    var classMethodNamePrefix = '_';
    for (var eachMethodName in from)
    {
        var eachMethod = from[eachMethodName];
        if (eachMethod instanceof Function == false) continue;
        if (eachMethodName.charAt(0) !== classMethodNamePrefix) continue;

        to[eachMethodName.substring(1)] = eachMethod;
        to[eachMethodName.substring(1)]._super = _super;
    }
}

function copyPropertiesOfObjectTo(from, to)
{
    for (var eachPropertyName in from)
    {
        var eachProperty = from[eachPropertyName];
        if (eachProperty instanceof Function) continue;

        to[eachPropertyName] = eachProperty;
    }
}

function objectToString(object)
{
    var string = '';

    // Object
    if (typeof(object) == "object" && (object.join == undefined))
    {
        string += '{';
            for (eachPropertyName in object)
            { string += eachPropertyName+': '+objectToString(object[eachPropertyName])+', '; };
        string += '}';
    }

    // Array
    else if (typeof(object) == "object" && !(object.join == undefined))
    {
        string += '[';
            for(eachPropertyName in object)
            { string += objectToString(object[eachPropertyName])+", "; }
        string += ']';
    }

    // Function
    else if (typeof(object) == "function")
    {
        string += object.toString();
    }

    // Anything else
    else
    {
        string += JSON.stringify(object);
    }

    return string;
}

function stripAlmostEverything(string)
{ return string.replace(/[^a-zA-Z0-9_$=]/g,''); }