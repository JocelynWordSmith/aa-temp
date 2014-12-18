var AppRouter = Parse.Router.extend({
	
	routes: {
		''					: 'frontPage',
		'scan'				: 'scanItem',
		'inventory' 		: 'inventoryList',
		'shelf' 			: 'shelfList',
		'backorder' 		: 'backorderList',
		'orders' 			: 'orderList',
		'order'				: 'placeOrder',
		'order/:id'			: 'finalOrder',

		'customers'			: 'customerList',


	},

	initialize: function(){
		// this is for the swap function to work, and presumably for later when a navbar exists, there will be a navswap function
		this.navOptions = null;
		this.currentView = null;
	},

	frontPage: function() {
		this.swap( new FrontPage() );
	},

	scanItem: function() {
		this.swap( new ScanItem() );
	},

	inventoryList: function() {
		this.swap( new InventoryList() );
	},

	shelfList: function() {
		this.swap( new ShelfList() );
	},

	backorderList: function() {
		this.swap( new BackorderList() );
	},

	orderList: function() {
		this.swap( new OrderList() );
	},

	orderStatus: function(id) {
		this.swap( new OrderStatus({"orderID": id}) );
	},

	placeOrder: function() {
		this.swap( new PlaceOrder() );
	},	

	orderItems: function(id) {
		this.swap( new OrderItemsView({"shopID": id}) );
	},

	attachForm3: function(id) {
		this.swap( new AttachForm3({"orderID": id}) );
	},

	orderInvoice: function(id) {
		this.swap( new OrderInvoice({"orderID": id}) );
	},

	orderPartial: function(id) {
		this.swap( new OrderPartial({"orderID": id}) );
	},

	customerList: function() {
		this.swap( new CustomerList() );
	},	

	finalOrder: function(id) {
		this.swap( new OrderInstanceView(id) );
	},


	swap: function (view) {
		// this replaces the current app-view with the new view, and gets rid of the old one and stops it from listening for events and stuff
		if (this.currentView) {this.currentView.remove()};
		this.currentView = view;
	},



});