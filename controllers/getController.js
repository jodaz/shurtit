//------ IMPORTS ------//
const mongo    = require('mongodb'),
			assert   = require('assert');

exports.getUrl = (request, response) => {
	const shortUrl = request.params.short;

	db.collection('links').findOne({"shortUrl" : shortUrl}, (error, doc) => {
		assert.equal(null, error);

		if (doc) {
			response.redirect(doc.originalUrl);
		} else {
			response.json({
				"Error": "We cannot find a matching URL"
			});
		}
	});
}