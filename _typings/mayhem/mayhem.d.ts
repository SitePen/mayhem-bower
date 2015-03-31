/// <reference path="../dgrid/dgrid.d.ts" />
/// <reference path="../dojo/dojo.d.ts" />
/// <reference path="../dojo/dijit.d.ts" />
/// <reference path="../dstore/dstore.d.ts" />
/// <reference path="../esprima/esprima.d.ts" />
/// <reference path="../intern/intern.d.ts" />
/// <reference path="../intl-messageformat/intl-messageformat.d.ts" />
/// <reference path="../xstyle/xstyle.d.ts" />
declare module 'mayhem/binding/BindDirection' {
	 enum DataBindingDirection {
	    /**
	     * Create a one-way binding from source to target.
	     */
	    ONE_WAY = 1,
	    /**
	     * Create a two-way binding between the source and the target.
	     */
	    TWO_WAY = 2,
	}
	export = DataBindingDirection;

}
declare module 'mayhem/has' {
	import has = require('dojo/has');
	export = has;

}
declare module 'mayhem/util' {
	export function addUnloadCallback(callback: () => void): IHandle;
	export function createCompositeHandle(...handles: IHandle[]): IHandle;
	export function createHandle(destructor: () => void): IHandle;
	export function createTimer(callback: (...args: any[]) => void, delay?: number): IHandle;
	export function debounce<T extends (...args: any[]) => void>(callback: T, delay?: number): T;
	export var deepCopy: <T>(target: T, source: {}) => T;
	export var deepCreate: <T>(source: T, properties: {}) => T;
	export function deferMethods(target: {}, methods: string[], untilMethod: string, instead?: (method: string, args: IArguments) => any): void;
	export function deferSetters(target: Object, properties: string[], untilMethod: string, instead?: (setter: string, value: any) => any): void;
	/**
	 * Finds the first index of `searchString` in `source`, unless `searchString` is prefixed by a backslash in the source
	 * string (escaped), in which case it is considered not a match.
	 *
	 * @param source The string to search.
	 * @param searchString The string to search for.
	 * @param position The index to start the search.
	 * @returns The position of the search string, or -1 if the string is not found.
	 */
	export function escapedIndexOf(source: string, searchString: string, position?: number): number;
	/**
	 * Splits a string `source` by a string `separator`, unless `separator` is prefixed by a backslash in the source string
	 * (escaped), in which case the backslash is removed and no split occurs.
	 *
	 * @param source The string to split.
	 * @param separator The separator to split on.
	 * @returns The split string.
	 */
	export function escapedSplit(source: string, separator: string): string[];
	/**
	 * Escapes a string of text for injection into a serialization of HTML or XML.
	 */
	export function escapeXml(text: string, forAttribute?: boolean): string;
	export function getModule<T>(moduleId: string): IPromise<T>;
	export interface RequireError extends Error {
	    url: string;
	    originalError: Error;
	}
	export function getModules<T>(moduleIds: string[]): IPromise<T[]>;
	/**
	 * Retrieves all enumerable keys from an object.
	 */
	export var getObjectKeys: (o: any) => string[];
	/**
	 * Determines whether two values are strictly equal, also treating
	 * NaN as equal to NaN.
	 */
	export function isEqual(a: any, b: any): boolean;
	/**
	 * Determines whether or not a value is an Object, in the EcmaScript specification
	 * sense of an Object.
	 */
	export function isObject(object: any): boolean;
	/**
	 * Finds and removes `needle` from `haystack`, if it exists.
	 */
	export function spliceMatch<T>(haystack: T[], needle: T): boolean;
	export function spread<T, U>(values: IPromise<T>[], resolved: (...args: T[]) => U, rejected?: (error: Error) => void): IPromise<U>;
	export function spread<T, U>(values: T[], resolved: (...args: T[]) => U, rejected?: (error: Error) => void): IPromise<U>;
	export function deepMixin<T extends Object>(target: T, source: any): T;
	export function deepMixin<T extends Object>(target: any, source: any): T;
	export function unescapeXml(text: string): string;

}
declare module 'mayhem/Observable' {
	import core = require('mayhem/interfaces'); class Observable implements core.IObservable {
	    /**
	     * Gets the value of a property on the object.
	     *
	     * @method
	     * @param {string} key The key to retrieve.
	     * @returns {any} The value of the property.
	     */
	    get: Observable.Getters;
	    _dependencies: HashMap<IHandle>;
	    /**
	     * Not private in order to facilitate extension by Proxty and Proxy.
	     *
	     * @protected
	     */
	    _observers: HashMap<core.IObserver<any>[]>;
	    /**
	     * Sets multiple properties on the object at once.
	     *
	     * @method
	     * @property set
	     * @param {HashMap<any>} kwArgs A list of properties to set.
	     */
	    /**
	     * Sets a value of a property on the object.
	     *
	     * @method
	     * @param {string} key The key to set.
	     * @param {any} value The value to set.
	     */
	    set: Observable.Setters;
	    /**
	     * @constructor module:mayhem/Observable
	     * @param {HashMap<any>=} kwArgs An initial set of properties to set on the object at construction time.
	     */
	    constructor(kwArgs?: {});
	    /**
	     * Destroys the object. Subclasses may perform additional cleanup upon destruction, so make sure to call `destroy`
	     * whenever you are finished working with any Observable object.
	     */
	    destroy(): void;
	    /**
	     * Provides a mechanism for subclasses to set default properties. These default properties will then be overridden
	     * by any values passed to the class using the `kwArgs` object.
	     *
	     * @protected
	     */
	    _initialize(): void;
	    /**
	     * Notifies observers of the given property that its value has changed.
	     *
	     * @protected
	     * @param {string} key The name of the property.
	     * @param {any} newValue The new value for the property.
	     * @param {any} oldValue The old value for the property.
	     */
	    _notify(key: string, newValue: any, oldValue: any): void;
	    /**
	     * Observes a property on the object for changes.
	     *
	     * @param key The name of the property to observe.
	     * @param observer An callback that will be invoked whenever the property changes.
	     * @returns A handle that can be used to stop observing the property.
	     */
	    observe(key: string, observer: core.IObserver<any>): IHandle;
	} module Observable {
	    interface Getters extends core.IObservable.Getters {
	    }
	    interface Setters extends core.IObservable.Setters {
	    }
	}
	export = Observable;

}
declare module 'mayhem/ObservableEvented' {
	import core = require('mayhem/interfaces');
	import Observable = require('mayhem/Observable'); class ObservableEvented extends Observable {
	    protected _eventListeners: IHandle[];
	    constructor(kwArgs?: {});
	    destroy(): void;
	    emit(event: core.IEvent): boolean;
	    get: ObservableEvented.Getters;
	    on: ObservableEvented.Events;
	    set: ObservableEvented.Setters;
	} module ObservableEvented {
	    interface Events {
	        (type: IExtensionEvent, listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: string, listener: core.IEventListener<core.IEvent>): IHandle;
	    }
	    interface Getters extends Observable.Getters {
	    }
	    interface Setters extends Observable.Setters {
	    }
	}
	export = ObservableEvented;

}
declare module 'mayhem/interfaces' {
	import binding = require('mayhem/binding/interfaces');
	import ObservableEvented = require('mayhem/ObservableEvented');

	export interface IApplication extends ObservableEvented {
		get:IApplication.Getters;
		on:IApplication.Events;
		set:IApplication.Setters;
		run():IPromise<IApplication>;
	}

	export module IApplication {
		export interface Events extends ObservableEvented.Events {}
		export interface Getters extends ObservableEvented.Getters {
			(key:'binder'):binding.IBinder;
		}
		export interface Setters extends ObservableEvented.Setters {}
	}

	////

	export interface IApplicationComponent {
		run?():IPromise<void>;
	}

	////

	export interface IDestroyable {
		destroy():void;
	}

	////

	export interface IEvent {
		bubbles:boolean;
		cancelable:boolean;
		currentTarget:any;
		defaultPrevented:boolean;
		immediatePropagationStopped:boolean;
		propagationStopped:boolean;
		target:any;
		timestamp:number;
		type:string;

		preventDefault():void;
		stopImmediatePropagation():void;
		stopPropagation():void;
	}

	export interface IErrorEvent extends IEvent {
		error:Error;
	}

	export interface IEventListener<T extends IEvent> {
		(event:T):void;
	}

	////

	export interface IObservable extends IDestroyable {
		get:IObservable.Getters;
		set:IObservable.Setters;

		// TODO: Should expose correct interface for all observers, like Getters, throughout framework
		observe(key:string, observer:IObserver<any>):IHandle;
	}

	export module IObservable {
		export interface Getters {
			(key:string):void;
		}

		export interface Setters {
			(kwArgs:{}):void;
			(key:string, value:any):void;
		}
	}

	export interface IObserver<T> {
		(newValue:T, oldValue:T, key?:string):void;
	}

}
declare module 'mayhem/binding/interfaces' {
	import BindDirection = require('mayhem/binding/BindDirection');
	import core = require('mayhem/interfaces');

	/**
	 * The keyword arguments object for the high-level data binding API.
	 */
	export interface IBindArguments {
		/**
		 * The source object to bind to.
		 */
		source:Object;

		/**
		 * The binding string for the property being bound on the source object. The binding string can be any arbitrary
		 * string but is typically an identifier or expression. The data binding registry in use determines whether or not
		 * the specified binding string is valid.
		 */
		sourcePath:string;

		/**
		 * The target object to bind to.
		 */
		target:Object;

		/**
		 * The binding string for the property being bound on the target object.
		 */
		targetPath:string;

		/**
		 * The direction in which the two properties are bound. By default, the direction is `ONE_WAY`, which means that
		 * only the source is bound to the target. A `TWO_WAY` binding keeps the source and target in sync no matter which
		 * changes.
		 */
		direction?:BindDirection;
	}

	/**
	 * IBinder provides the high-level data binding API for creating reactive objects and binding together two object
	 * properties.
	 */
	export interface IBinder extends core.IApplicationComponent {
		/**
		 * Tests whether or not the given data binding arguments can be used to successfully bind two objects together.
		 */
		test(kwArgs:IBindArguments):boolean;

		/**
		 * Creates a data binding between the objects given in `kwArgs`. This is a convenience function that creates two
		 * proxties for source and target and binds between them.
		 */
		bind(kwArgs:IBindArguments):IBindingHandle;

		/**
		 * Creates a proxty object from a given object and binding string. This method must be exposed publicly
		 * in order to allow property binders to peel away sections of binding strings, and to allow access to additional
		 * interfaces exposed on subtypes of IProxty.
		 */
		createBinding<T>(object:{}, path:string, options?:{ useScheduler?:boolean; }):IBinding<T>;

		observe(object:{}, path:string, observer:IObserver<any>):IHandle;
	}

	/**
	 * IBindingHandle extends the standard removal handle with added functionality for modifying the source, target, and
	 * direction of the resulting data binding.
	 */
	export interface IBindingHandle extends IHandle {
		// TODO: Is it a bad limitation to not be able to set only the bindings?
		setSource(source:{}, sourcePath?:string):void;
		setTarget(target:{}, targetPath?:string):void;
		setDirection(direction:BindDirection):void;
	}

	/**
	 * TODO: Documentation updates
	 * An IBindingProxty object represents an arbitrary property on an arbitrary JavaScript object. By using an opaque
	 * IBindingProxty object, the value of any property can be updated, retrieved, and bound to another property without
	 * needing to know the originally bound object, the name of the property, or even that the property exists at the time
	 * that it is bound or set.
	 */
	export interface IBinding<T> {
		destroy():void;
		get():T;
		getObject():{};
		notify(change:IChangeRecord<T>):void;
		observe(observer:IObserver<T>, invokeImmediately?:boolean):IHandle;
		set?(value:T):void;
	}

	/**
	 * The keyword arguments object for property bindings.
	 */
	export interface IBindingArguments {
		/**
		 * The object to bind to.
		 */
		object:Object;

		/**
		 * The binding string to use when creating the binding.
		 */
		path:string;

		/**
		 * The binder that is creating the bound property. Providing this information to the property binder
		 * enables property binders to peel away sections of a binding string to compose complex wirings of bound
		 * properties.
		 */
		binder:IBinder;
	}

	/**
	 * IPropertyBinder constructors are responsible for implementing the actual property binding logic for the default
	 * PropertyRegistry data binding registry. They are typically classes that implement `IBoundProperty` with an
	 * additional static `test` function.
	 */
	export interface IBindingConstructor {
		new <T>(kwArgs:IBindingArguments):IBinding<T>;

		/**
		 * Tests whether or not the property binder can successfully create a bound property from the given object and
		 * binding string.
		 */
		test(kwArgs:IBindingArguments):boolean;
	}

	export interface IChangeRecord<T> {
		added?:T[];
		index?:number;
		oldValue?:T;
		removed?:T[];
		value?:T;
	}

	// TODO: Do something with this or delete it.
	export interface IComputedProperty {
		/**
		 * Inferrence for whether or not an object on a data model is actually a computed property.
		 * Will always be `true`.
		 */
		isComputed: boolean;

		/**
		 * The getter method for the computed property.
		 */
		get(): any;

		/**
		 * An optional setter method for the computed property. If not defined, the computed property will be considered
		 * read-only.
		 */
		set?(value:any): void;

		/**
		 * A list of other properties that the computed property uses when generating itself. Used to ensure that the
		 * computed property is updated whenever any of its dependencies are updated. The dependencies themselves are
		 */
		dependencies: string[];
	}

	export interface IObserver<T> {
		(change:IChangeRecord<T>):void;
	}

}
declare module 'mayhem/ui/style/ClassList' {
	 class ClassList {
	    private _value;
	    constructor();
	    add(className: string): void;
	    has(className: string): boolean;
	    remove(className: string): void;
	    set(className: string): void;
	    toggle(className: string, forceState?: boolean): void;
	    valueOf(): string;
	}
	export = ClassList;

}
declare module 'mayhem/ui/Master' {
	import core = require('mayhem/interfaces');
	import ObservableEvented = require('mayhem/ObservableEvented');
	import View = require('mayhem/ui/View');
	interface Master extends ObservableEvented, core.IApplicationComponent {
	    get: Master.Getters;
	    on: Master.Events;
	    set: Master.Setters;
	} module Master {
	    interface Events extends ObservableEvented.Events {
	    }
	    interface Getters extends ObservableEvented.Getters {
	        (key: 'app'): core.IApplication;
	        (key: 'view'): View;
	    }
	    interface Setters extends ObservableEvented.Setters {
	        (key: 'app', value: core.IApplication): void;
	        (key: 'view', value: View): void;
	    }
	} var Master: {
	    new (kwArgs: HashMap<any>): Master;
	    prototype: Master;
	};
	export = Master;

}
declare module 'mayhem/Promise' {
	 class Promise<T> implements IPromise<T> {
	    static all: {
	        <T>(array: IPromise<T>[]): IPromise<T[]>;
	        <T>(array: T[]): IPromise<T[]>;
	        (object: {}): IPromise<Object>;
	    };
	    static Deferred: {
	        new <T>(canceler?: (reason: any) => any): IDeferred<T>;
	        when<T>(value: T): IPromise<T>;
	        when<T>(value: IPromise<T>): IPromise<T>;
	        when<T, U>(valueOrPromise: T, callback?: (value: T) => IPromise<U>): IPromise<U>;
	        when<T, U>(valueOrPromise: T, callback?: (value: T) => U): IPromise<U>;
	    };
	    static reject(error: Error): IPromise<Error>;
	    static resolve<U>(value: IPromise<U>): IPromise<U>;
	    static resolve<U>(value: U): IPromise<U>;
	    constructor(initializer: (resolve?: Promise.IResolver<T>, reject?: Promise.IRejecter, progress?: Promise.IProgress, setCanceler?: (canceler: Promise.ICanceler) => void) => void);
	    always: <U>(callback: (valueOrError: any) => U) => IPromise<U>;
	    cancel: <U>(reason?: U, strict?: boolean) => U;
	    isCanceled: () => boolean;
	    isFulfilled: () => boolean;
	    isRejected: () => boolean;
	    isResolved: () => boolean;
	    otherwise: {
	        <U>(errback: (reason: any) => IPromise<U>): IPromise<U>;
	        <U>(errback: (reason: any) => U): IPromise<U>;
	    };
	    then: {
	        <U>(callback: (value: T) => IPromise<U>, errback?: (reason: any) => IPromise<U>, progback?: (update: any) => IPromise<U>): IPromise<U>;
	        <U>(callback: (value: T) => IPromise<U>, errback?: (reason: any) => U, progback?: (update: any) => IPromise<U>): IPromise<U>;
	        <U>(callback: (value: T) => U, errback?: (reason: any) => IPromise<U>, progback?: (update: any) => IPromise<U>): IPromise<U>;
	        <U>(callback: (value: T) => U, errback?: (reason: any) => U, progback?: (update: any) => IPromise<U>): IPromise<U>;
	        <U>(callback: (value: T) => IPromise<U>, errback?: (reason: any) => IPromise<U>, progback?: (update: any) => U): IPromise<U>;
	        <U>(callback: (value: T) => IPromise<U>, errback?: (reason: any) => U, progback?: (update: any) => U): IPromise<U>;
	        <U>(callback: (value: T) => U, errback?: (reason: any) => IPromise<U>, progback?: (update: any) => U): IPromise<U>;
	        <U>(callback: (value: T) => U, errback?: (reason: any) => U, progback?: (update: any) => U): IPromise<U>;
	    };
	} module Promise {
	    interface ICanceler {
	        (reason: Error): any;
	    }
	    interface IProgress {
	        (update: any): void;
	    }
	    interface IRejecter {
	        (error: Error): void;
	    }
	    interface IResolver<T> {
	        (value: Promise<T>): void;
	        (value: T): void;
	    }
	}
	export = Promise;

}
declare module 'mayhem/routing/Request' {
	 class Request {
	    headers: HashMap<string>;
	    host: string;
	    method: string;
	    path: string;
	    protocol: string;
	    vars: HashMap<any>;
	    constructor(kwArgs?: Request.KwArgs);
	    toString(): string;
	} module Request {
	    interface KwArgs {
	        headers?: HashMap<string>;
	        host?: string;
	        method?: string;
	        path?: string;
	        protocol?: string;
	        vars?: {};
	    }
	}
	export = Request;

}
declare module 'mayhem/routing/RoutingError' {
	import Request = require('mayhem/routing/Request');
	interface RoutingError extends Error {
	    request: Request;
	} var RoutingError: {
	    new (message: string, request?: Request): RoutingError;
	    prototype: RoutingError;
	};
	export = RoutingError;

}
declare module 'mayhem/routing/PathRegExp' {
	 class PathRegExp {
	    static escape(string: string): string;
	    /**
	     * The JavaScript-compatible regular expression to match the path.
	     *
	     * @type {RegExp}
	     */
	    protected _expression: RegExp;
	    /**
	     * A map of parameter key position to parameter key name, to translate match indexes from the JavaScript RegExp
	     * object into named properties.
	     *
	     * @type {string[]}
	     */
	    protected _keys: string[];
	    /**
	     * The list of all parts that constitute a complete parameterized expression. Used to generate strings that will
	     * match the parameterized expression (reverse routing).
	     *
	     * @type {any[]}
	     */
	    protected _parts: any[];
	    constructor(path: string, partSeparator?: string, separatorDirection?: PathRegExp.Direction, isCaseSensitive?: boolean, defaults?: {});
	    /**
	     * Generates a path matching this URL rule, containing the given arguments. Properties of kwArgs are consumed
	     * by this operation and will no longer exist on the kwArgs object after processing.
	     *
	     * @param kwArgs
	     * @returns {string} [description]
	     */
	    consume(kwArgs: {}): string;
	    /**
	     * Executes a search for a match against the given string.
	     *
	     * @param value A string to match.
	     * @returns A hash map of parameters extracted from the string.
	     */
	    exec(string: string, options?: {
	        coerce?: boolean;
	    }): HashMap<string>;
	    /**
	     * Tests whether or not the given string matches this path expression.
	     */
	    test(value: string): boolean;
	    /**
	     * Tests whether or not the given arguments can be successfully consumed by this path expression and converted into
	     * a path string.
	     */
	    testConsumability(kwArgs: {}): boolean;
	} module PathRegExp {
	    enum Direction {
	        LEFT = 0,
	        RIGHT = 1,
	    }
	    interface Part {
	        key: string;
	        expression: RegExp;
	        isOptional: boolean;
	    }
	}
	export = PathRegExp;

}
declare module 'mayhem/routing/UrlRule' {
	import Observable = require('mayhem/Observable');
	import PathRegExp = require('mayhem/routing/PathRegExp');
	import Request = require('mayhem/routing/Request');
	import Router = require('mayhem/routing/Router'); class UrlRule extends Observable {
	    get: UrlRule.Getters;
	    set: UrlRule.Setters;
	    protected _hostExpression: PathRegExp;
	    protected _pathExpression: PathRegExp;
	    private _defaults;
	    _defaultsGetter(): {
	        routeId?: string;
	    };
	    _defaultsSetter(value: {}): void;
	    private _host;
	    _hostGetter(): string;
	    _hostSetter(value: string): void;
	    private _isCaseSensitive;
	    _isCaseSensitiveGetter(): boolean;
	    _isCaseSensitiveSetter(value: boolean): void;
	    private _path;
	    _pathGetter(): string;
	    _pathSetter(value: string): void;
	    _initialize(): void;
	    protected _parsePattern(pattern: string, separator?: string, separatorDirection?: PathRegExp.Direction, isCaseSensitive?: boolean, defaults?: {}): PathRegExp;
	    parse(request: Request): Router.RouteInfo;
	    serialize(routeId: string, kwArgs?: {}): string;
	} module UrlRule {
	    interface Getters extends Observable.Getters {
	        (key: 'defaults'): {};
	        (key: 'host'): string;
	        (key: 'isCaseSensitive'): boolean;
	        (key: 'path'): string;
	        (key: 'protocol'): string;
	        (key: 'methods'): string[];
	        (key: 'mode'): UrlRule.Mode;
	        (key: 'routeId'): string;
	    }
	    enum Mode {
	        PARSE = 1,
	        SERIALIZE = 2,
	    }
	    interface Setters extends Observable.Setters {
	        (key: 'defaults', value: {}): void;
	        (key: 'host', value: string): void;
	        (key: 'isCaseSensitive', value: boolean): void;
	        (key: 'path', value: string): void;
	        (key: 'protocol', value: string): void;
	        (key: 'methods', value: string[]): void;
	        (key: 'mode', value: UrlRule.Mode): void;
	        (key: 'routeId', value: string): void;
	    }
	}
	export = UrlRule;

}
declare module 'mayhem/routing/Router' {
	import Application = require('mayhem/Application');
	import Observable = require('mayhem/Observable');
	import Promise = require('mayhem/Promise');
	import Request = require('mayhem/routing/Request');
	import UrlRule = require('mayhem/routing/UrlRule'); class Router extends Observable {
	    get: Router.Getters;
	    set: Router.Setters;
	    protected _routeInProgress: Promise<void>;
	    protected _rules: UrlRule[];
	    protected _rulesGetter(): UrlRule[];
	    protected _rulesSetter(value: any[]): void;
	    createUrl(routeId: string, kwArgs?: {}): string;
	    destroy(): void;
	    go(routeId: string, kwArgs?: {}): Promise<void>;
	    protected _goToRoute(routeInfo: Router.RouteInfo): IPromise<void>;
	    protected _handleRequest(request: Request): Promise<void>;
	    _initialize(): void;
	    protected _loadRoute(routeId: string): Promise<Router.Route>;
	    protected _parseRequest(request: Request): Router.RouteInfo;
	} module Router {
	    interface Getters extends Observable.Getters {
	        (key: 'app'): Application;
	        (key: 'currentRoute'): Route;
	        (key: 'defaultRoute'): RouteInfo;
	        (key: 'routes'): HashMap<any>;
	        (key: 'rules'): UrlRule[];
	    }
	    interface RouteInfo {
	        routeId: string;
	        kwArgs?: {};
	    }
	    interface Route {
	        beforeEnter?(kwArgs: {}): Promise<void>;
	        beforeEnter?(kwArgs: {}): void;
	        beforeExit?(kwArgs: {}): Promise<void>;
	        beforeExit?(kwArgs: {}): void;
	        destroy(): void;
	        enter(kwArgs: {}): Promise<void>;
	        enter(kwArgs: {}): void;
	        exit?(kwArgs: {}): Promise<void>;
	        exit?(kwArgs: {}): void;
	        update?(kwArgs: {}): Promise<void>;
	        update?(kwArgs: {}): void;
	    }
	    interface Setters extends Observable.Setters {
	        (key: 'defaultRoute', value: RouteInfo): void;
	        (key: 'routes', value: HashMap<any>): void;
	        (key: 'rules', value: UrlRule[]): void;
	    }
	}
	export = Router;

}
declare module 'mayhem/WebApplication' {
	import Application = require('mayhem/Application');
	import Master = require('mayhem/ui/Master');
	import Router = require('mayhem/routing/Router'); class WebApplication extends Application {
	    static _defaultConfig: {
	        components: {
	            binder: {
	                constructor: string;
	                constructors: string[];
	            };
	            errorHandler: {
	                constructor: string;
	            };
	            i18n: {
	                constructor: string;
	            };
	            scheduler: {
	                constructor: string;
	            };
	        };
	    };
	    get: WebApplication.Getters;
	    on: WebApplication.Events;
	    set: WebApplication.Setters;
	    /**
	     * The human-readable name of your application.
	     *
	     * @get
	     * @set
	     */
	    private _name;
	    /**
	     * The router component.
	     *
	     * @get
	     * @set
	     * @default module:mayhem/routing/HashRouter
	     */
	    private _router;
	    /**
	     * The user interface component.
	     *
	     * @get
	     * @set
	     * @default module:mayhem/ui/Master
	     */
	    private _ui;
	} module WebApplication {
	    interface Events extends Application.Events {
	    }
	    interface Getters extends Application.Getters {
	        (key: 'name'): string;
	        (key: 'router'): Router;
	        (key: 'ui'): Master;
	    }
	    interface Setters extends Application.Setters {
	        (key: 'name', value: string): void;
	        (key: 'router', value: Router): void;
	        (key: 'ui', value: Master): void;
	    }
	}
	export = WebApplication;

}
declare module 'mayhem/ui/Widget' {
	import ClassList = require('mayhem/ui/style/ClassList');
	import core = require('mayhem/interfaces');
	import ObservableEvented = require('mayhem/ObservableEvented');
	import WebApplication = require('mayhem/WebApplication');
	interface Widget extends ObservableEvented {
	    get: Widget.Getters;
	    on: Widget.Events;
	    set: Widget.Setters;
	    detach(): any;
	} module Widget {
	    interface Events extends ObservableEvented.Events {
	        (type: 'pointercancel', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointerdown', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointerenter', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointerleave', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointermove', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointerout', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointerover', listener: core.IEventListener<core.IEvent>): IHandle;
	        (type: 'pointerup', listener: core.IEventListener<core.IEvent>): IHandle;
	    }
	    interface Getters extends ObservableEvented.Getters {
	        (key: 'app'): WebApplication;
	        (key: 'class'): string;
	        (key: 'classList'): ClassList;
	        (key: 'id'): string;
	        (key: 'index'): number;
	        (key: 'isAttached'): boolean;
	        (key: 'parent'): Widget;
	    }
	    interface Setters extends ObservableEvented.Setters {
	        (key: 'app', value: WebApplication): void;
	        (key: 'class', value: string): void;
	        (key: 'id', value: string): void;
	        (key: 'isAttached', value: boolean): void;
	        (key: 'parent', value: Widget): void;
	    }
	} var Widget: {
	    new (kwArgs: HashMap<any>): Widget;
	    prototype: Widget;
	};
	export = Widget;

}
declare module 'mayhem/ui/View' {
	import Widget = require('mayhem/ui/Widget');
	interface View extends Widget {
	    get: View.Getters;
	    on: View.Events;
	    set: View.Setters;
	} module View {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'model'): Object;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'model', value: Object): void;
	    }
	} var View: {
	    new (kwArgs: HashMap<any>): View;
	    prototype: View;
	};
	export = View;

}
declare module 'mayhem/ErrorHandler' {
	import Observable = require('mayhem/Observable'); class ErrorHandler extends Observable {
	    private _app;
	    private _handleGlobalErrors;
	    private _handle;
	    get: ErrorHandler.Getters;
	    set: ErrorHandler.Setters;
	    _initialize(): void;
	    destroy(): void;
	    handleError(error: Error): void;
	    run(): void;
	} module ErrorHandler {
	    interface Getters extends Observable.Getters {
	        (key: 'handleGlobalErrors'): boolean;
	    }
	    interface Setters extends Observable.Setters {
	        (key: 'handleGlobalErrors', value: boolean): void;
	    }
	}
	export = ErrorHandler;

}
declare module 'mayhem/LogLevel' {
	 enum LogLevel {
	    ERROR = 0,
	    WARN = 1,
	    LOG = 2,
	    INFO = 3,
	    DEBUG = 4,
	}
	export = LogLevel;

}
declare module 'mayhem/Scheduler' {
	 class Scheduler {
	    private _callbacks;
	    private _dispatch;
	    private _postCallbacks;
	    private _timer;
	    constructor();
	    afterNext(callback: (...args: any[]) => void): IHandle;
	    dispatch(): void;
	    schedule(id: string, callback: () => void): IHandle;
	}
	export = Scheduler;

}
declare module 'mayhem/Application' {
	import binding = require('mayhem/binding/interfaces');
	import core = require('mayhem/interfaces');
	import ErrorHandler = require('mayhem/ErrorHandler');
	import LogLevel = require('mayhem/LogLevel');
	import ObservableEvented = require('mayhem/ObservableEvented');
	import Scheduler = require('mayhem/Scheduler'); class Application extends ObservableEvented {
	    /**
	     * The default configuration for the Application class.
	     *
	     * @protected
	     */
	    static _defaultConfig: {
	        components: {
	            binder: {
	                constructor: string;
	                constructors: string[];
	            };
	            errorHandler: {
	                constructor: string;
	            };
	            i18n: {
	                constructor: string;
	            };
	            scheduler: {
	                constructor: string;
	            };
	        };
	    };
	    /**
	     * The data binder component.
	     *
	     * @get
	     * @set
	     * @default module:mayhem/binding/Binder
	     */
	    private _binder;
	    /**
	     * A hash map of application components that will be dynamically loaded and set on the Application object when it is
	     * {@link module:mayhem/Application#run started}. The values of the map are {@link TODO keyword arguments}
	     * objects that should be passed to a constructor function, plus a `constructor` key indicating the constructor
	     * function to use. The `constructor` value can either be a module ID, in which case the module will be dynamically
	     * loaded at runtime and its value used as the constructor, or a constructor function, in which case it will be used
	     * as-is. The constructor must accept a keyword arguments object as its only argument.
	     *
	     * @get
	     * @set
	     */
	    private _components;
	    /**
	     * The error handler component.
	     *
	     * @get
	     * @set
	     * @default module:mayhem/ErrorHandler
	     */
	    private _errorHandler;
	    /**
	     * The event scheduler component.
	     *
	     * @get
	     * @set
	     * @default module:mayhem/Scheduler
	     */
	    private _scheduler;
	    get: Application.Getters;
	    on: Application.Events;
	    set: Application.Setters;
	    constructor(kwArgs?: HashMap<any>);
	    destroy(): void;
	    handleError(error: Error): void;
	    log(message: string, level?: LogLevel, category?: string): void;
	    /**
	     * Starts the application. Once this method has been called, the {@link module:mayhem/Application#components}
	     * property may no longer be modified.
	     *
	     * @returns A promise that is resolved once all application components have loaded and started.
	     */
	    run(): IPromise<Application>;
	} module Application {
	    interface Events extends ObservableEvented.Events, core.IApplication.Events {
	    }
	    interface Getters extends ObservableEvented.Getters {
	        (key: 'binder'): binding.IBinder;
	        (key: 'components'): HashMap<HashMap<any>>;
	        (key: 'errorHandler'): ErrorHandler;
	        (key: 'scheduler'): Scheduler;
	    }
	    interface Setters extends ObservableEvented.Setters {
	        (key: 'binder', value: binding.IBinder): void;
	        (key: 'components', value: HashMap<HashMap<any>>): void;
	        (key: 'errorHandler', value: ErrorHandler): void;
	        (key: 'scheduler', value: Scheduler): void;
	    }
	}
	export = Application;

}
declare module 'mayhem/Event' {
	import core = require('mayhem/interfaces'); class Event implements core.IEvent {
	    bubbles: boolean;
	    cancelable: boolean;
	    currentTarget: any;
	    defaultPrevented: boolean;
	    immediatePropagationStopped: boolean;
	    propagationStopped: boolean;
	    target: any;
	    timestamp: number;
	    type: string;
	    constructor(kwArgs?: any);
	    preventDefault(): void;
	    stopImmediatePropagation(): void;
	    stopPropagation(): void;
	}
	export = Event;

}
declare module 'mayhem/i18n/IntlMessageFormat' {
	 var out: typeof IntlMessageFormat;
	export = out;

}
declare module 'mayhem/I18n' {
	import currencyFormatter = require('dojo/currency');
	import dateFormatter = require('dojo/date/locale');
	import numberFormatter = require('dojo/number');
	import Observable = require('mayhem/Observable');
	import Promise = require('mayhem/Promise'); class I18n extends Observable {
	    private _loadedBundles;
	    protected _locale: string;
	    protected _messages: I18n.Dictionary;
	    protected _preload: string[];
	    get: I18n.Getters;
	    set: I18n.Setters;
	    _initialize(): void;
	    _formatCurrencyDependencies(): string[];
	    formatCurrency(amount: number, options?: currencyFormatter.IFormatOptions): string;
	    _formatDateDependencies(): string[];
	    formatDate(date: Date, options?: dateFormatter.IFormatOptions): string;
	    _formatNumberDependencies(): string[];
	    formatNumber(number: number, options?: numberFormatter.IFormatOptions): string;
	    protected _getDefaultLocale(): string;
	    loadBundle(id: string): Promise<void>;
	    _parseCurrencyDependencies(): string[];
	    parseCurrency(amount: string, options?: currencyFormatter.IParseOptions): number;
	    _parseDateDependencies(): string[];
	    parseDate(date: string, options?: dateFormatter.IFormatOptions): Date;
	    _parseNumberDependencies(): string[];
	    parseNumber(number: string, options?: numberFormatter.IParseOptions): number;
	    run(): Promise<void>;
	    switchToLocale(locale: string): Promise<void>;
	} module I18n {
	    type Dictionary = HashMap<(values: {}) => string>;
	    interface Getters extends Observable.Getters {
	        (key: 'locale'): string;
	        (key: 'messages'): I18n.Dictionary;
	        (key: 'preload'): string[];
	    }
	    interface Setters extends Observable.Setters {
	        (key: 'locale', value: string): void;
	        (key: 'preload', value: string[]): void;
	    }
	}
	export = I18n;

}
declare module 'mayhem/WeakMap' {
	 var Ctor: typeof WeakMap;
	interface Ctor<K, V> extends WeakMap<K, V> {
	}
	export = Ctor;

}
declare module 'mayhem/auth/User' {
	import Observable = require('mayhem/Observable'); class User extends Observable {
	    get: User.Getters;
	    set: User.Setters;
	    /**
	     * Whether or not the current user is authenticated. @protected
	     */
	    _isAuthenticated: boolean;
	    /**
	     * User-specific data about the currently authenticated user. @protected
	     */
	    _state: Object;
	    /**
	     * Performs a login for the current user. If successful, the user object is set to authenticated and its state
	     * property is updated with the data returned by the `authenticate` method. Data passed to the `login` method is
	     * arbitrary based on the needs of an implementation and is simply passed through to the `authenticate` method.
	     *
	     * @param kwArgs Parameters used to login this User.
	     *
	     * @returns a Promise that resolves with an object containing the user information.
	     */
	    login(kwArgs: Object): IPromise<Object>;
	    /**
	     * An abstract method that should be implemented by subclasses.
	     *
	     * @param kwArgs Parameters used to authenticate this User.
	     *
	     * @returns a Promise that resolves with an object containing user information when authentication is successful, or
	     * rejects with an appropriate error message when authentication is unsuccessful.
	     */
	    authenticate(kwArgs: Object): IPromise<Object>;
	    /**
	     * Performs a logout of the current user by clearing the authenticated flag and state information.
	     */
	    logout(): void;
	    /**
	     * Checks whether or not the current user has access to perform the given operation.
	     *
	     * @param operation The name of the operation.
	     * @param kwArgs Additional parameters used to validate the operation.
	     *
	     * @returns A boolean corresponding to whether or not the user is authorized to complete the given operation. If
	     * asynchronous access control checks are required, the method should return a Promise instead that resolves to a
	     * boolean true or false.
	     */
	    checkAccess(operation: string, kwArgs?: Object): any;
	} module User {
	    interface Getters extends Observable.Getters {
	        (key: 'isAuthenticated'): boolean;
	        (key: 'state'): Object;
	    }
	    interface Setters extends Observable.Setters {
	        (key: 'isAuthenticated', value: boolean): void;
	        (key: 'state', value: Object): void;
	    }
	}
	export = User;

}
declare module 'mayhem/binding/BindingError' {
	import binding = require('mayhem/binding/interfaces');
	interface BindingError extends Error {
	    kwArgs: binding.IBindingArguments;
	} var BindingError: {
	    new (message: string, kwArgs: binding.IBindingArguments): BindingError;
	    prototype: BindingError;
	};
	export = BindingError;

}
declare module 'mayhem/binding/Binder' {
	import binding = require('mayhem/binding/interfaces');
	import Promise = require('mayhem/Promise'); class Binder implements binding.IBinder {
	    private _bindingRegistry;
	    /**
	     * The list of Binding constructors available for use by this data binder.
	     *
	     * @get
	     */
	    private _constructors;
	    /**
	     * Whether or not to use the {@link module:mayhem/Scheduler event scheduler} when creating new bindings.
	     *
	     * @get
	     * @set
	     * @default false
	     */
	    private _useScheduler;
	    constructor(kwArgs: Binder.KwArgs);
	    /**
	     * Registers a new Binding constructor with the data binder. This method can be used to dynamically add and remove
	     * support for different bindings at runtime.
	     *
	     * @param Ctor The Binding constructor.
	     * @param index The priority of the newly added constructor. Constructors closer to zero are evaluated first.
	     * @returns A handle that can be used to remove the Binding constructor from the data binder.
	     */
	    add(Ctor: binding.IBindingConstructor, index?: number): IHandle;
	    /**
	     * Creates a data binding between two objects.
	     *
	     * @param kwArgs The binding arguments for how a data binding should be created.
	     * @returns A handle that can be used to remove the binding or change its source, target, or direction.
	     */
	    bind<T>(kwArgs: binding.IBindArguments): binding.IBindingHandle;
	    /**
	     * Creates a Binding object that can be used to observe changes to the property of an object.
	     *
	     * @param object The object to bind to.
	     * @param path The binding path to use.
	     * @param options Additional options to use when creating the binding.
	     * @param options.scheduled Whether or not to use the event scheduler to defer notification of the changed value
	     * until the next event loop. This improves binding efficiency by ensuring that a bound target property will only
	     * change once per event loop, no matter how many times it is set. This defaults to the `useScheduler` property of
	     * the Binder instance.
	     * @returns A new Binding object.
	     */
	    createBinding<T>(object: Object, path: string, options?: {
	        useScheduler?: boolean;
	    }): binding.IBinding<T>;
	    notify(object: {}, property: string, change: binding.IChangeRecord<any>): void;
	    observe(object: {}, property: string, observer: binding.IObserver<any>): IHandle;
	    run(): Promise<void>;
	    /**
	     * Tests whether or not the data binder will be able to successfully create a data binding using the given
	     * arguments.
	     *
	     * @param kwArgs The binding arguments to test.
	     * @returns `true` if the binding is possible.
	     */
	    test(kwArgs: binding.IBindArguments): boolean;
	} module Binder {
	    interface KwArgs {
	        constructors: any[];
	        useScheduler?: boolean;
	    }
	}
	export = Binder;

}
declare module 'mayhem/binding/Binding' {
	import binding = require('mayhem/binding/interfaces'); class Binding<T> implements binding.IBinding<T> {
	    /**
	     * @protected
	     */
	    _binder: binding.IBinder;
	    /**
	     * @protected
	     */
	    _observers: binding.IObserver<T>[];
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    notify(change: binding.IChangeRecord<any>): void;
	    observe(observer: binding.IObserver<T>, invokeImmediately?: boolean): IHandle;
	}
	export = Binding;

}
declare module 'mayhem/binding/bindings/ArrayBinding' {
	import Binding = require('mayhem/binding/Binding');
	import binding = require('mayhem/binding/interfaces'); class ArrayBinding<T extends Array<any>> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    private _object;
	    constructor(kwArgs: binding.IBindingArguments);
	    getObject(): {};
	    destroy(): void;
	}
	export = ArrayBinding;

}
declare module 'mayhem/binding/bindings/CollectionBinding' {
	import Binding = require('mayhem/binding/Binding');
	import binding = require('mayhem/binding/interfaces'); class CollectionBinding extends Binding<dstore.ICollection<any>> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    private _handle;
	    private _object;
	    constructor(kwArgs: binding.IBindingArguments);
	    getObject(): {};
	    destroy(): void;
	}
	export = CollectionBinding;

}
declare module 'mayhem/binding/bindings/CollectionLengthBinding' {
	import Binding = require('mayhem/binding/Binding');
	import binding = require('mayhem/binding/interfaces'); class CollectionLengthBinding extends Binding<number> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    private _handle;
	    private _object;
	    private _value;
	    constructor(kwArgs: binding.IBindingArguments);
	    get(): number;
	    getObject(): {};
	    destroy(): void;
	}
	export = CollectionLengthBinding;

}
declare module 'mayhem/binding/bindings/CompositeBinding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class CompositeBinding extends Binding<string> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The decomposed parts of the source binding.
	     */
	    private _parts;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): string;
	}
	export = CompositeBinding;

}
declare module 'mayhem/binding/bindings/ObjectTargetBinding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class ObjectTargetBinding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The object containing the final property to be bound.
	     * @protected
	     */
	    _object: any;
	    /**
	     * The key for the final property to be bound.
	     * @protected
	     */
	    _property: string;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    set(value: T): void;
	}
	export = ObjectTargetBinding;

}
declare module 'mayhem/binding/bindings/DomInputBinding' {
	import binding = require('mayhem/binding/interfaces');
	import ObjectTargetBinding = require('mayhem/binding/bindings/ObjectTargetBinding'); class DomInputBinding<T> extends ObjectTargetBinding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The watch handle for the bound object.
	     */
	    private _handle;
	    /**
	     * The object containing the final property to be bound.
	     * @protected
	     */
	    _object: HTMLInputElement;
	    /**
	     * @protected
	     */
	    _property: string;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	}
	export = DomInputBinding;

}
declare module 'mayhem/binding/bindings/Es5Binding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class Es5Binding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The bound object.
	     */
	    private _object;
	    /**
	     * The original property descriptor for the bound object.
	     */
	    private _originalDescriptor;
	    /**
	     * The property descriptor generated for this binding.
	     */
	    private _ownDescriptor;
	    /**
	     * The name of the property to bind on the source object.
	     */
	    private _property;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    set(value: T): void;
	}
	export = Es5Binding;

}
declare module 'mayhem/binding/bindings/Es7Binding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class Es7Binding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The object containing the final property to be bound.
	     * @protected
	     */
	    _object: any;
	    /**
	     * The key for the final property to be bound.
	     * @protected
	     */
	    _property: string;
	    private _observer;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    set(value: T): void;
	}
	export = Es7Binding;

}
declare module 'mayhem/binding/bindings/NestedBinding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class NestedBinding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The string that identifies the sub-property to be bound.
	     */
	    private _path;
	    /**
	     * The watch handles for each binding.
	     */
	    private _bindings;
	    /**
	     * The property at the end of the bound chain of properties.
	     */
	    private _source;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    /**
	     * Removes and rebinds to all objects in the object chain.
	     */
	    private _rebind(fromObject, fromIndex);
	    set(value: T): void;
	}
	export = NestedBinding;

}
declare module 'mayhem/binding/bindings/ObjectMethodBinding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class ObjectMethodBinding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    private _args;
	    private _callee;
	    private _dependencies;
	    private _object;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	}
	export = ObjectMethodBinding;

}
declare module 'mayhem/binding/bindings/ObservableBinding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class ObservableBinding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The watch handle for the bound object.
	     */
	    private _handle;
	    /**
	     * The object containing the final property to be bound.
	     */
	    private _object;
	    /**
	     * The key for the final property to be bound.
	     */
	    private _property;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    set(value: T): void;
	}
	export = ObservableBinding;

}
declare module 'mayhem/binding/bindings/StatefulBinding' {
	import binding = require('mayhem/binding/interfaces');
	import Binding = require('mayhem/binding/Binding'); class StatefulBinding<T> extends Binding<T> {
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    /**
	     * The watch handle for the bound object.
	     */
	    private _handle;
	    /**
	     * The object containing the final property to be bound.
	     */
	    private _object;
	    /**
	     * The key for the final property to be bound.
	     */
	    private _property;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    set(value: T): void;
	}
	export = StatefulBinding;

}
declare module 'mayhem/validation/ValidationError' {
	interface ValidationError extends Error {
	    options: {
	        [key: string]: any;
	    };
	    toString(options?: {
	        [key: string]: any;
	    }): string;
	} var ValidationError: {
	    new (message: string, options?: {
	        [key: string]: any;
	    }): ValidationError;
	    prototype: ValidationError;
	};
	export = ValidationError;

}
declare module 'mayhem/validation/Validator' {
	import data = require('mayhem/data/interfaces'); class Validator {
	    options: Validator.IOptions;
	    constructor(options?: typeof Validator.prototype.options);
	    /**
	     * The function that must be implemented by all validators
	     * which is called to validate a field of a data model. This
	     * function accepts up to three arguments.
	     *
	     * @param {module:mayhem/data/Model} model The object being validated.
	     * @param {string} key The name of the field being validated.
	     * @param {any} value The value of the field being validated.
	     * @returns {boolean} If `false` is returned, all other validators for the given field will be skipped.
	     * Otherwise, return nothing.
	     */
	    validate(model: data.IModel, key: string, value: any): void;
	} module Validator {
	    /**
	     * A hash map of options for the validator to use when deciding
	     * whether or not the given value is valid.
	     */
	    interface IOptions {
	        /**
	         * If true, and the value of the field is
	         * null, undefined, or empty string, the validator will be
	         * skipped.
	         */
	        allowEmpty?: boolean;
	        /**
	         * If provided, and the current `scenario` property of the model being validated does not match any
	         * of the listed scenarios, the validator will be skipped.
	         */
	        scenarios?: string[];
	    }
	}
	export = Validator;

}
declare module 'mayhem/data/interfaces' {
	import core = require('mayhem/interfaces');
	import ValidationError = require('mayhem/validation/ValidationError');
	import Validator = require('mayhem/validation/Validator');

	export interface IModel extends core.IObservable {
		/**
		 * Retrieves the value of a property on the model.
		 */
		get:IModel.Getters;

		/**
		 * Sets the value of a property on the model.
		 */
		set:IModel.Setters;

		addError(key:string, error:ValidationError):void;

		clearErrors(key?:string):void;

		/**
		 * Validates the data model.
		 *
		 * @param keys
		 * Passing a list of keys will cause only those keys to be validated. By default, all keys on the model are
		 * validated.
		 *
		 * @returns
		 * A promise that resolves when validation completes, or is rejected with error if there is an unhandled exception
		 * during validation. The resolved value is `true` if the model validated successfully, or `false` if the model
		 * experienced a validation failure. Once validated, errors can be retrieved by calling
		 * `Model#getMetadata('errors')` (for all model errors) or `Model#property(key).getMetadata('errors')` for a
		 * specific field.
		 */
		validate(keys?:string[]):IPromise<boolean>;
	}

	export module IModel {
		export interface Getters extends core.IObservable.Getters {
			(key:'app'):core.IApplication;
			(key:'autoSave'):boolean;
			(key:'autoValidate'):boolean;
			(key:'isDirty'):boolean;
			(key:'isExtensible'):boolean;
			(key:'isValid'):boolean;
			(key:'labels'):HashMap<string>;
			(key:'scenario'):string;
			(key:'scenarios'):HashMap<string[]>;
			(key:'validators'):HashMap<Validator[]>;
		}
		export interface Setters extends core.IObservable.Setters {
			(key:'autoSave', value:boolean):void;
			(key:'autoValidate', value:boolean):void;
			(key:'isExtensible', value:boolean):void;
			(key:'labels', value:HashMap<string>):void;
			(key:'scenario', value:string):void;
			(key:'scenarios', value:HashMap<string[]>):void;
			(key:'validators', value:HashMap<Validator[]>):void;
		}
	}

	export interface IPersistentModel extends IModel {
		get:IPersistentModel.Getters;
		set:IPersistentModel.Setters;

		remove():IPromise<void>;
		save(skipValidation?:boolean):IPromise<void>;
	}

	export module IPersistentModel {
		export interface Getters extends IModel.Getters {
			(key:'store'):dstore.ICollection<IPersistentModel>;
		}

		export interface Setters extends IModel.Setters {
			(key:'store', value:dstore.ICollection<IPersistentModel>):void;
		}
	}

	export interface IProxyModel<T> extends IModel {
		get:IProxyModel.Getters<T>;
		set:IProxyModel.Setters<T>;
	}

	export module IProxyModel {
		export interface Getters<T> extends IModel.Getters {
			(key:'model'):T;
		}
		export interface Setters<T> extends IModel.Setters {
			(key:'model', value:T):void;
		}
	}

	export interface IModelConstructor {
		new (kwArgs?:HashMap<any>):IModel;
	}

	// TODO: Rename interfaces.d.ts to ../<package name>.d.ts

}
declare module 'mayhem/data/Model' {
	import core = require('mayhem/interfaces');
	import data = require('mayhem/data/interfaces');
	import Observable = require('mayhem/Observable');
	import ValidationError = require('mayhem/validation/ValidationError'); class Model extends Observable implements data.IModel {
	    /**
	     * @protected
	     */
	    static _app: any;
	    static setDefaultApp(app: any): void;
	    /**
	     * @protected
	     */
	    _app: core.IApplication;
	    /**
	     * @protected
	     */
	    _autoValidate: boolean;
	    /**
	     * @protected
	     */
	    _autoSave: boolean;
	    /**
	     * @protected
	     */
	    _errors: HashMap<ValidationError[]>;
	    /**
	     * @protected
	     */
	    _isExtensible: boolean;
	    /**
	     * @protected
	     */
	    _scenario: string;
	    private _currentScenarioKeys;
	    private _dirtyProperties;
	    private _initializing;
	    private _validatorInProgress;
	    get: Model.Getters;
	    set: Model.Setters;
	    constructor(kwArgs?: HashMap<any>);
	    _initialize(): void;
	    addError(key: string, error: ValidationError): void;
	    clearErrors(key?: string): void;
	    commit(): void;
	    destroy(): void;
	    _isDirtyGetter(): boolean;
	    _isValidGetter(): boolean;
	    revert(keysToRevert?: string[]): void;
	    _scenarioGetter(): string;
	    _scenarioSetter(value: string): void;
	    toJSON(): {};
	    validate(keysToValidate?: string[]): IPromise<boolean>;
	} module Model {
	    interface Getters extends data.IModel.Getters {
	    }
	    interface Setters extends data.IModel.Setters {
	    }
	}
	export = Model;

}
declare module 'mayhem/data/PersistentModel' {
	import Model = require('mayhem/data/Model');
	import data = require('mayhem/data/interfaces');
	import Promise = require('mayhem/Promise'); class PersistentModel extends Model implements data.IPersistentModel {
	    /**
	     * @get
	     * @set
	     */
	    _store: dstore.ICollection<data.IModel>;
	    get: PersistentModel.Getters;
	    set: PersistentModel.Setters;
	    static store: dstore.ICollection<data.IPersistentModel>;
	    static setDefaultStore(store: dstore.ICollection<data.IPersistentModel>): void;
	    static findAll(query: any): dstore.ICollection<data.IPersistentModel>;
	    static get(id: any): Promise<data.IPersistentModel>;
	    remove(): IPromise<any>;
	    _restore(Ctor: new (...args: any[]) => Model): Model;
	    save(skipValidation?: boolean): IPromise<void>;
	} module PersistentModel {
	    interface Getters extends Model.Getters, data.IPersistentModel.Getters {
	    }
	    interface Setters extends Model.Setters, data.IPersistentModel.Setters {
	    }
	}
	export = PersistentModel;

}
declare module 'mayhem/data/Proxy' {
	import core = require('mayhem/interfaces');
	import data = require('mayhem/data/interfaces');
	import Observable = require('mayhem/Observable'); class Proxy<T> extends Observable {
	    static forCollection<T extends data.IModel>(collection: dstore.ISyncCollection<T>): dstore.ISyncCollection<Proxy<T>>;
	    static forCollection<T extends data.IModel>(collection: dstore.ICollection<T>): dstore.ICollection<Proxy<T>>;
	    static forCollection<T extends Proxy<data.IModel>>(collection: dstore.ISyncCollection<T>): dstore.ISyncCollection<Proxy<T>>;
	    static forCollection<T extends Proxy<data.IModel>>(collection: dstore.ICollection<T>): dstore.ICollection<Proxy<T>>;
	    /**
	     * @protected
	     */
	    _app: core.IApplication;
	    /**
	     * @protected
	     */
	    _target: T;
	    private _initializing;
	    private _targetHandles;
	    get: Proxy.Getters;
	    set: Proxy.Setters;
	    constructor(kwArgs: HashMap<any>);
	    _initialize(): void;
	    private _createTargetBinding(key);
	    destroy(): void;
	    observe(key: any, observer: core.IObserver<any>): IHandle;
	    _targetGetter(): T;
	    _targetSetter(target: T): void;
	} module Proxy {
	    interface Getters extends Observable.Getters {
	        (key: 'target'): Observable;
	    }
	    interface Setters extends Observable.Setters {
	        (key: 'target', value: Observable): void;
	    }
	}
	export = Proxy;

}
declare module 'mayhem/data/stores/DomStorage' {
	import Memory = require('dstore/Memory');
	interface DomStorage<T> extends Memory<T> {
	    key: string;
	    storage: Storage;
	    filter(query: string): DomStorage<T>;
	    filter(query: {}): DomStorage<T>;
	    filter(query: (item: T, index: number) => boolean): DomStorage<T>;
	    sort(property: string, descending?: boolean): DomStorage<T>;
	    sort(property: (a: T, b: T) => number, descending?: boolean): DomStorage<T>;
	    track(): DomStorage<T>;
	} var DomStorage: new (...args: any[]) => DomStorage<any>;
	export = DomStorage;

}
declare module 'mayhem/routing/HashRouter' {
	import Promise = require('mayhem/Promise');
	import Router = require('mayhem/routing/Router'); class HashRouter extends Router {
	    protected _handle: IHandle;
	    protected _oldHash: string;
	    protected _prefix: string;
	    get: HashRouter.Getters;
	    set: HashRouter.Setters;
	    createUrl(routeId: string, kwArgs?: {}): string;
	    destroy(): void;
	    go(routeId: string, kwArgs?: {}): Promise<void>;
	    protected _handleHashChange(newHash: string): Promise<void>;
	    _initialize(): void;
	    protected _listen(): void;
	    run(): void;
	} module HashRouter {
	    interface Getters extends Router.Getters {
	        (key: 'prefix'): string;
	    }
	    interface Setters extends Router.Setters {
	        (key: 'prefix', value: string): void;
	    }
	}
	export = HashRouter;

}
declare module 'mayhem/ui/interfaces' {
	import core = require('mayhem/interfaces');
	import Master = require('mayhem/ui/Master');
	import Widget = require('mayhem/ui/Widget');

	export interface ClickEvent extends PointerEvent {
		numClicks:number;
	}

	export interface PointerEvent extends UiEvent {
		button:number;
		buttons:number;
		clientX:number;
		clientY:number;
		height:number;
		isPrimary:boolean;
		modifiers:PointerEvent.Modifiers;
		pointerId:number;
		pointerType:string;
		pressure:number;
		relatedTarget?:Widget;
		tiltX:number;
		tiltY:number;
		width:number;
	}

	export interface KeyboardEvent extends UiEvent {
		char:string;
		code:string;
		key:string;
	}

	export module PointerEvent {
		export interface Modifiers {
			alt:boolean;
			control:boolean;
			meta:boolean;
			shift:boolean;
			shortcut:boolean;
		}
	}

	export interface UiEvent extends core.IEvent {
		currentTarget:Widget;
		target:Widget;
		view:Master;
	}

}
declare module 'mayhem/ui/dom/actions' {
	import ui = require('mayhem/ui/interfaces');
	import Widget = require('mayhem/ui/dom/Widget');
	export interface ExtensionEvent {
	    (target: Widget, callback: (event?: ui.UiEvent) => void): IHandle;
	    symbol: string;
	}
	export var activate: ExtensionEvent;
	export var click: ExtensionEvent;

}
declare module 'mayhem/ui/AddPosition' {
	 enum AddPosition {
	    FIRST = 0,
	    LAST = -1,
	}
	export = AddPosition;

}
declare module 'mayhem/ui/Container' {
	import AddPosition = require('mayhem/ui/AddPosition');
	import Widget = require('mayhem/ui/Widget');
	interface Container extends Widget {
	    get: Container.Getters;
	    on: Container.Events;
	    set: Container.Setters;
	    add(child: Widget, position?: AddPosition): IHandle;
	    add(child: Widget, position?: number): IHandle;
	    empty(): void;
	    getChildIndex(child: Widget): number;
	    remove(position: number): void;
	    remove(child: Widget): void;
	} module Container {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'children'): Widget[];
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'children', value: Widget[]): void;
	    }
	} var Container: {
	    new (kwArgs: HashMap<any>): Container;
	    prototype: Container;
	};
	export = Container;

}
declare module 'mayhem/ui/common/Widget' {
	import ClassList = require('mayhem/ui/style/ClassList');
	import core = require('mayhem/interfaces');
	import IWidget = require('mayhem/ui/Widget');
	import ObservableEvented = require('mayhem/ObservableEvented');
	import WebApplication = require('mayhem/WebApplication'); class Widget extends ObservableEvented implements IWidget {
	    /**
	     * The {@link module:mayhem/Application} instance for this view.
	     *
	     * @get
	     * @set
	     * @protected
	     */
	    _app: WebApplication;
	    /**
	     * @protected
	     */
	    _classList: ClassList;
	    /**
	     * @protected
	     */
	    _id: string;
	    /**
	     * @protected
	     */
	    _index: number;
	    /**
	     * @protected
	     */
	    _isAttached: boolean;
	    /**
	     * @protected
	     */
	    _parent: IWidget;
	    get: Widget.Getters;
	    on: Widget.Events;
	    set: Widget.Setters;
	    constructor(kwArgs?: {});
	    _initialize(): void;
	    private _classGetter();
	    private _classSetter(value);
	    private _indexGetter();
	    destroy(): void;
	    /**
	     * @abstract
	     */
	    detach(): void;
	    emit(event: core.IEvent): boolean;
	    /**
	     * @abstract
	     * @protected
	     */
	    _render(): void;
	} module Widget {
	    interface Events extends IWidget.Events {
	    }
	    interface Getters extends IWidget.Getters {
	    }
	    interface Setters extends IWidget.Setters {
	    }
	}
	export = Widget;

}
declare module 'mayhem/ui/dom/Widget' {
	import CommonWidget = require('mayhem/ui/common/Widget'); class Widget extends CommonWidget {
	    get: Widget.Getters;
	    on: Widget.Events;
	    set: Widget.Setters;
	    /**
	     * @abstract
	     */
	    detach(): Node;
	} module Widget {
	    interface Events extends CommonWidget.Events {
	    }
	    interface Getters extends CommonWidget.Getters {
	        (key: 'firstNode'): Node;
	        (key: 'lastNode'): Node;
	        (key: 'parent'): Widget;
	    }
	    interface Setters extends CommonWidget.Setters {
	    }
	}
	export = Widget;

}
declare module 'mayhem/ui/dom/util' {
	import Master = require('mayhem/ui/dom/Master');
	import Widget = require('mayhem/ui/dom/Widget');
	export function extractContents(start: Node, end: Node, exclusive?: boolean): DocumentFragment;
	export var on: (target: EventTarget, type: string, listener: EventListener) => IHandle;
	/**
	 * Finds the nearest widget parent to the given node.
	 *
	 * @param node The node to find ownership over.
	 * @param master The master UI that the discovered widget should belong to.
	 * @returns The nearest widget.
	 */
	export function findNearestParent(master: Master, searchNode: Node): Widget;
	/**
	 * Given a DOM pointer, touch, or mouse event, find the nearest parent widget to the point on the page that emitted the
	 * event.
	 *
	 * @param x
	 * @param y
	 * @param master The master UI for the application. Searches shall never go above here.
	 * @returns The widget at the given point, or `null` if there is no widget belonging to the given master UI at the
	 * given point.
	 */
	export function findWidgetAt(master: Master, x: number, y: number): Widget;

}
declare module 'mayhem/ui/dom/events/KeyboardManager' {
	 class KeyboardManager {
	    private _handles;
	    private _listeners;
	    private _root;
	    constructor(root: EventTarget);
	    private _createKeyInfo(event);
	    destroy(): void;
	    private _emit(type, event);
	    on(type: 'down', listener: KeyboardManager.Listener): IHandle;
	    on(type: 'repeat', listener: KeyboardManager.Listener): IHandle;
	    on(type: 'up', listener: KeyboardManager.Listener): IHandle;
	    on(type: string, listener: KeyboardManager.Listener): void;
	} module KeyboardManager {
	    interface Listener {
	        (keyInfo: KeyboardManager.KeyInfo): boolean;
	    }
	    interface KeyInfo {
	        char: string;
	        code: string;
	        key: string;
	    }
	}
	export = KeyboardManager;

}
declare module 'mayhem/ui/dom/events/PointerManager' {
	import ui = require('mayhem/ui/interfaces'); class PointerManager {
	    private _handles;
	    private _listeners;
	    pointers: {
	        [pointerId: number]: PointerManager.Pointer;
	        numActive: number;
	    };
	    private static _keyboardActive;
	    constructor(root: EventTarget);
	    destroy(): void;
	    private _emit(event, pointer);
	    on(type: 'add', listener: PointerManager.Listener): IHandle;
	    on(type: 'cancel', listener: PointerManager.Listener): IHandle;
	    on(type: 'change', listener: PointerManager.Listener): IHandle;
	    on(type: 'remove', listener: PointerManager.Listener): IHandle;
	    on(type: string, listener: PointerManager.Listener): void;
	} module PointerManager {
	    interface Changes {
	        buttons: boolean;
	        clientX: boolean;
	        clientY: boolean;
	        height: boolean;
	        pressure: boolean;
	        tiltX: boolean;
	        tiltY: boolean;
	        width: boolean;
	    }
	    interface Listener {
	        (pointer: PointerManager.Pointer): boolean;
	    }
	    interface Pointer {
	        buttons: number;
	        clientX: number;
	        clientY: number;
	        height: number;
	        isActive: boolean;
	        isPrimary: boolean;
	        lastChanged: PointerManager.Changes;
	        lastState: Pointer;
	        modifiers: ui.PointerEvent.Modifiers;
	        pointerId: number;
	        pointerType: string;
	        pressure: number;
	        tiltX: number;
	        tiltY: number;
	        timestamp: number;
	        width: number;
	    }
	}
	export = PointerManager;

}
declare module 'mayhem/ui/dom/events/EventManager' {
	import Master = require('mayhem/ui/dom/Master'); class EventManager {
	    private _handles;
	    private _master;
	    private _keyboardManager;
	    private _pointerManager;
	    private _targets;
	    constructor(master: Master);
	    destroy(): void;
	    private _emitKeyboardEvent(type, keyInfo);
	    private _emitPointerEvent(type, pointer, target, relatedTarget?);
	    private _emitEnter(pointer, target, relatedTarget?);
	    private _emitLeave(pointer, target, relatedTarget?);
	    private _handlePointerAdd(pointer);
	    private _handlePointerCancel(pointer);
	    private _handlePointerChange(pointer);
	    private _handlePointerRemove(pointer);
	}
	export = EventManager;

}
declare module 'mayhem/ui/dom/MultiNodeWidget' {
	import Widget = require('mayhem/ui/dom/Widget'); class MultiNodeWidget extends Widget {
	    /**
	     * @protected
	     * @get
	     */
	    _firstNode: Comment;
	    /**
	     * @protected
	     */
	    _fragment: DocumentFragment;
	    /**
	     * @protected
	     * @get
	     */
	    _lastNode: Comment;
	    get: MultiNodeWidget.Getters;
	    on: MultiNodeWidget.Events;
	    set: MultiNodeWidget.Setters;
	    constructor(kwArgs?: HashMap<any>);
	    destroy(): void;
	    detach(): DocumentFragment;
	    _render(): void;
	} module MultiNodeWidget {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'firstNode'): Comment;
	        (key: 'lastNode'): Comment;
	    }
	    interface Setters extends Widget.Setters {
	    }
	}
	export = MultiNodeWidget;

}
declare module 'mayhem/ui/dom/View' {
	import IView = require('mayhem/ui/View');
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget'); class View extends MultiNodeWidget implements IView {
	    /**
	     * @protected
	     */
	    _model: Object;
	    get: View.Getters;
	    on: View.Events;
	    set: View.Setters;
	} module View {
	    interface Events extends MultiNodeWidget.Events, IView.Events {
	    }
	    interface Getters extends MultiNodeWidget.Getters, IView.Getters {
	    }
	    interface Setters extends MultiNodeWidget.Setters, IView.Setters {
	    }
	}
	export = View;

}
declare module 'mayhem/ui/dom/Master' {
	import EventManager = require('mayhem/ui/dom/events/EventManager');
	import IMaster = require('mayhem/ui/Master');
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget');
	import Promise = require('mayhem/Promise');
	import View = require('mayhem/ui/dom/View'); class Master extends MultiNodeWidget implements IMaster {
	    private _eventManager;
	    private _root;
	    private _view;
	    get: Master.Getters;
	    on: Master.Events;
	    set: Master.Setters;
	    constructor(kwArgs?: HashMap<any>);
	    destroy(): void;
	    _initialize(): void;
	    private _initializeView();
	    _rootGetter(): Element;
	    _rootSetter(root: Element): void;
	    run(): Promise<void>;
	    _viewGetter(): any;
	    _viewSetter(view: View): void;
	    _viewSetter(view: string): void;
	} module Master {
	    interface Events extends MultiNodeWidget.Events, IMaster.Events {
	    }
	    interface Getters extends MultiNodeWidget.Getters, IMaster.Getters {
	        (key: 'eventManager'): EventManager;
	        (key: 'root'): Element;
	    }
	    interface Setters extends MultiNodeWidget.Setters, IMaster.Setters {
	        (key: 'root', value: Element): void;
	    }
	}
	export = Master;

}
declare module 'mayhem/routing/HtmlHistoryRouter' {
	import Router = require('mayhem/routing/Router');
	export = Router;

}
declare module 'mayhem/templating/interfaces' {
	export interface INode {
		[key:string]:any;
		constructor:string;

		// Non-instantiated node
		$ctor?:INode;

		// Element node
		content?:any[];
		children?:INode[];

		// Conditional node
		conditions?:{ condition:{ $bind:string; }; consequent:INode; }[];
	}
	export interface IParser {
		parse(source:string):IParseTree;
	}

	export interface IParseTree {
		constructors:string[];
		root:INode;
	}

}
declare module 'mayhem/templating/html/peg/html' {
	import templating = require('mayhem/templating/interfaces');

	export function parse(source:string):templating.IParseTree;

}
declare module 'mayhem/templating/html' {
	import Widget = require('mayhem/ui/dom/Widget');
	export interface TemplatingAwareWidgetConstructor {
	    inheritsModel?: boolean;
	    new (kwArgs?: {}): Widget;
	    prototype: Widget;
	}
	/**
	 * Creates a Widget constructor from an HTML template.
	 *
	 * @param template A Mayhem HTML template.
	 * @returns A promise that resolves to an BindableWidget constructor.
	 */
	export function create(template: string): IPromise<typeof Widget>;
	export function createFromFile(filename: string): IPromise<typeof Widget>;
	/**
	 * Implementation of the AMD Loader Plugin API.
	 *
	 * @param resourceId The path to the template.
	 * @param require Context-specific require.
	 * @param load Callback function passed a templated widget constructor.
	 */
	export function load(resourceId: string, _: typeof require, load: (value: typeof Widget) => void): void;
	export function normalize(resourceId: string, normalize: (id: string) => string): string;

}
declare module 'mayhem/templating/html/binding/ProxyBinding' {
	import binding = require('mayhem/binding/interfaces');
	import BindDirection = require('mayhem/binding/BindDirection');
	import Binding = require('mayhem/binding/Binding'); class ProxyBinding<T> extends Binding<T> {
	    private _object;
	    private _path;
	    private _source;
	    static test(kwArgs: binding.IBindingArguments): boolean;
	    constructor(kwArgs: binding.IBindingArguments);
	    destroy(): void;
	    get(): T;
	    getObject(): {};
	    remove(): void;
	    set(value: T): void;
	    setDirection(direction: BindDirection): void;
	    setObject(value: {}): void;
	    setPath(value: string): void;
	    setSource(object: {}, path?: string): void;
	    setTarget(object: {}, path?: string): void;
	    private _switchSource();
	}
	export = ProxyBinding;

}
declare module 'mayhem/templating/html/ui/Conditional' {
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget');
	import View = require('mayhem/ui/dom/View'); class Conditional extends MultiNodeWidget {
	    static inheritsModel: boolean;
	    private _conditionBindings;
	    private _conditionObserveHandle;
	    private _conditions;
	    private _currentView;
	    private _modelObserver;
	    get: Conditional.Getters;
	    on: Conditional.Events;
	    set: Conditional.Setters;
	    _initialize(): void;
	    private _bindConditions();
	    destroy(): void;
	    private _evaluateConditions();
	    _conditionsGetter(): Conditional.ICondition[];
	    _conditionsSetter(value: Conditional.ICondition[]): void;
	    /**
	     * @protected
	     */
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	} module Conditional {
	    interface ICondition {
	        condition: any;
	        consequent: View;
	    }
	    interface Events extends View.Events {
	    }
	    interface Getters extends View.Getters {
	        (key: 'model'): {};
	        (key: 'conditions'): Conditional.ICondition[];
	    }
	    interface Setters extends View.Setters {
	        (key: 'model', value: {}): void;
	        (key: 'conditions', value: Conditional.ICondition[]): void;
	    }
	}
	export = Conditional;

}
declare module 'mayhem/ui/common/Container' {
	import Widget = require('mayhem/ui/Widget'); class ContainerMixin {
	    private _children;
	    private _isAttached;
	    get: Widget.Getters;
	    add(child: Widget): void;
	    /**
	     * @protected
	     */
	    _childrenGetter(): Widget[];
	    /**
	     * @protected
	     */
	    _childrenSetter(children: Widget[]): void;
	    destroy(): void;
	    empty(): void;
	    getChildIndex(child: Widget): number;
	    _initialize(): void;
	    /**
	     * @protected
	     */
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    remove(child: Widget): void;
	}
	export = ContainerMixin;

}
declare module 'mayhem/ui/dom/Container' {
	import AddPosition = require('mayhem/ui/AddPosition');
	import IContainer = require('mayhem/ui/Container');
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget');
	import Widget = require('mayhem/ui/dom/Widget'); class Container extends MultiNodeWidget implements IContainer {
	    /**
	     * @protected
	     */
	    _children: Widget[];
	    get: Container.Getters;
	    on: Container.Events;
	    set: Container.Setters;
	    constructor(kwArgs?: HashMap<any>);
	    _initialize(): void;
	    add(child: Widget, position?: AddPosition): IHandle;
	    add(child: Widget, position?: number): IHandle;
	    /**
	     * @protected
	     */
	    _childrenGetter(): Widget[];
	    /**
	     * @protected
	     */
	    _childrenSetter(children: Widget[]): void;
	    destroy(): void;
	    empty(): void;
	    getChildIndex(child: Widget): number;
	    /**
	     * @protected
	     */
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    remove(index: number): void;
	    remove(child: Widget): void;
	} module Container {
	    interface Events extends MultiNodeWidget.Events, IContainer.Events {
	    }
	    interface Getters extends MultiNodeWidget.Getters, IContainer.Getters {
	    }
	    interface Setters extends MultiNodeWidget.Setters, IContainer.Setters {
	    }
	}
	export = Container;

}
declare module 'mayhem/templating/html/ui/Element' {
	import Container = require('mayhem/ui/dom/Container');
	import ui = require('mayhem/ui/interfaces');
	import Widget = require('mayhem/ui/dom/Widget'); class ElementWidget extends Container {
	    static inheritsModel: boolean;
	    get: ElementWidget.Getters;
	    on: ElementWidget.Events;
	    set: ElementWidget.Setters;
	    private _bindingHandles;
	    /**
	     * An array of raw content consisting of HTML strings and one of three special objects:
	     *
	     * * `$bind` objects representing data bindings;
	     * * `$child` objects representing placeholders for positioned child widgets that existed within the HTML template;
	     * * `$placeholder` objects representing placeholders for named placeholders
	     *
	     * This property is only designed to be set at construction time.
	     */
	    private _content;
	    /**
	     * A map of event names to arrays of event listeners, used to force events to fire on the innermost targets first.
	     */
	    private _eventQueues;
	    /**
	     * A map of widgets currently assigned to the different placeholder properties within the ElementWidget.
	     */
	    private _placeholders;
	    _initialize(): void;
	    /**
	     * @override
	     */
	    _childrenGetter(): Widget[];
	    _childrenSetter(value: Widget[]): void;
	    destroy(): void;
	    _isAttachedSetter(value: boolean): void;
	    _render(): void;
	} module ElementWidget {
	    interface Events extends Container.Events {
	    }
	    interface Getters extends Container.Getters {
	        (key: 'model'): Object;
	    }
	    interface Setters extends Container.Setters {
	        (key: 'model', value: Object): void;
	    }
	    interface ElementPointerEvent extends ui.PointerEvent {
	        currentTargetNode: Element;
	        targetNode: Element;
	    }
	}
	export = ElementWidget;

}
declare module 'mayhem/templating/html/ui/Iterator' {
	import binding = require('mayhem/binding/interfaces');
	import Container = require('mayhem/ui/dom/Container');
	import View = require('mayhem/ui/View'); class Iterator<T> extends Container {
	    static inheritsModel: boolean;
	    get: Iterator.Getters<T>;
	    on: Iterator.Events<T>;
	    set: Iterator.Setters<T>;
	    protected _as: string;
	    protected _binding: binding.IBinding<{}>;
	    /**
	     * @get
	     * @set
	     */
	    protected _collection: dstore.ICollection<T>;
	    protected _collectionGetter(): dstore.ICollection<T>;
	    protected _collectionSetter(collection: dstore.ICollection<T>): void;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    /**
	     * @get
	     * @set
	     */
	    protected _itemConstructor: Iterator.IItemConstructor<T>;
	    constructor(kwArgs?: HashMap<any>);
	    destroy(): void;
	    protected _bind(): void;
	    protected _unbind(): void;
	    protected _refresh(): void;
	    protected _handleChange(change: binding.IChangeRecord<T>): void;
	} module Iterator {
	    interface Events<T> extends Container.Events {
	    }
	    interface Getters<T> extends Container.Getters {
	        (key: 'as'): string;
	        (key: 'collection'): dstore.ICollection<T>;
	        (key: 'itemConstructor'): Iterator.IItemConstructor<T>;
	    }
	    interface Setters<T> extends Container.Setters {
	        (key: 'as', value: string): void;
	        (key: 'collection', value: dstore.ICollection<T>): void;
	        (key: 'itemConstructor', value: Iterator.IItemConstructor<T>): void;
	    }
	    interface IItemConstructor<T> {
	        new (kwArgs?: HashMap<any>): View;
	        prototype: View;
	    }
	}
	export = Iterator;

}
declare module 'mayhem/templating/html/ui/Promise' {
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget');
	import Promise = require('mayhem/Promise');
	import Proxy = require('mayhem/data/Proxy');
	import View = require('mayhem/ui/View'); class PromiseWidget<T> extends MultiNodeWidget {
	    static inheritsModel: boolean;
	    private _as;
	    private _attachedView;
	    private _fulfilled;
	    private _pending;
	    private _pendingAs;
	    private _value;
	    private _rejected;
	    private _rejectedAs;
	    get: PromiseWidget.Getters<T>;
	    on: PromiseWidget.Events;
	    set: PromiseWidget.Setters<T>;
	    constructor(kwArgs?: HashMap<any>);
	    _initialize(): void;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    _valueGetter(): Promise<T>;
	    _valueSetter(value: T): void;
	    _valueSetter(value: Promise<T>): void;
	    _pendingGetter(): View;
	    _pendingSetter: (value: View) => void;
	    _rejectedGetter(): View;
	    _rejectedSetter: (value: View) => void;
	    _fulfilledGetter(): View;
	    _fulfilledSetter: (value: View) => void;
	    _model: Proxy<{}>;
	    _modelGetter(): {};
	    _modelSetter(value: {}): void;
	    destroy(): void;
	} module PromiseWidget {
	    interface Events extends MultiNodeWidget.Events {
	    }
	    interface Getters<T> extends MultiNodeWidget.Getters {
	        (key: 'pending'): View;
	        (key: 'value'): Promise<T>;
	        (key: 'rejected'): View;
	        (key: 'resolved'): View;
	    }
	    interface Setters<T> extends MultiNodeWidget.Setters {
	        (key: 'pending', value: View): void;
	        (key: 'value', value: T): void;
	        (key: 'value', value: Promise<T>): void;
	        (key: 'rejected', value: View): void;
	        (key: 'resolved', value: View): void;
	    }
	}
	export = PromiseWidget;

}
declare module 'mayhem/ui/Dialog' {
	import Container = require('mayhem/ui/Container');
	interface Dialog extends Container {
	    get: Dialog.Getters;
	    on: Dialog.Events;
	    set: Dialog.Setters;
	} module Dialog {
	    interface Events extends Container.Events {
	    }
	    interface Getters extends Container.Getters {
	        (key: 'isOpen'): boolean;
	        (key: 'title'): string;
	    }
	    interface Setters extends Container.Setters {
	        (key: 'isOpen', value: boolean): void;
	        (key: 'title', value: string): void;
	    }
	} var Dialog: {
	    new (kwArgs: HashMap<any>): Dialog;
	    prototype: Dialog;
	};
	export = Dialog;

}
declare module 'mayhem/ui/DropDown' {
	import Widget = require('mayhem/ui/Widget');
	interface DropDown extends Widget {
	    get: DropDown.Getters;
	    on: DropDown.Events;
	    set: DropDown.Setters;
	} module DropDown {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'children'): [Widget, Widget];
	        (key: 'dropDown'): Widget;
	        (key: 'isOpen'): boolean;
	        (key: 'label'): Widget;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'dropDown', value: Widget): void;
	        (key: 'isOpen', value: boolean): void;
	        (key: 'label', value: Widget): void;
	    }
	} var DropDown: {
	    new (kwArgs: HashMap<any>): DropDown;
	    prototype: DropDown;
	};
	export = DropDown;

}
declare module 'mayhem/ui/Label' {
	import Widget = require('mayhem/ui/Widget');
	interface Label extends Widget {
	    get: Label.Getters;
	    on: Label.Events;
	    set: Label.Setters;
	} module Label {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'formattedText'): string;
	        (key: 'text'): string;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'formattedText', value: string): void;
	        (key: 'text', value: string): void;
	    }
	} var Label: {
	    new (kwArgs: HashMap<any>): Label;
	    prototype: Label;
	};
	export = Label;

}
declare module 'mayhem/ui/ListView' {
	import Widget = require('mayhem/ui/Widget');
	interface ListView<T> extends Widget {
	    get: ListView.Getters<T>;
	    on: ListView.Events<T>;
	    set: ListView.Setters<T>;
	} module ListView {
	    interface Events<T> extends Widget.Events {
	    }
	    interface Getters<T> extends Widget.Getters {
	        (key: 'collection'): dstore.ICollection<T>;
	        (key: 'itemConstructor'): ListView.ItemConstructor<T>;
	    }
	    interface Setters<T> extends Widget.Setters {
	        (key: 'collection', value: dstore.ICollection<T>): void;
	        (key: 'itemConstructor', value: ListView.ItemConstructor<T>): void;
	    }
	    interface ItemConstructor<T> {
	        new (kwArgs?: HashMap<any>): ListView.Item<T>;
	        prototype: ListView.Item<T>;
	    }
	    interface Item<T> extends Widget {
	        get: Item.Getters<T>;
	        set: Item.Setters<T>;
	    }
	    module Item {
	        interface Getters<T> extends Widget.Getters {
	            (key: 'model'): T;
	        }
	        interface Setters<T> extends Widget.Setters {
	            (key: 'model', value: T): void;
	        }
	    }
	} var ListView: {
	    new <T>(kwArgs: HashMap<any>): ListView<T>;
	    prototype: ListView<{}>;
	};
	export = ListView;

}
declare module 'mayhem/ui/PlacePosition' {
	 enum PlacePosition {
	    FIRST = 0,
	    LAST = -1,
	    BEFORE = -2,
	    AFTER = -3,
	    ONLY = -4,
	    REPLACE = -5,
	}
	export = PlacePosition;

}
declare module 'mayhem/ui/common/View' {
	import Widget = require('mayhem/ui/common/Widget'); class View extends Widget {
	    get: View.Getters;
	    set: View.Setters;
	} module View {
	    interface Getters extends Widget.Getters {
	        (key: 'model'): Object;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'model', value: Object): void;
	    }
	}
	export = View;

}
declare module 'mayhem/ui/dom/SingleNodeWidget' {
	import Widget = require('mayhem/ui/dom/Widget'); class SingleNodeWidget extends Widget {
	    /**
	     * @protected
	     */
	    _node: Element;
	    constructor(kwArgs?: {});
	    destroy(): void;
	    detach(): Element;
	    _firstNodeGetter(): Element;
	    _lastNodeGetter(): Element;
	} module SingleNodeWidget {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'firstNode'): Element;
	        (key: 'lastNode'): Element;
	    }
	    interface Setters extends Widget.Setters {
	    }
	}
	export = SingleNodeWidget;

}
declare module 'mayhem/ui/dom/DijitWidget' {
	import SingleNodeWidget = require('mayhem/ui/dom/SingleNodeWidget');
	import _WidgetBase = require('dijit/_WidgetBase'); class DijitWidget extends SingleNodeWidget {
	    static Ctor: typeof _WidgetBase;
	    static setupMap: {
	        events?: HashMap<(event?: Event) => void>;
	        properties?: HashMap<string>;
	    };
	    protected _bindingHandles: IHandle[];
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _isDisabled: boolean;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _isFocused: boolean;
	    /**
	     * @protected
	     */
	    _widget: _WidgetBase;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    _isFocusedGetter(): boolean;
	    _isFocusedSetter(value: boolean): void;
	    _initialize(): void;
	    protected _bindWidget(): void;
	    protected _clearInternalBindings(): void;
	    /**
	     * @protected
	     */
	    _render(): void;
	    destroy(): void;
	} module DijitWidget {
	    interface Events extends SingleNodeWidget.Events {
	    }
	    interface Getters extends SingleNodeWidget.Getters {
	        (key: 'isDisabled'): boolean;
	        (key: 'isFocused'): boolean;
	    }
	    interface Setters extends SingleNodeWidget.Setters {
	        (key: 'isDisabled', value: boolean): void;
	        (key: 'isFocused', value: boolean): void;
	    }
	}
	export = DijitWidget;

}
declare module 'mayhem/ui/dom/Dialog' {
	import AddPosition = require('mayhem/ui/AddPosition');
	import DijitDialog = require('dijit/Dialog');
	import DijitWidget = require('mayhem/ui/dom/DijitWidget');
	import IDialog = require('mayhem/ui/Dialog');
	import Widget = require('mayhem/ui/dom/Widget'); class Dialog extends DijitWidget implements IDialog {
	    static Ctor: new (kwArgs?: Object, srcNodeRef?: HTMLElement) => DijitDialog;
	    protected _containerNode: HTMLElement;
	    _widget: DijitDialog;
	    protected _children: Widget[];
	    protected _childrenGetter(): Widget[];
	    protected _childrenSetter(children: Widget[]): void;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    protected _isOpen: boolean;
	    protected _isOpenGetter(): boolean;
	    protected _isOpenSetter(value: boolean): void;
	    protected _title: string;
	    protected _titleGetter(): string;
	    protected _titleSetter(title: string): void;
	    get: Dialog.Getters;
	    on: Dialog.Events;
	    set: Dialog.Setters;
	    constructor(kwArgs?: HashMap<any>);
	    _initialize(): void;
	    _render(): void;
	    add(child: Widget, position?: AddPosition): IHandle;
	    add(child: Widget, position?: number): IHandle;
	    destroy(): void;
	    empty(): void;
	    getChildIndex(child: Widget): number;
	    remove(index: number): void;
	    remove(child: Widget): void;
	} module Dialog {
	    interface Events extends DijitWidget.Events, IDialog.Events {
	    }
	    interface Getters extends DijitWidget.Getters, IDialog.Getters {
	    }
	    interface Setters extends DijitWidget.Setters, IDialog.Setters {
	    }
	}
	export = Dialog;

}
declare module 'mayhem/ui/dom/DropDown' {
	import IDropDown = require('mayhem/ui/DropDown');
	import SingleNodeWidget = require('mayhem/ui/dom/SingleNodeWidget');
	import Widget = require('mayhem/ui/dom/Widget');
	import ui = require('mayhem/ui/interfaces'); class DropDown extends SingleNodeWidget implements IDropDown {
	    get: DropDown.Getters;
	    on: DropDown.Events;
	    set: DropDown.Setters;
	    protected _dropDownNode: HTMLDivElement;
	    protected _globalHandle: IHandle;
	    protected _labelHandle: IHandle;
	    protected _labelNode: HTMLDivElement;
	    constructor(kwArgs?: {});
	    _childrenGetter(): [Widget, Widget];
	    _childrenSetter(children: [Widget, Widget]): void;
	    protected _dropDown: Widget;
	    _dropDownGetter(): Widget;
	    _dropDownSetter(value: Widget): void;
	    _isAttached: boolean;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    _isOpen: boolean;
	    _isOpenGetter(): boolean;
	    _isOpenSetter(value: boolean): void;
	    protected _label: Widget;
	    _labelGetter(): Widget;
	    _labelSetter(value: Widget): void;
	    destroy(): void;
	    _render(): void;
	    protected _toggle(event: ui.UiEvent): void;
	} module DropDown {
	    interface Events extends SingleNodeWidget.Events, IDropDown.Events {
	    }
	    interface Getters extends SingleNodeWidget.Getters, IDropDown.Getters {
	        (key: 'dropDown'): Widget;
	        (key: 'label'): Widget;
	    }
	    interface Setters extends SingleNodeWidget.Setters, IDropDown.Setters {
	        (key: 'dropDown', value: Widget): void;
	        (key: 'label', value: Widget): void;
	    }
	}
	export = DropDown;

}
declare module 'mayhem/ui/dom/Label' {
	import ILabel = require('mayhem/ui/Label');
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget'); class Label extends MultiNodeWidget implements ILabel {
	    get: Label.Getters;
	    on: Label.Events;
	    set: Label.Setters;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _formattedText: string;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _text: string;
	    constructor(kwArgs: HashMap<any>);
	    _formattedTextGetter(): string;
	    _formattedTextSetter(value: string): void;
	    _textGetter(): string;
	    _textSetter(value: string): void;
	} module Label {
	    interface Events extends MultiNodeWidget.Events, ILabel.Events {
	    }
	    interface Getters extends MultiNodeWidget.Getters, ILabel.Getters {
	    }
	    interface Setters extends MultiNodeWidget.Setters, ILabel.Setters {
	    }
	}
	export = Label;

}
declare module 'mayhem/ui/dom/ListView' {
	import SingleNodeWidget = require('mayhem/ui/dom/SingleNodeWidget');
	import Widget = require('mayhem/ui/dom/Widget'); class ListView<T> extends SingleNodeWidget {
	    /**
	     * @get
	     * @set
	     */
	    private _collection;
	    /**
	     * @get
	     * @set
	     */
	    private _itemConstructor;
	    private _widget;
	    get: ListView.Getters<T>;
	    on: ListView.Events<T>;
	    set: ListView.Setters<T>;
	    constructor(kwArgs?: HashMap<any>);
	    _collectionGetter(): dstore.ICollection<T>;
	    _collectionSetter(value: dstore.ICollection<T>): void;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    remove(child: Widget): void;
	    _render(): void;
	} module ListView {
	    interface Events<T> extends SingleNodeWidget.Events {
	    }
	    interface Getters<T> extends SingleNodeWidget.Getters {
	        (key: 'collection'): dstore.ICollection<T>;
	        (key: 'itemConstructor'): ListView.IItemConstructor<T>;
	    }
	    interface Setters<T> extends SingleNodeWidget.Setters {
	        (key: 'collection', value: dstore.ICollection<T>): void;
	        (key: 'itemConstructor', value: ListView.IItemConstructor<T>): void;
	    }
	    interface IItemConstructor<T> {
	        new (kwArgs?: HashMap<any>): ListView.IItem<T>;
	        prototype: ListView.IItem<T>;
	    }
	    interface IItem<T> extends SingleNodeWidget {
	        get: ListView.IItem.Getters<T>;
	        set: ListView.IItem.Setters<T>;
	    }
	    module IItem {
	        interface Getters<T> extends SingleNodeWidget.Getters {
	            (key: 'model'): T;
	        }
	        interface Setters<T> extends SingleNodeWidget.Setters {
	            (key: 'model', value: T): void;
	        }
	    }
	}
	export = ListView;

}
declare module 'mayhem/ui/form/AbstractInput' {
	import Widget = require('mayhem/ui/Widget');
	interface AbstractInput extends Widget {
	    get: AbstractInput.Getters;
	    on: AbstractInput.Events;
	    set: AbstractInput.Setters;
	} module AbstractInput {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'disabled'): boolean;
	        (key: 'readOnly'): boolean;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'disabled', value: boolean): void;
	        (key: 'readOnly', value: boolean): void;
	    }
	}
	export = AbstractInput;

}
declare module 'mayhem/ui/form/Button' {
	import AbstractInput = require('mayhem/ui/form/AbstractInput');
	import core = require('mayhem/interfaces');
	interface Button extends AbstractInput {
	    get: Button.Getters;
	    on: Button.Events;
	    set: Button.Setters;
	} module Button {
	    interface Events extends AbstractInput.Events {
	        (type: 'activate', listener: core.IEventListener<core.IEvent>): IHandle;
	    }
	    interface Getters extends AbstractInput.Getters {
	        (name: 'formattedLabel'): string;
	        (name: 'icon'): string;
	        (name: 'label'): string;
	    }
	    interface Setters extends AbstractInput.Setters {
	        (name: 'formattedLabel', value: string): void;
	        (name: 'icon', value: string): void;
	        (name: 'label', value: string): void;
	    }
	} var Button: {
	    new (kwArgs: HashMap<any>): Button;
	    prototype: Button;
	};
	export = Button;

}
declare module 'mayhem/ui/dom/form/Button' {
	import DijitButton = require('dijit/form/Button');
	import DijitWidget = require('mayhem/ui/dom/DijitWidget');
	import IButton = require('mayhem/ui/form/Button'); class Button extends DijitWidget implements IButton {
	    static Ctor: new (kwArgs?: Object, srcNodeRef?: HTMLElement) => DijitButton;
	    static setupMap: {
	        events?: HashMap<(event?: Event) => void>;
	        properties?: HashMap<string>;
	    };
	    get: Button.Getters;
	    on: Button.Events;
	    set: Button.Setters;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _formattedLabel: string;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _icon: string;
	    _formattedLabelGetter(): string;
	    _formattedLabelSetter(value: string): void;
	    _labelGetter(): string;
	    _labelSetter(value: string): void;
	} module Button {
	    interface Events extends DijitWidget.Events, IButton.Events {
	    }
	    interface Getters extends DijitWidget.Getters, IButton.Getters {
	    }
	    interface Setters extends DijitWidget.Setters, IButton.Setters {
	    }
	}
	export = Button;

}
declare module 'mayhem/ui/form/CheckboxValue' {
	 enum CheckboxValue {
	    INDETERMINATE = -1,
	    FALSE = 0,
	    TRUE = 1,
	}
	export = CheckboxValue;

}
declare module 'mayhem/ui/form/Checkbox' {
	import CheckboxValue = require('mayhem/ui/form/CheckboxValue');
	import Widget = require('mayhem/ui/Widget');
	interface Checkbox extends Widget {
	    get: Checkbox.Getters;
	    on: Checkbox.Events;
	    set: Checkbox.Setters;
	} module Checkbox {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'isChecked'): boolean;
	        (key: 'isDisabled'): boolean;
	        (key: 'value'): CheckboxValue;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'isChecked', value: boolean): void;
	        (key: 'isDisabled', value: boolean): void;
	        (key: 'value', value: CheckboxValue): void;
	    }
	} var Checkbox: {
	    new (kwArgs: HashMap<any>): Checkbox;
	    prototype: Checkbox;
	};
	export = Checkbox;

}
declare module 'mayhem/ui/dom/form/Checkbox' {
	import CheckboxValue = require('mayhem/ui/form/CheckboxValue');
	import DijitCheckbox = require('dijit/form/CheckBox');
	import DijitWidget = require('mayhem/ui/dom/DijitWidget');
	import ICheckbox = require('mayhem/ui/form/Checkbox'); class Checkbox extends DijitWidget implements ICheckbox {
	    static Ctor: new (kwArgs?: Object, srcNodeRef?: HTMLElement) => DijitCheckbox;
	    static setupMap: {
	        events?: HashMap<(event?: Event) => void>;
	        properties?: HashMap<string>;
	    };
	    get: Checkbox.Getters;
	    on: Checkbox.Events;
	    set: Checkbox.Setters;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _isChecked: boolean;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _value: CheckboxValue;
	    destroy(): void;
	    _isCheckedGetter(): boolean;
	    _isCheckedSetter(value: boolean): void;
	    _render(): void;
	    _valueGetter(): CheckboxValue;
	    _valueSetter(value: CheckboxValue): void;
	} module Checkbox {
	    interface Events extends DijitWidget.Events, ICheckbox.Events {
	    }
	    interface Getters extends DijitWidget.Getters, ICheckbox.Getters {
	    }
	    interface Setters extends DijitWidget.Setters, ICheckbox.Setters {
	    }
	}
	export = Checkbox;

}
declare module 'mayhem/ui/form/DatePicker' {
	import Widget = require('mayhem/ui/Widget');
	interface DatePicker extends Widget {
	    get: DatePicker.Getters;
	    on: DatePicker.Events;
	    set: DatePicker.Setters;
	} module DatePicker {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'max'): Date;
	        (key: 'min'): Date;
	        (key: 'placeholder'): string;
	        (key: 'value'): Date;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'max', value: Date): void;
	        (key: 'min', value: Date): void;
	        (key: 'placeholder', value: string): void;
	        (key: 'value', value: Date): void;
	    }
	} var DatePicker: {
	    new (kwArgs: HashMap<any>): DatePicker;
	    prototype: DatePicker;
	};
	export = DatePicker;

}
declare module 'mayhem/ui/dom/form/DatePicker' {
	import DijitDateTextBox = require('dijit/form/DateTextBox');
	import DijitWidget = require('mayhem/ui/dom/DijitWidget');
	import IDatePicker = require('mayhem/ui/form/DatePicker'); class DatePicker extends DijitWidget implements IDatePicker {
	    static Ctor: new (kwArgs?: Object, srcNodeRef?: HTMLElement) => DijitDateTextBox;
	    static setupMap: {
	        events?: HashMap<(event?: Event) => void>;
	        properties?: HashMap<string>;
	    };
	    get: DatePicker.Getters;
	    on: DatePicker.Events;
	    set: DatePicker.Setters;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    protected _max: Date;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    protected _min: Date;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    protected _value: Date;
	    constructor(kwArgs?: HashMap<any>);
	    protected _maxGetter(): Date;
	    protected _maxSetter(date: Date): void;
	    protected _minGetter(): Date;
	    protected _minSetter(date: Date): void;
	} module DatePicker {
	    interface Events extends DijitWidget.Events, IDatePicker.Events {
	    }
	    interface Getters extends DijitWidget.Getters, IDatePicker.Getters {
	    }
	    interface Setters extends DijitWidget.Setters, IDatePicker.Setters {
	    }
	}
	export = DatePicker;

}
declare module 'mayhem/ui/form/Error' {
	import Widget = require('mayhem/ui/Widget');
	interface ErrorWidget extends Widget {
	    get: ErrorWidget.Getters;
	    on: ErrorWidget.Events;
	    set: ErrorWidget.Setters;
	} module ErrorWidget {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'errors'): Error[];
	        (key: 'prefix'): string;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'errors', value: Error[]): void;
	        (key: 'prefix', value: string): void;
	    }
	} var ErrorWidget: {
	    new (kwArgs: HashMap<any>): ErrorWidget;
	    prototype: ErrorWidget;
	};
	export = ErrorWidget;

}
declare module 'mayhem/ui/dom/form/Error' {
	import binding = require('mayhem/binding/interfaces');
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget');
	import IError = require('mayhem/ui/form/Error'); class ErrorWidget extends MultiNodeWidget implements IError {
	    get: ErrorWidget.Getters;
	    on: ErrorWidget.Events;
	    set: ErrorWidget.Setters;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _errors: Error[];
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _prefix: string;
	    _prefixNode: HTMLElement;
	    _errorsNode: HTMLElement;
	    _binding: binding.IBinding<{}>;
	    destroy(): void;
	    _errorsGetter(): Error[];
	    _errorsSetter(errors: Error[]): void;
	    _prefixGetter(): string;
	    _prefixSetter(prefix: string): void;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    _bindErrors(): void;
	    _unbindErrors(): void;
	    _render(): void;
	    _updateUi(): void;
	    _onChangeErrors(change: binding.IChangeRecord<Error>): void;
	} module ErrorWidget {
	    interface Events extends MultiNodeWidget.Events, IError.Events {
	    }
	    interface Getters extends IError.Getters {
	    }
	    interface Setters extends MultiNodeWidget.Setters, IError.Setters {
	    }
	}
	export = ErrorWidget;

}
declare module 'mayhem/ui/form/RadioButton' {
	import Checkbox = require('mayhem/ui/form/Checkbox');
	interface RadioButton extends Checkbox {
	    get: RadioButton.Getters;
	    on: RadioButton.Events;
	    set: RadioButton.Setters;
	} module RadioButton {
	    interface Events extends Checkbox.Events {
	    }
	    interface Getters extends Checkbox.Getters {
	        (key: 'checkedValue'): any;
	        (key: 'formattedLabel'): string;
	        (key: 'label'): string;
	        (key: 'value'): any;
	    }
	    interface Setters extends Checkbox.Setters {
	        (key: 'checkedValue', value: any): void;
	        (key: 'formattedLabel', value: string): void;
	        (key: 'label', value: string): void;
	        (key: 'value', value: any): void;
	    }
	} var RadioButton: {
	    new (kwArgs: HashMap<any>): RadioButton;
	    prototype: RadioButton;
	};
	export = RadioButton;

}
declare module 'mayhem/ui/dom/form/RadioButton' {
	import DijitRadioButton = require('dijit/form/RadioButton');
	import DijitWidget = require('mayhem/ui/dom/DijitWidget');
	import IRadioButton = require('mayhem/ui/form/RadioButton');
	import MultiNodeWidget = require('mayhem/ui/dom/MultiNodeWidget'); class RadioButton extends MultiNodeWidget implements IRadioButton {
	    static Ctor: new (kwArgs?: Object, srcNodeRef?: HTMLElement) => DijitRadioButton;
	    static setupMap: {
	        events?: HashMap<(event?: Event) => void>;
	        properties?: HashMap<string>;
	    };
	    get: RadioButton.Getters;
	    on: RadioButton.Events;
	    set: RadioButton.Setters;
	    protected _isChecked: boolean;
	    protected _checkedValue: any;
	    protected _formattedLabel: string;
	    protected _isDisabled: boolean;
	    protected _isFocused: boolean;
	    protected _label: string;
	    protected _labelNode: HTMLElement;
	    protected _value: any;
	    protected _widget: DijitRadioButton;
	    protected _isCheckedGetter(): boolean;
	    protected _isCheckedSetter(isChecked: boolean): void;
	    protected _formattedLabelGetter(): string;
	    protected _formattedLabelSetter(value: string): void;
	    _isAttachedGetter(): boolean;
	    _isAttachedSetter(value: boolean): void;
	    _isFocusedGetter(): boolean;
	    _isFocusedSetter(value: boolean): void;
	    protected _labelGetter(): string;
	    protected _labelSetter(value: string): void;
	    protected _valueGetter(): any;
	    protected _valueSetter(value: any): void;
	    constructor(kwArgs?: HashMap<any>);
	    _initialize(): void;
	    _render(): void;
	    destroy(): void;
	} module RadioButton {
	    interface Events extends DijitWidget.Events, IRadioButton.Events {
	    }
	    interface Getters extends DijitWidget.Getters, IRadioButton.Getters {
	    }
	    interface Setters extends DijitWidget.Setters, IRadioButton.Setters {
	    }
	}
	export = RadioButton;

}
declare module 'mayhem/ui/form/KeyboardType' {
	 enum KeyboardType {
	    DEFAULT = 0,
	    URL = 1,
	    NUMBER = 2,
	    TELEPHONE = 3,
	    EMAIL = 4,
	}
	export = KeyboardType;

}
declare module 'mayhem/ui/form/Text' {
	import KeyboardType = require('mayhem/ui/form/KeyboardType');
	import Widget = require('mayhem/ui/Widget');
	interface Text extends Widget {
	    get: Text.Getters;
	    on: Text.Events;
	    set: Text.Setters;
	} module Text {
	    interface Events extends Widget.Events {
	    }
	    interface Getters extends Widget.Getters {
	        (key: 'autoCommit'): boolean;
	        (key: 'isMultiLine'): boolean;
	        (key: 'isSecureEntry'): boolean;
	        (key: 'keyboardType'): KeyboardType;
	        (key: 'placeholder'): string;
	        (key: 'value'): string;
	    }
	    interface Setters extends Widget.Setters {
	        (key: 'autoCommit', value: boolean): void;
	        (key: 'isMultiLine', value: boolean): void;
	        (key: 'isSecureEntry', value: boolean): void;
	        (key: 'keyboardType', value: KeyboardType): void;
	        (key: 'placeholder', value: string): void;
	        (key: 'value', value: string): void;
	    }
	} var Text: {
	    new (kwArgs: HashMap<any>): Text;
	    prototype: Text;
	};
	export = Text;

}
declare module 'mayhem/ui/dom/form/Text' {
	import DijitWidget = require('mayhem/ui/dom/DijitWidget');
	import DijitText = require('dijit/form/ValidationTextBox');
	import IText = require('mayhem/ui/form/Text');
	import KeyboardType = require('mayhem/ui/form/KeyboardType'); class Text extends DijitWidget implements IText {
	    static setupMap: {
	        events?: HashMap<(event?: Event) => void>;
	        properties?: HashMap<string>;
	    };
	    get: Text.Getters;
	    on: Text.Events;
	    set: Text.Setters;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _autoCommit: boolean;
	    _isMultiLine: boolean;
	    _isMultiLineGetter(): boolean;
	    _isMultiLineSetter(value: boolean): void;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _isSecureEntry: boolean;
	    _isSecureEntryGetter(): boolean;
	    _isSecureEntrySetter(value: boolean): void;
	    /**
	    * @get
	    * @set
	    * @protected
	    */
	    _keyboardType: KeyboardType;
	    _keyboardTypeGetter(): KeyboardType;
	    _keyboardTypeSetter(value: KeyboardType): void;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _placeholder: string;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _readOnly: boolean;
	    /**
	     * @get
	     * @set
	     * @protected
	     */
	    _value: string;
	    _widget: DijitText;
	    constructor(kwArgs?: HashMap<any>);
	    _initialize(): void;
	    /**
	     * @override
	     */
	    _render(): void;
	} module Text {
	    interface Events extends DijitWidget.Events, IText.Events {
	    }
	    interface Getters extends DijitWidget.Getters, IText.Getters {
	    }
	    interface Setters extends DijitWidget.Setters, IText.Setters {
	    }
	}
	export = Text;

}
declare module 'mayhem/ui/style/interfaces' {
	import core = require('mayhem/interfaces');

	export interface IBackgroundImage {
		attachment: string /* should be enum */;
		clip: string /* should be enum */;
		origin: string /* should be enum */;
		position: string /* should be enum */;
		repeat: string /* should be enum */;
		size: string /* should be enum */;
		url: string;
	}

	/* not all widget backends would support all background features; we are just starting with HTML/CSS for now */
	export interface IBackgroundStyle {
		color: IColor;
		images: IBackgroundImage[];
	}

	export /* class */ interface IColor {
		r: number;
		g: number;
		b: number;
		h: number;
		s: number;
		l: number;
		a: number;
		toHex(): string;
		toString(): string;
	}

	export interface IClassList {
		add(className:string):void;
		has(className:string):boolean;
		remove(className:string):void;
		toggle(className:string, forceState?:boolean):void;
	}

	export interface IStyle extends core.IObservable {
		// Combined styles interface for multiple platform support
		background?: IBackgroundStyle;
		textColor?: IColor;
		/* etc. */

		observe(observer:core.IObserver<any>):IHandle;
		observe(key:string, observer:core.IObserver<any>):IHandle;
	}

}
declare module 'mayhem/validation/DateValidator' {
	import data = require('mayhem/data/interfaces');
	import Validator = require('mayhem/validation/Validator'); class DateValidator extends Validator {
	    options: DateValidator.IOptions;
	    validate(model: data.IModel, key: string, value: any): void;
	} module DateValidator {
	    interface IOptions extends Validator.IOptions {
	        /**
	         * If provided, the value must be on or after this Date.
	         */
	        min?: Date;
	        /**
	         * If provided, the value must be on or before this Date.
	         */
	        max?: Date;
	    }
	}
	export = DateValidator;

}
declare module 'mayhem/validation/NumericValidator' {
	import data = require('mayhem/data/interfaces');
	import Validator = require('mayhem/validation/Validator'); class NumericValidator extends Validator {
	    options: NumericValidator.IOptions;
	    validate(model: data.IModel, key: string, value: any): void;
	} module NumericValidator {
	    interface IOptions extends Validator.IOptions {
	        /**
	         * If provided, the value must be greater or equal to this number.
	         */
	        min?: number;
	        /**
	         * If provided, the value must be smaller or equal to this number.
	         */
	        max?: number;
	        /**
	         * If `true`, the value must be an integer.
	         */
	        integerOnly?: boolean;
	    }
	}
	export = NumericValidator;

}
declare module 'mayhem/validation/RequiredValidator' {
	import data = require('mayhem/data/interfaces');
	import Validator = require('mayhem/validation/Validator'); class RequiredValidator extends Validator {
	    validate(model: data.IModel, key: string, value: any): void;
	}
	export = RequiredValidator;

}
declare module 'mayhem/validation/StringValidator' {
	import data = require('mayhem/data/interfaces');
	import Validator = require('mayhem/validation/Validator'); class StringValidator extends Validator {
	    options: StringValidator.IOptions;
	    validate(model: data.IModel, key: string, value: any): void;
	} module StringValidator {
	    interface IOptions extends Validator.IOptions {
	        /**
	         * If provided, the value must be at least this many characters long.
	         */
	        minLength?: number;
	        /**
	         * If provided, the value must be no more than this many characters long.
	         */
	        maxLength?: number;
	        /**
	         * If provided, the value must match this regular expression.
	         */
	        regExp?: RegExp;
	        /**
	         * If provided, this will be used in place of the normal regular expression failure message so a more
	         * human-friendly error can be used.
	         */
	        regExpFailureMessage?: string;
	    }
	}
	export = StringValidator;

}
