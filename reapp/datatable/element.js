let { _, $ } = require('./utils')
let React = require('react');
let ReactDOM = require('react-dom');

let shallowCompare = require('react-addons-shallow-compare')
let createFragment = require('react-addons-create-fragment')
let update = require('react-addons-update')

const loadedScripts = {}
function genID() {
	return Date.now().toString(36) + _.random(35).toString(36)
}

export class Element extends React.Component {

	/**
	 * @constructor
	 * @param props
	 * @param children
	 * @param updater
	 */
	constructor( props, ...args ) {

		super(props, ...args)

		this.state = _.defaults(this.initialState, props)

		this._events = _.mapObject(this.events, handler => _.isFunction(handler) ? handler.bind(this) : handler)

		_.autoBind(this)
	}

	/* --- Static getters / setters --- */

	static get className() {

		return ''
	}

	static get propTypes() {

		return {
			tag: React.PropTypes.string,
			hidden: React.PropTypes.bool,
		}
	}

	static get defaultProps() {

		return {
			tag: this.tagName || 'DIV',
		}
	}

	static get contextTypes() {

		return {
			app: React.PropTypes.any,
			parent: React.PropTypes.any,
		}
	}

	static get childContextTypes() {

		return {
			app: React.PropTypes.any,
			parent: React.PropTypes.any,
		}
	}

	get initialState() {

		return {}
	}

	getChildContext() {

		return {
			parent: this,
		}
	}

	/* --- Prototype getters / setters --- */

	get DOMNode() {

		return this.refs.__wrapper__
	}

	get app() {

		return this.context.app
	}

	get parent() {

		return this.context.parent
	}

	isInstanceOf( ...types ) {

		return _.some(types, type => {

			return _.isObject(this.page.elements[ type ]) && (this instanceof this.page.elements[ type ])
		})
	}

	/* --- lifecycle methods --- */

	shouldComponentUpdate( nextProps, nextState ) {
		return true
		return !_.isEqual(this.state.styles, nextState.styles) || !_.isEqual(nextState, this.state) || !_.isEqual(this._pickProps(nextProps), this.state)
	}

	get events() {

		return {

		}
	}

}

class Status extends React.Component {

    render() {
        switch (parseInt(this.props.value)){
            case 1:
                return <label className="label label-success status1">Chưa đổi</label>;
            case 2:
                return <label className="label label-warning status2">Hết hạn</label>;
            case 3:
                return <label className="label label-warning status3">Hết hạn</label>;
            case 4:
                return <label className="label label-primary status4">Đã đổi</label>;
            case 5:
                return <label className="label label-danger status5">Hết hạn</label>;
            case 6:
                return <label className="label label-default status6">Giữ chỗ</label>;
            default:
                return <label className="label label-success status7">Unknown</label>;
        }
    }
}