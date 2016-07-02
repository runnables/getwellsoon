/* global $ console */

$(document).ready(function(){

  var container, stats,
      camera, scene, renderer, raycaster,
      composer, mouse, shouldRender = true;
      PI2 = Math.PI * 2;

  var $grid = $('.grid');
  $('.grid').masonry({
    itemSelector: '.grid-item'
  });

  var fbLoggedIn = false;
  var fbAccessToken, inputBase64;
  var loadingSpinner = 'loading...';


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

    var container = document.getElementById('threejs');

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 300, 500 );
    scene = new THREE.Scene();

    var textureLoader = new THREE.TextureLoader();

    const thumbnails = JSON.parse($('#thumbnails').val());
    console.log('thumbnails', thumbnails);

    for (var i = 0; i < thumbnails.length; i++) {
      var map = textureLoader.load(thumbnails[i]);
      var particle = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
      particle.position.x = Math.random() * 800 - 400;
      particle.position.y = Math.random() * 800 - 400;
      particle.position.z = Math.random() * 800 - 400;
      particle.scale.x = particle.scale.y = Math.random() * 40 + 40;
      scene.add(particle);
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
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

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300 && !$('#lock').val() && $('#next').val()) {
        $('#lock').val('true');
        getWellSoonService.getMessages($('#next').val(), function(data) {
          $('#lock').val('');
          $('#next').val(data.next);
          for (var i = 0; i < data.messages.length; i++) {
            var message = data.messages[i];
            addMessageCard(message);
          }

          setTimeout(function() { updateGridLayout(); }, 100);
        });
      }

      shouldRender = $(window).scrollTop() < $(window).height();

    });
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
    if(shouldRender){
      render();
    }
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
    composer.render();
  }

  function getImage(file, callback) {
    file.reader = new FileReader();
    file.reader.readAsDataURL(file);
    file.reader.onload = function(encode) {

      $('#display-image').attr('src', encode.target.result).load(function() {
        file.img = new Image();
        file.img.src = encode.target.result;
        file.canvas = document.createElement('canvas');
        file.canvas.width = this.width;
        file.canvas.height = this.height;

        if (file.canvas.width > 1280) {
          file.canvas.width = 1280;
          file.canvas.height = file.img.height / (file.img.width / 1280);
        } else if (file.canvas.height > 1280) {
          file.canvas.width = file.img.width / (file.img.height / 1280);
          file.canvas.height = 1280;
        }


        file.context = file.canvas.getContext('2d');
        file.context.drawImage(file.img, 0, 0, file.canvas.width, file.canvas.height);
        file.imageType = file.type.split('/')[file.type.split('/').length];

        callback(file.canvas.toDataURL('image/' + file.imageType));
      });
    };
  }

  /**
   * jQuery Inits
   */

  var getWellSoonService = {
    authenticateUser: function(params, callback) {
      $.post('/users/login', {
        'token': params.token
      }, function(data){
        getWellSoonService.token = data.token;
        callback(data);
      }, 'json');
    },
    sendMessage: function(params, callback) {
      if(getWellSoonService.token !== undefined){
        params.accessToken = getWellSoonService.token;
      }
      $.post('/messages', params, function(data){
        callback(data);
      }, 'json');
    },
    getMessages: function(lastId, callback) {
      $.get('/messages?lastId=' + lastId, callback);
    }
  };

  /**
   * Private Functions
   */
  function showLightbox() {
    $('.btn-participate').addClass('hidden');
    $('.lightbox-participate').css('display', 'table');
    $('body').css('position', 'fixed');
    $('body').css('top', '0px');
    $('body').css('left', '0px');
    $('body').css('bottom', '0px');
    $('body').css('right', '0px');
  }

  function hideLightbox() {
    $('.btn-participate').removeClass('hidden');
    $('.lightbox-participate').css('display', 'none');
    $('body').removeAttr('style');
  }

  function addMessageCard(message, opts){
    opts = opts || {};

    var $elem = $('<div>').loadTemplate($("#template"), {
      cardClass: 'card type' + (Math.floor(Math.random() * 3) + 1),
      imageClass: message.imagePath ? 'block' : 'none',
      imageSrc: message.imagePath,
      detail: message.detail,
      name: ((message.user || {}).name || '').split(' ')[0],
      affiliation: message.affiliation,
      profileImage: (message.user || {}).profileImage
    }).children();

    if(opts.prepend){
      $('.grid').prepend($elem)
        .masonry('prepended', $elem);
    }else{
      $('.grid').append($elem)
        .masonry('appended', $elem);
    }
  }

 /**
  * Callbacks
  */
  $('.btn-participate').click(function(){
    if ($('.btn-participate').hasClass('disabled')) { return false; }
    $('.btn-participate').addClass('disabled');

    var authenticateUser = function (){
      var text = $('.btn-participate').html();
      $('.btn-participate').html(loadingSpinner);
      getWellSoonService.authenticateUser({ token: fbAccessToken }, function(data){
        showLightbox();
        $('.btn-participate').removeClass('disabled');
        $('.btn-participate').html(text);
        $('.input-name').val(data.user.name.split(' ')[0]);
      });
    };

    if(fbLoggedIn) {
      authenticateUser();
    } else {
      var text = $('.btn-participate').html();
      $('.btn-participate').html(loadingSpinner);
      FB.login(function(response) {
        $('.btn-participate').html(text);
        $('.btn-participate').removeClass('disabled');

        if (response.status === 'connected') {
          fbLoggedIn = true;
          fbAccessToken = response.authResponse.accessToken;
          authenticateUser();
        } else if (response.status === 'not_authorized') {
          fbLoggedIn = false;
          fbAccessToken = undefined;
        } else {
          fbLoggedIn = false;
          fbAccessToken = undefined;
        }
      }, { scope: 'public_profile' });
    }
  });

  $('.btn-image').click(function() {
    $('.input-file').click();
  });

  $('.input-name').focusin(function() {
    $.smoothScroll({ scrollElement: $('.lightbox'), scrollTarget: '#label-name' });
  });
  $('.input-affiliation').focusin(function() {
    $.smoothScroll({ scrollElement: $('.lightbox'), scrollTarget: '#label-affiliation' });
  });
  $('.input-message').focusin(function() {
    $.smoothScroll({ scrollElement: $('.lightbox'), scrollTarget: '#label-message' });
  });

  $('.input-file').on('change', function(){
    if ($('.btn-image').hasClass('disabled')) { return false; }
    $('.btn-image').addClass('disabled');
    var selectedFile = this.files[0];
    var text = $('.btn-image').html();
    $('.btn-image').html(loadingSpinner);
    getImage(selectedFile, function(base64){
      $('.btn-image').html(text);
      $('.btn-image').removeClass('disabled');
      inputBase64 = base64;
    });
  });

  $('.btn-post').click(function(){
    var nameExists = $('.input-name').val();
    if (!nameExists) {
      $('.input-name').siblings('label').addClass('required');
    } else {
      $('.input-name').siblings('label').removeClass('required');
    }

    var messageExists = $('.input-message').val();
    if (!messageExists) {
      $('.input-message').siblings('label').addClass('required');
    } else {
      $('.input-message').siblings('label').removeClass('required');
    }

    if (!nameExists || !messageExists) return;
    getWellSoonService.sendMessage(
      {
        'title': $('.input-name').val(),
        'detail': $('.input-message').val(),
        'affiliation': $('.input-affiliation').val(),
        'image': inputBase64
      }, function(message){
        // $('.grid').prepend($('<div>').loadTemplate($("#template"), {
        //   cardClass: 'card type' + (Math.floor(Math.random() * 3) + 1),
        //   imageClass: message.imagePath ? 'block' : 'none',
        //   imageSrc: message.imagePath,
        //   detail: message.detail,
        //   name: ((message.user || {}).name || '').split(' ')[0],
        //   affiliation: message.affiliation,
        //   profileImage: (message.user || {}).profileImage
        // }).children().html());
        // var msnry = new Masonry( '.grid', { itemSelector: '.grid-item' });

        addMessageCard(message, {prepend: true});
        setTimeout(function(){ updateGridLayout(); },  500);

        hideLightbox();
        $.smoothScroll({ scrollTarget: '#cards' });
      });
  });

  $('.btn-close').click(function(){
    hideLightbox();
  });

  function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      fbLoggedIn = true;
      fbAccessToken = response.authResponse.accessToken;
      //$('.lightbox-participate').css('display', 'block');

    } else if (response.status === 'not_authorized') {
      fbLoggedIn = false;
      fbAccessToken = undefined;
      // The person is logged into Facebook, but not your app.
    } else {
      fbLoggedIn = false;
      fbAccessToken = undefined;
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
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

  function updateGridLayout(){
    $('.card-body').each(function(){
      if($(this).html().length < 10){
        $(this).css('font-size', '36px');
      } else if($(this).html().length < 40) {
        $(this).css('font-size', '24px');
      }else {
        $(this).css('font-size', '16px');
      }
    });
    $('.grid').masonry('layout');
  }


  // Initialization Code
    // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  setTimeout(function(){ updateGridLayout(); },  1000);
  init();
  animate();

});
