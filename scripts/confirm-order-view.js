
var ConfirmOrderView = Parse.View.extend ({

	events: {
		'click .update-total' : 'updatePage',
		'click .confirm-list' : 'confirmCart',
	},

	template: _.template($('.confirm-order-view').text()),
	itemInstanceTemplate: _.template($('.confirm-order-item-instance-view').text()),
	itemTotalTemplate: _.template($('.update-order-total-view').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('PlaceOrder')
		this.render();
		// console.log(this.options)
	},

	render: function() {
		// console.log(this.options.customer)
		var customer = {
			Company: (this.options.customer.attributes.Company ? this.options.customer.attributes.Company : ''),
			FirstName: (this.options.customer.attributes.FirstName ? this.options.customer.attributes.FirstName : ''),
			LastName: (this.options.customer.attributes.LastName ? this.options.customer.attributes.LastName : ''),
			Address1: (this.options.customer.attributes.Address1 ? this.options.customer.attributes.Address1 : ''),
			City: (this.options.customer.attributes.City ? this.options.customer.attributes.City : ''),
			State: (this.options.customer.attributes.State ? this.options.customer.attributes.State : ''),
			Zip: (this.options.customer.attributes.Zip ? this.options.customer.attributes.Zip : ''),
			email: (this.options.customer.attributes.email ? this.options.customer.attributes.email : ''),
			Phone: (this.options.customer.attributes.Phone ? this.options.customer.attributes.Phone : ''),
		}
		$(this.el).append(this.template({customer : customer}));
		this.getCart();

	},

	renderCart: function(cart){
		var that = this;
		$('.item-instance-bound').html('');
		// console.log(cart)
		cart.forEach(function(item){
			$('.item-instance-bound').append(that.itemInstanceTemplate({item: item}));
			// console.log(item)
		})
	},

	getCart: function(){
		var that = this;
		this.cart = [];

			var fetch = new Promise (

				function(resolve, reject){
				that.cart = [];
				that.options.items.forEach(function(item, index, array){

					var query = new Parse.Query('itemType');
					query.equalTo('objectId', item[0]);
					query.find({
						success: function(model) {
							model[0].attributes.quan = item[1];
							model[0].attributes.id = model[0].id;

							that.cart.push(model[0].attributes);
							// console.log(model[0].attributes)

						},
						error: function(error) {
							console.log(error);
						}
					}).then(function(){
						// console.log(index + 1 + ' ' + array.length)
						if(index + 1 === array.length){
							resolve(that.cart);
						}
						
					})
				})
			});
		

		fetch.then(function () {
			// console.log(that.cart)
			that.renderCart(that.cart);
			that.showItemSum(that.sumItemCost());
		});

	},

	sumItemCost: function () {
		var total = 0;

		for(i = 0; i < $('.total-item-cost').length; i+=1){
			total += parseInt($('.total-item-cost')[i].innerHTML);
			if(i === $('.total-item-cost').length - 1){
				return total;
			}
		};
	},

	showItemSum: function (sum) {
		$('.cart-total').html(this.itemTotalTemplate({sum: sum}));
	},

	updatePage: function() {
		var newCartTotals = [];

		$('.cart-item-instance').each(function(a,b,c){
			newCartTotals.push([b.getAttribute('id'), b.value])
		})
			this.updateCart(newCartTotals);
		
	},

	updateCart: function(newCart){
		var that = this;

			var fetch = new Promise (

				function(resolve, reject){
				that.cart = [];
				newCart.forEach(function(item, index, array){

					var query = new Parse.Query('itemType');
					query.equalTo('objectId', item[0]);
					query.find({
						success: function(model) {
							model[0].attributes.quan = item[1];
							model[0].attributes.id = model[0].id;

							that.cart.push(model[0].attributes);

						},
						error: function(error) {
							console.log(error);
						}
					}).then(function(){
						// console.log(index + 1 + ' ' + array.length)
						if(index + 1 === array.length){
							resolve(that.cart);
						}
						
					})
				})
			});
		

		fetch.then(function () {
			// console.log(that.cart)
			that.renderCart(that.cart);
			that.showItemSum(that.sumItemCost());
		});

	},

	confirmCart: function() {
		if(confirm('yo dawg are you sure?')){
			$('.item-list-bound').html('');
			$('.item-total-bound').html('');
			new FinalOrder(this.cart);
		}else {
			alert('A wise decision!')
		}

	}

});

var FinalOrder = Parse.View.extend ({

	events: {

	},

	template: _.template($('.final-order-instance-view').text()),

	checkoutCart: [],

	initialize: function() {
		$('.item-list-bound').html(this.el);
		// console.log('OrderStatus')
		this.getCustomer();
		
		this.render();
		this.getItems();
		// console.log(this.order)
	},

	createOrder: function(customer) {
		var that = this;
		// Alternatively, you can use the typical Backbone syntax.
		console.log()
		var Order = Parse.Object.extend('order');
		this.order = new Order();
		this.order.set('customer', customer);
		// this.order.set('backorders', []);
		// this.order.set('items', []);
		this.order.save();

		console.log(this.order);

	},

	getCustomer: function() {
		var that = this;

		var query = new Parse.Query('customer');
		query.equalTo('objectId', router.currentView.options.customer.id);
		query.first({
			success: function(result) {
				that.customer = result;
				that.createOrder(result);
				console.log(result)
			},
			error: function(error){
				console.log(error)
			}
		})

	},

	render: function() {
		// $('nav').toggle();
		$(this.el).append(this.template());

	},

	getItems: function() {
		var that = this;

		router.currentView.cart.forEach(function(item){
			var needed = item.quan;
			


				// console.log(item.Model);
				var query = new Parse.Query('itemInstance');
				query.include('itemType');
				query.equalTo('UPC', item.UPC);
				query.equalTo('itemInstanceCode', 0);
				query.find({
					success: function(results){
						console.log(results);
						results.forEach(function(result){
							if(needed > 0){
								console.log('id ' + result.id);
								result.set('itemInstanceCode', 2);
								result.set('order', that.order)
								result.save();
								needed -= 1;
							}
						})
					},
					error: function(error){
						console.log(error)
					}
				}).then(function(){
					if(needed > 0){
						for (var i = needed; i > 0; i-= 1) {
							that.makeBackorder(item.UPC);
						};
					}
				}).then(function(){
					console.log(that.checkoutCart)
					setTimeout(function(){
						router.navigate('#order/' + that.order.id, {trigger: true, replace: true})
					},500)
				})

		})
	},

	grabInstance: function(item){
		console.log('grabbed an ' + item.attributes.UPC)
		console.log('id ' + item.id);
		item.set('itemInstanceCode', 2);
		item.set('order', this.order)
		item.save();
		this.checkoutCart.push([item, 0]);

	},

	makeBackorder: function(itemType){
		console.log('backorder for ' + itemType);
		var BackOrder = Parse.Object.extend('backOrder');
		var backOrder = new BackOrder();
		backOrder.set('itemType', itemType);
		backOrder.set('order', this.order);
		backOrder.save();
		this.checkoutCart.push([backOrder, 1]);

	}


});
