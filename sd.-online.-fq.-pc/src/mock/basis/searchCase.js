const Mock = require('mockjs')

export default {
  'post|searchCase': (option) => {
    let body = JSON.parse(option.body)
    return Mock.mock({
      code: 200,
      msg: 'success',
      data: {
        caseId: body.detail == '' ? '@integer(100)' : body.detail,
        borrower: '@cname()',
        time: '@date("yyyy-MM-dd")',
        'status|0-4': 4,
      },
    })
  },
}
