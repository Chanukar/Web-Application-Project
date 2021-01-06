var express = require('express');
var router = express.Router();

var sanitizeHtml = require('sanitize-html');
var argon2 = require('argon2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Shop' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'The Shop' });
});

router.get('/logout', function(req, res, next) {

  if ('user' in req.session)
  {
    delete req.session.user;
  }
  if ('usertype' in req.session)
  {
    delete req.session.usertype;
  }

  res.sendStatus(200);
  return;
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'The Shop' });
});

router.post('/registerdetails', async function(req, res, next) {

    var phash = null;
    try {
      phash = await argon2.hash(req.body.password);
    } catch (err) {
      res.sendStatus(500);
      return;
    }

    req.pool.getConnection( function(err,connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      var query;
      if (req.body.usertype == 'manager')
      {
        query = "insert into Manager (firstname, lastname, address, phonenumber, email, password) values (?,?,?,?,?,?)";
        connection.query(query, [sanitizeHtml(req.body.firstname), sanitizeHtml(req.body.lastname), sanitizeHtml(req.body.address), sanitizeHtml(req.body.phonenumber), sanitizeHtml(req.body.email), phash], function(err,rows,fields){
        connection.release();
          // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.redirect('/login.html');
          //send response
        });
      }
      else
      {
        query = "insert into Employee (firstname, lastname, address, phonenumber, email, password) values (?,?,?,?,?,?)";
        connection.query(query, [sanitizeHtml(req.body.firstname), sanitizeHtml(req.body.lastname), sanitizeHtml(req.body.address), sanitizeHtml(req.body.phonenumber), sanitizeHtml(req.body.email), phash], function(err,rows,fields){
        //connection.release();
          // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
        req.pool.getConnection( function(err,connection) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          query = "SELECT MAX(employeeid) as max FROM Employee;";
          connection.query(query, function(err,rows2,fields){
          //connection.release();
            // release connection
          if (err) {
            res.sendStatus(500);
            return;
          }

          lastemployeeid = rows2[0].max;

          req.pool.getConnection( function(err,connection) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            query = "insert into EmployeeAvailable (fk_employeeid, day, available) values (?,'Monday',0), (?,'Tuesday',0), (?,'Wednesday',0), (?,'Thursday',0), (?,'Friday',0)";
            connection.query(query, [lastemployeeid,lastemployeeid,lastemployeeid,lastemployeeid,lastemployeeid], function(err,rows,fields){
            //connection.release();
              // release connection
            if (err) {
              res.sendStatus(500);
              return;
            }

            req.pool.getConnection( function(err,connection) {
              if (err) {
                res.sendStatus(500);
                return;
              }
              query = "insert into EmployeeTypePreference (fk_employeeid, type, preference) values (?,'type1',0), (?,'type2',0), (?,'type3',0), (?,'type4',0), (?,'type5',0)";
              connection.query(query, [lastemployeeid,lastemployeeid,lastemployeeid,lastemployeeid,lastemployeeid], function(err,rows,fields){
              connection.release();
                // release connection
              if (err) {
                res.sendStatus(500);
                return;
              }
              res.redirect('/login.html');
              });
            });

            });
          });

          });
        });
        });
      }
      });
});

router.post('/useraccount', function(req, res) {

  var userid = '';
  if(req.body.usertype == 'employee')
  {
    req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "select employeeid, password from Employee where email = ?";
    connection.query(query, [sanitizeHtml(req.body.email)], async function(err,rows,fields){
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0)
      {
        try {
          if (await argon2.verify(rows[0].password, req.body.password)) {
            // password match
            // add code here for when user successfully logged in

            userid = JSON.stringify(rows[0].employeeid);
            req.session.user = userid;
            res.redirect('/users/employeelogin');

          } else {
            // password did not match
            // add code here for when user login fails

            res.redirect('/loginfail.html');
            return;
          }
        } catch (err) {
          // internal failure
          res.sendStatus(500);
          return;
        }
      }
      else
      {
        res.redirect('/loginfail.html');
      }
      });
    });
  }
  else
  {
    req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "select managerid, password from Manager where email = ?";
    connection.query(query, [sanitizeHtml(req.body.email)], async function(err,rows,fields){
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0)
      {
        try {
          if (await argon2.verify(rows[0].password, req.body.password)) {
            // password match
            // add code here for when user successfully logged in

            userid = JSON.stringify(rows[0].managerid);
            req.session.user = userid;
            req.session.usertype = 'manager';
            res.redirect('/users/managerlogin');

          } else {
            // password did not match
            // add code here for when user login fails

            res.redirect('/loginfail.html');
            return;
          }
        } catch (err) {
          // internal failure
          res.sendStatus(500);
          return;
        }
      }
      else
      {
        res.redirect('/loginfail.html');
      }
      });
    });
  }
});

router.get('/homepagedata', function(req, res, next) {

  var details;
  var userlist = [];
  var task;

  req.pool.getConnection(function(err,connection){
    if (err){
      res.sendStatus(500);
      return;
    }
    var query = "select taskname, description, TIME_FORMAT(starttime,'%H %i %p') as starttime, TIME_FORMAT(endtime, '%H %i %p') as endtime, Manager.firstname as manager from Task inner join Manager on Task.fk_managerid = Manager.managerid;";
    connection.query(query, function(err,rows,fields){
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      else
      {
        //res.json(rows);
        details = rows;

        for (let index = 0; index < details.length; index++)
        {
          task = details[index].taskname;
          var userquery = "select firstname, lastname, status from EmployeeTask inner join Task on EmployeeTask.fk_taskid = Task.taskid inner join Employee on EmployeeTask.fk_employeeid = Employee.employeeid where taskname = ?";
          connection.query(userquery,[task], function(err,rows2,fields){
            if (err)
            {
              res.sendStatus(500);
              return;
            }
            else
            {
              //userlist.push(rows2);
              details[index].taskusers = rows2;

              if (index == details.length-1)
              {
                res.send(JSON.stringify(details));
              }
            }
          });
        }
        connection.release();
      }

    });
  });
});

module.exports = router;
