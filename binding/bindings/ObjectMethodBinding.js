var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding', 'esprima', '../../util'], function (require, exports, Binding, esprima, util) {
    var ObjectMethodBinding = (function (_super) {
        __extends(ObjectMethodBinding, _super);
        function ObjectMethodBinding(kwArgs) {
            _super.call(this, kwArgs);
            var root = this._object = kwArgs.object;
            var path = kwArgs.path;
            var binder = kwArgs.binder;
            var dependencies = [];
            function createBinding(path) {
                var binding = binder.createBinding(root, path);
                dependencies.push(binding);
                return binding;
            }
            function getKey(node) {
                switch (node.type) {
                    case 'Identifier':
                        return node.name;
                    case 'Literal':
                        return node.value;
                    case 'ThisExpression':
                        return 'this';
                    default:
                        throw new Error('Unsupported node type "' + node.type + '"');
                }
            }
            function visit(node) {
                if (!node) {
                    return undefined;
                }
                switch (node.type) {
                    case 'Program':
                        if (node.body.length !== 1) {
                            throw new Error('Invalid binding expression');
                        }
                        return visit(node.body[0]);
                    case 'ExpressionStatement':
                        return visit(node.expression);
                    case 'CallExpression':
                        return {
                            callee: visit(node.callee),
                            args: node.arguments.map(function (argument) {
                                return visit(argument);
                            })
                        };
                    case 'MemberExpression':
                        return visitMemberExpression(node);
                    case 'Identifier':
                        return createBinding(node.name);
                    case 'Literal':
                        return node.value;
                    case 'ThisExpression':
                        return createBinding('this');
                    case 'ObjectExpression':
                        return visitObjectExpression(node);
                    case 'ArrayExpression':
                        return node.elements.map(function (element) {
                            return visit(element);
                        });
                    default:
                        throw new Error('Unsupported node type "' + node.type + '"');
                }
            }
            function visitMemberExpression(expression) {
                function visitObject(node) {
                    switch (node.type) {
                        case 'MemberExpression':
                            return visitObject(node.object) + '.' + visitObject(node.property);
                        case 'Identifier':
                        case 'ThisExpression':
                        case 'Literal':
                            return getKey(node);
                        default:
                            throw new Error('Unsupported node type "' + node.type + '"');
                    }
                }
                return createBinding(visitObject(expression));
            }
            function visitObjectExpression(expression) {
                var obj = {};
                expression.properties.forEach(function (property) {
                    obj[getKey(property.key)] = visit(property.value);
                });
                return obj;
            }
            var ast = visit(esprima.parse(path));
            this._dependencies = dependencies;
            this._callee = ast.callee;
            this._args = ast.args;
            var self = this;
            dependencies.forEach(function (dependency) {
                dependency.observe(function () {
                    self.notify({ value: self.get() });
                });
            });
        }
        ObjectMethodBinding.test = function (kwArgs) {
            return util.isObject(kwArgs.object) && typeof kwArgs.path === 'string' && kwArgs.path.indexOf('(') > -1;
        };
        ObjectMethodBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var dependency;
            while ((dependency = this._dependencies.pop())) {
                dependency.destroy();
            }
            this._callee.destroy();
            this._dependencies = this._object = this._callee = this._args = null;
        };
        ObjectMethodBinding.prototype.get = function () {
            function readItem(item) {
                if (item instanceof Binding) {
                    return item.get();
                }
                else if (typeof item === 'object') {
                    return compileObject(item);
                }
                else {
                    return item;
                }
            }
            function compileObject(object) {
                if (object instanceof Array) {
                    return object.map(readItem);
                }
                else if (util.isObject(object)) {
                    var compiledObject = {};
                    for (var key in object) {
                        compiledObject[key] = readItem(object[key]);
                    }
                    return compiledObject;
                }
                else {
                    return readItem(object);
                }
            }
            var fn = this._callee.get();
            if (fn) {
                var thisArg = this._callee.getObject();
                var computedArgs = compileObject(this._args);
                return fn.apply(thisArg, computedArgs);
            }
            return undefined;
        };
        ObjectMethodBinding.prototype.getObject = function () {
            return this._object;
        };
        return ObjectMethodBinding;
    })(Binding);
    return ObjectMethodBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/ObjectMethodBinding.js.map