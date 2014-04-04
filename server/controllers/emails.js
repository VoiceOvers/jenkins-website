var app = require('../app'),
    _ = require('lodash');

var mandrill = require('mandrill-api/mandrill'),
    mandrillClient = new mandrill.Mandrill(app.config.api.mandrill.apiKey);

exports.impl = {};

exports.impl.sendWelcome = function (email, name) {
  var options = {
    'template_name': 'jenkinswelcome',
    'template_content': [],
    message: {
      to: [
        {
          email: email,
          name: name,
          type: 'to'
        }
      ],
      'track_clicks': true,
      'track_opens': true,
      'merge_vars': [
        {
          rcpt: email,
          vars: [
            {
              name: 'recipientemail',
              content: email
            },
            {
              name: 'recipientname',
              content: name
            }
          ]
        }
      ]
    },
    tags: [
      'jenkins-welcome'
    ]
  };

  mandrillClient.messages.sendTemplate(options);
};