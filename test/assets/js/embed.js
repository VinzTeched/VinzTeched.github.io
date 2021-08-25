/* PLEASE DO NOT COPY AND PASTE THIS CODE. */
const BotEmbedder = function () {
	let args = window[window['MtnBotObject']],
		el = null,
		host = (typeof args.host != "undefined")? args.host: "https://mtnng-prod.voiceweb.eu/bm/",
		defaultLocale = 'el',
		appsrc = 'api/bot/webcontainer',
		containerStyles = [host + 'embed/embed.css?dt=' + Date.now()],
		o = false,
		appendCss = function() {
			containerStyles.forEach(function(url) {
				let link =  document.createElement('link');
				link.href = url;
				link.rel = 'stylesheet';  
				link.type = 'text/css'; 
				document.head.appendChild(link);
			});
		},
		appendContainer = function() {
			el = document.createElement('div');
			el.id = 'mtnbot-container';
			try {
			  document.body.appendChild(el);
			}
			catch(err) {
			  console.error(err);
			  el = null;
			}
		},
		appendApp =  function() {
			if (!el || el.innerHTML)
				return false;
			
			appsrc += '?ch='+ args.ch + '&hl=' + getLocale();
			if (args.sdn)
				appsrc += '&dn=' + args.dn;
			if (args.trigger_icon)
				appsrc += '&trigger_icon=' + args.trigger_icon;
			
			fetch(host + appsrc).then((res) => {
				setTimeout(function() {
					el.classList.add('show');
					el.querySelector('.open-chatbox').classList.add('show');
					setTimeout(function() {
						el.classList.add('show_balloon');
					}, 1500);
				}, 1000);
				return res.text();
			}).then((container) => {
				el.innerHTML = container;
				initEvents();
			});
		},
		configureSize = function() {
			if (!el)
				return false;
			
			let w = window.innerWidth,
				h = window.innerHeight,
				ew = el.querySelector('.mtnbot-modal').offsetWidth,
				eh = el.querySelector('.mtnbot-modal').offsetHeight;
		},
		getLocale = function() {
			let locale = localStorage.getItem('mtnbotlocale');
			if (!locale && navigator.language) {
				let parts = navigator.language.split('-');
				if (parts.length > 1) {
					locale = parts[0];
				}
			}
			return locale || defaultLocale;
		},
		initEvents = function() {
			if (!el)
				return false;
			
			o = el.querySelector('.mtnbot-modal').style.display == 'block' ? 1 : 0;
			el.querySelector('button').addEventListener('click', function(e) {
				if (!o) {
					el.querySelector('.mtnbot-modal').style.display = 'block';
					setTimeout(configureSize, 250);
					el.classList.add('opened');
				}
				else {
					el.querySelector('.mtnbot-modal').style.display = 'none';
					el.classList.remove('opened');
				}
				o = !o
			}, false);
			el.querySelector('.open-chatbox').addEventListener('click', function(e) {
				if (!o) {
					el.querySelector('.mtnbot-modal').style.display = 'block';
					setTimeout(configureSize, 250);
					el.classList.add('opened');
				}
				else {
					el.querySelector('.mtnbot-modal').style.display = 'none';
					el.classList.remove('opened');
				}
				o = !o
			}, false);
			document.querySelector('.mtnbot-close-modal').addEventListener('click', function(e) {
			    el.querySelector('.mtnbot-modal').style.display = 'none';
				el.classList.remove('opened');
				o = false;
			});
			window.addEventListener('click', function(e){   
				if (!el.contains(e.target)) {
					el.querySelector('.mtnbot-modal').style.display = 'none';
					el.classList.remove('opened');
					o = !o
				}
			});
			window.addEventListener('resize', configureSize);
			configureSize();
		};

	return {
		init: function() {
			if (typeof args !== 'object' || (args.ch && ['web','mtnapp'].indexOf(args.ch) < 0))
				return false;
			
			appendContainer();
			if (el) {
				appendCss(),
				appendApp();
			}
		}
	}
}();
BotEmbedder.init();