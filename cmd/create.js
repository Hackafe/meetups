var moment = require('moment')

module.exports = function (argv, frm) {
  var dryrun = argv[ 'dry-run' ]
  var name = argv._[ 1 ]
  var date = argv._[ 2 ]
  var time = argv._[ 3 ]

  if (!name || !date || !time) {
    console.error('Usage: ' + global.CMD_NAME + ' create <title> <date> <time> [options]')
    process.exit(1)
  }

  var template
  try {
    template = require('../tmpl/' + name)
  } catch (e) {
    console.error('Unknown meetup ' + name)
    process.exit(2)
  }

  var context = {
    date: moment(date + ' ' + time),
    name: name,
  }
  var config = template(context)

  if (dryrun) {
    console.log('create topic\ntitle: ' + config.frm.title + '\nbody: ' + config.frm.body + '\n\n---\ncategory: ' + config.frm.category + '\n\n')
    topicCreated(null, '{"topic_id":666}', 200)
  } else {
    frm.createTopic(config.frm.title, config.frm.body, config.frm.category, topicCreated)
  }

  function topicCreated (err, body, httpCode) {
    if (err) {
      console.error(err)
      process.exit(3)
    }

    context.topic = JSON.parse(body)
    context.topic.url = frm.url + '/t/' + context.topic.topic_id
    config = template(context)
    console.log('Meetup created at ' + context.topic.url)
    console.log('\n\nNow open https://www.facebook.com/HackafePlovdiv/events and create new event\n')
    console.log(config.fb)
  }
}
