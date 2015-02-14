define(["require", "exports", 'dojo/aspect', 'dojo/_base/lang', './html/peg/html', '../util'], function (require, exports, aspect, lang, parser, util) {
    function createViewConstructor(root, parent) {
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
                    handles.push(binder.bind({
                        source: model || emptyObject,
                        sourcePath: declaration.$bind,
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
                            self[eventTarget] && self[eventTarget].call(this, event);
                        });
                    }
                    else {
                        bindEvent(eventName, eventTarget);
                    }
                }
            }
            function getInitialStateFromNode(node) {
                var kwArgs = { app: app };
                var bindings = {};
                var events = {};
                function recursivelyInitializeChildren(parent) {
                    for (var key in parent) {
                        var value = parent[key];
                        if (value && typeof value.constructor === 'string') {
                            parent[key] = initializeChild(value);
                        }
                        else if (util.isObject(value)) {
                            recursivelyInitializeChildren(value);
                        }
                    }
                    return parent;
                }
                for (var key in node) {
                    if (key === 'constructor') {
                        continue;
                    }
                    var value = node[key];
                    if (/^on[A-Z]/.test(key)) {
                        events[key.charAt(2).toLowerCase() + key.slice(3)] = value;
                    }
                    else if (value && value.$bind) {
                        bindings[key] = value;
                    }
                    else if (value && value.$ctor) {
                        kwArgs[key] = createViewConstructor(value.$ctor, self);
                    }
                    else if (value && typeof value.constructor === 'string') {
                        kwArgs[key] = initializeChild(value);
                    }
                    else {
                        if (util.isObject(value)) {
                            recursivelyInitializeChildren(value);
                        }
                        kwArgs[key] = value;
                    }
                }
                return {
                    kwArgs: kwArgs,
                    bindings: bindings,
                    events: events
                };
            }
            function initializeChild(node) {
                var WidgetCtor = require(node.constructor);
                var initialState = getInitialStateFromNode(node);
                var isModelInheritor = !('model' in initialState.bindings) && WidgetCtor.inheritsModel;
                if (isModelInheritor) {
                    initialState.kwArgs['model'] = model;
                }
                var childWidget = new WidgetCtor(initialState.kwArgs);
                applyBindings(childWidget, initialState.bindings);
                applyEvents(childWidget, initialState.events);
                if (isModelInheritor) {
                    modelInheritors.push(childWidget);
                }
                return childWidget;
            }
            aspect.before(this, 'destroy', function () {
                var handle;
                while ((handle = handles.pop())) {
                    handle.remove();
                }
            });
            var model;
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
            var initialState = getInitialStateFromNode(root);
            applyBindings(this, initialState.bindings);
            applyEvents(this, initialState.events);
            BaseCtor.call(this, lang.mixin(initialState.kwArgs, kwArgs));
            this.observe('model', function (value) {
                for (var i = 0, handle; (handle = handles[i]); ++i) {
                    handle.setSource(value || emptyObject);
                }
                for (var i = 0, child; (child = modelInheritors[i]); ++i) {
                    child.set('model', value);
                }
            });
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