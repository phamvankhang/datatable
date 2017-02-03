/**
 * Created by khangpv on 21/10/2016.
 */
let {_, $} = require('./utils')
let React = require('react');
let {Element} = require('./element')

let createFragment = require('react-addons-create-fragment')

export class Table extends Element {

    constructor(props, ...args) {
        super(props, ...args)
        this.state = this.props
    }

    static get propTypes() {

        return {
            ...super.propTypes,
            data: React.PropTypes.array,
            th: React.PropTypes.object
        }
    }

    static get defaultProps() {

        return {
            ...super.defaultProps,
            tag: 'TABLE',
            data: [],
            th: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state.data, nextProps.data)
    }

    get className() {
        return 'display responsive table table-striped table-bordered'
    }

    get events() {
        return {
            ...super.events,
        }
    }

    render() {
        return <table className={this.className}>
            <thead>
            <tr>
                {
                    _.map(this.props.th, (th, type) => {
                        let props = {...th, type: type}
                        return <TH {...props} key={type}/>
                    })
                }
            </tr>
            </thead>
            <tbody>
            {
                _.isEmpty(this.props.data) ? null : _.map(this.props.data, (row, i) => {
                    return <TR {...row} key={i} th={this.props.th}/>
                })
            }
            </tbody>
        </table>
    }
}

class TR extends Element {

    static get propTypes() {

        return {
            ...super.propTypes,
        }
    }

    static get defaultProps() {

        return {
            ...super.defaultProps,
            tag: 'TR'
        }
    }

    render() {
        return <tr className={this.className}>
            {
                _.map(this.props.th, (value, key) => {
                    let props = {value: this.props[key], type: key}
                    switch (key) {
                        case 'brand_name':
                            props.fieldID = this.props.brand_id
                            break
                        case 'store':
                            props.fieldID = this.props.store_id
                            break
                        case 'title':
                            props.fieldID = this.props.deal_id
                            break
                    }
                    return <TD {...props} key={key}/>
                })
            }
        </tr>
    }
}

class TD extends Element {

    constructor(props, ...args) {
        super(props, ...args)
        this.state = this.props
    }

    static get propTypes() {

        return {
            ...super.propTypes,
        }
    }

    static get defaultProps() {

        return {
            ...super.defaultProps,
        }
    }

    render() {
        let props = {value: this.props.value}
        let value = '' + this.props.value
        let text = ''
        if (value.indexOf('%20') >= 0) {
            text = window.decodeURIComponent(value)
        }
        else {
            text = this.props.value
        }

        if (this.props.type == 'gender') {
            if (this.props.value == 'female')
                text = 'nữ'
            else if (this.props.value == 'male')
                text = 'nam'
            else
                text = ''
        }

        return <td>
            <div className="truncate-by-height">
                {
                    createFragment({
                        filter: this.context.app.props.config.filter.indexOf(this.props.type) >= 0 ?
                            <i className="fa fa-search-plus" style={ {
                                color: '#8cc152',
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'inline'
                            } }
                               onClick={ (e) => {

                                   let opt = {
                                       key: this.props.type,
                                       value: this.props.value,
                                   }
                                   if (typeof this.props.fieldID !== 'undefined')
                                       opt.id = this.props.fieldID
                                   this.context.app.setFilter(opt)
                               }}
                            /> : null,
                        content: this.props.type != 'status' ? text : <Status  {...props}/>,
                    })
                }
            </div>
        </td>
    }
}

class TH extends Element {

    constructor(props, ...args) {
        super(props, ...args)
        this.state = this.props
    }

    static get propTypes() {

        return {
            ...super.propTypes,
            text: React.PropTypes.string,
            type: React.PropTypes.string,
            filter: React.PropTypes.bool,
        }
    }

    static get defaultProps() {

        return {
            ...super.defaultProps,
            text: 'text default',
            filter: true
        }
    }

    get events() {
        return {
            onClick: (e) => {
                if (this.props.filter) {
                    this.context.app.setOrder(this.props.type)
                }
            }
        }
    }

    render() {
        let className = 'fa fa-caret-down'
        if (this.context.app.state.order.by == this.props.type) {
            className = this.context.app.state.order.type == 'ASC' ? 'fa fa-caret-down' : 'fa fa-caret-up'
        }
        return <th {...this.events} className={ this.context.app.state.order.by == this.props.type ? 'active' : '' }>
            {
                this.state.text
            }
            {!this.props.filter ? null : <i className={className} aria-hidden="true"></i>}
        </th>
    }
}

class Status extends React.Component {

    render() {
        switch (parseInt(this.props.value)) {
            case 1:
                return "<label class='label label-success status1'>Chưa đổi</label>";
            case 2:
                return "<label class='label label-warning status2'>Hết hạn</label>";
            case 3:
                return "<label class='label label-warning status3'>Hết hạn</label>";
            case 4:
                return "<label class='label label-primary status4'>Đã đổi</label>";
            case 5:
                return "<label class='label label-danger status5'>Hết hạn</label>";
            case 6:
                return "<label class='label label-default status6'>Giữ chỗ</label>";
            case 7:
                return "<label class='label label-warning status7'>Đợi xác nhận</label>";
            case 8:
                return "<label class='label label-danger status8'>NH từ chối</label>";
            case 9:
                return "<label class='label label-default status9'>NH huỷ</label>";
            case 10:
                return "<label class='label label-default status10'>ND Huỷ</label>";
            case 11:
                return "<label class='label label-default status11'>Admin Huỷ</label>";
            default:
                return "<label class='label status'>Unknown</label>";
        }
    }
}
