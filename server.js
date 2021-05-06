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
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.Feedback__c SET Phone__c = $1, MobilePhone__c = $1 WHERE LOWER(First_Name__c) = LOWER($2) AND LOWER(	Last_Name__c) = LOWER($3) AND LOWER(Email__c) = LOWER($4) AND LOWER(Rate__c) = LOWER($5) AND LOWER(Free_space__c) = LOWER($6) AND LOWER(Name) = LOWER($7) ',
            [req.body.phone__c.trim(), req.body.first_name__c.trim(), req.body.last_name__c.trim(), req.body.email__c.trim(),req.body.name.trim(),req.body.rate__c.trim(),req.body.Free_space__c.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.Feedback__c (Phone__c, MobilePhone__c, First_Name__c, Last_Name__c, Email__c,Name, Rate__c, Free_space__c) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                  [req.body.phone__c.trim(), req.body.phone__c.trim(), req.body.first_name__c.trim(), req.body.last_name__c.trim(), req.body.email__c.trim(),req.body.name.trim(),req.body.rate__c.trim(),req.body.Free_space__c.trim()],
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
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
