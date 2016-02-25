/**
 * Venue.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    venue_name: {
			type: 'string'
		},
    venue_category: {
			type: 'string'
		},
    venue_hours: {
			type: 'string'
		},
    venue_price: {
			type: 'string'
		},
    venue_adress: {
			type: 'string'
		},
    venue_tips: {
			type: 'string'
		},
  }
};
