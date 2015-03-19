var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../binding/BindDirection', '../../../ui/dom/Container', 'dojo/dom-construct', '../../../has', '../binding/ProxyBinding'], function (require, exports, BindDirection, Container, domConstruct, has, ProxyBinding) {
    var Node;
    if (has('dom-addeventlistener')) {
        Node = window.Node;
    }
    else {
        Node = {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9,
            DOCUMENT_FRAGMENT_NODE: 11
        };
    }
    var BIND = /^bind ([0-9]+)$/;
    var BIND_ATTRIBUTE = /<!--bind ([0-9]+)-->/g;
    var CHILD = /^child ([0-9]+)$/;
    var EVENT_ATTRIBUTE = /^on-(.*)$/;
    var PLACEHOLDER = /^placeholder (.*)$/;
    function createPlaceholderSetter(property, placeholderNode) {
        property = '_' + property;
        return function (value) {
            var oldValue = this[property];
            oldValue && oldValue.detach();
            if (value) {
                placeholderNode.parentNode.insertBefore(value.detach(), placeholderNode);
                value.set({
                    isAttached: this.get('isAttached'),
                    parent: this
                });
            }
            this._placeholders[property] = this[property] = value;
        };
    }
    var ElementWidget = (function (_super) {
        __extends(ElementWidget, _super);
        function ElementWidget() {
            _super.apply(this, arguments);
        }
        ElementWidget.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._bindingHandles = [];
            this._eventQueues = {};
            this._placeholders = {};
            this.observe('model', function (value) {
                value = value || {};
                var handle;
                for (var i = 0; (handle = this._bindingHandles[i]); ++i) {
                    handle.setSource(value);
                }
            });
        };
        ElementWidget.prototype._childrenGetter = function () {
            return this._children;
        };
        ElementWidget.prototype._childrenSetter = function (value) {
            for (var i = 0, child; (child = value[i]); ++i) {
                child.set({
                    isAttached: this.get('isAttached'),
                    parent: this
                });
            }
            this._children = value;
        };
        ElementWidget.prototype.destroy = function () {
            var placeholder;
            for (var key in this._placeholders) {
                placeholder = this._placeholders[key];
                placeholder && placeholder.destroy();
            }
            this._eventQueues = null;
            this._placeholders = null;
            _super.prototype.destroy.call(this);
        };
        ElementWidget.prototype._isAttachedSetter = function (value) {
            _super.prototype._isAttachedSetter.call(this, value);
            var placeholders = this._placeholders;
            for (var key in placeholders) {
                placeholders[key] && placeholders[key].set('isAttached', value);
            }
        };
        ElementWidget.prototype._render = function () {
            var self = this;
            var binder = this._app.get('binder');
            var model = this.get('model') || {};
            var bindings = [];
            function addEvent(node, eventName, listener) {
                function getElement(event) {
                    if ('key' in event) {
                        return document.activeElement;
                    }
                    else if ('clientX' in event) {
                        return document.elementFromPoint(event.clientX, event.clientY);
                    }
                }
                function runListeners(target, event) {
                    var newEvent;
                    newEvent = Object.create(event);
                    newEvent.preventDefault = function () {
                        event.preventDefault();
                    };
                    newEvent.stopPropagation = function () {
                        event.stopPropagation();
                    };
                    newEvent.targetNode = target;
                    newEvent.bubbles = (eventName !== 'pointerenter' && eventName !== 'pointerleave');
                    newEvent.type = eventName;
                    var currentListeners = listeners.slice(0);
                    for (var i = 0, entry; (entry = currentListeners[i]); ++i) {
                        if (target === entry.node || (newEvent.bubbles && !newEvent.propagationStopped && entry.node.contains(target))) {
                            newEvent.currentTargetNode = entry.node;
                            entry.listener.call(self, newEvent);
                        }
                    }
                }
                var listeners = self._eventQueues[eventName];
                if (!listeners) {
                    listeners = self._eventQueues[eventName] = [];
                    if (eventName === 'pointerout' || eventName === 'pointerleave' || eventName === 'pointerover' || eventName === 'pointerenter') {
                        var lastElement;
                        if (eventName === 'pointerleave') {
                            self.on('pointermove', function (event) {
                                var newElement = getElement(event);
                                if (lastElement && !lastElement.contains(newElement)) {
                                    runListeners(lastElement, event);
                                }
                                lastElement = newElement;
                            });
                        }
                        else if (eventName === 'pointerout') {
                            self.on('pointermove', function (event) {
                                var newElement = getElement(event);
                                if (lastElement && !lastElement.contains(newElement) && !lastElement['widget']) {
                                    runListeners(lastElement, event);
                                }
                                lastElement = newElement;
                            });
                        }
                        else if (eventName === 'pointerenter') {
                            self.on('pointermove', function (event) {
                                var newElement = getElement(event);
                                if (newElement && !newElement.contains(lastElement)) {
                                    runListeners(newElement, event);
                                }
                                lastElement = newElement;
                            });
                        }
                        else if (eventName === 'pointerover') {
                            self.on('pointermove', function (event) {
                                var newElement = getElement(event);
                                if (newElement && !newElement.contains(lastElement) && !newElement['widget']) {
                                    runListeners(newElement, event);
                                }
                                lastElement = newElement;
                            });
                        }
                        if (eventName === 'pointerout' || eventName === 'pointerleave') {
                            self.on('pointerleave', function (event) {
                                if (lastElement) {
                                    runListeners(lastElement, event);
                                    lastElement = null;
                                }
                            });
                            if (eventName === 'pointerout') {
                                self.on('pointerout', function (event) {
                                    var oldNode = event.target && event.target.get('firstNode');
                                    if (oldNode) {
                                        runListeners(oldNode, event);
                                    }
                                });
                            }
                        }
                        else {
                            self.on('pointerenter', function (event) {
                                var newElement = getElement(event);
                                if (newElement) {
                                    runListeners(newElement, event);
                                    lastElement = newElement;
                                }
                            });
                            if (eventName === 'pointerover') {
                                self.on('pointerover', function (event) {
                                    var newNode = event.target && event.target.get('firstNode');
                                    if (newNode) {
                                        runListeners(newNode, event);
                                    }
                                });
                            }
                        }
                    }
                    else {
                        self.on(eventName, function (event) {
                            var target = getElement(event);
                            if (!target) {
                                return;
                            }
                            runListeners(target, event);
                        });
                    }
                }
                listeners.unshift({ node: node, listener: listener });
            }
            function generateContent(source) {
                var htmlContent = '';
                for (var i = 0, j = source.length, part; i < j; ++i) {
                    part = source[i];
                    if (typeof part === 'string') {
                        htmlContent += part;
                    }
                    else if (part.$child !== undefined) {
                        htmlContent += '<!--child ' + part.$child + '-->';
                    }
                    else if (part.$placeholder !== undefined) {
                        htmlContent += '<!--placeholder ' + part.$placeholder + '-->';
                    }
                    else if (part.$bind !== undefined) {
                        bindings.push(part);
                        htmlContent += '<!--bind ' + (bindings.length - 1) + '-->';
                    }
                }
                var domContent;
                if (has('dom-firstchild-empty-bug')) {
                    htmlContent = '&shy;' + htmlContent;
                    domContent = domConstruct.toDom(htmlContent);
                    var shyNode = domContent.childNodes[0];
                    if (shyNode.nodeType === 3 && shyNode.nodeValue.charAt(0) === '\u00AD') {
                        shyNode.nodeValue = shyNode.nodeValue.slice(1);
                    }
                }
                else {
                    domContent = domConstruct.toDom(htmlContent);
                    if (domContent.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                        var fragment = document.createDocumentFragment();
                        fragment.appendChild(domContent);
                        domContent = fragment;
                    }
                }
                return domContent;
            }
            function processNode(node) {
                var result;
                if (node.nodeType === Node.COMMENT_NODE) {
                    if ((result = PLACEHOLDER.exec(node.nodeValue))) {
                        self['_' + result[1] + 'Setter'] = createPlaceholderSetter(result[1], node);
                    }
                    else if ((result = CHILD.exec(node.nodeValue))) {
                        node.parentNode.replaceChild(self._children[result[1]].detach(), node);
                    }
                    else if ((result = BIND.exec(node.nodeValue))) {
                        var newNode = document.createTextNode('');
                        node.parentNode.replaceChild(newNode, node);
                        self._bindingHandles.push(binder.bind({
                            source: model,
                            sourcePath: bindings[Number(result[1])].$bind,
                            target: newNode,
                            targetPath: 'nodeValue',
                            direction: 1 /* ONE_WAY */
                        }));
                    }
                }
                else if (node.nodeType === Node.ELEMENT_NODE) {
                    for (var i = 0, attribute; (attribute = node.attributes[i]); ++i) {
                        var nodeValue = attribute.value;
                        if ((result = EVENT_ATTRIBUTE.exec(attribute.name))) {
                            (function (nodeValue) {
                                var boundEvent = BIND_ATTRIBUTE.exec(nodeValue);
                                BIND_ATTRIBUTE.lastIndex = 0;
                                var binding;
                                if (boundEvent) {
                                    if (boundEvent[0].length !== nodeValue.length) {
                                        throw new Error('Illegal event binding to ' + attribute.name + ': ' + node.outerHTML);
                                    }
                                    binding = new ProxyBinding({
                                        binder: binder,
                                        object: model,
                                        path: bindings[Number(boundEvent[1])].$bind
                                    });
                                    self._bindingHandles.push(binding);
                                }
                                var eventName = result[1].toLowerCase().replace(/-(.)/g, function (_, character) {
                                    return character.toUpperCase();
                                });
                                addEvent(node, eventName, function (event) {
                                    if (binding) {
                                        return binding.get().call(binding.getObject(), event);
                                    }
                                    else {
                                        return self[nodeValue](event);
                                    }
                                });
                            })(nodeValue);
                        }
                        else if ((result = BIND_ATTRIBUTE.exec(nodeValue))) {
                            var lastIndex = 0;
                            if (result.index === 0 && result[0].length === nodeValue.length) {
                                var kwArgs = {
                                    source: model,
                                    sourcePath: bindings[Number(result[1])].$bind,
                                    target: attribute,
                                    targetPath: 'value',
                                    direction: bindings[Number(result[1])].direction
                                };
                                for (var defaultDomKey in { value: true, checked: true }) {
                                    if (attribute.name === defaultDomKey && defaultDomKey in node) {
                                        kwArgs.target = node;
                                        kwArgs.targetPath = defaultDomKey;
                                        attribute.value = '{' + kwArgs.sourcePath + '}';
                                        if (kwArgs.direction === 2 /* TWO_WAY */) {
                                            attribute.value = '{' + attribute.value + '}';
                                        }
                                        break;
                                    }
                                }
                                self._bindingHandles.push(binder.bind(kwArgs));
                                BIND_ATTRIBUTE.lastIndex = 0;
                            }
                            else {
                                var compositeBinding = [];
                                do {
                                    compositeBinding.push(nodeValue.slice(lastIndex, result.index));
                                    compositeBinding.push({ path: bindings[Number(result[1])].$bind });
                                    lastIndex = result.index + result[0].length;
                                } while ((result = BIND_ATTRIBUTE.exec(nodeValue)));
                                compositeBinding.push(nodeValue.slice(lastIndex));
                                self._bindingHandles.push(binder.bind({
                                    source: model,
                                    sourcePath: compositeBinding,
                                    target: attribute,
                                    targetPath: 'value',
                                    direction: 1 /* ONE_WAY */
                                }));
                            }
                        }
                    }
                }
            }
            var content = generateContent(this._content);
            var node = content;
            var nextNode;
            while (node) {
                if (node.firstChild) {
                    nextNode = node.firstChild;
                }
                else if (node.nextSibling) {
                    nextNode = node.nextSibling;
                }
                else if (node.parentNode) {
                    var maybeNextNode = node;
                    nextNode = null;
                    while (maybeNextNode.parentNode && maybeNextNode.parentNode !== content) {
                        maybeNextNode = maybeNextNode.parentNode;
                        if (maybeNextNode.nextSibling) {
                            nextNode = maybeNextNode.nextSibling;
                            break;
                        }
                    }
                }
                else {
                    nextNode = null;
                }
                processNode(node);
                node = nextNode;
            }
            _super.prototype._render.call(this);
            this._fragment.insertBefore(content, this._lastNode);
        };
        ElementWidget.inheritsModel = true;
        return ElementWidget;
    })(Container);
    return ElementWidget;
});
//# sourceMappingURL=../../../_debug/templating/html/ui/Element.js.map