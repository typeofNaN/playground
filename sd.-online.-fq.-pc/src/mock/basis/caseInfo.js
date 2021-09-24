const Mock = require('mockjs')
Mock.Random.extend({
  phone: function() {
    var phonePrefixs = ['132', '135', '189']
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/)
  },
})

export default {
  'post|caseInfo': (option) => {
    let body = JSON.parse(option.body)
    return Mock.mock({
      code: 200,
      msg: 'success',
      data: {
        caseId: body.caseId,
        name: '@cname()',
        idType: '身份证',
        id: '@id()',
        birthday: '@date("yyyy-MM-dd")',
        'phone|1': ['@phone'],
        'result|1': true,
        'status|0-4': 4,
        url1: Mock.Random.image('400x200'),
        url2: Mock.Random.image('400x200'),
        money: 123,
        interest: 123,
        deadline: '36个月',
        condition: '@cparagraph',
        file: [
          { fileName: '贷款合同', url: '' },
          { fileName: '其他附件', url: '' },
        ],
      },
    })
  },
}
