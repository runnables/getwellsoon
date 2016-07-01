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

    var container = document.getElementById('threejs');

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 300, 500 );
    scene = new THREE.Scene();

    //scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
    var textureLoader = new THREE.TextureLoader();

    const thumbnails = [
      '10157261_10205994824132108_4212659439549719700_n.jpg',
      '10288709_10203281269047576_1778362898838843739_n.jpg',
      '10407633_931361353543313_7146225251119744637_n.jpg',
      '10410961_10205044746452374_3621602907992324053_n.jpg',
      '10646976_4565223786214_8155308977573861559_n.jpg',
      '10670235_10152744944228134_8166125482065470413_n.jpg',
      '10685536_655902421174739_8443066831520915279_n.jpg',
      '10885402_928819413802400_7489004722159124925_n.jpg',
      '10897830_10153021033310908_4921336612047406080_n.jpg',
      '1097961_1204260066256107_2333557639804504507_n.jpg',
      '10994052_1246092035407302_2173275303155588692_n.jpg',
      '11014886_1168175623208182_5383192676652047899_n.jpg',
      '11017129_10155303765035634_1812721858002133212_n.jpg',
      '11036483_874605922624836_4880785034412092230_n.jpg',
      '11150529_10153185884518119_4649761917411835693_n.jpg',
      '11160580_10205490771741604_1684423489328748008_n.jpg',
      '11193305_1094232503925668_3223865037608872000_n.jpg',
      '11222119_10153638822674304_5018912906744305565_n.jpg',
      '11230721_1089310944427583_3856082314425365287_n.jpg',
      '11752427_10153089525392843_8485923981573794050_n.jpg',
      '11896163_1170001299681841_4311675749591974582_n.jpg',
      '12047149_1003222973067911_2676661978874940001_n.jpg',
      '12096461_10207196447143561_2302691132797103924_n.jpg',
      '12191701_1041457969208497_5000841823786844652_n.jpg',
      '12316622_10153730839123187_6157020629208410862_n.jpg',
      '12410561_1138226399534935_4659328159233646329_n.jpg',
      '12472730_10154062261294210_5871729917544818828_n.jpg',
      '12509427_1039060272781468_7823168143902330231_n.jpg',
      '12510409_10153839061963627_8155022733847419856_n.jpg',
      '12565376_10208175056721812_67132055709586446_n.jpg',
      '12573714_10153842252663255_4897322797770760256_n.jpg',
      '12644896_10208660550417013_2531314032671047491_n.jpg',
      '12645114_10156472410680481_775271229686387062_n.jpg',
      '12647147_1168719613153304_1029075962674944220_n.jpg',
      '12670589_10153980436389917_7877546322528101261_n.jpg',
      '12798973_10153252958601876_6109003828876447805_n.jpg',
      '12800353_1164384336925184_2511001335058718204_n.jpg',
      '12920529_10209007987545570_5342536172215708517_n.jpg',
      '12936777_10154107765387360_69471427361933749_n.jpg',
      '12993414_10154151691362612_3400202833072020677_n.jpg',
      '12994517_1102830406406980_5417217782596353032_n.jpg',
      '13001172_1271981196149751_5343224960428081231_n.jpg',
      '13007133_10153619765910292_1771802958355373047_n.jpg',
      '13010731_10206247927054046_4385907112698602252_n.jpg',
      '13103347_10207960753869562_3728856178951863871_n.jpg',
      '13118852_10154173714959549_2657663176082048381_n.jpg',
      '13118985_1245394952150987_3051582223853749451_n.jpg',
      '13166085_1353178231366400_377058563790825498_n.jpg',
      '13178713_1383025815046245_1554970294976370793_n.jpg',
      '13239116_10156908110880015_8736182454931486721_n.jpg',
      '13244705_1111060835582380_4286841563427783259_n.jpg',
      '13244776_990029004384748_8218602984254399398_n.jpg',
      '13265889_1288394147854988_4940183344819987982_n.jpg',
      '13315606_10155040860003782_5613390777196638187_n.jpg',
      '13325656_1140742635976881_981428914052570197_n.jpg',
      '13344505_10207899947189084_3855586604567938739_n.jpg',
      '13428365_10206770795775007_7155589489906070907_n.jpg',
      '13450048_1018989184857072_3834969067548731715_n.jpg',
      '13495335_10208249929418638_3416824843211563969_n.jpg',
      '13537644_10154314558168270_3231605377819893553_n.jpg',
      '1455198_10151749083029352_2123881301_n.jpg',
      '154206_143036735747915_6283669_n.jpg',
      '1798593_1140535265978010_617167626973820428_n.jpg',
      '1909686_10207175318755620_4364432187786019420_n.jpg',
      '1935481_1058391057514574_243389201763747455_n.jpg',
      '1960043_10206261467320454_7535159492177907910_n.jpg',
      '270124_10150330183902905_4938745_n.jpg',
      '28618_1486315319479_7755392_n.jpg',
      '29833_656511341028218_543894157_n.jpg',
      '388171_10151189590516834_2095382778_n.jpg',
      '486562_367643956642191_496415153_n.jpg',
      '527092_548100998546454_1834674830_n.jpg',
      '535446_10151083369487465_1346860431_n.jpg',
      '537987_10151392621386099_1880540471_n.jpg',
      '625604_4322830467369_1597991202_n.jpg',
      '77112_10150128273906632_4453485_n.jpg'
    ];

    for (var i = 0; i < thumbnails.length; i++) {
      var map = textureLoader.load('/thumbnails/' + thumbnails[i]);

      var particle = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
      particle.position.x = Math.random() * 800 - 400;
      particle.position.y = Math.random() * 800 - 400;
      particle.position.z = Math.random() * 800 - 400;
      particle.scale.x = particle.scale.y = Math.random() * 40 + 40;
      scene.add(particle);

      var particle = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
      particle.position.x = Math.random() * 800 - 400;
      particle.position.y = Math.random() * 800 - 400;
      particle.position.z = Math.random() * 800 - 400;
      particle.scale.x = particle.scale.y = Math.random() * 40 + 40;
      scene.add(particle);

      var particle = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
      particle.position.x = Math.random() * 800 - 400;
      particle.position.y = Math.random() * 800 - 400;
      particle.position.z = Math.random() * 800 - 400;
      particle.scale.x = particle.scale.y = Math.random() * 40 + 40;
      scene.add(particle);
    }

    //
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
    //
    window.addEventListener( 'resize', onWindowResize, false );
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300 && !$('#lock').val() && $('#next').val()) {
        $('#lock').val('true');
        getWellSoonService.getMessages($('#next').val(), function(data) {
          $('#lock').val('');
          $('#next').val(data.next);
          for (var i = 0; i < data.messages.length; i++) {
            var message = data.messages[i];
            $('.grid').append($('<div>').loadTemplate($("#template"), {
              //cardClass: 'card type' + (Math.floor(Math.random() * 4) + 1),
              cardClass: 'card type' + (Math.floor(Math.random() * 3) + 1),
              //cardClass: 'card',
              imageClass: message.imagePath ? 'block' : 'none',
              imageSrc: message.imagePath,
              detail: message.detail,
              name: ((message.user || {}).name || '').split(' ')[0],
              affiliation: message.affiliation,
              profileImage: (message.user || {}).profileImage
            }).children().html());
            var msnry = new Masonry( '.grid', { itemSelector: '.grid-item' });
          }
        });
      }
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

  // Utils
  // convertToBase64 = function(inputFile, callback){
  //   var reader = new FileReader();
  //   reader.onload = function(e) {
  //     callback(e.target.result)
  //   };
  //   reader.onerror = function(e) {
  //     callback(null);
  //   };
  //   reader.readAsDataURL(inputFile);
  // };

  function getImage(inputFile, callback) {
    return new Promise(resolve => {
      file.reader = new FileReader();
      file.reader.readAsDataURL(file);
      file.reader.onload = encode => {
        file.img = new Image();
        file.img.src = encode.target.result;
        file.canvas = document.createElement('canvas');
        file.canvas.width = file.img.width;
        file.canvas.height = file.img.height;

        if (file.canvas.width > 1280) {
          file.canvas.width = 1280;
          file.canvas.height = file.img.height / (file.img.width / 1280);
        } else if (file.canvas.height > 1280) {
          file.canvas.width = file.img.width / (file.img.height / 1280);
          file.canvas.height = 1280;
        }

        file.context = file.canvas.getContext('2d');
        file.context.drawImage(file.img, 0, 0, file.canvas.width, file.canvas.height);
        file.imageType = _.last(file.type.split('/'));

        callback(file.canvas.toDataURL(`image/${file.imageType}`));
      };
    });
  }


   // req.checkBody('image', 'Invalid Image').optional().isBase64();
   //  req.checkBody('title', 'Title us required').notEmpty();
   //  req.checkBody('detail', 'detail is required').notEmpty();
   //  req.checkBody('affiliation', 'affiliation is required').optional();

   /**
    * Callbacks
    */

  var fbLoggedIn = false;
  var fbAccessToken, inputBase64;

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

  function showLightbox() {
    $('.lightbox-participate').css('display', 'table');
    $('body').css('position', 'fixed');
    $('body').css('top', '0px');
    $('body').css('left', '0px');
    $('body').css('bottom', '0px');
    $('body').css('right', '0px');
  }

  function hideLightbox() {
    $('.lightbox-participate').css('display', 'none');
    $('body').removeAttr('style');
  }

  $('.btn-participate').click(function(){
    if ($('.btn-participate').hasClass('disabled')) { return false; }
    $('.btn-participate').addClass('disabled');

    var authenticateUser = function (){
      var text = $('.btn-participate').html();
      $('.btn-participate').html('. . .');
      getWellSoonService.authenticateUser({ token: fbAccessToken }, function(data){
        showLightbox();
        $('.btn-participate').removeClass('disabled');
        $('.btn-participate').html(text);
        $('.input-name').val(data.user.name.split(' ')[0]);
      });
    };

    $('.input-file').on('change', function(){
      var selectedFile = this.files[0];
      console.log('inputFile has changed');
      getImage(selectedFile, function(base64){
        console.log(base64);
        inputBase64 = base64;
      });
    });

    if(fbLoggedIn) {
      authenticateUser();
    } else {
      var text = $('.btn-participate').html();
      $('.btn-participate').html('. . .');
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
      }, function(data){
        hideLightbox();
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
    console.log(response);
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

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  $('.card-body').each(function(){
    if($(this).html().length < 10){
      $(this).css('font-size', '36px');
    } else if($(this).html().length < 40) {
      $(this).css('font-size', '24px');
    }else {
      $(this).css('font-size', '16px');
    }

  });

  // Initialization Code
  init();
  animate();

});
