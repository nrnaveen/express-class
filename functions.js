var Async			=	require("async"),
	util			=	require("util"),
	querystring		=	require('querystring'),
	url 			=	require('url'),
	lodash			=	require('lodash'),
	fs				=	require("fs"),
	moment			=	require("moment"),
	path			=	require("path"),
	_				=	require("underscore"),
	crypto			=	require('crypto'),
	Article			=	require("./models/Article"),
	algorithm		=	'aes-256-ctr',
	password		=	'd6F3Efeq';

class LocalFunctions {
	// get Href value of pagination array
	href(req){
		return (prev, params) => {
			var query = lodash.clone(req.query);
			if(typeof query.page === 'undefined'){ query.page = 1; }
			if(typeof prev === 'object'){
				params = prev;
				prev = false;
			}else{
				prev = (typeof prev === 'boolean') ? prev : false;
				query.page = prev ? query.page-= 1 : query.page += 1;
				query.page = (query.page < 1) ? 1 : query.page;
			}
			// allow overriding querystring params
			// (useful for sorting and filtering)
			// another alias for `lodash.assign` is `lodash.extend`
			if(lodash.isObject(params)) query = lodash.assign(query, params);
			return url.parse(req.originalUrl).pathname + '?' + querystring.stringify(query);
		};
	}

	// get pagination array
	getArrayPages(req){
		var _this = this;
		return (limit, pageCount, currentPage) => {
			var maxPage = pageCount, limit = limit || 3; // limit default is 3
			if(limit > 0){
				var end = Math.min(Math.max(currentPage + Math.floor(limit / 2), limit), pageCount),
				start = (currentPage < (limit - 1)) ? 1 : (end - limit) + 1, pages = [];
				if(start <= 0){ start = 1; }
				for(var i = start; i <= end; i++){
					pages.push({
						number: i,
						url: _this.href(req)().replace('page=' + (currentPage + 1), 'page=' + i),
					});
				};
				return pages;
			}
		};
	}

	// Add error to session
	flashError(req, res, err){
		console.log(err);
		req.flash("error", err);
		res.status(err.status || 500);
	}

	isAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/login'); // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
	}

	isNotAuthenticated(req, res, next){
		if(!req.isAuthenticated()){
			return next();
		}
		res.redirect('/'); // IF A USER IS LOGGED IN, THEN REDIRECT THEM SOMEWHERE
	}

	fromNow(createdAt){
		return moment(createdAt).fromNow();
	}

	isArray(arr){
		return util.isArray(arr);
	}

	FirstChar(string){
		if(string == null || string == ''){
			return null;
		}
		return string.charAt(0).toUpperCase();
	}
};

module.exports = new LocalFunctions();