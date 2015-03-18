define(["require", "exports", '../util', '../../../Event', 'dojo/_base/lang', './KeyboardManager', './PointerManager'], function (require, exports, domUtil, Event, lang, KeyboardManager, PointerManager) {
    var BUBBLES = {
        pointercancel: true,
        pointerdown: true,
        pointermove: true,
        pointerout: true,
        pointerover: true,
        pointerup: true
    };
    var CANCELABLE = {
        pointerdown: true,
        pointermove: true,
        pointerout: true,
        pointerover: true,
        pointerup: true
    };
    var EventManager = (function () {
        function EventManager(master) {
            this._master = master;
            var root = master.get('root');
            this._pointerManager = new PointerManager(root);
            this._keyboardManager = new KeyboardManager(root);
            this._handles = [
                this._pointerManager.on('add', lang.hitch(this, '_handlePointerAdd')),
                this._pointerManager.on('cancel', lang.hitch(this, '_handlePointerCancel')),
                this._pointerManager.on('change', lang.hitch(this, '_handlePointerChange')),
                this._pointerManager.on('remove', lang.hitch(this, '_handlePointerRemove')),
                this._keyboardManager.on('down', lang.hitch(this, '_emitKeyboardEvent', 'keydown')),
                this._keyboardManager.on('repeat', lang.hitch(this, '_emitKeyboardEvent', 'keyrepeat')),
                this._keyboardManager.on('up', lang.hitch(this, '_emitKeyboardEvent', 'keyup'))
            ];
        }
        EventManager.prototype.destroy = function () {
            this.destroy = function () {
            };
            this._pointerManager.destroy();
            this._keyboardManager.destroy();
        };
        EventManager.prototype._emitKeyboardEvent = function (type, keyInfo) {
            var target = domUtil.findNearestParent(this._master, document.activeElement);
            if (!document.activeElement || document.activeElement === document.body || document.activeElement === document.documentElement) {
                target = this._master;
            }
            if (!target) {
                return;
            }
            var event = new Event({
                bubbles: true,
                cancelable: true,
                char: keyInfo.char,
                code: keyInfo.code,
                currentTarget: target,
                key: keyInfo.key,
                keyType: 'keyboard',
                target: target,
                type: type,
                view: this._master
            });
            return !event.currentTarget.emit(event);
        };
        EventManager.prototype._emitPointerEvent = function (type, pointer, target, relatedTarget) {
            if (!target) {
                target = domUtil.findWidgetAt(this._master, pointer.clientX, pointer.clientY);
            }
            var event = new Event({
                bubbles: BUBBLES[type],
                button: pointer.lastState.buttons ^ pointer.buttons,
                buttons: pointer.buttons,
                cancelable: CANCELABLE[type],
                clientX: pointer.clientX,
                clientY: pointer.clientY,
                currentTarget: target,
                height: pointer.height,
                isPrimary: pointer.isPrimary,
                modifiers: pointer.modifiers,
                pointerId: pointer.pointerId,
                pointerType: pointer.pointerType,
                pressure: pointer.pressure,
                relatedTarget: relatedTarget || null,
                target: target,
                tiltX: pointer.tiltX,
                tiltY: pointer.tiltY,
                type: type,
                view: this._master,
                width: pointer.width
            });
            return !event.currentTarget.emit(event);
        };
        EventManager.prototype._handlePointerAdd = function (pointer) {
            var target = domUtil.findWidgetAt(this._master, pointer.clientX, pointer.clientY);
            if (!target) {
                target = this._master;
            }
            var shouldCancel = this._emitPointerEvent('pointerover', pointer, target);
            this._emitPointerEvent('pointerenter', pointer, target);
            if (pointer.pointerType === 'touch') {
                if (this._emitPointerEvent('pointerdown', pointer, target)) {
                    shouldCancel = true;
                }
            }
            return shouldCancel;
        };
        EventManager.prototype._handlePointerCancel = function (pointer) {
            var target = domUtil.findWidgetAt(this._master, pointer.lastState.clientX, pointer.lastState.clientY);
            if (!target) {
                target = this._master;
            }
            var shouldCancel = this._emitPointerEvent('pointercancel', pointer, target);
            if (this._emitPointerEvent('pointerout', pointer, target)) {
                shouldCancel = true;
            }
            this._emitPointerEvent('pointerleave', pointer, target);
            return shouldCancel;
        };
        EventManager.prototype._handlePointerChange = function (pointer) {
            function contains(maybeParent, child) {
                if (!maybeParent || !child) {
                    return false;
                }
                var parent = child;
                do {
                    if (parent === maybeParent) {
                        return true;
                    }
                } while ((parent = parent.get('parent')));
                return false;
            }
            var target = domUtil.findWidgetAt(this._master, pointer.clientX, pointer.clientY) || this._master;
            var previousTarget;
            var changes = pointer.lastChanged;
            var shouldCancel = false;
            var hasMoved = changes.clientX || changes.clientY;
            if (hasMoved) {
                if (pointer.lastState.clientX == null || pointer.lastState.clientY == null) {
                    previousTarget = null;
                }
                else {
                    previousTarget = domUtil.findWidgetAt(this._master, pointer.lastState.clientX, pointer.lastState.clientY) || this._master;
                }
            }
            if (hasMoved && !contains(previousTarget, target) && previousTarget) {
                if (this._emitPointerEvent('pointerout', pointer, previousTarget, target)) {
                    shouldCancel = true;
                }
                this._emitPointerEvent('pointerleave', pointer, previousTarget, target);
            }
            if (this._emitPointerEvent('pointermove', pointer, target)) {
                shouldCancel = true;
            }
            if (hasMoved && !contains(target, previousTarget)) {
                if (this._emitPointerEvent('pointerover', pointer, target, previousTarget)) {
                    shouldCancel = true;
                }
                this._emitPointerEvent('pointerenter', pointer, target, previousTarget);
            }
            if (changes.buttons) {
                if (pointer.buttons > 0 && pointer.lastState.buttons === 0) {
                    if (this._emitPointerEvent('pointerdown', pointer, target)) {
                        shouldCancel = true;
                    }
                }
                else if (pointer.buttons === 0 && pointer.lastState.buttons > 0) {
                    if (this._emitPointerEvent('pointerup', pointer, target)) {
                        shouldCancel = true;
                    }
                }
            }
            return shouldCancel;
        };
        EventManager.prototype._handlePointerRemove = function (pointer) {
            var target = domUtil.findWidgetAt(this._master, pointer.lastState.clientX, pointer.lastState.clientY) || this._master;
            var shouldCancel = false;
            if (pointer.pointerType === 'touch') {
                shouldCancel = this._emitPointerEvent('pointerup', pointer.lastState, target);
            }
            if (this._emitPointerEvent('pointerout', pointer, target)) {
                shouldCancel = true;
            }
            return shouldCancel;
        };
        return EventManager;
    })();
    return EventManager;
});
//# sourceMappingURL=../../../_debug/ui/dom/events/EventManager.js.map