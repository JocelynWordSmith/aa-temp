var PlaceOrder = Parse.View.extend ({

	events: {
		'click .customer-state' : 'getCustomer',
		'click .states-bread' : 'showStates',
		'click .customers-bread' : 'showCustomers',
		'click .merchant' : 'showCustomer',
		'click .accept-merchant' : 'acceptMerchant',
		'click .cancel-merchant' : 'showStates',
		'click .confirm-order-button' : 'swapConfirmView',
		// 'click .remove-item' : 'removeItemOrder'
	},

	template: _.template($('.place-order-view').text()),
	customersTemplate: _.template($('.customer-by-state-view').text()),
	customerTemplate: _.template($('.customer-order-view').text()),

	shoppingCart: {
		customer: {},
		cart: []
	},

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('PlaceOrder')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.showStates();

	},

	showStates: function() {
		$('.select-customer').html('');

		var states = [
			'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
			'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
			'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
			'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
			'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
			'DC'
		];

		$('.order-directions').text('Choose state location of customer');
		states.forEach(function(state){
			$('.select-customer').append('<button class="customer-state btn btn-default">' + state + '</button>');
		})
	},

	getCustomer: function(e) {
		var that = this;
		var state = e.currentTarget.innerHTML;
		this.merchants = [];

		var query = new Parse.Query('customer');
		query.equalTo('State', state)
		query.find({
			success: function(results){
				results.forEach(function(result){
					that.merchants.push(result)
				})
				// console.log(merchants);
				that.showCustomers();
			},
			error: function(error){

			}
		})
	},

	showCustomers: function() {
		var that = this;
		$('.select-customer').html('<div class="crumbs"><span class="states-bread">states</span> > customers</div>');
		$('.order-directions').text('Select the customer to create order');
		this.merchants.forEach(function(merchant,index){
			$('.select-customer').append(that.customersTemplate({merchant: merchant, index: index}));
		});
	},

	showCustomer: function(location) {
		$('.order-directions').text('Please confirm customer selection');
		$('.select-customer').html('<div class="crumbs"><span class="states-bread">states</span> > <span class="customers-bread">customers</span> > '+ location.currentTarget.innerHTML + '</div>');
		var index = location.currentTarget.id;
		this.shoppingCart.customer = this.merchants[index];
		$('.select-customer').append(this.customerTemplate({merchant : this.shoppingCart.customer}));
	},

	acceptMerchant: function() {
		$('.order-directions').text('Please select manufacturer and item types for order');
		this.inventoryList = new OrderInventoryList();
		// console.log(this.shoppingCart)
	},

	swapConfirmView: function() {
		router.swap( new ConfirmOrderView({ customer: this.shoppingCart.customer, items: this.shoppingCart.cart }) );
	},

	// removeItemOrder: function(e) {
	// 	var that = this;
	// 	var tog = false

	// 	this.shoppingCart.cart.forEach(function(item, index, array){
	// 		if(item[0] == e.currentTarget.getAttribute('value')){
	// 			item[1] -= 1;
	// 			if(item[1] <= 0){
	// 				array.splice(that.shoppingCart.cart[index], 1);
	// 				that.shoppingCart.cart = array;
	// 				that.inventoryList.renderCart()
	// 			}else {
	// 				that.inventoryList.renderCart()
					
	// 			}
	// 			// console.log(router.currentView.shoppingCart.cart)
	// 		}
	// 	})		
	// },


});

// this should prompt them to select a customer from the customer list, or make a new customer in a modal. when they select a customer, they
// should be able to change the input (address, billing, phone number, etc) feilds after a button click, but this should not by default
// update the customer model. we can add the option later, but for now it should just be treated as an array of strings we are displaying on the
// page, and lose reference to the model. the reason being if they just need to send it to a new address or something this one time, and also 
// the invoice (object) needs to save this information as text to itself in case the customer is later deleted or updated.

// once a customer has been selected, item types and quantities should be selected. "special" will be an option, but for now it should just be
// treated the same, as it will be worked out later. 

// once item types and quantities are chosen form-3's will be generated and filled out for the existing items, and will be generated for the backorder
// items although be incomplete. these will be displayed on a different page, but made here.


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


var OrderInventoryList = Parse.View.extend ({

	events: {
		'click span.item-type' : 'itemTypeDetail',
		'click .manufacturer' : 'activeManufacturer',
		'click button.order-item' : 'addItemOrder',
	},

	template: _.template($('.order-inventory-list-view').text()),
	listItemTemplate: _.template($('.order-inventory-list-item-view').text()),
	listItemDetailTemplate: _.template($('.order-inventory-list-detail-view').text()),
	shoppingCartTemplate: _.template($('.order-shopping-cart-view').text()),

	initialize: function() {
		$('.app-merchant-bound').html(this.el);
		// console.log('InventoryList')
		this.render();
	},

	render: function() {
		$(this.el).append(this.template());
	},

	itemTypeDetail: function (location) {
		var that = this;
		$('.inventory-list-detail-bound').html('');

		var query = new Parse.Query('itemType');
		query.equalTo('typeName', location.currentTarget.innerHTML);
		query.first({
			success: function(itemType) {
				// console.log(itemType)
				var query = new Parse.Query('itemInstance');
				query.equalTo('itemType', itemType);
				query.equalTo('itemInstanceCode', undefined)
				query.each(function(item){
					// console.log(item.attributes)
					$('.inventory-list-detail-bound').append(that.listItemDetailTemplate({ item: item.attributes }))
				})
				
			},
			error: function(error) {
				console.log(error)
			}
		})



	},

	activeManufacturer: function(e){
		$('.manufacturer').removeClass('active');
		$(event.target).addClass('active');
		$('.center-number').text('');
		$('.center-number').text($(event.target).text());
		$('.inventory-list-item-bound').html('');
		var chosenManufacturer = e.currentTarget.attributes.name.value;
		var that = this;
		// var itemNumber = 0;
		var listManufacturers = [];
		// var thisModel = 0;
		var query = new Parse.Query('itemType');
		query.limit(1000)
		query.equalTo('Manufacturer', chosenManufacturer)
		query.find(function(itemTypes){

			itemTypes.forEach(function(e){
				if (e.attributes.Manufacturer == chosenManufacturer){
					$('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: e}))
				}
			})

		})
	},


	addItemOrder: function(e){
		var that = this;
		var tog = false

		var itemName = e.currentTarget.parentElement.parentElement.children[1].innerHTML;

		router.currentView.shoppingCart.cart.forEach(function(item){
			if(item[0] == e.currentTarget.getAttribute('value')){
				tog = true;
				item[1] += 1;
				// console.log(router.currentView.shoppingCart.cart)
				that.renderCart()
			}
		})
		if(tog == false){
			var cartItem = [ e.currentTarget.getAttribute('value'), 1, itemName];
			router.currentView.shoppingCart.cart.push(cartItem);
			// console.log(router.currentView.shoppingCart.cart)
			that.renderCart()				
		}
			
	},

	renderCart: function(){
		$('.shopping-cart-bound').html('');
		var that = this;

		router.currentView.shoppingCart.cart.forEach(function(item){
			// if(item[3] == undefined){
			// 	var query = new Parse.Query('itemType');
			// 	query.
			// }
			$('.shopping-cart-bound').append(that.shoppingCartTemplate({ item: item}));
			// console.log(item)
		})
		$('.shopping-cart-bound').append('<button role="button" class="btn confirm-order-button" data-toggle="modal">Check Out</button>');

	}


});