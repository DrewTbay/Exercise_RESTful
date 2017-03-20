var dbPool = require(__dirname + '/../global.js').dbPool;
var hasher = require(__dirname + '/../global.js').hasher;

//validate the request to insert a new user.
function createUser(req, res, next) {	
	if(!req.body.username){
		res.status(400).json({
			data: {},
			message: 'No username provided'
		});
	} else if(!req.body.password) {
		res.status(400).json({
			data: {},
			message: 'No password provided'
		});
	} else if(!req.body.email) {
		res.status(400).json({
			data: {},
			message: 'No email provided'
		});
	} else {
		hasher.crypt.genSalt(hasher.saltRounds, function(err, salt) {
			if (err) {
				res.status(412).json({
					data: {},
					message: 'salt generation failed'
				});
			} else {
				hasher.crypt.hash(req.body.password, salt, function(err, hash) {
					if (err) {
						res.status(412).json({
							data: {},
							message: 'hash generation failed'
						});
					} else {
						dbPool.connect(function (err, client, done) {
							if(err) {
								res.status(412).json({
									data: {},
									message: 'getting client from pool failed'
								});
							} else {
								client.query(
									'SELECT user_name ' +
									'FROM users ' +
									'WHERE user_name = $1::text', 
									[req.body.username], 
								function (err, result) {
									if(err){
										done(err);
										res.status(412).json({
											data: {},
											message: err
										});
									} else {
										if(result.rows.length > 0){
											res.status(409).json({
												data: {},
												message: 'Insertion error: username already exists'
											});				
										}else{
											client.query(
												'INSERT INTO users ( ' +
													'user_name, ' + 
													'user_password, ' + 
													'salt, ' + 
													'user_email' + 
												') VALUES (' + 
													'$1::text, ' + 
													'$2::text, ' + 
													'$3::text, ' + 
													'$4::text ' + 
												')', 
												[
													req.body.username,
													hash,
													salt,
													req.body.email
												], 
											function (err, result) {
												done(err);
												if(err){
													res.status(412).json({
														data: {},
														message: err
													});
												} else {
													if(result.rows.length > 0){
														res.status(409).json({
															data: {},
															message: 'Insertion error: username already exists'
														});				
													}else{
														res.status(200).json({
															data: {},
															message: 'User added'
														});
													}
												}
											});
										}
									}
								});
							}
						});
					}
				});
			}
		});
	}
}

function loginUser() {
}

module.exports= {
	createUser: createUser
	loginUser: loginUser
}
