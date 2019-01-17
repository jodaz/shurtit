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
			response.render('404', {title: 'Shurtit! | Page Not Found'});
		}
	});
}