var http = require( "http" );
var fs = require( "fs" );
var args = process.argv;

var players = 0;
var pieces;
var move = "black";

setBoard();

function setBoard(){
  pieces = fs.readFileSync( args[2] ).toString().split( "\n" );

  for ( var i = 0; i < pieces.length; i++ ){
    pieces[i] = pieces[i].split( "" );
  }
  console.log(pieces)

}

function setPiece( req, res ) {
  var pieceColor = req.url.split( "?" )[0].substring( 1, 6 );
  var y_coor = parseInt( req.url.split( "?" )[1].split( "=" )[1].split( "," )[0] );
  var x_coor = parseInt( req.url.split( "?" )[1].split( "=" )[1].split( "," )[1] );

  console.log( pieceColor + y_coor + x_coor );

  if( pieceColor == move ){
    pieces[y_coor+1][x_coor] = pieceColor.substring( 0, 1 );
    console.log(move);
    console.log(pieces);

    if( move == "black" ){
      move = "white";
    }
    else{
      move = "black";
    }
    console.log( move );
  }
}

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

function sendBoard( req, res ){
  console.log("send board")
  res.writeHead( 200 );
  res.end( JSON.stringify(pieces) );
}

function serverFn( req, res ){

  var filename = req.url.substring( 1, req.url.length );

  console.log( filename );

  if( filename.substring( 0, 17 ) == "player_assignment" ){
    playerAssignment( req, res );
  }
  else if( filename.substring( 0, 5 ) == "black" || filename.substring( 0, 5 ) == "white" ){
    setPiece( req, res );
  }
  else if (filename == "poll_board" ){
    sendBoard( req, res );
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
