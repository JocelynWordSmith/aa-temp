var OrderList = Parse.View.extend ({

	events: {
		'click .order-instance'	: 'orderDetail',
	},

	template: _.template($('.order-list-view').text()),
	orderInstanceTemplate: _.template($('.order-list-item-view').text()),
	orderDetailTemplate: _.template($('.order-detail-view').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('OrderList')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getOrders();
	},

	getOrders: function() {
		var that = this;

		$('.order-list-item-bound').html('');
		var query = new Parse.Query('order');
		query.include('customer');
		query.each(function(order){
			$('.order-list-item-bound').append(that.orderInstanceTemplate({ order: order, customer: order.attributes.customer }))
		})
	},

	orderDetail: function(location) {
		var that = this;
		// console.log(location.currentTarget.id)
		$('.order-detail-bound').html('');
		var query = new Parse.Query('order');
		query.include('customer');
		query.equalTo('objectId', location.currentTarget.id);
		query.first(function(order){
			console.log(order)
			var query = new Parse.Query('itemInstance');
			query.include('itemType');
			query.equalTo('order', order);
			query.each(function(item){
				$('.order-detail-bound').append(that.orderDetailTemplate({ item: item, itemType: item.attributes.itemType }))
			})
		})

	}


});

// this is a list of all past orders/invoices. the list should be sortable, and each item should be attached to its items, customer, form-3, and 
// any other relevant data. 

// eventually we should write cloud code that moves shipped items, forms, and orders to a seperate data class so that we dont query through items
// that are already gone. currently they should keep all associations and information.

// I dont think anything on this list should be editable from here, if at all. please discuss with me if you think of a situation where it may be
// needed. this list also includes partial invoices, but as far as the invoice is concerned it is final and has been sent. if they send a new
// invoice when a backorder is filled and shipped and want to do it through here, cool. but currently all this information is static as I understand
// it.