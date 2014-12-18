//						ITEM INSTANCE CODE
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
// ///////// undefined 	: not assigned, currently for sale	
// ///////// 0 			: currently on the shelf, already sold, waiting for paperwork 
// ///////// 1			: currently attached to a backorder waiting to be processed
// ///////// 2			: sold/shipped/unavailable
// ///////// 3			: special, not currently used, but essetially this exists
// /////////			  for reserving items, removing items from a backorder but
// /////////			  needing to keep it from being attached to another backorder,
// /////////			  or basically any time it is not sold but not currently open
// /////////			  for regular sale
// /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////
var BackorderList = Parse.View.extend ({

	events: {

	},

	template: _.template($('.backorder-list-view').text()),
	backorderItemTemplate: _.template($('.backorder-list-item').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('BackorderList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());
		this.getBackorderItems();
	},

	getBackorderItems: function() {
		var that = this;
		$('.backorder-list-item-bound').html('');

		var query = new Parse.Query('backOrder');
		query.include('itemType');
		query.include('order');
		query.each(function(item){
			$('.backorder-list-item-bound').append(that.backorderItemTemplate({ backorder: item.attributes, itemType: item.attributes.itemType.attributes, order: item.attributes.order }))
		})
	},


});

// this is formost a list of items that have been invoiced/sold but were not in stock at the time of the sale
// essentially, it is a list of item types (not instances) that have been bought, so there needs to be knowledge
// of the particular order/invoice, the particular form-3, and it should check the items in inventory for an item
// instance that matches the item type. this should also happen in the scanning process, but it will be reduntantly
// done in this view.

// if a match of item instance is found, it should automatically be associated to the relevant backorder via pointer
// as to keep it from being sold, it should complete the associated form-3, and it should notify the shop/update the page.

// the page should be a searchable list of all backorders, that is by default color coded and ordered as the filled backorders
// first, and the unfilled backorders by oldest (smallest, in javascript) date second.

// the list by default should have a color code to show filled status, it should have a date, the name of the item, the name of the 
// customer, and either expand or have a modal to display the form-3/invoice/shipment of partial invoice/or any other relevant
// information we have. 

// non priorities, but should be built for the possibility later, are:

// 	to be able to remove an item from a backorder so that it can attached to another order at the shop's 
// 	discretion. this is a nice to have fringe case. 

// 	a feild for the expected delivery date

// 	the ability to place an order for the item(s), but seriously this is barely on the radar, i just want it 
// 	in the comments to note it as something to look into after this is complete



