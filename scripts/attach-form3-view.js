
var AttachForm3 = Parse.View.extend ({

	events: {

	},

	template: _.template($('.attach-form3-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('AttachForm3')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());

	},


});

// this basically just shows the form-3's that are attached to a certain order. they can be edited, but all items should have one if they have
// ordered. im a little fuzzy on exactly what is needed, so for now this page should just show a bunch of form threes.