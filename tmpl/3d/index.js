module.exports = function (context) {
  return {
    frm: {
      title: require('./title.hbs')(context),
      body: require('./post.hbs')(context),
      category: 'events',
    },
    fb: require('./fb.hbs')(context),
  }
}
