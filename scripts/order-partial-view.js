var OrderPartial = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-partial-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderPartial')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is for invoices that have backorders on them. I think all backorders must be paid for even if they dont have them yet, so for now 
// i think that's how it should work, but build it with the understanding that may change. it otherwise works exactly the same as the invoice,
// it just looks different because it needs to display if items are put on the shelf or on backorder.