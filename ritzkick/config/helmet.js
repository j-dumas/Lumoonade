module.exports = {
	contentSecurityPolicy: false, // set in next.config
	crossOriginOpenerPolicy: {
		policy: 'same-origin'
	},
	crossOriginResourcePolicy: {
		policy: 'same-site'
	},
	expectCt: {
		maxAge: 63072000,
		enforce: true
	},
	referrerPolicy: {
		policy: 'strict-origin'
	},
	hsts: {
		maxAge: 63072000,
		preload: true
	},
	dnsPrefetchControl: false,
	frameguard: {
		action: 'deny'
	}
}

// https://www.npmjs.com/package/helmet
