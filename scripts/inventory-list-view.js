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


var InventoryList = Parse.View.extend ({

	events: {
		'click span.item-type' : 'itemTypeDetail',
		'click .manufacturer' : 'activeManufacturer',
	},

	template: _.template($('.inventory-list-view').text()),
	listItemTemplate: _.template($('.inventory-list-item-view').text()),
	listItemDetailTemplate: _.template($('.inventory-list-detail-view').text()),

	initialize: function() {
		if((Parse.User.current() === null) === true){
			window.location.href = '#';
			router.swap( new FrontPage() );
		} else {
			$('.app-container').html(this.el);
			// console.log('InventoryList')
			this.render();
		}
	},

	render: function() {
		$(this.el).append(this.template());
		this.getItemTypes();
	},

	getItemTypes: function() {
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

	newItemView: function(e){
		new InventoryItemView({
		  el: $('.inventory-list-item-bound'),
		  model: e,
		});
	},
	activeManufacturer: function(e){
		$('.manufacturer').removeClass('active');
		$(event.target).addClass('active');
		$('.center-number').text('');
		$('.center-number').text($(event.target).text());
		$('.inventory-list-item-bound').html('');

		var chosenManufacturer = e.currentTarget.attributes.name.value;
		var that = this;
		var listManufacturers = [];
		var thisManufacturersItems = [];
		
		var query = new Parse.Query('itemType');
		query.limit(1000)
		query.find(function(itemTypes){
			itemTypes.forEach(function(e){
				var thisItem = [];
				if (e.attributes.Manufacturer == chosenManufacturer){
					// var newItemView = new InventoryItemView({itemType: e});
					$('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: e}))
					thisManufacturersItems.push(e);
				}
				return thisManufacturersItems
			});
			var ItemsList = []
			console.log(thisManufacturersItems);
			var queryInstances = new Parse.Query('itemInstance');
			queryInstances.limit(1000);
			queryInstances.find(function(itemInstances){
				var UPCList = [];
				itemInstances.forEach(function(item){
					UPCList.push(item.attributes.UPC);
					
				})
			console.log(UPCList);
				return UPCList
				// console.log(itemInstances.attributes.UPC);
			})
			for(i = 0; i < thisManufacturersItems.length; i++){
			  _.each(thisManufacturersItems[i], function(){
			  	// console.log(thisManufacturersItems);
			  	// console.log(thisManufacturersItems[i].attributes.UPC);
			  	ItemsList.push(thisManufacturersItems[i]);
			    // $('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: thisManufacturersItems[i]}))
			  });
				// setTimeout(console.log(ItemsList), 1500);
		  	// return ItemsList;
			};
		})
		// // this.setAppropriateHeight();
	},


	// setAppropriateHeight: function () {
	// 	$('li').forEach(function(){
	// 		console.log($(this).height);
	// 	})
		// $('.try').css('height', $(this).parent().height());
		// var children = []; 
		// var outerContainer = $('.inventory-list-item-bound');
		// console.log(outerContainer);
		// console.log(this.$el);
		// $('.inventory-list-item-bound').children().forEach(function(child){
		// 	children.push(child);
		// 	console.log(children);
		// 	return children
		// })
		// // _.each($('.inventory-list-item-bound').children(), function(child){ 
		// // 	children.push(child);
		// // 	return children
		// // }); 
		// // console.log(children)
		// _.each(children, function(child){
		// 	$(child).children().css('height', $(child).height())
		// });
	// },


});

// this is a list of all items that are not attached to a backorder or a shelf item, so all items with no item instance code.
// these are all items instances that have been scanned in and not sold. there should be a list of all item types that have item
// instances attached to them, including a non-defined item type, which is what is given to all items that do not have defined item
// types. an item instance must be assigned an item type other than non-defined before it can be sold. 

// new item types should be able to be created, deleted and edited. when this happens, items should be automatically moved from non-defined
// to the new item type if they match. otherwise some association with the info from the manufacturers needs to be created so that items will
// automatically be put into their appropriate types when scanned in. 

// particular item instances should be able to be created, deleted and edited, however this should be indirect to do, and require multiple
// checks and button clicks, as it should never happen by accident.

// there is going to be a "special" item type, which is going to be dealt with entirely seperately from the rest of the items, and it going to 
// be pulled into the order forms differently as well. it should only be dealt with after all essentials are completed.
// the point of the special item class is to group items that are unique in some way. this could be a one off item that will never be sold again,
// or it could an existing item that they want to sell for a different price, but only want to apply that price to that particular item. this 
// could also be accomplished on the invoice, but this is a better way of tracking it. there are also other uses for the "special" item type,
// but it is not a priority, just something that will likely need to be made. it will never take items automatically when scanned in.




			// THIS IS HERE IN CASE I NEED SOMETHING OLD -------------

			// itemTypes.forEach(function(itemType){
			// 	var query = new Parse.Query('itemInstance');
			// 	// query.equalTo('itemInstanceCode', undefined)
			// 	query.equalTo('Manufacturer', chosenManufacturer);
			// 	// $(itemType.attributes.ProductID).forEach(function(e){
			// 	// 	var thisProductId = 0;
			// 	// 	thisProductId = e;
			// 	// 	ProductIdLength.push(thisProductId);
			// 	// })
			// console.log(query)
			// // console.log(itemNumber)
			// 	query.find({
			// 		success:function(count){
			// 				itemNumber = itemNumber + 1;
			// 				// $('.product-id').text(itemNumber);
			// 			// for(i = 0; i < ProductIdLength.length; i ++){
			// 				$('.inventory-list-item-bound').append(that.listItemTemplate({ itemType: itemType, count: count}))
			// 				// console.log(i);
			// 				// console.log(itemNumber);
			// 				// console.log(count)

			// 				// i++	
			// 			// }
			// 		},
			// 		error:function(error){
			// 			console.log(error);
			// 		}
			// 	})
