//------ IMPORTS ------//
const shortID  = require('shortid'),
			mongo    = require('mongodb'),
			dns			 = require('dns'),
			assert   = require('assert');

const errorMessage = {
	invalidUrl : {
		"error": "invalid URL"
	},
	invalidHost : {
		"error": "invalid Hostname"
	}
}
const shortUrl = shortID.generate();

exports.postURL = (request, response) => {
	// Regex source https://github.com/yagoestevez/cortala/
	const url           = request.body.url;
  const urlRegEx      = /(https?:\/\/)?(www\.)?[\w-@:%._\+~#=]{2,}\.[a-z]{2,6}\b([\w-@:%._\+.~#?&/=]*)/i;
  const noProtocol    = url.replace( /^https?\:\/\//i, "" );
  const domainOnly    = noProtocol.match( /^(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/i );
  const validUrl      = url.match( urlRegEx );
  const validProtocol = url.match( /^https?:\/\// );
	const domain        = url.replace(/(^\w+:|^)\/\//, '');

	// Validate url
  if (validProtocol && validUrl) {
    dns.lookup(domain, (error) => {
    	if (error) {
    		response.json(errorMessage.invalidHost);
    	} else {
  			saveLink(url, response);	
    	}
    });
  } else {
  	response.json(errorMessage.invalidUrl);
  }

  const saveLink = (url, response) => {
		const newUrl = {
			"url": url,
			"shortenUrl": shortUrl
		}

		db.collection('links').insertOne(newUrl, (error, result) => {
			assert.equal(error, null);
			response.json({
				"original_url": url,
				"short_url": shortUrl
			});
		});
	}
};
