var OrderInstanceView = Parse.View.extend ({

	events: {
		'click .print-sales' : 'printSales',
		'click .print-invoice' : 'printInvoice',
	},

	template: _.template($('.final-order-instance-view').text()),
	customerTemplate: _.template($('.customer-info-order-template').text()),
	itemInstanceTemplate: _.template($('.customer-info-order-items-template').text()),
	backorderInstanceTemplate: _.template($('.customer-info-backorder-template').text()),
	totalTemplate: _.template($('.sales-order-template-total').text()),


	initialize: function() {
		$('.app-container').html(this.el);
		// console.log('front page')
		this.render();
		// $('.alan-arms-pos').hide();
	},

	render: function() {
		$(this.el).append(this.template());
		this.getOrder();

	},

	getOrder: function() {
		var that = this;

		var query = new Parse.Query('order');
		query.equalTo('objectId', this.options);
		query.include('customer');
		query.first({
			success: function(order){
				that.order = order;
				that.showCustomer();
			},
			error: function(error){

			}
		}).then(function(){
			that.getItems();
			
		})
	},

	showCustomer: function() {
		var customer = this.order.attributes.customer;
		$('.customer-info').append(this.customerTemplate({customer: customer, order: this.order }));
	},

	getItems: function() {
		var that = this;

		var query = new Parse.Query('itemInstance');
		query.equalTo('order', this.order);
		query.include('itemType');
		query.find({
			success: function(items){
				if(items.length > 0 ){

				items.forEach(function(item){
					that.showItem(item);	
				})
			} else {
				$('.ship-head').html('');
			}

			},
			error: function(error){

			}
		}).then(function(){
			that.getBackOrders();
		})
	},

	getBackOrders: function() {
		var that = this;

		var query = new Parse.Query('backOrder');
		query.equalTo('order', this.order);
		query.find({
			success: function(items){
				if(items.length > 0 ){

				items.forEach(function(item){
					var typeQuery = new Parse.Query('itemType');
					typeQuery.equalTo('UPC', item.attributes.itemType);
					typeQuery.first({
						success: function(type) {
							that.showBackOrder(item, type);
						},
						error: function(error){
							
						}
					})
				})
			}else{
				$('.backorder-head').html('');
			}

			},
			error: function(error){

			}
		}).then(function(){
			that.getTotal();
		})
	},

	showBackOrder: function(backorder, type){
		$('.backorder-items').append(this.backorderInstanceTemplate({backorder: backorder, type: type}));	
	},

	showItem: function(item) {
		$('.in-stock-items').append(this.itemInstanceTemplate({item: item, type: item.attributes.itemType}));
	},

	getTotal: function() {
	var that = this;

	var costTotal = 0;
		setTimeout(function(){
		$('.item-price').each(function(index, price){
			var cost = (parseInt(this.innerHTML.replace(/\s+/g, '').substr(1)));
			costTotal += cost;
		})
		that.showTotal(costTotal);
			
		},800)
	},

	showTotal: function(costTotal) {
		$('.backorder-items').append(this.totalTemplate({total: costTotal}));
	},

	printSales: function() {
		window.print()
	},	

	printInvoice: function() {
		window.print()
	},



});