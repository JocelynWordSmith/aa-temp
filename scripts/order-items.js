var OrderItemsView = Parse.View.extend ({

	events: {

	},

	template: _.template($('.order-items-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('PlaceOrder')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());
		this.getItemTypes();

	},

	getItemTypes: function() {
		var query = new Parse.Query('itemType');
		query.find({
			success: function(types){
				types.forEach(function(type){
					console.log(type.attributes.Model)
				})
			},
			error: function(error) {
				console.log(error)
			}
		})
	}




});