let { _, $ } = require('./utils')
let React = require('react');
let { Element } = require('./element')

class Pagination extends Element {

    constructor(props) {
        super(props);

        this.state = {
            ...this.props,
            max: 10
        }
    }

    static get propTypes() {

		return {
			...super.propTypes,
            current: React.PropTypes.number,
            numberPerPage: React.PropTypes.number,
            total: React.PropTypes.number
		}
	}

	static get defaultProps() {

		return {
			...super.defaultProps,
            currentPage: 1,
            numberPerPage: 10,
            total: 51,
		}
	}

    shouldComponentUpdate(nextState, nextProps) {
        return true
    }

    get pagination() {
        let page = Math.ceil( this.props.total / 10 )
        let results = []

        if ( page > 7 ) {
            if ( this.props.currentPage >= 4 ) {
                results.push({text: 'first', number: 1})

                let max = this.props.currentPage > page - 2 ? page : this.props.currentPage + 2

                if ( max == page ) {
                    results.push({text: this.props.currentPage - 4, number: this.props.currentPage - 4})
                    results.push({text: this.props.currentPage - 3, number: this.props.currentPage - 3})
                }

                results.push({text: this.props.currentPage - 2, number: this.props.currentPage - 2})
                results.push({text: this.props.currentPage - 1, number: this.props.currentPage - 1})

                for ( let i = this.props.currentPage; i <= max; i++) {
                    results.push({text: i, number: i})
                }

                if ( max != page ) {
                    results.push({text: 'last', number: page})
                }
            }
            else {
                let start = 1
                if ( this.props.currentPage > 1) {

                    results.push({text: 'first', number: 1})
                    start = 2
                }

                for ( let i = start; i <= 7; i++) {
                    results.push({text: i, number: i})
                }

                results.push({text: 'last', number: page})
            }

        }

        else {
            for ( var i = 1; i <= page; i++ ) {
                results.push({text: i, number: i})
            }
        }

        return results
    }

    get className() {
        return 'pagination pull-right ' + ( this.props.show  ? '' : 'hidden' )
    }

    changePage(data) {
        this.context.app.savePagination(data)
    }

    render() {

        return <ul className={this.className}>
            {
                _.map( this.pagination, (page, i) => {
                    let text = page.number
                    if ( page.text == 'first') text = 'Đầu'
                    if ( page.text == 'last') text = 'Cuối'
                    return <li className={ page.number == this.props.currentPage ? 'active' : '' }
                               onClick={ (e) => {
                                    this.changePage(page.number)
                               } }
                               key={i}>
                        <a href="javascript:;">
                            { text }
                        </a>
                    </li>
                })
            }
        </ul>
    }
}

class Overlay extends Element {

    constructor(props) {
        super(props);
        this.state = this.props
    }

    get className() {
        return 'jamja-table-overlay ' + ( this.state.show  ? '' : 'jamja-hidden' )
    }

    componentDidMount(){
		// console.log(this.context)
	}

    render() {
        let svgStyle = {
            transform: 'translateY(-50%) translateX(-50%)',
            top: '50%',
            left: '50%',
            position: 'relative',
        }
        return <div className={ this.className } >
            <div className="loadding">
                <svg style={svgStyle} width='50px' height='50px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <rect x="0" y="0" width="100" height="100" fill="#ffffff"></rect>
                    <g transform="translate(20 50)">
                        <rect x="-10" y="-30" width="20" height="60" fill="#3769c8" opacity="0.6">
                            <animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0s" repeatCount="indefinite"
                                              dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1"
                                              values="2;1">

                            </animateTransform>
                        </rect>
                    </g>
                    <g transform="translate(50 50)">
                        <rect x="-10" y="-30" width="20" height="60" fill="#3769c8" opacity="0.8">
                            <animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0.1s"
                                              repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1"
                                              keyTimes="0;1" values="2;1">

                            </animateTransform>
                        </rect>
                    </g>
                    <g transform="translate(80 50)">
                        <rect x="-10" y="-30" width="20" height="60" fill="#3769c8" opacity="0.9">
                            <animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0.2s"
                                              repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1"
                                              keyTimes="0;1" values="2;1">

                            </animateTransform>
                        </rect>
                    </g>
                </svg>
            </div>
        </div>
    }
}

class Label extends Element {

    constructor(props) {
        super(props);
        this.state = this.props
    }

    get className() {
        return 'label label-success ' + ( this.state.show  ? '' : 'jamja-hidden' )
    }

    static get propTypes() {

		return {
            ...super.propTypes,
			hidden: React.PropTypes.bool,
            text: React.PropTypes.string,
			value: React.PropTypes.any,
			type: React.PropTypes.string,
		}
	}

	static get defaultProps() {

		return {
            ...super.defaultProps,
			text: 'sắp xếp',
			value: 'từ A đến Z',
            hidden: false,
            type: 'order'
		}
	}

	shouldComponentUpdate(){
        return true
    }

    get events() {
		return {
            onClick: (e) => {
                if ( this.props.close ) {
                    this.context.app.removeFilter(this.props.type)
                }
            }
		}
	}

	get value() {
        let text = this.props.value
        if ( this.props.type == 'status' ) {
            switch (parseInt(this.props.value)) {
                case 1:
                    text = 'Chưa đổi'
                    break
                case 2:
                    text = 'Hết hạn'
                    break
                case 3:
                    text = 'Hết hạn'
                    break
                case 4:
                    text = 'Đã đổi'
                    break
                case 5:
                    text = 'Hết hạn'
                    break
                case 6:
                    text = 'Giữ chỗ'
                    break
                default:
                    text = 'Unknown'
                    break
            }
        }
        if ( this.props.type == 'gender' ) {
            if ( this.props.value == 'male' )
                text = 'nam'
            else if ( this.props.value == 'female' )
                text = 'nữ'
            else {
                text = 'không rõ'
            }
        }
        return text
    }

    render() {
        return <span className={`label label-success ${this.props.close ? 'jamja-close' : ''}`} {...this.events}>
            { `${this.props.text}: ${this.value}` }
        </span>
    }
}

class FilterByTime extends Element {

    constructor(props) {
        super(props);
        this.state = this.props
    }

    get className() {
        return ''
    }

    static get propTypes() {

		return {
            ...super.propTypes,
			type: React.PropTypes.string,
            value: React.PropTypes.string,
			from: React.PropTypes.number,
			to: React.PropTypes.number,
		}
	}

	static get defaultProps() {

		return {
            ...super.defaultProps,
			type: 'all',
		}
	}

	shouldComponentUpdate(){
        return true
    }

    changeType(e) {
        let options = {}
        this.setState({type: this.refs.type.value}, () => this.forceUpdate())
        if ( this.refs.type.value != 'custom' ) {

            options.type = this.refs.type.value
            this.context.app.saveTime(options)
        }
    }

    changeDate(){
        let options = {}
        options.type = this.refs.type.value
        if ( options.type == 'custom') {
            if ( this.refs.from.value.indexOf('-') >0 && this.refs.to.value.indexOf('-') >0) {
                options.from = new Date(this.refs.from.value.split("-").join("-")).getTime() / 1000;
                options.to = new Date(this.refs.to.value.split("-").join("-")).getTime() / 1000;
                if (!options.from || !options.to) return
                if ( options.from <= options.to )
                    this.context.app.saveTime(options)
            }

        }
    }

    shouldComponentUpdate(nextState, nextProps){
        return false
    }

    render() {
        return <div id="filter-by-time">
            <div className="form-group">
                <select style={ {width: '100px'} } className="form-control" ref="type" id="select-type" onChange={ (e) => {
                    this.changeType(e)
                } } defaultValue={ this.props.type }>
                    <option value="all">Tất cả</option>
                    <option value="today">Hôm nay</option>
                    <option value="last7days">7 ngày qua</option>
                    <option value="custom">Tự chọn</option>
                </select>
            </div>

            {
                this.state.type != 'custom' ? null : <div className="form-inline">
                    <div className="form-group">
                        <label>Từ:</label>
                        <input ref="from" type="date" className="form-control" id="from-date" onChange={e=>this.changeDate()}/>
                    </div>
                    <div className="form-group">
                        <label>Đến:</label>
                        <input ref="to" type="date" className="form-control" id="to-date" onChange={e=>this.changeDate()} />
                    </div>
                </div>
            }
        </div>
    }
}



module.exports = {
    Pagination, Overlay, Label, FilterByTime
}