
let { _, $ } = require('./utils')
let React = require('react');
import ReactDOM from 'react-dom'
let { Element } = require('./element')
let { Table } = require('./table')
let { Pagination, Overlay, Label, FilterByTime } = require('./components')

class CouponList extends Element {

	constructor( props, ...args ) {
		super(props, ...args)
        this.state = this.props
	}

	getChildContext() {

		return {
			app: this,
            parent: this
		}
	}

	static get propTypes() {

		return {
			...super.propTypes,
            url: React.PropTypes.string,
            th: React.PropTypes.object,
            pagination: React.PropTypes.any,
            overlay: React.PropTypes.bool,
            order: React.PropTypes.object,
            filter: React.PropTypes.object,
            time: React.PropTypes.object,
            sucess: React.PropTypes.number,
            reject: React.PropTypes.number,
		}
	}

	static get defaultProps() {

		return {
			...super.defaultProps,
            url: window.location.href,
            data: [],
            th: {},
            overlay: false,
            pagination: {
                currentPage: 1,
                numberPerPage: 10,
                total: 50
            },
            order: {
                by: 'get_date',
                type: 'DESC'
            },
            filter: {},
            time: {
                type: 'all'
            },
            sucess: 0,
            reject: 0,
		}
	}

	shouldComponentUpdate() {
        return false
    }

	get link() {
        let start = (this.state.pagination.currentPage - 1) * this.state.pagination.numberPerPage
        let length = this.state.pagination.numberPerPage
        let order = '&orderBy=' + this.state.order.by + '&orderType=' + this.state.order.type
        let filter = ''
        _.each( this.state.filter, (obj, key) => {
            filter += '&' + key + '=' + ( obj.id ? obj.id : obj.value )
        })

        let time = '&time=' + this.state.time.type
        if ( this.state.time.type == 'custom' ) {
            if ( this.state.time.from && this.state.time.to ) {
                time += '&from-date=' + this.state.time.from + '&to-date=' + this.state.time.to
            }
        }
        return `${this.state.url}?start=${ start }&length=${length}${order}${filter}${time}`
    }

    savePagination(page) {
        let pagination =  this.state.pagination
        pagination.currentPage = parseInt(page)
        this.setState({pagination: pagination}, () =>{
            this.getData()
        })
    }

    setOrder(type) {
        let order = _.clone(this.state.order)
        if ( this.state.order.by == type ) {
            order.type = order.type == 'ASC' ? 'DESC' : 'ASC'
        }
        else {
            order.by = type
            order.type = 'DESC'
        }
        this.setState({order: order}, () =>{
            this.getData()
        })
    }

    setFilter(option) {
        let filter = _.clone(this.state.filter)

        let pagination =  this.state.pagination
        pagination.currentPage = 1
        if ( typeof filter[option.key] === 'undefined' ) {
            filter[option.key] = option
            this.setState({filter: filter, pagination: pagination}, () =>{
                    this.getData()
        })

        }
        else {

            if (filter[option.key].value != option.value ) {
                filter[option.key] = option
                this.setState({filter: filter, pagination: pagination}, () =>{
                    this.getData()
                })
            }
        }

    }

    removeFilter(type) {
        let filter = _.clone(this.state.filter)
        if (filter[type]) {
            delete filter[type]
            this.setState({filter: filter}, () =>{
                this.getData()
            })
        }
    }

    saveTime(options) {
        let pagination =  this.state.pagination
        pagination.currentPage = 1
        this.setState({time: options, pagination: pagination}, () =>{
            this.getData()
        })
    }

	getData() {
        this.refs.overlay.setState({show: true})
        this.serverRequest = $.get(this.link, function (result) {
            console.log(result)
            if ( typeof result.data !== 'undefined' ) {
                if (_.isEmpty(result.data))
                    result.data = [{}]
                let pagination = this.state.pagination
                pagination.total = typeof result.total_count !== 'undefined' ? parseInt(result.total_count) : 50
                let totalSuccess = result.success_redeem_count || 0
                let totalreject = result.rejected_redeem_count || 0
                console.log(result)
                this.setState({
                    sucess: totalSuccess,
                    reject: totalreject,
                    data: result.data,
                    pagination: pagination
                }, () => {
                    this.forceUpdate()
                });
            }

        }.bind(this));
    }

    componentDidUpdate(){

        this.refs.overlay.setState({show: false})
    }

    componentDidMount(){
        this.getData()
        console.log('didmount')
    }

	get events() {
		return {
			...super.events,
		}
	}

	render() {
        let pagination = {
            ...this.state.pagination,
            show: true,
        }
        return <div ref="wrapper" className="table-wrapper" >
            <Overlay ref="overlay" show={this.state.overlay} />
            <FilterByTime {...this.state.time} />
            <Pagination {...pagination} />
            <div id="filter">
                <Label key="order" type={'order'} text={'sắp xếp ' + this.state.th[this.state.order.by].text.toLowerCase()}
                       value={'theo thứ tự ' + (this.state.order.type == 'ASC' ? 'giảm dần' : 'tăng dần') }  close={false}/>
                {
                    _.map(this.state.filter, (obj, key) => {
                        let props = {
                            type: key,
                            text: this.state.th[key].text,
                            value: obj.value,
                            key: key,
                            close: true
                        }
                        if ( typeof obj.id !== 'undefined')
                            props.id = obj.id
                        return <Label {...props}/>
                    })
                }
            </div>
            <div style={ {marginBottom: '10x'} } id="count">

                <span>Đã đổi/Tổng mã: {this.state.sucess}/{this.state.pagination.total}</span>
                <span style={ {marginLeft: '10px'} }>Từ chối: {this.state.reject}</span>
                <p>Tổng mã: {this.state.pagination.total}</p>
            </div>
            <Table {..._.pick(this.state, ['data', 'th'])}/>
            <Pagination {...pagination} />
        </div>
    }
}

window.initTable = function(el, options) {
    ReactDOM.render(
        <CouponList {...options}/>, el);
}
