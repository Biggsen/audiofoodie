var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Status Model
 * ==================
 */

var Status = new keystone.List('Status', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Status.add({
	name: { type: String, required: true },
    type: { type: Types.Select, options: 'filter, storage' },
    order: { type: Number },
    icon: { type: String},
    heading: { type: String },
    description: { type: String }
});

Status.relationship({ ref: 'ArtistAlbum', path: 'artist-albums', refPath: 'status' });

Status.register();

Status.defaultColumns = 'name,order,type,heading';
