
const g_wa_instance_url = process.env.WA_INSTANCE_URL;
const g_wa_skill_id     = process.env.WA_SKILL_ID;
const g_wa_apikey       = process.env.WA_APIKEY;


const g_http       = require( "http"        );
const g_express    = require( "express"     );
const g_bodyParser = require( "body-parser" );
const g_axios      = require( "axios"       );


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
    response.json( { "Success" : "Success" } );  // Return a successful response right away, no matter what, 
                                                 // to avoid disrupting the chatbot user experience
    
    console.log( "\n/confirmedintent request.body:\n" + JSON.stringify( request.body, null, 3 ) );
    
    var intent     = request.body.intent;
    var user_input = request.body.user_input;
    
    updateIntent( intent, user_input );
    
} );


function updateIntent( intent, user_input )
{
    // https://cloud.ibm.com/apidocs/assistant/assistant-v1#updateintent
    //

    var url = g_wa_instance_url + "/v1/workspaces/" + g_wa_skill_id + "/intents/" + intent + "?append=true&version=2021-11-27";
    
    var data = { "examples" : [ { "text" : user_input } ] };
    var body = { "body" : data };
    
    var auth    = { "username" : "apikey", "password" : g_wa_apikey };
    var headers = { "Content-Type" : "application/json" };
    var parms   = { "auth" : auth, "headers" : headers };
    
    console.log( "\nupdateIntent:\n" +
                 "url: " + url + "\n" +
                 "body:\n" + JSON.stringify( body, null, 3 ) + "\n" +
                 "parms:\n" + JSON.stringify( parms, null, 3 ) );
    
    g_axios.post( url, data, parms ).then( function( data )
    {
        console.log( "Intent updated successfully" );
        
    } ).catch( function( error )
    {
        if( error.response && error.response.data && error.response.data.error && error.response.data.error.match( /Unique Violation/i ) )
        {
            console.log( "Repeat intent" );
            return;
        }
        
        printAxiosError( error );
        
    } );
}


function printAxiosError( error )
{
    // https://www.npmjs.com/package/axios#handling-errors
    //
    
    console.log( "\nAxios error:" );
    
    if( error.response )
    {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log( error.response.data    );
        console.log( error.response.status  );
        console.log( error.response.headers );
    } 
    else if( error.request )
    {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log( error.request );
    } 
    else 
    {
      // Something happened in setting up the request that triggered an Error
      console.log( error.message );
    }
    
    console.log( error.config );
}

