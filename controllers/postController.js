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
    dns.lookup(domainOnly[0], error => {
    	if (error) {
    		response.json(errorMessage.invalidHost);
    	} else {
    		findLink();
  		}
  	})
  } else {
  	response.json(errorMessage.invalidUrl);
  }

  function saveLink(id) {
		let newUrl = {
			"originalUrl": url,
			"shortUrl": id
		}

		db.collection('links').insertOne(newUrl, (error, result) => {
			assert.equal(error, null);
			response.json({
				"original_url": newUrl.originalUrl,
				"short_url": newUrl.shortUrl
			});
		});
	}

	function findLink() {
		let id = shortID.generate();

		db.collection('links').find({"shortUrl": id}, (err, result) => {
			if (result != null) {
				db.collection('links').findOne({"originalUrl": url}, (error, doc) => {
					if (doc != null){
						response.json({
							"original_url": doc.originalUrl,
							"short_url": doc.shortUrl
						});
					} else {
						id = shortID.generate();
						saveLink(id);
				}});
			} else {
				response.json({"error": error});
			}
		});
	}
};