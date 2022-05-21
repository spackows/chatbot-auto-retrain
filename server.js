
const g_http       = require( "http"        );
const g_express    = require( "express"     );
const g_bodyParser = require( "body-parser" );


var g_app = g_express();
g_app.use( g_express.static( __dirname + '/public' ) );
g_app.use( g_bodyParser.json() );
g_app.use( g_bodyParser.urlencoded( { extended: true } ) );


const g_server = g_http.Server( g_app );
g_server.listen( 8080, function()
{
  console.log( "\nServer running" );
  
} );


g_app.post( '/confirmedintent', function( request, response )
{
    console.log( "\n/confirmedintent ..." );
    
    console.log( "\nrequest.body:\n" + JSON.stringify( request.body, null, 3 ) );
    
    response.json( { "Success" : "Success" } );
    
} );




