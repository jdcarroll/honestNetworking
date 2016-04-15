var db = require('mongojsom')('honest',['users']);

module.exports = {
	ReadUsers : new Promise(function(resolve, reject){
		db.users.find(function(err, docs){
			resolve(docs)
		})
	}).catch(function(err){
		console.log(err);
	}),

	createUsers : function(user){
		new Promise(function(resolve, reject){
			var insertedUser = db.users.insert(user);
			resolve(insertedUser);
		}).catch(function(err){
			console.log(err);
		})
	},

	deleteUser : function(user){
		var query = {
			_id : user._id
		}

		db.users.remove(query, function(err, result){
			if(err) { throw err; }
    		console.log('user' + user.name + 'removed')
		})
	}

}
