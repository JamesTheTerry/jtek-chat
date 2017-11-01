const express = require('express');
const app = express();
const fs = require('fs');
const router = express.Router();

const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var globalId = 1;

app.options('/*', function(req, res) {
  res.set(defaultCorsHeaders);
  res.status(200).end();
});

app.get('/chatterbox/classes/messages', function(req, res) {
  res.set(defaultCorsHeaders);
  fs.readFile('chatLog.json', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var parsedData = JSON.parse(data);
      console.log('PDRL:', parsedData.results.length);
      globalId = parsedData.results.length;
      console.log('globalId', globalId);
      res.send(parsedData);
    }
  });
});

app.post('/chatterbox/classes/messages', function(req, res) {
  res.set(defaultCorsHeaders);
  fs.readFile('chatLog.json', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var messages = JSON.parse(data);
      var body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        console.log('Body:\n', body);
        body = JSON.parse(body);
        body.objectId = globalId + 1;
        messages.results.push(body);

        console.log('\nMessages: \n', messages);

        fs.writeFile('chatLog.json', JSON.stringify(messages), function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log('\n WROTE FILE \n');
            res.status(201).send('Okay').end();
          }
        });
      });
    }
  });
});

app.use(express.static('../client'));
app.use('/', router);
// app.set('port', (process.env.PORT || 3000));

app.listen(3000, function() {
  console.log('Launching Chatterbox Express');
});

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
