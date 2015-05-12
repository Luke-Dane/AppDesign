var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function formInputParser( url )
{
    inputs = {}
    var form_text = url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        inputs[ inp[0] ] = inp[1];
    }
    console.log( inputs );
    return inputs;
}

function serveFile( filename, req, res )
{
    try
    {
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function listStudents( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>" +
  "<table>";
    db.each( "SELECT * FROM Students ",
        function( err, row ) {
            console.log( row );
	    resp_text += " <tr><td> " + row.StudentName + " </td><td>" + row.Year + "</td></tr> ";
        });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listTeachers( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>" +
  "<table>";
    db.each( "SELECT * FROM Teachers ",
        function( err, row ) {
            console.log( row );
	    resp_text += " <tr><td> " + row.TeacherName + " </td><td>" + row.Office+ "</td></tr> ";
        });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listClasses( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>" +
  "<table>";
    db.each( "SELECT * FROM Classes ",
        function( err, row ) {
            console.log( row );
	    resp_text += " <tr><td> " + row.ClassName + " </td><td>" + row.Department + "</td></tr> ";
        });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listEnrollments( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>" +
  "<table>";
    db.each( "SELECT * FROM Enrollments " +
             "JOIN Classes ON Classes.ID = Enrollments.ClassID " +
             "JOIN Students ON Students.ID = Enrollments.StudentID ",
        function( err, row ) {
            console.log( row );
	    resp_text += " <tr><td> " + row.StudentName + " </td><td>" +
                   row.ClassName + "</td></tr> ";
        });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listAssignments( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>" +
  "<table>" +
  "<tr><td style = ''>Teacher";
    db.each( "SELECT * FROM TeachingAssignments " +
             "JOIN Classes ON Classes.ID = TeachingAssignments.ClassID " +
             "JOIN Teachers ON Teachers.ID = TeachingAssignments.TeacherID ",
        function( err, row ) {
            console.log( row );
	    resp_text += " <tr><td> " + row.TeacherName + " </td><td>" +
                   row.ClassName + "</td></tr> ";
        });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function addStudent( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    console.log( req.url );
    //formInputParser( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var pre_sname = null, syear = null;
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        if( inp[0] == 'studentname' ) {
            pre_sname = inp[1];
        }
        else if( inp[0] == 'year' ) {
            syear = inp[1];
        }
    }
    if( pre_sname == null || syear == null)
    {
        res.writeHead( 200 );
        res.end( "Error: Student name or year could not be read." );
        return;
    }

    var sname = decodeURIComponent( ( pre_sname + '' ).replace( /\+/g, '%20' ) );
    var sql_cmd = "INSERT INTO Students ('StudentName', 'Year') VALUES ('"+
       sname+"', '"+
       syear+"')";
       db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added " + sname + " to Students</body></html>" );
}

function addEnrollment( req, res )
{
    var db = new sqlite.Database( "School.sqlite" );
    console.log( req.url );
    //formInputParser( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var pre_sname = null, pre_cname = null;
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        if( inp[0] == 'studentname' ) {
            pre_sname = inp[1];
        }
        else if( inp[0] == 'classname' ) {
            pre_cname = inp[1];
        }
    }
    if( pre_sname == null || pre_cname == null)
    {
        res.writeHead( 200 );
        res.end( "Error: Student name or year could not be read." );
        return;
    }

    var sname = decodeURIComponent( ( pre_sname + '' ).replace( /\+/g, '%20' ) );
    var cname = decodeURIComponent( ( pre_cname + '' ).replace( /\+/g, '%20' ) );

    var sname_exists = false;
    db.all( "SELECT COUNT(StudentName) FROM Students WHERE StudentName = '" + sname +"'",
        function( err, rows ) {
            sname_exists = rows[0]['COUNT(StudentName)'] == 1;
            console.log(sname_exists);
            if( !sname_exists ){
              console.log( "Error: " + sname + " is not in the database." );
              return;
            }
            else{
              db.each( "SELECT * FROM Students WHERE StudentName = '" + sname + "'",
                function( err, rows ){
                  var sidx = rows.ID;
                });
            }

        });

    var cname_exists = false;
    db.all( "SELECT COUNT(ClassName) FROM Classes WHERE ClassName = '" + cname +"'",
        function( err, rows ) {
            cname_exists = rows[0]['COUNT(ClassName)'] == 1;
            if( !cname_exists ){
              console.log( "Error: " + cname + " is not in the database." );
              return;
            }
            else{
              db.each( "SELECT * FROM Classes WHERE ClassName = '" + cname + "'",
                function( err, rows) {
                  var cidx = rows.ID;
                });
            }
        });



    var sql_cmd = "INSERT INTO Enrollments ('ClassID', 'StudentID') VALUES ('"+
       cidx+"', '"+
       sidx+"')";
       db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added enrollment</body></html>" );
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );

    if( filename == "" ){
        filename = "./index_school.html";
    }
    if( filename.substring( 0, 13 ) == "list_students" ){
        listStudents( req, res );
    }
    else if( filename.substring( 0, 13 ) == "list_teachers" ){
        listTeachers( req, res );
    }
    else if( filename.substring( 0, 12 ) == "list_classes" ){
        listClasses( req, res );
    }
    else if( filename.substring( 0, 16 ) == "list_enrollments" ){
        listEnrollments( req, res );
    }
    else if( filename.substring( 0, 16 ) == "list_assignments" ){
        listAssignments( req, res );
    }
    else if( filename.substring( 0, 11 ) == "add_student" ){
        addStudent( req, res );
    }
    else if( filename.substring( 0, 14 ) == "add_enrollment" ){
        addEnrollment( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
