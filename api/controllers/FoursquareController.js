/**
 * FoursquareController
 *
 * @description :: Server-side logic for getting venues
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var clientId = 'VXVMR5JYO2LMVP3CG2FKT4A34FSN5BQUGIMXXXBCXCXIQ5CX';
var secretId = 'O3UYHAUG05JQZ4VSTSWFJ2ER1A3KL0KHR21ICHR2QEYN3BHJ';
var foursquare = require('node-foursquare-venues')(clientId, secretId);

module.exports = {
  allvenues: function(request, response, next) {
    var offset = request.query.offset;

    foursquare.venues.explore({
      near: 'city,new york',
      limit: 10,
      offset: offset
    }, function(error, data) {
      if (error) {
        return response.badRequest(error);
      }
      response.json(200, data);
    });
  },

  venue: function(request, response, next) {
    var venueId = request.params.venueId;
    foursquare.venues.venue(venueId, function(error, data) {
      if (error) {
        return response.badRequest(error);
      }
      response.json(200, data)
    })
  }
};
