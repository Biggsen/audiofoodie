var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ArtistAlbum Model
 * ==================
 */

var ArtistAlbum = new keystone.List('ArtistAlbum', {
	autokey: { from: 'name', path: 'key', unique: true },
    map: { name: 'name' },
    track: { createdAt: true, updatedAt: true }
});

ArtistAlbum.add({
	name: { type: String, required: true },
    year: { type: Types.Date, format: 'YYYY', default: ''},
    image: { type: Types.CloudinaryImage },
    status: { type: Types.Relationship, ref: 'Status', many: true },
    artist: { type: Types.Relationship, ref: 'Artist', many: true },
    newArtist: { type: Types.Boolean, label: 'Is this a new artist?' },
    user: { type: Types.Relationship, ref: 'User', many: true },
    filter1Date: { type: Types.Date, default: '' },
    storage1Date: { type: Types.Date, default: '' },
    filter2Date: { type: Types.Date, default: '' },
    storage2Date: { type: Types.Date, default: '' },
    filter3Date: { type: Types.Date, default: '' },
    storage3Date: { type: Types.Date, default: '' },
    filter4Date: { type: Types.Date, default: '' },
    storage4Date: { type: Types.Date, default: '' },
    filter5Date: { type: Types.Date, default: '' },
    movement: { type: Types.Boolean, label: 'Flag movement' },
    movementDate: { type: Types.Date, default: '' },
    rymUrl: { type: String, default: '' },
	lastfmUrl: { type: String, default: '' },
});

ArtistAlbum.relationship({ ref: 'Artist', path: 'artists', refPath: 'album' });
ArtistAlbum.defaultColumns = 'name, year, status, -createdAt, movementDate';
ArtistAlbum.defaultSort = '-createdAt';
ArtistAlbum.register();
