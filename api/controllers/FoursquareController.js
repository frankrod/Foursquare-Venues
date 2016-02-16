/**
 * FoursquareController
 *
 * @description :: Server-side logic for getting venues
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var clientId = 'VXVMR5JYO2LMVP3CG2FKT4A34FSN5BQUGIMXXXBCXCXIQ5CX';
var secretId = 'O3UYHAUG05JQZ4VSTSWFJ2ER1A3KL0KHR21ICHR2QEYN3BHJ';
var foursquare = require('node-foursquare-venues')(clientId, secretId);
var excel = require('node-excel-export');

module.exports = {

	allvenues: function(request, response) {
		// You can define styles as json object
		// More info: https://github.com/protobi/js-xlsx#cell-styles
		var styles = {
			headerDark: {
				fill: {
					fgColor: {
						rgb: 'FF000000'
					}
				},
				font: {
					color: {
						rgb: 'FFFFFFFF'
					},
					sz: 14,
					bold: true,
					underline: true
				}
			}
		};

		var specification = {
			venue_name: { // <- the key should match the actual data key
				displayName: 'Name', // <- Here you specify the column header

				headerStyle: styles.headerDark,
				width: '40'
			},
			venue_category: {
				displayName: 'Category',

				headerStyle: styles.headerDark,
				width: '30' // <- width in chars (when the number is passed as string)
			},
			venue_hours: {
				displayName: 'Hours', // <- Cell style [todo: allow function]

				headerStyle: styles.headerDark,
				width: '60'
			},
			venue_price: {
				displayName: 'Price', // <- Cell style [todo: allow function]

				headerStyle: styles.headerDark,
				width: '10'
			},
			venue_adress: {
				displayName: 'Adress', // <- Cell style [todo: allow function]

				headerStyle: styles.headerDark,
				width: '80'
			},
			venue_tips: {
				displayName: 'Tips', // <- Cell style [todo: allow function]

				headerStyle: styles.headerDark,
				width: '160'
			}
		};
		var dataset = [];

		var offset = request.query.offset;

    

		foursquare.venues.explore({
			near: 'city,new york',
			limit: 50,
			offset: offset
		}, function(error, data) {
			if (error) {
				return response.badRequest(error);
			}
			// sails.log(data);

			// response.json(200, data);
			var items = data.response.groups[0].items;

			async.each(items, function(item, callback) {

				foursquare.venues.venue(item.venue.id, function(error, venueData) {
					if (error) {
						return response.badRequest(error);
					}
					var venuesObject = {};
					var hours = [];
					var hoursObj = {};

					if (typeof venueData.response.venue.hours != "undefined") {
						var timeframes = venueData.response.venue.hours.timeframes
						timeframes.forEach(function(timeframe) {
							var daysOpen = timeframe.days;
							var open = timeframe.open[0].renderedTime;
							hoursObj[daysOpen] = open;
							hours.push(hoursObj);
						})
					}
          var hoursToJson = JSON.stringify(hours);

					if (typeof item.venue.price !== 'undefined') {
						venuesObject = {
							venue_name: item.venue.name,
							venue_category: item.venue.categories[0].name,
							venue_hours: hoursToJson,
							venue_price: item.venue.price.message,
							venue_adress: item.venue.location.formattedAddress,
							venue_tips: item.tips[0].text
						};
						dataset.push(venuesObject);
					} else {
						venuesObject = {
							venue_name: item.venue.name,
							venue_category: item.venue.categories[0].name,
							venue_hours: hoursToJson,
							venue_price: '-------',
							venue_adress: item.venue.location.formattedAddress,
							venue_tips: item.tips[0].text
						};
						dataset.push(venuesObject);
					}
					callback();

				})
			}, function(err) {
				var report = excel.buildExport(
					[ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
						{
							name: 'Venues', // <- Specify sheet name (optional)
							specification: specification, // <- Report specification
							data: dataset // <-- Report data
						}
					]
				);
				response.attachment('venues.xlsx');
				response.send(report);
			});

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
