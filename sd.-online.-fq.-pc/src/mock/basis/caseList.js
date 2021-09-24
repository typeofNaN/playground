const Mock = require('mockjs')
var caseList = Mock.mock({
  code: 200,
  msg: 'success',
  'data|10': [
    {
      caseId: '@integer(100)',
      borrower: '@cname()',
      time: '@date("yyyy-MM-dd")',
      'status|0-4': 4,
    },
  ],
})

export default {
  'get|getCaseList': () => {
    return caseList
  },
}
