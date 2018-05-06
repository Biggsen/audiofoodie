var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ArtistAlbum Model
 * ==================
 */

var ArtistAlbum = new keystone.List('ArtistAlbum', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ArtistAlbum.add({
	name: { type: String, required: true },
    year: { type: Types.Date, format: 'YYYY'},
    image: { type: Types.CloudinaryImage },
    status: { type: Types.Relationship, ref: 'Status', many: true },
    artist: { type: Types.Relationship, ref: 'Artist', many: true },
    newArtist: { type: Types.Boolean, label: 'Is this a new artist?' },
    curiousDate: { type: Types.Date},
    notInterestedDate: { type: Types.Date},
    interestedDate: { type: Types.Date},
    decentStuffDate: { type: Types.Date},
    greatDate: { type: Types.Date},
    greatNotGrippingDate: { type: Types.Date},
    excellentDate: { type: Types.Date},
    notQuiteWonderfulDate: { type: Types.Date},
    wonderfulDate: { type: Types.Date},
    movement: { type: Types.Boolean, label: 'Flag movement' },
});

ArtistAlbum.relationship({ ref: 'Artist', path: 'artists', refPath: 'album' });

ArtistAlbum.register();
