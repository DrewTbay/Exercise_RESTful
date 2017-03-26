var dbPool = require(__dirname + '/../global.js').dbPool;
var hasher = require(__dirname + '/../global.js').hasher;

//validate the request to insert a new user.
function createUser(req, res, next) {	
    if(!req.body.username){
	res.status(400).json({
	    status: "validation",
	    data: {},
            message: 'No password provided'
	});
	return;
    }
    if(!req.body.email) {
	res.status(400).json({
	    status: "validation",
	    data: {},
	    message: 'No username provided'
	});
	return;
    }
    if(!req.body.password) {
	res.status(400).json({
	    status: "validation",
	    data: {},
	    message: 'No username provided'
	});
	return;
    }
    
    hasher.crypt.genSalt(hasher.saltRounds, function(err, salt) {
	if (err){
	    res.status(412).json({
		status: "error",
		data: {},
		message: 'Hash generation failed'
	    });
	    return;
	}
	hasher.crypt.hash(req.body.password, salt, function(err, hash) {
	    if (err) {
		res.status(412).json({
		    status: "error"
		    data: {},
		    message: 'Hash generation failed'
		});
		return;
	    }
	    dbPool.connect(function(err, client, done) {
		if (err) {
		    res.status(412).json({
			status: "error",
			data: {},
			message: 'Connection to database failed'
		    });
		    return;
		}
		client.query(
		    'SELECT user_name ' +
		    'FROM users ' +
		    'WHERE user_name = $1::text', 
		    [req.body.username], 
		    function (err, result) {
			if (err) {
			    res.status(412).json({
				status: "error",
				data: {},
				message: 'Connection to database failed'
			    });
			    return;
			}
			if(result.rows.length > 0){
			    res.status(409).json({
				status: "validation",
				data: {},
				message: 'Insertion error: username already exists, fails at check'
			    });			
			} else {
				client.query(
				    'INSERT INTO users (user_name, user_password, salt, user_email) ' +
				    'VALUES ($1::text, $2::text, $3::text, $4::text)', 
				    [req.body.username, hash, salt, req.body.email], 
				    function (err, result) {
					if (err) {
					    res.status(409).json({
						status: "error",
						data: {},
						message: 'Insertion error: username already exists. fails at insert'
					    });
					    return;
					}
					res.status(200).json({
					    status: "successful",
					    data: {},
					    message: 'User Added'
					});
					return;
				    });
			    }
			});
		});
	});
    });
}

function loginUser() {
    
}

module.exports= {
    createUser: createUser,
    loginUser: loginUser
}
