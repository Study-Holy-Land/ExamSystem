require.config({
	baseUrl: "./dist",
	paths: {
		'skrollr' : "skrollr.min"
	},
	waitSeconds: 200
});

require(['skrollr'], function(skrollr){
	var s = skrollr.init({
		edgeStrategy: 'set',
		skrollrBody: 'skrollr-body',
		mobileDeceleration: 0.001,
		smoothScrolling: true,
		smoothScrollingDuration: 15,
		easing: {
			WTF: Math.random,
			inverted: function(p) {
				return 1-p;
			}
		}
	});
});