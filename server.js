var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
       
            function(err, result) { ,
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.Feedback__c (Name, First_Name__c, Last_Name__c, Email__c, Phone__c,Rate__c, Free_space__c) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                  [req.body.name.trim(), req.body.firstName__c.trim(), req.body.lastName__c.trim(), req.body.email__c.trim(),req.body.phone__c.trim(),req.body.rate__c.trim(),req.body.free_space__c.trim() ],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                }
            }
        
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
