var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function listPerformers( req, res )
{
    var db = new sqlite.Database( "telluride.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each( "SELECT NAME FROM PERFORMERS", function( err, row ) {
        console.log( "perf "+row.NAME );
	resp_text += row.NAME;
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function listPerformances( req, res )
{
    var db = new sqlite.Database( "telluride.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each( "SELECT PERFORMERS.NAME as pname, * FROM PERFORMANCE " +
             "JOIN PERFORMERS ON PERFORMERS.ID = PERFORMANCE.PERFORMER " +
             "JOIN STAGES ON STAGES.ID = PERFORMANCE.STAGE " +
             "JOIN DAY ON DAY.ID = PERFORMANCE.DAY",
        function( err, row ) {
            console.log( row );
	    resp_text += row.TIME + " " + row.PERFORMER + " " +
                row.STAGE + " " + row.DAY;
        });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
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

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    if( filename == "" )
    {
        filename = "./index.html";
    }
    if( filename.substring( 0, 15 ) == "list_performers" )
    {
        listPerformers( req, res );
    }
    else if( filename.substring( 0, 17 ) == "list_performances" )
    {
        listPerformances( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
