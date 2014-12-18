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

var ShelfList = Parse.View.extend ({

	events: {

	},

	template: _.template($('.shelf-list-view').text()),
	shelfItemTemplate: _.template($('.shelf-list-item').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('ShelfList')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getShelfItems();
	},

	getShelfItems: function () {
		var that = this;
		$('.shelf-item-list-bound').html('');

		var query = new Parse.Query('itemInstance');
		query.equalTo('itemInstanceCode', 0)
		query.each(function(item){
			$('.shelf-item-list-bound').append(that.shelfItemTemplate({ item: item.attributes }))
		})
	}


});

// these are all items that have been sold/invoiced but are still in the store sitting on a shelf waiting for paperwork to be returned/recieved.
// they need to have knowledge of the date they were set as a shelf item, and they need to have a date/reminder for when that paperwork should be
// back. if they go past that date (either 45 days or 90 days for now) they should be marked as urgent (red, at the top of the list, and push 
// 	a notification somewhere). once an item is shipped it should not be marked as a shelf item, but should still have a pointer to its shelf
// 	information object on the server. this needs to be discussed, actually.