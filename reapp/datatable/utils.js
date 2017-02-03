let _ = require('underscore')
let $ = require('jquery')

_.mixin({
	get: require('lodash/get'),
	set: require('lodash/set'),
	unset: require('lodash/unset'),
	has: require('lodash/has'),
	merge: require('lodash/merge'),
	cloneDeep: function ( obj ) {
		return JSON.parse(JSON.stringify(obj));
	},

	autoBind( instance ) {
		!function bind( protos ) {
			Array.prototype.forEach.call(Object.getOwnPropertyNames(protos), name => {
				var descriptor = Object.getOwnPropertyDescriptor(protos, name)
				switch ( name ) {
					case 'constructor':
						return
					default:
						if ( typeof descriptor.value == 'function' && !instance.hasOwnProperty(name) )
							instance[name] = descriptor.value.bind(instance)
				}
			})
			protos.__proto__ !== Object.prototype && bind(protos.__proto__)
		}(instance.__proto__)
	},

	// _.classNames('foo bar')
	// _.classNames('prefix-','foo bar')
	// _.classNames('prefix-','foo bar', { foo: 'foo' })
	// _.classNames('foo bar', { foo: 'foo' })
	classNames: function ( prefix, names, map ) {

		if ( _.isString(prefix) && !_.isString(names) ) {
			if ( _.isObject(names) ) {
				map = names
				names = ""
			}
			if ( _.isEmpty(names) ) {
				names = prefix
				prefix = ''
			}
		}
		if ( _.isEmpty(names) )
			return ''

		return _.chain(names.replace(/\s+/g, ' ').trim().split(' '))
			.flatten()
			.uniq()
			.map(name => {
				return (prefix ? `${prefix}-` : '') + (_.has(map, name) ? _.result(map, name) : name)
			})
			.value()
			.join(' ')
	},
	prefixCSSRules: function ( css, prefix ) {
		css = css.replace(/\n|\r|\t/g, '');
		css = css.replace(/\/\*[^*]+\*\//g, '');
		css = ` ${css} `
		return _(css.match(/[^{]+\{[^}]+}/g) || []).map(function ( rule ) {
			var split = rule.match(/^(.*)?({.*})/)

			return (split[ 1 ] ? _.map(split[ 1 ].split(','), function ( name ) {
					return (prefix + ' ' + name.trim()).replace(' &', '');
				}, this).join(",\n") : prefix) + split[ 2 ];
		}, this).join("\n");
	},

	keyOfValue( obj, value ) {
		for ( let key in obj ) {
			if ( _.isEqual(obj[ key ], value) )
				return key
		}
	},
	parseCssValue( value, round = true ) {

		return _.isString(value)? value.replace(/^([0-9.]+)px$/,'$1') : value

		return _.isString(value) && value.match(/^[0-9.]+$/) ? parseFloat(value) : value

		if ( _.isString(value) && value.match(/^[0-9.]+px$/) ) {
			let r = value.replace(/^(.*)px$/, '$1')
			r.match(/^[0-9.]+$/) && (r = parseFloat(r))
			return round ? Math.round(r) : r
		}
		return value
	},
	join( array, spacer ) {
		return Array.prototype.join.call(array || [], spacer)
	},

	assign() {
		return _.extend.apply(null, _(arguments).unshift({}))
	},
	isPrototypeOf: function ( child, parent ) {
		if ( !child || !parent )
			return false;
		var result = false;
		var proto = child.prototype;
		while ( proto ) {
			if ( proto == parent.prototype ) {
				result = true;
				break;
			}
			proto = proto.__proto__;
		}
		return result;
	},
	setPrototypeOf: function ( child, prototype ) {
		if ( _.isFunction(Object.setPrototypeOf) )
			Object.setPrototypeOf(child.prototype || child, prototype);
		else
			(child.prototype || child).__proto__ = prototype;
		return child
	},
	extendPrototype: function ( child, prototype ) {
		_.extend(child.prototype, prototype)
		return child
	},

	joinPath: function () {
		return _(arguments).join('/').replace(/([^:])\/+/g, '$1\/');
	},

	parseNumberUnit: function ( str ) {
		str += '';
		var match = str.replace(/\s+/, ' ').match(/([-0-9.]+)\s?([^\s]*)?/);
		return {
			value: match && parseFloat(match[ 1 ]) || 0,
			unit: match && match[ 2 ] || ''
		}
	},
	stripTags: function ( str ) {
		return str
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	},
	encodeHtmlEntities: function ( str ) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	},
	decodeHtmlEntities: function ( str ) {
		return String(str)
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"');
	},
})

$.fn.clickOutside = function ( callback, context ) {
	return typeof callback != 'function' ? this : this.each(function ( index, element ) {
		$(window).on('mousedown', function clickHandler( e ) {
			if ( !$(element).is(e.target) && !$(e.target).parents('.' + $(element).attr('class').replace(/\s+/g, '.')).length )
				$(window).off('mousedown', clickHandler),
					callback.call(context, e);
		});
	});
}

exports._ = _
exports.$ = $