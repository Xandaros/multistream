var config = {
	content: [{
		type: 'row',
		content: [
			{
				type:'component',
				componentName: 'stream',
				title: 'stream: summit1g (twitch)',
				componentState: { channel: 'summit1g', service: 'twitch' }
			},
			{
				type:'component',
				componentName: 'chat',
				title: 'chat: summit1g (twitch)',
				componentState: { channel: 'summit1g', service: 'twitch' }
			},
			{
				type:'component',
				componentName: 'stream',
				title: 'stream: monstercat (mixer)',
				componentState: { channel: 'monstercat', service: 'mixer' }
			},
			{
				type:'component',
				componentName: 'chat',
				title: 'chat: monstercat (mixer)',
				componentState: { channel: 'monstercat', service: 'mixer' }
			}
		]
	}]
};
if(localStorage.multistream_layout) {
	config = JSON.parse(localStorage.multistream_layout);
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
    default:
      console.log('Invalid service');
  }
});
streamLayout.registerComponent( 'chat', function( container, state ){
  switch(state.service) {
    case 'youtube':
      container.getElement().append($('<iframe allowfullscreen src="//gaming.youtube.com/live_chat?v='+state.channel+'&embed_domain='+window.location.host+'" frameborder="0" scrolling="no"></iframe>'));
      break;
    case 'twitch':
      container.getElement().append($('<iframe src="//www.twitch.tv/'+state.channel.toLowerCase()+'/chat?darkpopout" frameborder="0" scrolling="no"></iframe>'));
      break;
    case 'mixer':
      container.getElement().append($('<iframe src="//mixer.com/embed/chat/'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
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

streamLayout.on( 'stateChanged', function(){
	var state = JSON.stringify( streamLayout.toConfig() );
	localStorage.setItem( 'multistream_layout', state );
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
				{title: 'Mixer', cmd: 'ms' }
			] },
			{title: 'Add chat...', children: [
				{title: 'YouTube', cmd: 'yc' },
				{title: 'Twitch', cmd: 'tc' },
				{title: 'Mixer', cmd: 'mc' }
			] },
			{title: 'Add stream+chat...', children: [
				{title: 'YouTube', cmd: 'ys+c' },
				{title: 'Twitch', cmd: 'ts+c' },
				{title: 'Mixer', cmd: 'ms+c' }
			] }
		],
		// Handle menu selection to implement a fake-clipboard
		select: function(event, ui) {
			var $target = ui.target;
			for(var i=0;i<ui.cmd.length;++i) {
				var cmd = ui.cmd[i];
				if(cmd == 'y') {
					var service = 'youtube';
					var channel = prompt('Youtube stream ID');
				}
				else if(cmd == 't') {
					var service = 'twitch';
					var channel = prompt('Channel to add');
				}
				else if(cmd == 'm') {
					var service = 'mixer';
					var channel = prompt('Channel to add');
				}
				if(channel === undefined || channel === null || channel === '') {
					return;
				}
				if(cmd == 's') {
					addTab({
						type:'component',
						componentName: 'stream',
						title: 'stream: '+channel+' ('+service+')',
						componentState: { channel: channel, service: service }
					});
				}
				else if(cmd == 'c') {
					addTab({
						type:'component',
						componentName: 'chat',
						title: 'chat: '+channel+' ('+service+')',
						componentState: { channel: channel, service: service }
					});
				}
			}
		}
	});
