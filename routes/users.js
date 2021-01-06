var express = require('express');
var router = express.Router();

var sanitizeHtml = require('sanitize-html');
var argon2 = require('argon2');

router.use(function(req, res, next) {
  if (!('user' in req.session))
  {
    res.redirect('/login.html');
  }
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/employeelogin', function(req, res, next) {
  res.send("<!DOCTYPE html>\
<html lang='en'>\
    <head>\
        <title>The Shop</title>\
        <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css' integrity='sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk' crossorigin='anonymous'>\
        <link rel='stylesheet' href='/stylesheets/style.css'>\
        <script src='https://cdn.jsdelivr.net/npm/vue/dist/vue.js'></script>\
    </head>\
    <body onload='employeeschedule()'>\
        <header id='main-header'>\
                <a href='/'><h1>The Shop</h1></a>\
                <div class='header-buttons'>\
                    <button type='submit' class='btn btn-danger mb-2' onclick='logout()'>Log Out</button>\
                    <button type='button' class='btn btn-success' style='display:none'>Log In</button>\
                </div>\
        </header>\
        <ul>\
            <li><a id='navitem1' class='active' href='#' onclick='changenav1(); employeeschedule()'>Schedule</a></li>\
            <li><a id='navitem2' href='#' onclick='changenav2(); preferencestab()'>Preferences</a></li>\
            <li><a id='navitem3' href='#' onclick='changenav3(); profiletab()'>Profile</a></li>\
        </ul>\
        <div id='main-page-content'>\
        </div>\
        <footer id='main-footer'>\
            <p>Copyright &copy; 2020<br>\
                <svg class='bi bi-shop-window' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>\
                    <path fill-rule='evenodd' d='M3.12 1.175A.5.5 0 0 1 3.5 1h9a.5.5 0 0 1 .38.175l2.759 3.219A1.5 1.5 0 0 1 16 5.37v.13h-1v-.13a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.13H0v-.13a1.5 1.5 0 0 1 .361-.976l2.76-3.22z'/>\
                    <path d='M2.375 6.875c.76 0 1.375-.616 1.375-1.375h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 1 0 2.75 0h1a2.375 2.375 0 0 1-4.25 1.458 2.371 2.371 0 0 1-1.875.917A2.37 2.37 0 0 1 8 6.958a2.37 2.37 0 0 1-1.875.917 2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.5h1c0 .76.616 1.375 1.375 1.375z'/>\
                    <path d='M4.75 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM2 8.854V15h12V8.854a3.354 3.354 0 0 0 1-.27V15h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V8.583c.311.14.647.232 1 .271zm0-1.008V7H1v.437c.291.207.632.35 1 .409zm13-.409c-.291.207-.632.35-1 .409V7h1v.437z'/>\
                    <path d='M4 13V9H3v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9h-1v4H4z'/>\
                </svg>\
            The Shop<br>\
                <svg class='bi bi-geo-alt' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>\
                    <path fill-rule='evenodd' d='M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/>\
                </svg>\
            123 Main Road Modbury, SA 5092<br>\
                <svg class='bi bi-phone' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>\
                    <path fill-rule='evenodd' d='M11 1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z'/>\
                    <path fill-rule='evenodd' d='M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/>\
                </svg>\
            8395 2800\
            </p>\
        </footer>\
        <script src='/javascripts/jscript.js'></script>\
    </body>\
</html>");
});

router.get('/managerlogin', function(req, res, next) {
  res.send("<!DOCTYPE html>\
<html lang='en'>\
    <head>\
        <title>The Shop</title>\
        <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css' integrity='sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk' crossorigin='anonymous'>\
        <link rel='stylesheet' href='/stylesheets/style.css'>\
        <script src='https://cdn.jsdelivr.net/npm/vue/dist/vue.js'></script>\
        <script src='/javascripts/jscript.js'></script>\
    </head>\
    <body onload='createtask()'>\
        <header id='main-header'>\
                <a href='/'><h1>The Shop</h1></a>\
                <div class='header-buttons'>\
                    <button type='submit' class='btn btn-danger mb-2' onclick='logout()'>Log Out</button>\
                    <button type='button' class='btn btn-success' style='display:none'>Log In</button>\
                </div>\
        </header>\
        <ul>\
            <li><a id='navitem1' class='active' href='#' onclick='changenav1(); createtask()'>Create Task</a></li>\
            <li><a id='navitem2' href='#' onclick='changenav2(); edittask()'>Edit Task</a></li>\
            <li><a id='navitem3' href='#' onclick='changenav3(); profiletab()'>Profile</a></li>\
        </ul>\
        <div id='main-page-content'>\
        </div>\
        <footer id='main-footer'>\
            <p>Copyright &copy; 2020<br>\
                <svg class='bi bi-shop-window' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>\
                    <path fill-rule='evenodd' d='M3.12 1.175A.5.5 0 0 1 3.5 1h9a.5.5 0 0 1 .38.175l2.759 3.219A1.5 1.5 0 0 1 16 5.37v.13h-1v-.13a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.13H0v-.13a1.5 1.5 0 0 1 .361-.976l2.76-3.22z'/>\
                    <path d='M2.375 6.875c.76 0 1.375-.616 1.375-1.375h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 1 0 2.75 0h1a2.375 2.375 0 0 1-4.25 1.458 2.371 2.371 0 0 1-1.875.917A2.37 2.37 0 0 1 8 6.958a2.37 2.37 0 0 1-1.875.917 2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.5h1c0 .76.616 1.375 1.375 1.375z'/>\
                    <path d='M4.75 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM2 8.854V15h12V8.854a3.354 3.354 0 0 0 1-.27V15h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V8.583c.311.14.647.232 1 .271zm0-1.008V7H1v.437c.291.207.632.35 1 .409zm13-.409c-.291.207-.632.35-1 .409V7h1v.437z'/>\
                    <path d='M4 13V9H3v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9h-1v4H4z'/>\
                </svg>\
            The Shop<br>\
                <svg class='bi bi-geo-alt' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>\
                    <path fill-rule='evenodd' d='M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/>\
                </svg>\
            123 Main Road Modbury, SA 5092<br>\
                <svg class='bi bi-phone' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>\
                    <path fill-rule='evenodd' d='M11 1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z'/>\
                    <path fill-rule='evenodd' d='M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/>\
                </svg>\
            8395 2800\
            </p>\
        </footer>\
    </body>\
</html>");
});

router.get('/usercontent', function(req, res, next) {
  res.send("<div id='maincontent'>\
            <div style='margin-left:25%;padding:1px 16px;height:1500px;'>\
                <div id='usertask1' class='task-detail2' v-for='(description, index) in taskdescription'>\
                    <div class='task-name'><h6>{{description.taskname}}</h6></div>\
                    <div class='task-time'><p>{{timeschedule(description)}}</p></div>\
                    <div class='task-description'><p>{{description.description}}</p></div>\
                    <div class='task-user'>\
                        <div class='user-status'><svg class='bi bi-circle-fill' width='1em' height='1em' viewBox='0 0 16 16' v-bind:fill='completebuttoncolour(description)' xmlns='http://www.w3.org/2000/svg'>\
                            <circle cx='8' cy='8' r='8'/></svg>\
                        </div>\
                        <div class='user-name'>\
                            <h6>{{completestatus(description)}}</h6>\
                        </div>\
                    </div>\
                    <div><button type='button' class='btn btn-success' v-on:click='markcompletebutton(description, index)' :disabled='disablestatus(description)'>Mark as Complete</button></div>\
                    <div class='task-manager'><h6>{{managerschedule(description)}}</h6></div>\
                </div>\
            </div>\
        </div>");
});

router.get('/userpreferences', function(req, res, next) {
  res.send("<div style='margin-left:25%;padding:1px 16px;height:1000px;'>\
            <div class='preferences' id='employeepreference'>\
                <div class='availability'>\
                    <h6 style='font-weight: bold; text-align: center;'>Availability</h6>\
                    <div id='check-available' class='available-day'>\
                        <div class='form-check'>\
                            <input id='Monday' class='form-check-input' type='checkbox' v-model='Monday' v-on:click='clickday(&quot;Monday&quot;)'>\
                            <label class='form-check-label'>\
                            Monday\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='Tuesday' class='form-check-input' type='checkbox' v-model='Tuesday' v-on:click='clickday(&quot;Tuesday&quot;)'>\
                            <label class='form-check-label'>\
                            Tuesday\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='Wednesday' class='form-check-input' type='checkbox' v-model='Wednesday' v-on:click='clickday(&quot;Wednesday&quot;)'>\
                            <label class='form-check-label'>\
                            Wednesday\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='Thursday' class='form-check-input' type='checkbox' v-model='Thursday' v-on:click='clickday(&quot;Thursday&quot;)'>\
                            <label class='form-check-label'>\
                            Thursday\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='Friday' class='form-check-input' type='checkbox' v-model='Friday' v-on:click='clickday(&quot;Friday&quot;)'>\
                            <label class='form-check-label'>\
                            Friday\
                            </label>\
                        </div>\
                    </div>\
                </div>\
                <div class='availability'>\
                    <h6 style='font-weight: bold; text-align: center;'>Type of Task</h6>\
                    <div class='available-day'>\
                        <div class='form-check'>\
                            <input id='type1' class='form-check-input' type='checkbox' v-model='type1' v-on:click='clicktype(&quot;type1&quot;)'>\
                            <label class='form-check-label'>\
                            Task Type 1\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='type2' class='form-check-input' type='checkbox' v-model='type2' v-on:click='clicktype(&quot;type2&quot;)'>\
                            <label class='form-check-label'>\
                                Task Type 2\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='type3' class='form-check-input' type='checkbox' v-model='type3' v-on:click='clicktype(&quot;type3&quot;)'>\
                            <label class='form-check-label'>\
                                Task Type 3\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='type4' class='form-check-input' type='checkbox' v-model='type4' v-on:click='clicktype(&quot;type4&quot;)'>\
                            <label class='form-check-label'>\
                                Task Type 4\
                            </label>\
                        </div>\
                        <div class='form-check'>\
                            <input id='type5' class='form-check-input' type='checkbox' v-model='type5' v-on:click='clicktype(&quot;type5&quot;)'>\
                            <label class='form-check-label'>\
                                Task Type 5\
                            </label>\
                        </div>\
                    </div>\
                </div>\
            </div>\
          </div>");
});

router.get('/userprofile', function(req, res, next) {
  res.send("<div style='margin-left:25%;padding:1px 16px;height:1000px;' id='usereditpage'>\
            <div class='preferences' v-if='showprofile'>\
                <div class='edits'>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>First Name: </p>\
                        <p>{{firstname}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Last Name: </p>\
                        <p>{{lastname}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Address:</p>\
                        <p>{{address}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Phone Number: </p>\
                        <p>{{phonenumber}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Email: </p>\
                        <p>{{email}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Password: </p>\
                        <p>*****</p>\
                    </div>\
                    <div class='col-auto'>\
                        <button type='submit' class='btn btn-danger mb-2' v-on:click='enableedit'>Edit Profile</button>\
                      </div>\
                </div>\
            </div>\
            <div class='preferences' v-if='showedit'>\
                <div class='edits'>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>First Name: </p>\
                        <p>{{firstname}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Last Name: </p>\
                        <p>{{lastname}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Address: </p>\
                        <input type='text' v-model='address'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Phone Number: </p>\
                        <input type='text' v-model='phonenumber'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Email: </p>\
                        <input type='text' v-model='email'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Password: </p>\
                        <input type='password' v-model='password'>\
                    </div>\
                    <div class='col-auto'>\
                        <button type='submit' class='btn btn-success mb-2' v-on:click='disableedit'>Save Changes</button>\
                      </div>\
                </div>\
            </div>\
          </div>");
});

router.get('/managercreatetask', function(req, res, next) {
  res.send("<div style='margin-left:25%;padding:1px 16px;height:1000px;' id='taskcreate'>\
            <div class='preferences'>\
                <div class='edits'>\
                    <div class='edit'>\
                        <form>\
                            <div class='form-row'>\
                                <div class='col-md-6 mb-3'>\
                                    <label style='font-weight: bold;'>Task name</label>\
                                    <input type='text' class='form-control' required v-model='taskname'>\
                                </div>\
                            </div>\
                                <div class='form-group'>\
                                    <label style='font-weight: bold;'>Task Description</label>\
                                    <input type='text' class='form-control' required v-model='taskdescription'>\
                                </div>\
                                <div class='form-row'>\
                                    <div class='col-md-3 mb-3'>\
                                        <label style='font-weight: bold;'>Start Time</label>\
                                        <select class='custom-select' v-model='starttime'>\
                                          <option selected disabled value=''>Select Time</option>\
                                          <option value='09:00:00'>09.00</option>\
                                          <option value='10:00:00'>10.00</option>\
                                          <option value='11:00:00'>11.00</option>\
                                          <option value='12:00:00'>12.00</option>\
                                          <option value='13:00:00'>13.00</option>\
                                          <option value='14:00:00'>14.00</option>\
                                          <option value='15:00:00'>15.00</option>\
                                          <option value='16:00:00'>16.00</option>\
                                        </select>\
                                    </div>\
                                    <div class='col-md-3 mb-3'>\
                                        <label style='font-weight: bold;'>End Time</label>\
                                        <select class='custom-select' v-model='endtime'>\
                                          <option selected disabled value=''>Select Time</option>\
                                          <option value='10:00:00'>10.00</option>\
                                          <option value='11:00:00'>11.00</option>\
                                          <option value='12:00:00'>12.00</option>\
                                          <option value='13:00:00'>13.00</option>\
                                          <option value='14:00:00'>14.00</option>\
                                          <option value='15:00:00'>15.00</option>\
                                          <option value='16:00:00'>16.00</option>\
                                          <option value='17:00:00'>17.00</option>\
                                        </select>\
                                    </div>\
                                </div>\
                                <div class='form-row;col-md-3 mb-3'>\
                                    <input type='button' class='btn btn-info' value='Available Employees' v-on:click='showusers()'>\
                                </div>\
                                <div v-if='showavailableusers'>\
                                    <div class='form-row;col-md-3 mb-3'>\
                                        <h6 style='font-weight: bold;'>{{calculatedate}}</h6>\
                                    </div>\
                                    <div class='form-row;col-md-3 mb-3'>\
                                        <div v-for='user in availableusers'>\
                                            <input type='checkbox' v-bind:value='user.id' v-model='selectedusers'>\
                                            <label for='vehicle1'>{{user.employee}}</label><br>\
                                        </div>\
                                    </div>\
                                </div>\
                            <div class='form-row;col-md-3 mb-3'>\
                                    <input type='button' value='Create Task' class='btn btn-success' v-on:click='submit' :disabled='disablebtn'>\
                                </div>\
                                <h6 style='font-weight: bold; color: red;' v-if='selecttaskname'>Task name is required</h6>\
                                <h6 style='font-weight: bold; color: red;' v-if='selecttime'>Please select valid start time or end time</h6>\
                                <h6 style='font-weight: bold; color: red;' v-if='selectemployee'>Please select at least one available employee</h6>\
                            </div>\
                          </form>\
                    </div>\
                </div>\
            </div>\
          </div>");
});

router.get('/manageredittask', function(req, res, next) {
  res.send("<div style='margin-left:25%;padding:1px 16px;height:1000px;' id='usereditpage'>\
            <div class='preferences' v-if='showprofile'>\
                <div class='edits'>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Task Name: </p>\
                        <p>{{taskname}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Task Description: </p>\
                        <p>{{taskdescription}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Start Time:</p>\
                        <p>{{starttime}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>End Time: </p>\
                        <p>{{endtime}}</p>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Complete Status: </p>\
                        <p>{{status}}</p>\
                    </div>\
                    <div class='col-auto'>\
                        <button type='submit' class='btn btn-danger mb-2' v-on:click='enableedit'>Edit Task</button>\
                      </div>\
                </div>\
            </div>\
            <div class='preferences' v-if='showedit'>\
                <div class='edits'>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Task Name: </p>\
                        <input type='text' v-model='taskname'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Task Description: </p>\
                        <input type='text' v-model='taskdescription'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Start Time: </p>\
                        <input type='text' v-model='starttime'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>End Time: </p>\
                        <input type='text' v-model='endtime'>\
                    </div>\
                    <div class='edit'>\
                        <p style='font-weight: bold;'>Complete Status: </p>\
                        <input type='text' v-model='status'>\
                    </div>\
                    <div class='col-auto'>\
                        <button type='submit' class='btn btn-success mb-2' v-on:click='disableedit'>Save Changes</button>\
                      </div>\
                </div>\
            </div>\
        </div>");
});

router.get('/employeepagedb', function(req, res, next) {

  var tasks;
  var taskdescription = [];
  var taskid;

  req.pool.getConnection(function(err,connection){
    if (err){
      res.sendStatus(500);
      return;
    }
    var query = "select fk_taskid as taskid, status from EmployeeTask where fk_employeeid = ?";
    connection.query(query, [req.session.user], function(err,rows,fields){
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      else
      {
        tasks = rows;

        for (let index = 0; index < tasks.length; index++)
        {
          taskid = tasks[index].taskid;
          var taskquery = "select taskid, taskname, description, TIME_FORMAT(starttime, '%H %i %p') as starttime, TIME_FORMAT(endtime, '%H %i %p') as endtime, Manager.firstname as managername from Task inner join Manager on Manager.managerid = Task.fk_managerid where Task.taskid = ?";
          connection.query(taskquery,[taskid], function(err,rows2,fields){
            if (err)
            {
              res.sendStatus(500);
              return;
            }
            else
            {
              rows2[0].status = tasks[index].status;
              taskdescription.push(rows2[0]);

              if (index == tasks.length-1)
              {
                res.send(JSON.stringify(taskdescription));
              }
            }
          });
        }
        connection.release();
      }

    });
  });
});

router.post('/employeestatus', function(req, res, next) {

  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "update EmployeeTask set status = 1 where fk_employeeid = ? and fk_taskid = ?";
    connection.query(query, [req.session.user, req.body.taskid], function(err,rows,fields){
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.get('/preferencedb', function(req, res, next) {

  var results ='';

  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "select day, available from EmployeeAvailable where fk_employeeid = ?";
    connection.query(query, [req.session.user], function(err,rows,fields){
    //connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
        //results = rows;
        query = "select type, preference from EmployeeTypePreference where fk_employeeid = ?";
        connection.query(query, [req.session.user], function(err,rows2,fields){
        connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        results = rows.concat(rows2);
        res.send(results);
        });
    });
  });
});

router.post('/updatedaypreference', function(req, res, next) {

  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "update EmployeeAvailable set available = ? where fk_employeeid = ? and day = ?";
    connection.query(query, [req.body.available, req.session.user, req.body.day], function(err,rows,fields){
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.post('/updatetypepreference', function(req, res, next) {

  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "update EmployeeTypePreference set preference = ? where fk_employeeid = ? and type = ?";
    connection.query(query, [req.body.preferencestatus, req.session.user, req.body.type], function(err,rows,fields){
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.get('/profiledb', function(req, res, next) {

  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }

    if ('usertype' in req.session)
    {
      var query = "select firstname, lastname, address, phonenumber, email from Manager where managerid = ?";
      connection.query(query, [req.session.user], function(err,rows,fields){
        connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        res.send(rows);
      });
    }
    else
    {
      var query = "select firstname, lastname, address, phonenumber, email from Employee where employeeid = ?";
      connection.query(query, [req.session.user], function(err,rows,fields){
        connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        res.send(rows);
      });
    }
  });
});

router.post('/updateprofiledb', async function(req, res, next) {

  var phash = null;
  try {
    phash = await argon2.hash(req.body.password);
    } catch (err) {
      res.sendStatus(500);
      return;
  }

  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    if ('usertype' in req.session)
    {
      var query = "update Manager set firstname = ?, lastname = ?, address = ?, phonenumber = ?, email = ?, password = ? where managerid = ?";
      connection.query(query, [sanitizeHtml(req.body.firstname), sanitizeHtml(req.body.lastname), sanitizeHtml(req.body.address), sanitizeHtml(req.body.phonenumber), sanitizeHtml(req.body.email), phash, req.session.user], function(err,rows,fields){
      connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    }
    else
    {
      var query = "update Employee set firstname = ?, lastname = ?, address = ?, phonenumber = ?, email = ?, password = ? where employeeid = ?";
      connection.query(query, [sanitizeHtml(req.body.firstname), sanitizeHtml(req.body.lastname), sanitizeHtml(req.body.address), sanitizeHtml(req.body.phonenumber), sanitizeHtml(req.body.email), phash, req.session.user], function(err,rows,fields){
      connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    }
  });
});


router.get('/checkavailableemployee', function(req, res, next) {

  var date = new Date();
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var day = days[date.getDay()];


  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "select employeeid as id , firstname as employee from Employee where employeeid in (select fk_employeeid from EmployeeAvailable where day='Wednesday' and available=1 and fk_employeeid in (select fk_employeeid from EmployeeTypePreference where preference=1))";
    connection.query(query, [day], function(err,rows,fields){
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      res.send(rows);
    });
  });
});

router.post('/addnewtaskdb', function(req, res, next) {

  var lasttaskid;
  userlist = req.body.employees;


  req.pool.getConnection(function(err,connection){
    if (err)
    {
      res.sendStatus(500);
      return;
    }
    var query = "insert into Task (taskname, description, starttime, endtime, fk_managerid) values (?,?,?,?,?)";
    connection.query(query, [req.body.taskname, req.body.taskdescription, req.body.starttime, req.body.endtime, req.session.user], function(err,rows,fields){
      //connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      //return res.send('/users/managerlogin');
      req.pool.getConnection(function(err,connection){
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        var query = "SELECT MAX(taskid) as max FROM Task";
        connection.query(query, function(err,rows2,fields){
          //connection.release();
          if (err)
          {
            res.sendStatus(500);
            return;
          }
          lasttaskid = rows2[0].max;
          //return res.send('/users/managerlogin');

          var listquery = `insert into EmployeeTask (fk_employeeid, fk_taskid, status) values (${userlist[0]},${lasttaskid},0)`;
          for ( let i=1; i<userlist.length; i++)
          {
            listquery += `, (${userlist[i]},${lasttaskid},0)`;
          }

          req.pool.getConnection(function(err,connection){
            if (err)
            {
              res.sendStatus(500);
              return;
            }
            connection.query(listquery, function(err,rows,fields){
              connection.release();
              if (err)
              {
                res.sendStatus(500);
                return;
              }
              return res.send('/users/managerlogin');
            });
          });
        });
      });
    });
  });
});

module.exports = router;
