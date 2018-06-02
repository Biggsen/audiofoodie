var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Artist Model
 * ==========
 */

var Artist = new keystone.List('Artist', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
    track: { createdAt: true, updatedAt: true }
});

Artist.add({
	name: { type: String, required: true },
	album: { type: Types.Relationship, ref: 'ArtistAlbum', hidden: true },
});

Artist.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Artist.relationship({ ref: 'ArtistAlbum', path: 'artist-albums', refPath: 'artist' });

Artist.defaultColumns = 'name';
Artist.register();
