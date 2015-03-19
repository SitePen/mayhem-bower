define(["require", "exports", 'dojo/aspect', 'dojo/_base/lang', './html/peg/html', '../util'], function (require, exports, aspect, lang, parser, util) {
    function createViewConstructor(root, parent, eventRoot) {
        var BaseCtor = require(root.constructor);
        function TemplatedView(kwArgs) {
            if (kwArgs === void 0) { kwArgs = {}; }
            var self = this;
            var app = kwArgs['app'] || this.get('app');
            if (!app) {
                throw new Error('An instance of Application must be provided to templated views, either inherited from the parent ' + 'prototype or passed on the "app" key to the constructor');
            }
            var binder = app.get('binder');
            var model = kwArgs['model'] || this.get('model') || (parent && parent.get('model'));
            var emptyObject = {};
            var modelInheritors = [];
            var handles = [];
            function applyBindings(widget, bindings) {
                for (var key in bindings) {
                    var declaration = bindings[key];
                    var sourcePath = declaration.$bind;
                    if (sourcePath instanceof Array) {
                        sourcePath = sourcePath.map(function (part) {
                            if (typeof part === 'string') {
                                return part;
                            }
                            else {
                                return { path: part.$bind };
                            }
                        });
                    }
                    handles.push(binder.bind({
                        source: model || emptyObject,
                        sourcePath: sourcePath,
                        target: widget,
                        targetPath: key,
                        direction: declaration.direction
                    }));
                }
            }
            function applyEvents(widget, events) {
                function bindEvent(eventName, eventTarget) {
                    var binding = binder.createBinding(model || emptyObject, eventTarget.$bind, { useScheduler: false });
                    widget.on(eventName, function (event) {
                        var listener = binding.get();
                        if (listener) {
                            listener.call(binding.getObject(), event);
                        }
                    });
                    handles.push({
                        setSource: function (source, sourcePath) {
                            if (sourcePath === void 0) { sourcePath = eventTarget.$bind; }
                            binding.destroy();
                            binding = binder.createBinding(source || emptyObject, sourcePath, { useScheduler: false });
                        },
                        remove: function () {
                            binding.destroy();
                            binding = null;
                        }
                    });
                }
                for (var eventName in events) {
                    var eventTarget = events[eventName];
                    if (typeof eventTarget === 'string') {
                        widget.on(eventName, function (event) {
                            (eventRoot || self)[eventTarget] && (eventRoot || self)[eventTarget](event);
                        });
                    }
                    else {
                        bindEvent(eventName, eventTarget);
                    }
                }
            }
            function readNode(node) {
                if (util.isObject(node)) {
                    if (typeof node.constructor === 'string') {
                        return createWidget(node);
                    }
                    else if (node.$ctor) {
                        return createViewConstructor(node.$ctor, self);
                    }
                    else {
                        var kwArgs = node instanceof Array ? [] : {};
                        for (var key in node) {
                            kwArgs[key] = readNode(node[key]);
                        }
                        return kwArgs;
                    }
                }
                else {
                    return node;
                }
            }
            function createWidget(node) {
                var Ctor = require(node.constructor);
                if (Ctor.inheritsModel) {
                    Ctor = createViewConstructor(node, self, eventRoot || parent || self);
                    instance = new Ctor({ app: app, model: model });
                    modelInheritors.push(instance);
                    return instance;
                }
                var initialState = getInitialState(node);
                initialState.kwArgs['app'] = app;
                var instance = new Ctor(initialState.kwArgs);
                applyBindings(instance, initialState.bindings);
                applyEvents(instance, initialState.events);
                return instance;
            }
            function getInitialState(node) {
                var kwArgs = {};
                var bindings = {};
                var events = {};
                for (var key in node) {
                    var value = node[key];
                    if (key === 'constructor') {
                        continue;
                    }
                    if (/^on[A-Z]/.test(key)) {
                        events[key.charAt(2).toLowerCase() + key.slice(3)] = value;
                    }
                    else if (value.$bind) {
                        bindings[key] = value;
                    }
                    else {
                        kwArgs[key] = readNode(value);
                    }
                }
                return {
                    kwArgs: kwArgs,
                    bindings: bindings,
                    events: events
                };
            }
            aspect.before(this, 'destroy', function () {
                var handle;
                while ((handle = handles.pop())) {
                    handle.remove();
                }
            });
            if (!('_modelGetter' in this)) {
                this._modelGetter = function () {
                    return model;
                };
            }
            if (!('_modelSetter' in this)) {
                this._modelSetter = function (value) {
                    if (parent && !value) {
                        value = parent.get('model');
                    }
                    model = value;
                };
            }
            var initialState = getInitialState(root);
            BaseCtor.call(this, lang.mixin(initialState.kwArgs, kwArgs));
            this.observe('model', function (value) {
                for (var i = 0, handle; (handle = handles[i]); ++i) {
                    handle.setSource(value || emptyObject);
                }
                for (var i = 0, child; (child = modelInheritors[i]); ++i) {
                    child.set('model', value);
                }
            });
            applyBindings(this, initialState.bindings);
            applyEvents(this, initialState.events);
        }
        __extends(TemplatedView, BaseCtor);
        return TemplatedView;
    }
    function create(template) {
        var ast = parser.parse(template);
        return util.getModules(ast.constructors).then(function () {
            return createViewConstructor(ast.root);
        });
    }
    exports.create = create;
    function createFromFile(filename) {
        return util.getModule('dojo/text!' + filename).then(function (template) {
            return create(template);
        });
    }
    exports.createFromFile = createFromFile;
    function load(resourceId, _, load) {
        createFromFile(resourceId).then(load);
    }
    exports.load = load;
    function normalize(resourceId, normalize) {
        if (!/\.html(?:$|\?)/.test(resourceId)) {
            return normalize(resourceId.replace(/(\?|$)/, '.html$1'));
        }
        return normalize(resourceId);
    }
    exports.normalize = normalize;
});
//# sourceMappingURL=../_debug/templating/html.js.map