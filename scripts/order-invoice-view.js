var OrderInvoice = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-invoice-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('OrderInvoice')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this is where the invoice is shown. it pulls information from the order, and displays everything as text. once it is submitted it can't be
// altered, but it can be voided and resubmitted. but both should still exist.