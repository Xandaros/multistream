var apiKey = 'AIzaSyA5xgXNNC6XUP1deX4vMZTiZuJNtxicAjY'; // Used to fetch YouTube channel names, leave this blank if you don't mind seeing the video ID/don't want to get your own API key

var config = {
  content: [{
    type: 'column',
    content: [
    {
      type: 'row',
      content:[
      {
        type:'component',
        componentName: 'stream',
        title: 'stream: summit1g (twitch)',
        componentState: { channel: 'summit1g', service: 'twitch' }
      },
      {
        type:'component',
        componentName: 'stream',
        title: 'stream: monstercat (mixer)',
        componentState: { channel: 'monstercat', service: 'mixer' }
      }]
    },
    {
      type: 'row',
      content:[
      {
        type:'component',
        componentName: 'chat',
        title: 'chat: summit1g (twitch)',
        componentState: { channel: 'summit1g', service: 'twitch' }
      },
      {
        type:'component',
        componentName: 'chat',
        title: 'chat: monstercat (mixer)',
        componentState: { channel: 'monstercat', service: 'mixer' }
      }]
    }
    ]
  }]
};

if(window.location.hash !== '') {
  config = JSON.parse(b64DecodeUnicode(window.location.hash.substring(1)));
} else if(sessionStorage.multistream_layout) {
  config = JSON.parse(sessionStorage.multistream_layout);
}

var streamLayout = new GoldenLayout( config );

streamLayout.registerComponent( 'stream', function( container, state ){
  switch(state.service) {
  case 'youtube':
    container.getElement().append($('<iframe allowfullscreen src="//gaming.youtube.com/embed/'+state.channel+'?autoplay=1" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'twitch':
    container.getElement().append($('<iframe allowfullscreen src="//player.twitch.tv/?channel='+state.channel.toLowerCase()+'&html5" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'mixer':
    container.getElement().append($('<iframe allowfullscreen src="//mixer.com/embed/player/'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'smashcast':
    container.getElement().append($('<iframe allowfullscreen src="//www.smashcast.tv/embed/'+state.channel.toLowerCase()+'?autoplay=true" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'mobcrush':
    container.getElement().append($('<iframe allowfullscreen src="//www.mobcrush.com/'+state.channel.toLowerCase()+'/embed" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'goodgame':
    container.getElement().append($('<iframe allowfullscreen src="//goodgame.ru/player?'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'custom':
    container.getElement().append($('<iframe src="'+state.channel+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  default:
    console.log('Invalid service');
  }
});
streamLayout.registerComponent( 'chat', function( container, state ){
  switch(state.service) {
  case 'youtube':
    container.getElement().append($('<iframe src="//gaming.youtube.com/live_chat?v='+state.channel+'&embed_domain='+window.location.host+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'twitch':
    container.getElement().append($('<iframe src="//www.twitch.tv/'+state.channel.toLowerCase()+'/chat?darkpopout" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'mixer':
    container.getElement().append($('<iframe src="//mixer.com/embed/chat/'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'smashcast':
    container.getElement().append($('<iframe src="//www.smashcast.tv/embed/chat/'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'mobcrush':
    container.getElement().append($('<iframe src="//www.mobcrush.com/'+state.channel.toLowerCase()+'/chat" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'goodgame':
    container.getElement().append($('<iframe src="//goodgame.ru/chat/'+state.channel.toLowerCase()+'/" frameborder="0" scrolling="no"></iframe>'));
    break;
  case 'custom':
    container.getElement().append($('<iframe src="'+state.channel+'" frameborder="0" scrolling="no"></iframe>'));
    break;
  default:
    console.log('Invalid service');
  }
});

streamLayout.init();

function addTab(newTabConfig) {
  if(streamLayout.root.contentItems.length > 0) streamLayout.root.contentItems[0].addChild(newTabConfig);
  else streamLayout.root.addChild(newTabConfig);
}

function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
  }));
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function saveTheAnimals(hash = true) {
  var state = JSON.stringify( streamLayout.toConfig() );
  sessionStorage.setItem( 'multistream_layout', state );
  if(hash) {
    if(history.pushState) {
      history.pushState(null, null, '#'+b64EncodeUnicode( JSON.stringify( streamLayout.toConfig() ) ));
    }
    else {
      location.hash = b64EncodeUnicode( JSON.stringify( streamLayout.toConfig() ) );
    }
  }
}

streamLayout.on( 'stateChanged', function(){
  saveTheAnimals();
});

$(document).contextmenu({
    delegate: '*',
    autoFocus: true,
    preventContextMenuForPopup: true,
    preventSelect: true,
    taphold: true,
    menu: [
      {title: 'Add stream...', children: [
        {title: 'YouTube', cmd: 'ys' },
        {title: 'Twitch', cmd: 'ts' },
        {title: 'Mixer', cmd: 'ms' },
        {title: 'Smashcast', cmd: 'hs' },
        {title: 'Mobcrush', cmd: 'rs' },
        {title: 'GoodGame', cmd: 'gs' },
        {title: 'Custom iframe', cmd: 'as' }
      ] },
      {title: 'Add chat...', children: [
        {title: 'YouTube', cmd: 'yc' },
        {title: 'Twitch', cmd: 'tc' },
        {title: 'Mixer', cmd: 'mc' },
        {title: 'Smashcast', cmd: 'hc' },
        {title: 'Mobcrush', cmd: 'rc' },
        {title: 'GoodGame', cmd: 'gc' },
        {title: 'Custom iframe', cmd: 'ac' }
      ] },
      {title: 'Add stream+chat...', children: [
        {title: 'YouTube', cmd: 'ysc' },
        {title: 'Twitch', cmd: 'tsc' },
        {title: 'Mixer', cmd: 'msc' },
        {title: 'Smashcast', cmd: 'hsc' },
        {title: 'Mobcrush', cmd: 'rsc' },
        {title: 'GoodGame', cmd: 'gsc' }
      ] },
      {title: 'MultiStream settings', children: [
        {title: 'Tweet layout', cmd: 'u' },
        {title: streamLayout.config.settings.hasHeaders?'Hide headers':'Show headers', cmd: 'l', },
        {title: 'Reset', cmd: 'e' }
      ] }
    ],

    select: function(event, ui) {
      var $target = ui.target;
      var title;
      for(var i=0;i<ui.cmd.length;++i) {
        var cmd = ui.cmd[i];
        if(cmd == 'u') {
          $('<a>').attr('href', 'https://twitter.com/intent/tweet?text=I\'m%20watching%20these%20streams%20via%20%23MultiStream!%20'+window.location.href.replace('#', '%23')).attr('target', '_blank')[0].click();
        }
        else if(cmd == 'l') {
          streamLayout.config.dimensions.headerHeight = 20;
          streamLayout.config.settings.hasHeaders = !streamLayout.config.settings.hasHeaders;
          saveTheAnimals(false);
          history.pushState('', document.title, window.location.pathname);
          window.location.reload();
        }
        else if(cmd == 'e') {
          sessionStorage.removeItem('multistream_layout');
          history.pushState('', document.title, window.location.pathname);
          window.location.reload();
        }
        else if(cmd == 'y') {
          var service = 'youtube';
          var channel = prompt('Youtube stream ID');
          if(apiKey !== '') {
            $.ajax({
              url: 'https://www.googleapis.com/youtube/v3/videos?id='+channel+'&key='+apiKey+'&part=snippet',
              dataType: 'json',
              async: false,
              success: function(data) {
                if(data.pageInfo.totalResults === 1) {
                  title = data['items'][0]['snippet']['channelTitle'];
                }
              }
            });
          }
        }
        else if(cmd == 't') {
          var service = 'twitch';
          var channel = prompt('Channel to add');
        }
        else if(cmd == 'm') {
          var service = 'mixer';
          var channel = prompt('Channel to add');
        }
        else if(cmd == 'h') {
          var service = 'smashcast';
          var channel = prompt('Channel to add');
        }
        else if(cmd == 'r') {
          var service = 'mobcrush';
          var channel = prompt('Channel to add');
        }
        else if(cmd == 'g') {
          var service = 'goodgame';
          var channel = prompt('Channel ID');
        }
        else if(cmd == 'a') {
          var service = 'custom';
          var channel = prompt('URL to embed');
        }
        if(channel === undefined || channel === null || channel === '') {
          return;
        }
        if(!title) {
          title = channel;
        }
        if(cmd == 's') {
          addTab({
            type:'component',
            componentName: 'stream',
            title: 'stream: '+title+' ('+service+')',
            componentState: { channel: channel, service: service }
          });
        }
        else if(cmd == 'c') {
          addTab({
            type:'component',
            componentName: 'chat',
            title: 'chat: '+title+' ('+service+')',
            componentState: { channel: channel, service: service }
          });
        }
      }
    }
  });
