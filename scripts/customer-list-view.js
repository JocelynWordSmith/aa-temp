var CustomerList = Parse.View.extend ({

	events: {
		'click .create-customer'		 : 'createCustomerContainer',
		'click .new-customer-submit' : 'addCustomer',
		'click .cancel-customer'		 : 'cancelCustomerCreation',
		'keydown .search'		: 'listIt',
		'click .reset-search' : 'resetSearch',
		'click .edit-customer' : 'editCustomerModal',
		'click #close-modal'		: 'closeModal',
		'click .save-customer-changes' : 'saveCustomerChanges',
	},

	template: _.template($('.customer-list-view').text()),
	customerListTemplate: _.template($('.customer-list-item').text()),
	customerModalTemplate: _.template($('.customer-modal-template').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			this.phoneValidate();
			this.render();
		}
	},

	render: function() {
		$(this.el).html('');
		$(this.el).append(this.template());
		this.phoneValidate();	
		this.emailValidate();
		this.getCustomers();
	},

	listIt: function(){
		var options = {
		  valueNames: [ 'company-name', 'company-owner', 'company-phone', 'company-email', 'FFL', 'address', 'city', 'state', 'zip' ]
		};

			// Init list
			
		var contactList = new List('contacts', options);
		// var options = {};
	},


	closeModal: function() {
		console.log('closing modal');
		$('body').css('overflow', 'visible');
		$('.modal-div').html('');
	},

	resetSearch: function () {
		$('.list').html('');
		$('.search').val('');
		$('.search').focus();
		this.getCustomers();
	},

	phoneValidate: function () {
	  function phone (input, n) {
	      $(input).keyup(function() {
	          // val is numeric
	          if ($.isNumeric($(this).val())) {
	              $('.phone-number-input').css('background', 'white');
	              if ($(this).val().length >= n) $(this).next('input').focus();
	          // val is not numeric
	          } else {
	              // characters exist in input
	              $(this).css('background', $(this).val().length ? 'rgba(255, 0, 0, 0.35)' : 'white');
	          }
	      });
	  };
	  _.each($('.phone-number-input'), function (input, i) {
	      // make click event for each input
	      phone(input, [3,3,4][i]);
	  });

	  _.each($('.zip-input'), function(input, i) {
	  		phone(input, [5][i]);
	  })

	  _.each($('.edit-phone-number-input'), function (input, i) {
	      // make click event for each input
	      phone(input, [3,3,4][i]);
	  });

	  _.each($('.edit-zip-input'), function(input, i) {
	  		phone(input, [5][i]);
	  })

	  // new function 
	  addDashes = function addDashes(f) {
	      var r = /(\D+)/g,
	          areacode = '',
	          middle3 = '',
	          last4 = '';
	      f.value = f.value.replace(r, '');
	      areacode = f.value.substr(0, 3);
	      middle3 = f.value.substr(3, 3);
	      last4 = f.value.substr(6, 4);
	      f.value = areacode + '-' + middle3 + '-' + last4;
	  }
	},

	emailValidate: function () {
	  function evaluate (val) { return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val); }
	  $('.email-input').keyup(function() {
	    $(this).css('background', evaluate($(this).val()) ? 'white' : 'rgba(255, 0, 0, 0.35)');
	    if($(this).val() < 1){
	    	$(this).css('background', 'white');
	    }
	  })
	},

	// checkCustomer: function() {
	// 	var that = this;
	// 	this.query.each(function(customer){
	// 		if(customer.attributes.name == $('.customer-name').val() && customer.attributes.city == $('.customer-city').val() && customer.attributes.state == $('.customer-state').val() && customer.attributes.streetAddress == $('.customer-address').val()){
	// 			alert('this customer already exists');
	// 		}else {
	// 			that.addCustomer();
	// 		}
	// 	})
	// },

	createCustomerContainer: function (){
		console.log('open it');
		$('.create-customer').attr('disabled', 'disabled');
		$('.hidden-customer-creation').css('display', 'block');
	},

	cancelCustomerCreation: function (){
		$('.create-customer-input').val('');
		$('.create-customer').attr('disabled', false);
		$('.hidden-customer-creation').css('display', 'none');
	},

	addCustomer: function() {
		var that = this;

		var Customer = Parse.Object.extend('customer');
		var customer = new Customer();
		// _.each($('.create-customer-input'), function(e){
			if($('.company-input').val() === '') {
				console.log('empty');
				$('.create-customer-input').val('')
				$('.company-input').focus();
				return '';
			} else {
				customer.set({
					Company: $('.company-input').val(),
					FirstName: $('.first-name-input').val(),
					LastName: $('.last-name-input').val(),
					Phone: parseInt($('.phone-number-input').val()),
					email: $('.email-input').val(),
					FFL: $('.ffl-input').val(),
					Address1: $('.address-input').val(),
					City: $('.city-input').val(),
					Zip: parseInt($('.zip-input').val()),
					State: $('.state-input').val()
				}).save()	
				console.log(customer);
				that.getCustomers();
				that.cancelCustomerCreation();
			}
		// })
	},

	getCustomers: function() {
		var that = this;
		$('.customer-list').html('');
		this.query = new Parse.Query('customer');
		this.query.each(function(customer){
			$('tbody.list').append(that.customerListTemplate({ customer: customer.attributes, model: customer }));
		})
	},

	editCustomerModal: function(e){
		var that = this;
		var CustomerName = $(event.target).attr('name');
		console.log(CustomerName);
		var customerQuery = new Parse.Query('customer');
		customerQuery.limit(1500);
		customerQuery.equalTo('Company', CustomerName);
		customerQuery.first({
			success: function(customer){
				$('body').css('overflow', 'hidden');
				$('.modal-div').append(that.customerModalTemplate({customer: customer.attributes, model: customer }));
				$('.state-input').selectedIndex = customer.attributes.State;
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		})
	},

	saveCustomerChanges: function(e){
		function phone (input, n) {
		    $(input).keyup(function() {
		        // val is numeric
		        if ($.isNumeric($(this).val())) {
		            $('.phone-number-input').css('background', 'white');
		            if ($(this).val().length >= n) $(this).next('input').focus();
		        // val is not numeric
		        } else {
		            // characters exist in input
		            $(this).css('background', $(this).val().length ? 'rgba(255, 0, 0, 0.35)' : 'white');
		        }
		    });
		};

		$('.edit-phone-number-input'), function (input, i) {
		    // make click event for each input
		    phone(input, [3,3,4][i]);
		};

		$('.edit-zip-input'), function(input, i) {
				phone(input, [5][i]);
		};

		var that = this;
		var CustomerName = $(event.target).attr('name');
		var customerQuery = new Parse.Query('customer');
		customerQuery.limit(1500);
		customerQuery.equalTo('Company', CustomerName);
		customerQuery.first({
			success: function(customer){
				var thisCompany = customer.attributes;
				// console.log(customer.attributes.Company)
				customer.set({
					Company: 		($('.company-input').val().length != 0 ? $('.company-input').val() : thisCompany.Company),
					FirstName: 	($('.first-name-input').val().length != 0 ? $('.first-name-input').val() : thisCompany.FirstName),
					LastName: 	($('.last-name-input').val().length != 0 ? $('.last-name-input').val() : thisCompany.LastName),
					Phone: 			($('.edit-phone-number-input').val().length != 0 ? parseInt($('.edit-phone-number-input').val()) : thisCompany.Phone),
					email: 			($('.email-input').val().length != 0 ? $('.email-input').val() : thisCompany.email),
					FFL: 				($('.ffl-input').val().length != 0 ? $('.ffl-input').val() : thisCompany.FFL),
					Address1: 	($('.first-name-input').val().length != 0 ? $('.first-name-input').val() : thisCompany.Address1),
					City: 			($('.city-input').val().length != 0 ? $('.city-input').val() : thisCompany.City),
					Zip: 				($('.edit-zip-input').val().length != 0 ? parseInt($('.edit-zip-input').val()) : thisCompany.Zip),
					State: 			($('.state-input').val().length != 0 ? $('.state-input').val() : thisCompany.State)
				}).save()

				console.log(customer.attributes);
				that.closeModal()
				that.getCustomers();
			},
			error: function(error) {	
				console.log("Error: " + error.code + " " + error.message);
			}
		})
	}


 //  readyCustomers:function() {
 //  	console.log('makin lists');
 //  	var options = {
	// 	  valueNames: [ 'username', 'address' ],
	// 	};
	// 	console.log(options);
	// 	var userList = new List('list', options);
	// },


});

// This is a list of existing/previous customers. There needs to be an input feild to add new customers. the customers will be objects on 
// the server made by the shop to be used when placing an order. each customer needs to have knowledge of its existing orders, but 
// on creation should have an empty array for that, not an undefined feild. 

// the customers should be sortable/searchable and editable. it would be nice (non priority) if the customer could hold multiple values for
// it's inputs, such as different shipping addresses, payment options, whatever. I mention this so that any feilds that the customer may need to
// have more than one of down the line are made as either an array of objects or arrays

// the user should be able to select a customer and view past orders, with any orders containing unfilled backorders listed first. I'm not sure
// how this could be done easily, since the order/invoice will not be updated once a backorder is filled assuming they already paid for the
// item, they will just be issued a new shipment invoice, which I dont think we are actually dealing with
