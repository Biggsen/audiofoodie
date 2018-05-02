var keystone = require('keystone');

/**
 * Status Model
 * ==================
 */

var Status = new keystone.List('Status', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Status.add({
	name: { type: String, required: true },
});

Status.relationship({ ref: 'ArtistAlbum', path: 'artist-albums', refPath: 'status' });

Status.register();
