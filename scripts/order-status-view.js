var OrderStatus = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-status-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderStatus')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is for incomplete orders. it may get dropped, but it depends on when the orders are saved to the server