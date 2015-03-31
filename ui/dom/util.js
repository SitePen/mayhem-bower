define(["require", "exports", '../../has', '../../util'], function (require, exports, has, util) {
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
    has.add('dom-range', Boolean(typeof document !== 'undefined' && document.createRange));
    function checkPointInWidget(widget, x, y) {
        var firstNode = widget.get('firstNode');
        var lastNode = widget.get('lastNode');
        if (firstNode === lastNode || firstNode.nextSibling === lastNode) {
            return false;
        }
        var rect;
        if (has('dom-range')) {
            var range = document.createRange();
            range.setStartAfter(widget.get('firstNode'));
            range.setEndBefore(widget.get('lastNode'));
            rect = range.getBoundingClientRect();
        }
        else {
            var findPosition = function (targetRange, findNode, nodeType) {
                var range = document.body.createTextRange();
                var numCharacters = 0;
                var node = findNode;
                while (node && node.nodeType !== 1) {
                    if (node.nodeType === 3) {
                        numCharacters += node.length;
                    }
                    node = nodeType === 'firstNode' ? node.previousSibling : node.nextSibling;
                }
                range.moveToElementText((node || findNode.parentNode));
                if (nodeType === 'firstNode') {
                    numCharacters && range.moveEnd('character', numCharacters);
                    targetRange.setEndPoint('EndToStart', range);
                }
                else {
                    numCharacters && range.moveStart('character', -numCharacters);
                    targetRange.setEndPoint('StartToEnd', range);
                }
            };
            var expandRect = function (rect) {
                var finalRect = {
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom
                };
                var elementRect;
                var node = firstNode;
                while (node !== lastNode) {
                    if (node.nodeType === 1) {
                        elementRect = node.getBoundingClientRect();
                        finalRect.top = Math.min(finalRect.top, elementRect.top);
                        finalRect.left = Math.min(finalRect.left, elementRect.left);
                        finalRect.right = Math.max(finalRect.right, elementRect.right);
                        finalRect.bottom = Math.max(finalRect.bottom, elementRect.bottom);
                    }
                    node = node.nextSibling;
                }
                return finalRect;
            };
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(firstNode.parentNode);
            findPosition(textRange, firstNode, 'firstNode');
            findPosition(textRange, lastNode, 'lastNode');
            rect = expandRect(textRange.getBoundingClientRect());
        }
        return (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom);
    }
    function extractContents(start, end, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        if (has('dom-range')) {
            var range = document.createRange();
            if (start.parentNode && end.parentNode) {
                if (exclusive) {
                    range.setStartAfter(start);
                    range.setEndBefore(end);
                }
                else {
                    range.setStartBefore(start);
                    range.setEndAfter(end);
                }
            }
            else {
                range.setStartAfter(document.body.lastChild);
                range.setEndAfter(document.body.lastChild);
                range.insertNode(end);
                range.insertNode(start);
            }
            return range.extractContents();
        }
        else {
            var fragment = document.createDocumentFragment();
            var next;
            if (start.parentNode && start.parentNode === end.parentNode) {
                if (exclusive) {
                    start = start.nextSibling;
                }
                while (start !== end) {
                    next = start.nextSibling;
                    fragment.appendChild(start);
                    start = next;
                }
                if (!exclusive) {
                    fragment.appendChild(start);
                }
            }
            else {
                fragment.appendChild(start);
                fragment.appendChild(end);
            }
            return fragment;
        }
    }
    exports.extractContents = extractContents;
    exports.on;
    if (has('dom-addeventlistener')) {
        exports.on = function (target, type, listener) {
            target.addEventListener(type, listener, true);
            return util.createHandle(function () {
                target.removeEventListener(type, listener, true);
                target = type = listener = null;
            });
        };
    }
    else {
        exports.on = function (target, type, listener) {
            target.attachEvent('on' + type, function () {
                var event = window.event;
                event.target = event.srcElement;
                event.currentTarget = target;
                if (event.type === 'mouseover') {
                    event.relatedTarget = event.fromElement;
                }
                else if (event.type === 'mouseout') {
                    event.relatedTarget = event.toElement;
                }
                event.stopPropagation = function () {
                    event.cancelBubble = true;
                };
                event.preventDefault = function () {
                    event.returnValue = false;
                };
                listener.call(this, event);
            });
            return util.createHandle(function () {
                target.detachEvent('on' + type, listener);
                target = type = listener = null;
            });
        };
    }
    function findNearestParent(master, searchNode) {
        var root = master.get('root');
        if (!root.contains(searchNode)) {
            return null;
        }
        var node = searchNode;
        var inSiblingWidget;
        checkNode: while (node !== root) {
            if (node['widget']) {
                break checkNode;
            }
            checkSibling: while (node.previousSibling) {
                node = node.previousSibling;
                if (node.nodeType === Node.COMMENT_NODE && node['widget']) {
                    if (node.nodeValue.charAt(0) === '/') {
                        inSiblingWidget = node.nodeValue.slice(1);
                    }
                    else if (inSiblingWidget === node.nodeValue) {
                        inSiblingWidget = null;
                    }
                    else if (!inSiblingWidget) {
                        break checkNode;
                    }
                }
            }
            node = node.parentNode;
        }
        if (node === root) {
            var masterView = master.get('view');
            if (masterView.get('firstNode').nodeType === Node.COMMENT_NODE) {
                return masterView;
            }
            else {
                return null;
            }
        }
        return node['widget'];
    }
    exports.findNearestParent = findNearestParent;
    function findWidgetAtPoint(widget, x, y, domTarget) {
        var widgetNode = widget.get('firstNode');
        var node;
        if (!domTarget.contains(widgetNode)) {
            node = domTarget.firstChild;
        }
        else if (widgetNode.nodeType === Node.COMMENT_NODE) {
            node = widgetNode.nextSibling;
        }
        else {
            node = widgetNode.firstChild;
        }
        if (!node) {
            return widget;
        }
        var lastCandidate;
        do {
            if (node.nodeType === Node.COMMENT_NODE && node['widget']) {
                var candidateWidget = node['widget'];
                if (node.nodeValue.charAt(0) !== '/') {
                    if (checkPointInWidget(candidateWidget, x, y)) {
                        lastCandidate = candidateWidget;
                    }
                }
                else if (candidateWidget === lastCandidate) {
                    return lastCandidate;
                }
            }
        } while ((node = node.nextSibling));
        return widget;
    }
    function findWidgetAt(master, x, y) {
        var domTarget = document.elementFromPoint(x, y);
        var parent = findNearestParent(master, domTarget);
        if (!parent) {
            return null;
        }
        return findWidgetAtPoint(parent, x, y, domTarget);
    }
    exports.findWidgetAt = findWidgetAt;
});
//# sourceMappingURL=../../_debug/ui/dom/util.js.map