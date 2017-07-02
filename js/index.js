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
    case 'twitch':
      container.getElement().append($('<iframe allowfullscreen src="http://player.twitch.tv/?channel='+state.channel.toLowerCase()+'&html5" frameborder="0" scrolling="no"></iframe>'));
      break;
    case 'mixer':
      container.getElement().append($('<iframe allowfullscreen src="https://mixer.com/embed/player/'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
      break;
    default:
      console.log(service);
  }
});
streamLayout.registerComponent( 'chat', function( container, state ){
  switch(state.service) {
    case 'twitch':
      container.getElement().append($('<iframe src="http://www.twitch.tv/'+state.channel.toLowerCase()+'/chat?popout=" frameborder="0" scrolling="no"></iframe>'));
      break;
    case 'mixer':
      container.getElement().append($('<iframe src="https://mixer.com/embed/chat/'+state.channel.toLowerCase()+'" frameborder="0" scrolling="no"></iframe>'));
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

var layoutChanged = false;
streamLayout.on( 'stateChanged', function(){
	layoutChanged = true;
});
function saveState() {
	if(layoutChanged) {
		var state = JSON.stringify( streamLayout.toConfig() );
		localStorage.setItem( 'multistream_layout', state );
		layoutChanged = false;
	}
}
setInterval(saveState,5000);


$(document).contextmenu({
		delegate: '*',
		autoFocus: true,
		preventContextMenuForPopup: true,
		preventSelect: true,
		taphold: true,
		menu: [
			{title: 'Add stream...', children: [
				{title: 'Twitch', service: 'twitch', cmd: 's' },
				{title: 'Mixer', service: 'mixer', cmd: 's' }
			] },
			{title: 'Add chat...', children: [
				{title: 'Twitch', service: 'twitch', cmd: 'c' },
				{title: 'Mixer', service: 'mixer', cmd: 'c' }
			] },
			{title: 'Add stream+chat...', children: [
				{title: 'Twitch', service: 'twitch', cmd: 's+c' },
				{title: 'Mixer', service: 'mixer', cmd: 's+c' }
			] }
		],
		// Handle menu selection to implement a fake-clipboard
		select: function(event, ui) {
			var channel = prompt('Channel to add');
			if(channel === undefined || channel === '') {
				return
			}
			var $target = ui.target;
			for(var i=0;i<ui.cmd.length;++i) {
				var cmd = ui.cmd[i];
				if(cmd=='s') {
					addTab({
						type:'component',
						componentName: 'stream',
						title: 'stream: '+channel+' ('+ui.service+')',
						componentState: { channel: channel, service: ui.service }
					});
				}
				else if(cmd=='c') {
					addTab({
						type:'component',
						componentName: 'chat',
						title: 'chat: '+channel+' ('+ui.service+')',
						componentState: { channel: channel, service: ui.service }
					});
				}
			}
		}
	});
