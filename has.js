define(["require", "exports", 'dojo/has'], function (require, exports, has) {
    has.add('debug', true);
    has.add('es5', Boolean(Object.create && Object.create.toString().indexOf('[native code]') > -1));
    has.add('es6-weak-map', typeof WeakMap !== 'undefined');
    has.add('es7-object-observe', 'observe' in Object);
    has.add('raf', typeof requestAnimationFrame === 'function');
    has.add('intl', typeof Intl !== 'undefined');
    if (typeof window !== 'undefined') {
        var minimumWindowDimension = Math.min(window.innerWidth, window.innerHeight);
        has.add('phone', has('touch') && minimumWindowDimension <= 640);
        has.add('tablet', has('touch') && !has('phone'));
    }
    if (has('dom')) {
        has.add('dom-tree-walker', typeof document.createTreeWalker !== 'undefined');
        has.add('dom-mspointerevents', 'MsPointerEvent' in window);
        has.add('dom-pointerevents', 'PointerEvent' in window);
        has.add('dom-touch', 'ontouchstart' in document);
        has.add('dom-mouse', 'onmousedown' in document);
        if (has('dom-addeventlistener')) {
            has.add('dom-mouse-buttons', 'buttons' in document.createEvent('MouseEvent'));
            has.add('dom-keyboard-key', 'key' in document.createEvent('KeyboardEvent'));
            has.add('dom-keyboard-keyIdentifier', 'keyIdentifier' in document.createEvent('KeyboardEvent'));
            has.add('dom-keyboard-isComposing', 'isComposing' in document.createEvent('KeyboardEvent'));
            has.add('dom-keyboard-code', 'code' in document.createEvent('KeyboardEvent'));
        }
        else {
            has.add('dom-dblclick-bug', true);
        }
        has.add('dom-node-interface', typeof Node !== 'undefined');
        has.add('dom-bad-expandos', function () {
            try {
                return (document.createTextNode('').foo = true) !== true;
            }
            catch (error) {
                return true;
            }
        });
        has.add('dom-firstchild-empty-bug', function () {
            var element = arguments[2];
            element.innerHTML = '<!--foo-->';
            return element.childNodes.length === 0;
        });
        has.add('webidl-bad-descriptors', function () {
            var element = arguments[2];
            return Boolean(element && Object.getOwnPropertyDescriptor(element, 'nodeValue') != null);
        });
    }
    return has;
});
//# sourceMappingURL=_debug/has.js.map