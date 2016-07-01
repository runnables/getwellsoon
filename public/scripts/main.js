/* global $ console */

$(document).ready(function(){

  var container, stats;
  var camera, scene, renderer;
  var raycaster;
  var composer;
  var mouse;
  var PI2 = Math.PI * 2;
  var programFill = function(context) {
    context.beginPath();
    context.arc( 0, 0, 0.5, 0, PI2, true);
    context.fill();
  };
  var programStroke = function(context) {
    context.lineWidth = 0.025;
    context.beginPath();
    context.arc(0, 0, 0.5, 0, PI2, true);
    context.stroke();
  };
  var INTERSECTED;
  function init() {
    // container = document.createElement( 'div' );
    // document.body.appendChild( container );
    var container = document.getElementById('threejs');
    console.log(container);

    // var info = document.createElement( 'div' );
    // info.style.position = 'absolute';
    // info.style.top = '10px';
    // info.style.width = '100%';
    // info.style.textAlign = 'center';
    // info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> canvas - interactive particles';
    // container.appendChild( info );
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 300, 500 );
    scene = new THREE.Scene();

    //scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    var textureLoader = new THREE.TextureLoader();


    $.ajax({
      url: 'http://api.randomuser.me/?inc=name,picture&results=100',
      dataType: 'json',
      success: function(data){
        console.log(data);
        for(var i in data.results){
          var map = textureLoader.load( data.results[i].picture.thumbnail );
          //0xFF006C
          var particle = new THREE.Sprite(  new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } ) );
          particle.position.x = Math.random() * 800 - 400;
          particle.position.y = Math.random() * 800 - 400;
          particle.position.z = Math.random() * 800 - 400;
          particle.scale.x = particle.scale.y = Math.random() * 40 + 40;
          scene.add( particle );
        }
      }
    });

    //
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    //renderer = new THREE.CanvasRenderer();
    
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    stats = new Stats();

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );
    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 4;
    composer.addPass( effect );
    var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    effect.uniforms[ 'amount' ].value = 0.0015;
    effect.renderToScreen = true;
    composer.addPass( effect );

    //container.appendChild( stats.dom );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }
  //
  function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
  }
  var radius = 600;
  var theta = 0;
  function render() {
    // rotate camera
    theta += 0.1;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    camera.lookAt( scene.position );
    camera.updateMatrixWorld();
    // find intersections
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) INTERSECTED.material.program = programStroke;
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.material.program = programFill;
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.program = programStroke;
      INTERSECTED = null;
    }
    //renderer.render( scene, camera );
    composer.render();
  }

  

   // req.checkBody('image', 'Invalid Image').optional().isBase64();
   //  req.checkBody('title', 'Title us required').notEmpty();
   //  req.checkBody('detail', 'detail is required').notEmpty();
   //  req.checkBody('affiliation', 'affiliation is required').optional();

   /**
    * Callbacks
    */ 

  var fbLoggedIn = false;
  var fbAccessToken;

  var getWellSoonService = {
    authenticateUser: function(params, callback){
      $.post('/users/login', {
        'token': params.token
      }, function(data){
        getWellSoonService.token = data.token;
        callback(data);
      }, 'json');
    }, sendMessage: function(params, callback){
      if(getWellSoonService.token !== undefined){
        params.accessToken = getWellSoonService.token;
      }
      $.post('/messages', params, function(data){
        callback(data);
      }, 'json');
    }
  }; 

  $('.btn-post').click(function(){
    getWellSoonService.sendMessage(
      {
        'title': 'hello',
        'detail': 'world',
        'affiliation': 'hey'
      }, function(data){
        $('.lightbox-participate').css('display', 'none');
      });
   });

   $('.btn-participate').click(function(){
    var loginAndAuthenticate = function (){
      FB.login(function(response) {
        console.log(response);
        if (response.status === 'connected') {
          fbLoggedIn = true;
          fbAccessToken = response.authResponse.accessToken;
          getWellSoonService.authenticateUser({token: fbAccessToken}, function(data){
            console.log('logged in ');
            console.log(data);

            $('.lightbox-participate').css('display', 'table');
          });
          
        } else if (response.status === 'not_authorized') {
          fbLoggedIn = false;
          fbAccessToken = undefined;
        } else {
          fbLoggedIn = false;
          fbAccessToken = undefined;
        }
      },{scope: 'public_profile,email'});
    };

    if(fbLoggedIn){
      FB.logout(function(response) {
        fbLoggedIn = false;
        fbAccessToken = undefined;
        loginAndAuthenticate();
      });
    }else {
      loginAndAuthenticate();
    }

    // if(fbLoggedIn){
    //   console.log({token: fbAccessToken});
    //   getWellSoonService.authenticateUser({token: fbAccessToken}, function(data){
    //     console.log('logged in ');
    //     console.log(data);
    //   });
    //   $('.lightbox-participate').css('display', 'block');
    // }else {
    //   FB.login(function(response) {
    //     if (response.status === 'connected') {
    //       fbLoggedIn = true;
    //       fbAccessToken = response.authResponse.accessToken;
    //       $('.lightbox-participate').css('display', 'block');
    //     } else if (response.status === 'not_authorized') {
    //       fbLoggedIn = false;
    //       fbAccessToken = undefined;
    //     } else {
    //       fbLoggedIn = false;
    //       fbAccessToken = undefined;
    //     }
    //   },{scope: 'public_profile,email'});
    // }

   });

  function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    console.log(response);
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      fbLoggedIn = true;
      fbAccessToken = response.authResponse.accessToken;
      //testAPI();
      //$('.lightbox-participate').css('display', 'block');

    } else if (response.status === 'not_authorized') {
      fbLoggedIn = false;
      fbAccessToken = undefined;
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 'Please log ' +
      //'into this app.';
    } else {
      fbLoggedIn = false;
      fbAccessToken = undefined;
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 'Please log ' +
      //'into Facebook.';
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '290151501335387',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.5' // use graph api version 2.5
    });

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }


  // Initialization Code
  init();
  animate();
  
});
