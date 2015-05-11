var http = require( "http" );
var fs = require( "fs" );

var players = 0;

function playerAssignment( req, res ){
  console.log( "here in server" );
  if( players == 0 ){
    res.writeHead( 200 );
    res.end( "black" );
  }
  else if( players == 1 ){
    res.writeHead( 200 );
    res.end( "white" );
  }
  else{
    res.writeHead( 200 );
    res.end( "obs" );
  }
  players++;
}

function serveFile( filename, req, res )
{
    var contents = "";
    try {
    	contents = fs.readFileSync( filename ).toString();
    }
    catch( e ) {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res ){
  console.log( "getting file" )
  var filename = req.url.substring( 1, req.url.length );
  if( filename.substring( 0, 17 ) == "player_assignment" ){
    playerAssignment( req, res );
  }
  else if( filename == "go_client.js" ){
    serveFile( "go_client.js", req, res );
  }
  else{
    serveFile( "go.html", req, res );
  }
}

var server = http.createServer( serverFn );
server.listen( 8098 );
