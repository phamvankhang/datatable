**Require**
>    - _NodeJS_
    
**Install**
    
>    - cd to project path
>    
>    - npm install
    
**Build**
>    - webpack
    
    
**Usage**
    for example:
    `
    var container = $('#redeem-list').get(0)
    initTable(container, {
        config: {
            filter: ['brand_name', 'store', 'title', 'gender']//
        },
        th: {
            'brand_name': {text: 'Brand', filter: false},
            'store': {text: 'Store', filter: false},
            'title': {text: 'Campaign', filter: false},
            'code': {text: 'Code', filter: false},
            'user_name': {text: 'Customer', filter: false},
            'gender': {text: 'Gender', filter: false},
            'phone': {text: 'Phone', filter: true},
            'get_date': {text: 'Get Date', filter: false},
            'check_in_time': {text: 'Check in Time', filter: false},
            'status': {text: 'Status', filter: false},
            'description': {text: 'Description', filter: false},
        }
    })`
    
contact: vkphambn@gmail.com
