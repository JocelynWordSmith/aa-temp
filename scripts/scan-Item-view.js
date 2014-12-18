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
var ScanItem = Parse.View.extend ({

	events: {
		'click .new-item-submit' 						: 'createNewItemInstance',
		'click .add-item'				 						: 'manualAddItem',
		'click .add-new-item'    						: 'addNewItemFields',
		'click .cancel-new-item-creation' 	: 'cancelCreation',
		'click .start-scanning'  						: 'startScanning',
		'click .stop-scanning'   						: 'stopScanning',
		'keypress .this-upc'								: 'firstScan',
		'keypress .this-serial-number'			: 'secondScan',
	},

	template: _.template($('.scan-item-view').text()),
	manualItemCreationTemplate: _.template($('.manual-item-creation-template').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			var fakeScan = [];
			this.render();
			var totalScanned = 0;
		}
	},

	render: function() {
		$(this.el).html(this.template());
	},

	firstScan: function(e){
		if(e.keyCode == 13){
		   console.log($('.this-upc').val());
		   $('.this-serial-number').focus();
		} else {
			console.log("it's not ENTER!");
		}
	},

	secondScan: function(e){
		if(e.keyCode == 13){
		   console.log($('.this-upc').val() + ', ' + $('.this-serial-number').val());
		   this.autoFill();
		   console.log(this.autoFill());
		   this.createNewItemInstance();
		   $('.this-upc').val('');
		   $('.this-serial-number').val('');
		   $('.this-upc').focus();
		} else {
			console.log("it's not ENTER!");
		}
	},

	startScanning: function () {
		$('.this-upc').attr('disabled', false);
		$('.this-serial-number').attr('disabled', false);
		$('.this-upc').focus();
		$('.start-scanning').addClass('stop-scanning');
		$('.start-scanning').text('STOP SCANNING');
		$('.stop-scanning').removeClass('start-scanning')
	},

	stopScanning: function () {
		$('.this-upc').attr('disabled', true);
		$('.this-serial-number').attr('disabled', true);
		$('.stop-scanning').addClass('start-scanning');
		$('.stop-scanning').text('START SCANNING');
		$('.start-scanning').removeClass('stop-scanning')
	},

	checkInput: function() {
		if($('.itemType').val() && $('.itemName').val() && $('.itemNumber').val()){
			this.checkItemType()
		}else {
			alert('please fill in all feilds')
		}
	},

	autoFillScan: function() {
		this.autoFill();
		var UPCserial = this.autoFill();
		$('.this-serial-number').val(UPCserial.splice(1));
		$('.this-upc').val(UPCserial.splice(0));
		// this.showScannedItem();
	},

	autoFill: function(UPC, SerialNumber) {
		var that = this;
		var scannedItemArray = []
		scannedItemArray.push($('.this-upc').val());
		scannedItemArray.push($('.this-serial-number').val())
	  return scannedItemArray;
	},

	checkItemType: function(){
		var that = this;


		this.autoFill().forEach(function(e){
			var scannedItem = e;
			var parsedScannedItem = parseInt(e);
			if(isNaN(parsedScannedItem) === false) {
				var itemUPC = scannedItem;
			} 
			var query = new Parse.Query('itemType');
			query.equalTo('UPC', itemUPC)
			query.find(function(items){
				if(items.length>0){
					that.itemPointer = items[0];
				} else {
					console.log('no match');
					that.itemPointer = itemType;
				}

			}).then(function(){
				that.newItemSubmit();
			})
		});

	},
	newItemSubmit: function() {
		var that = this;
		that.createNewItemInstance().then(function(){
			that.render;
		});
	},

	manualAddItem: function () {
		$('.add-item').attr('disabled', 'disabled');
		$('.new-item-submit').attr('disabled', 'disabled');
		var that = this;
		this.stopScanning();
		$('.add-here').append(that.manualItemCreationTemplate({}))
		console.log('added it');
	},

	createNewItemInstance: function () {
		var ItemInstance = Parse.Object.extend("itemInstance");
		var itemInstance = new ItemInstance();

		this.autoFill().forEach(function(e){
		  var that = this;
		  var scannedItem = e;
		  var scannedAndParsed = parseInt(e);
		  var query = new Parse.Query('itemType');
		  var UPCchecklist = [];
		  var newSerialNumber = $('.this-serial-number').val();
		  var totalScanned = $('.scanned-item-total').text();
		  var matchedSerialNumber = 0;
		  query.limit(1000);
		  query.find(function(itemTypes){
		    itemTypes.forEach(function(b){
		      if(b.attributes.UPC){
		        UPCchecklist.push(b.attributes.UPC)
		      }
		    });

	    SerialNumber = function () {
		    this.autoFill().forEach(function(e){
					 var scannedItem = e; 
					 var parsedScannedItem = parseInt(e); 
					 if(isNaN(parsedScannedItem)){ 
					 	console.log(scannedItem)
					 	return scannedItem
					 } 
				})
	    }
	    var meh = 0
	    if(isNaN(scannedAndParsed) === true){
		    console.log(scannedItem);
	    	// console.log(scannedAndParsed);
	    	var query = new Parse.Query('itemInstance');
	    	query.equalTo('serialNumber', scannedItem)
	    	query.find(function(itemInstances){
	    		if(itemInstances.length > 0){
		    		console.log(itemInstances)
    				$('.stop-scanning').click();
    				return '';
	    		}
	    	})
	    } else {
				UPCchecklist.forEach(function(e){
					console.log(scannedItem);
  	      if(e == scannedItem){
  	        var query = new Parse.Query('itemType');
  	        query.limit(1000);
  	        query.find(function(itemTypes){
  	          itemTypes.forEach(function(b){
  	            if(b.attributes.UPC == e){
  	              // Setting new itemInstance attributes to matching itemType attributes
  	              itemInstance.set({
  	                Caliber:              b.attributes.Caliber,
  	                Cost:                 b.attributes.Cost,
  	                DealerPrice:          b.attributes.DealerPrice,
  	                MSRP:          				b.attributes.MSRP,
  	                Description:          b.attributes.Description,
  	                Model:                b.attributes.Model,
  	                UPC:                  b.attributes.UPC,
  	                itemType: 						b,
  	                serialNumber: 				newSerialNumber,
  	                itemInstanceCode: 		0,
  	              })
  							  console.log(itemInstance)
  							  $('.scanned-item-list').append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + itemInstance.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + itemInstance.attributes.serialNumber + '</div>');
  								// itemInstance.save();
  							  totalScanned = parseInt(totalScanned) + 1;
  								$('.scanned-item-total').text(totalScanned);
  	            }
  	          })
  	        })
  	      }
  	    })
	    }
		  })
		})
	},


	addNewItemFields: function () {
		// var totalScanned = $('.scanned-item-total').text()
		var empty = $('.new-item-form').find("input").filter(function() {
		       return this.value === "";
		   });
		   if(empty.length) {
		   	alert('please fill in all fields.');
		       //At least one input is empty
		   } else {
		   	var ItemType = Parse.Object.extend("itemType");
		   	var itemType = new ItemType();
		   	itemType.set({
		   		Manufacturer: 				$('.manufacturer').val(),
		   		Description: 					$('.description').val(),
		   	  Caliber:              $('.caliber').val(),
		   	  Model:                $('.model').val(),
		   	  Cost:                 ("$" + $('.cost').val()),
		   	  DealerPrice:          ("$" + $('.dealer-price').val()),
		   	  MSRP:         				("$" + $('.msrp').val()),
		   	  UPC:                  $('.upc').val(),
		   	})

				itemType.save();

				$('.scanned-item-list').append('<div class="col-md-3 scanned-item-container"><div class="scanned-item-attribute col-md-6"><p>' + itemType.attributes.Model + '</p></div><div class="scanned-item-attribute col-md-6"><p>' + itemType.attributes.UPC + '</div>');

				console.log(itemType);
				$('.new-item-form').children('input').val('');
				$('.new-item-form').children('textarea').val('');
				$('.manufacturer').focus();
		   }
	},

	cancelCreation: function () {
		$('.add-item').attr('disabled', false);
		$('.new-item-submit').attr('disabled', false);
		$('.add-here').html('');
		console.log('pudding');
	},


});



// When an item instance is added, it should check to see if it can fill a backorder, be assigned to it's item type, and then
// after it has been saved check to see if it can fill a backorder. if it fails to fill a backorder both times, it SHOULD NOT get an item 
// instance code, and just be saved to the server, and the physical item should go in regular inventory.

// concerning item types, all items should automatically be assigned to an item type. we need to come up with a way to associate the information
// we get from a bar code to the item types on the server. the easiest way i think is to require an existing item of that type to be already
// scanned in in order to make a new item type. 

// all items that do not have an existing item type should be marked as non-defined. when a new item type is made based on a non-defined item,
// it should take all other like items marked as non-defined and change them to that item type, however this should be done in the inventory View
// or cloud code and not here