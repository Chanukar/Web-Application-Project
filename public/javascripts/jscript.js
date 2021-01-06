var home_page;
function connectdb()
{

    var date = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    document.getElementById("todaydate").innerHTML = days[date.getDay()]+", "+date.getDate()+" "+months[date.getMonth()]+" "+date.getUTCFullYear()+" Schedule";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            dbhomepagedata = JSON.parse(this.responseText);

                home_page = new Vue({
                el: '#maincontent',
                data: {
                scheduledetail: dbhomepagedata
            },
            created: function () {
                let btnstatus = '';
                for (let i=0; i<this.scheduledetail.length; i++)
                {
                    btnstatus = 'green';

                    for (let j = 0; j < this.scheduledetail[i].taskusers.length; j++) {
                        if (this.scheduledetail[i].taskusers[j].status == 1) {
                            this.scheduledetail[i].taskusers[j].status = 'green';
                        }
                        else {
                            this.scheduledetail[i].taskusers[j].status = 'red';
                            btnstatus = 'red';
                        }
                    }

                    this.scheduledetail[i].taskbtnstatus = btnstatus;
                }
        },
        methods: {
            tasktime: function(task) {
                return task.starttime + " - " + task.endtime;
            },
            managerstat: function(task) {
                return 'Scheduled by: ' + task.manager;
            },
            iscompleted: function(task) {
                if (task.taskbtnstatus == 'green') {
                    return 'Completed';
                }
                else {
                    return 'Not Completed';
                }
            }
        },
    });

        }
    };
    xhttp.open("GET", "/homepagedata", true);
    xhttp.send();
}







function changenav1()
{
    document.getElementById("navitem1").className = "active";
    if (document.getElementById("navitem2").className == "active") {
        document.getElementById("navitem2").className = "";
    }
    if (document.getElementById("navitem3").className == "active") {
        document.getElementById("navitem3").className = "";
    }
}

function changenav2()
{
    document.getElementById("navitem2").className = "active";
    if (document.getElementById("navitem1").className == "active") {
        document.getElementById("navitem1").className = "";
    }
    if (document.getElementById("navitem3").className == "active") {
        document.getElementById("navitem3").className = "";
    }
}

function changenav3()
{
    document.getElementById("navitem3").className = "active";
    if (document.getElementById("navitem2").className == "active") {
        document.getElementById("navitem2").className = "";
    }
    if (document.getElementById("navitem1").className == "active") {
        document.getElementById("navitem1").className = "";
    }
}

function markcompletebutton(obj)
{
    obj.disabled = true;
    let parent = obj.parentElement.parentNode.id;
    document.getElementById(parent).getElementsByTagName("svg")[0].attributes.fill.value = "green";
    document.getElementById(parent).getElementsByClassName("user-name")[0].innerHTML = "<h6>Completed</h6>";
}

function logout()
{
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = '/index.html';
        }
      };
      xhttp.open("GET", "/logout", true);
      xhttp.send();
}

function employeeschedule()
{
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('main-page-content').innerHTML = this.responseText;
          connectdbemployee();
        }
      };
      xhttp.open("GET", "/users/usercontent", true);
      xhttp.send();
}

function preferencestab()
{
    var preferences;
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('main-page-content').innerHTML = this.responseText;
          var xhttp1 = new XMLHttpRequest();
            xhttp1.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                preferences = JSON.parse(this.responseText);

                employee_pref_page = new Vue({
            el: '#employeepreference',
            data: {
              Monday: '',
              Tuesday: '',
              Wednesday: '',
              Thursday: '',
              Friday: '',
              type1: '',
              type2: '',
              type3: '',
              type4: '',
              type5: ''
            },
            created: function () {
                        this.Monday = preferences[0].available;
                        this.Tuesday = preferences[1].available;
                        this.Wednesday = preferences[2].available;
                        this.Thursday = preferences[3].available;
                        this.Friday = preferences[4].available;
                        this.type1 = preferences[5].preference;
                        this.type2 = preferences[6].preference;
                        this.type3 = preferences[7].preference;
                        this.type4 = preferences[8].preference;
                        this.type5 = preferences[9].preference;
            },
            methods: {
                clickday : function(preference) {
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                        }
                        };
                        xhttp.open("POST", "/users/updatedaypreference", true);
                        xhttp.setRequestHeader("content-type", "application/json");
                        xhttp.send(JSON.stringify({day:preference, available:document.getElementById(preference).checked}));
                    },

                clicktype : function(preference) {
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                        }
                        };
                        xhttp.open("POST", "/users/updatetypepreference", true);
                        xhttp.setRequestHeader("content-type", "application/json");
                        xhttp.send(JSON.stringify({type:preference, preferencestatus:document.getElementById(preference).checked}));
                    }

                }
            });
            }
            };
            xhttp1.open("GET", "/users/preferencedb", true);
            xhttp1.send();
        }
      };
      xhttp.open("GET", "/users/userpreferences", true);
      xhttp.send();
}

function profiletab()
{
    var personaldata;
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('main-page-content').innerHTML = this.responseText;
          var xhttp1 = new XMLHttpRequest();
            xhttp1.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                personaldata = JSON.parse(this.responseText);

                var user_pref_page = new Vue({
            el: '#main-page-content',
            data: {
                firstname: '',
                lastname: '',
                address: '',
                phonenumber: '',
                email: '',
                password: '*******',
                showprofile: true,
                showedit: false
            },
            created: function () {
                this.firstname = personaldata[0].firstname;
                this.lastname = personaldata[0].lastname;
                this.address = personaldata[0].address;
                this.phonenumber = personaldata[0].phonenumber;
                this.email = personaldata[0].email;
            },
            methods: {
                enableedit: function()
                {
                    this.showprofile = false;
                    this.showedit = true;
                },
                disableedit: function()
                {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                    }
                    };
                    xhttp.open("POST", "/users/updateprofiledb", true);
                    xhttp.setRequestHeader("content-type", "application/json");
                    xhttp.send(JSON.stringify({
                        firstname: this.firstname,
                        lastname: this.lastname,
                        address: this.address,
                        phonenumber: this.phonenumber,
                        email: this.email,
                        password: this.password
                        }));
                    this.showprofile = true;
                    this.showedit = false;

                }
            }
            });
            }
            };
            xhttp1.open("GET", "/users/profiledb", true);
            xhttp1.send();
        }
      };
      xhttp.open("GET", "/users/userprofile", true);
      xhttp.send();
}

function createtask()
{
    var xhttp1 = new XMLHttpRequest();
      xhttp1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('main-page-content').innerHTML = this.responseText;
          var manager_create_task = new Vue({
            el: '#taskcreate',
            data: {
                taskname: '',
                taskdescription: '',
                starttime: '',
                endtime: '',
                availableusers: '',
                selectedusers: [],
                showavailableusers: false,
                invalidtime: false,
                invalidtaskname: false,
                invalidemployees: false,
                invalidform: false
            },
            methods: {
                submit: function()
                {
                    var obj = {"taskname": this.taskname, "taskdescription": this.taskdescription, "starttime": this.starttime, "endtime": this.endtime, "employees": this.selectedusers};
                    var xhttp = new XMLHttpRequest();
                      xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            window.location = this.responseText;
                        }
                      };
                      xhttp.open("POST", "/users/addnewtaskdb", true);
                      xhttp.setRequestHeader("content-type", "application/json");
                      xhttp.send(JSON.stringify(obj));
                },
                showusers: function()
                {
                    var xhttp = new XMLHttpRequest();
                      xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            manager_create_task.availableusers = JSON.parse(this.responseText);
                            if (manager_create_task.showavailableusers == false)
                            {
                                manager_create_task.showavailableusers = true;
                            }
                            else
                            {
                                manager_create_task.showavailableusers = false;
                            }
                        }
                      };
                      xhttp.open("GET", "/users/checkavailableemployee", true);
                      xhttp.send();
                }
            },
            computed: {
                calculatedate: function()
                {
                    var date = new Date();
                    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return 'Select Available Employees on ' + days[date.getDay()];
                },
                selecttime: function()
                {
                    if (this.starttime == '' || this.endtime == '' || (this.starttime >= this.endtime))
                    {
                        this.invalidtime = true;
                        return true;
                    }
                    else
                    {
                        this.invalidtime = false;
                        return false;
                    }
                },
                selectemployee: function()
                {
                    if (this.selectedusers == '')
                    {
                        this.invalidemployees = true;
                        return true;
                    }
                    else
                    {
                        this.invalidemployees = false;
                        return false;
                    }
                },
                selecttaskname: function()
                {
                    if (this.taskname == '')
                    {
                        this.invalidtaskname = true;
                        return true;
                    }
                    else
                    {
                        this.invalidtaskname = false;
                        return false;
                    }
                },
                disablebtn: function()
                {
                    if (this.invalidtime == true || this.invalidemployees == true || this.invalidtaskname == true)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            });
        }
      };
      xhttp1.open("GET", "/users/managercreatetask", true);
      xhttp1.send();
}

function edittask()
{
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('main-page-content').innerHTML = this.responseText;
          var user_pref_page = new Vue({
            el: '#usereditpage',
            data: {
                taskname: 'taskname1',
                taskdescription: 'taskdescription1',
                starttime: '09:00AM',
                endtime: '10:00AM',
                status: 'Not Complete',
                showprofile: true,
                showedit: false
            },
            methods: {
                enableedit: function()
                {
                    this.showprofile = false;
                    this.showedit = true;
                },
                disableedit: function()
                {
                    this.showprofile = true;
                    this.showedit = false;
                }
            }
            });
        }
      };
      xhttp.open("GET", "/users/manageredittask", true);
      xhttp.send();
}

function connectdbemployee()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            dbemployeepagedata = JSON.parse(this.responseText);

                employee_page = new Vue({
                    el: '#maincontent',
                    data: {
                        taskdescription: dbemployeepagedata,
                        clickedindex: ''
                    },
                    methods: {
                        timeschedule: function(description) {
                        return description.starttime + " - " + description.endtime;
                        },
                        completestatus: function(description) {
                            if (description.status == '1')
                            {
                                return 'Completed';
                            }
                            else
                            {
                                return 'Not Completed';
                            }
                        },
                        disablestatus: function(description) {
                            if (description.status == '1')
                            {
                                return true;
                            }
                            else
                            {
                                return false;
                            }
                        },
                        completebuttoncolour: function(description) {
                            if (description.status == '1')
                            {
                                return 'green';
                            }
                            else
                            {
                                return 'red';
                            }
                        },
                        managerschedule: function(description) {
                            return 'schedulded by: '+description.managername;
                        },
                        markcompletebutton: function(description, index) {
                            if (status == '1')
                            {
                                description.status = '0';
                            }
                            else
                            {
                                description.status = '1';
                            }

                            this.clickedindex = index;
                            getclickedtaskid(this.taskdescription[this.clickedindex].taskid);
                        }
                    },
                });
        }
    };
    xhttp.open("GET", "/users/employeepagedb", true);
    xhttp.send();
}

function getclickedtaskid(taskid)
{
    var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  xhttp.open("POST", "/users/employeestatus", true);
  xhttp.setRequestHeader("content-type", "application/json");
  xhttp.send(JSON.stringify({taskid:taskid}));
}

