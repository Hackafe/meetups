var moment = require('moment')
var Handlebars = require('handlebars')

Handlebars.registerHelper('formatDate', function (date, format, locale, opts) {
  if (!opts) {
    opts = locale
    locale = null
  }
  var m = moment(date)
  if (locale) m.locale(locale)
  var res = m.format(format)
  return res
})

Handlebars.registerHelper('toUpperCase', function (string) {
  return ('' + string).toUpperCase()
})

Handlebars.registerHelper('momentAdd', function (date, value, key, opts) {
  if (!opts) {
    opts = key
    key = null
  }

  return moment(date).add(value, key)
})
