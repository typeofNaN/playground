var apiUrl = 'https://api.github.com/emojis'
var emojis = $('#main')
var search_input = $('input[name="search_text"]')
var render = (k, v, i) => {
  setTimeout(() => {
    var search_text = search_input.val()
    var emoji_img = `
      <img src="${v}" alt=":${k}:" width="22" style="vertical-align: middle;margin-right: 3px;">
    `
    var html = `
      <p class="emoji" data-emoji="${k}" style="display:${search_text ? (k.indexOf(search_text) !== -1 ? 'none' : 'block') : 'block'}">
        ${emoji_img}
        <code class="code" style="vertical-align:middle;">:${k}:</code>
      </p>
    `
    emojis.append(html)
  }, i * 10)
}

search_input.on('input', (evt) => {
  var val = evt.target.value
  if (val === '') {
    emojis.children().show()
    return
  }
  emojis.children().each((i, el) => {
    var cur = $(el)
    if (cur.attr('data-emoji').indexOf(val) !== -1) {
      cur.show()
    } else {
      cur.hide()
    }
  })
})

$.get(apiUrl).done((data) => {
  var i = 0
  for (var k in data) {
    if (data.hasOwnProperty(k)) {
      render(k, data[k], ++i);
    }
  }
}).fail((err) => {
  console.log(err);
})