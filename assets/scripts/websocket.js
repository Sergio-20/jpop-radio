let heartbeatInterval;
let wss;





function heartbeat( interval )
{
  heartbeatInterval = setInterval( () => {
    wss.send( JSON.stringify( { op:9 } ) );
  }, interval );
}



function connect()
{

  wss = new WebSocket("wss://listen.moe/gateway_v2");

  wss.onopen = () => {
    clearInterval( heartbeatInterval );
    heartbeatInterval = null;
  };

  wss.onmessage = message => {

    if( !message.data.length ) return;

    let response;
    try { response = JSON.parse( message.data ); } 
    catch( error ) { return; }

    switch( response.op )
    {
      
      case 0:
        wss.send( JSON.stringify( { op:9 } ) );
        heartbeat( response.d.heartbeat );
        break;

      case 1:
        if ( response.t !== 'TRACK_UPDATE' && response.t !== 'TRACK_UPDATE_REQUEST' 
             && response.t !== 'QUEUE_UPDATE' && response.t !== 'NOTIFICATION' 
           ) 
           { break; }
        console.log( response.d ); // Do something with the data


        document.querySelector(".listeners-text").innerHTML = `Listening Now: <span style="color: orangered;">${ response.d.listeners }</span>`;

        /* First Song Data */
        document.querySelector( "#song-title" ).innerHTML = response.d.song.title;
        document.querySelector( "#artist" ).innerHTML = `- ${ response.d.song.artists[0].name }`;
        if( response.d.song.albums.length > 0 && response.d.song.albums[0].image != null )
        {
          document.querySelector( "#song-img" ).src = `https://cdn.listen.moe/covers/${ response.d.song.albums[0].image }`;
        }
        else
        {
          document.querySelector( "#song-img" ).src = "https://listen.moe/_nuxt/img/cd1c044.png";
          document.querySelector( "#song-img" ).alt = "This song does not have cover art available.";
        }


        /* Second Song Data */
        document.querySelector( "#prev-song-title-01" ).innerHTML = response.d.lastPlayed[0].title;
        if( response.d.lastPlayed[0].artists.length > 1 )
        {
          document.querySelector( "#prev-artist-01" ).innerHTML = `- ${ response.d.lastPlayed[0].artists[0].name } and ${ response.d.lastPlayed[0].artists[1].name }`;
        }
        else
        {
          document.querySelector( "#prev-artist-01" ).innerHTML = `- ${ response.d.lastPlayed[0].artists[0].name }`;
        }
        
        if( response.d.lastPlayed[0].albums.length > 0 && response.d.lastPlayed[0].albums[0].image != null )
        {
          document.querySelector( "#prev-song-img-01" ).src = `https://cdn.listen.moe/covers/${ response.d.lastPlayed[0].albums[0].image }`;
        }
        else
        {
          document.querySelector( "#prev-song-img-01" ).src = "https://listen.moe/_nuxt/img/cd1c044.png";
          document.querySelector( "#prev-song-img-01" ).alt = "This song does not have cover art available.";
        }


        /* Third Song Data */
        document.querySelector( "#prev-song-title-02" ).innerHTML = response.d.lastPlayed[1].title;
        if( response.d.lastPlayed[1].artists.length > 1 )
        {
          document.querySelector( "#prev-artist-02" ).innerHTML = `- ${ response.d.lastPlayed[1].artists[0].name } and ${ response.d.lastPlayed[1].artists[1].name }`;
        }
        else
        {
          document.querySelector( "#prev-artist-02" ).innerHTML = `- ${ response.d.lastPlayed[1].artists[0].name }`;
        }

        if( response.d.lastPlayed[1].albums.length > 0 && response.d.lastPlayed[1].albums[0].image != null )
        {
          document.querySelector( "#prev-song-img-02" ).src = `https://cdn.listen.moe/covers/${ response.d.lastPlayed[1].albums[0].image }`;
        }
        else
        {
          document.querySelector( "#prev-song-img-02" ).src = "https://listen.moe/_nuxt/img/cd1c044.png";
          document.querySelector( "#prev-song-img-02" ).alt = "This song does not have cover art available.";
        }

        break;
        
      default:
        break;

    }

  };


  wss.onclose = error => {

    clearInterval( heartbeatInterval );
    heartbeatInterval = null;

    if( wss )
    {
      wss.close();
      wss = null;
    }

    setTimeout( () => connect(), 5000 );

  };

}


connect();