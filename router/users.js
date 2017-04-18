const dbPool = require(__dirname + '/../global.js').dbPool;
const hasher = require(__dirname + '/../global.js').hasher;
const tokenGen = require(__dirname + '/../global.js').tokenGen;

//validate the request to insert a new user.
function createUser(req, res, next) {
    let validation = {};
    let reply = {};

    validation = validateString(req.body.username, 'No username provided');
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

    validation = validateString(req.body.email, 'No email provided')
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

    validation = validateString(req.body.password, 'No password provided')
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

    hasher.crypt.genSalt(hasher.saltRounds, function(err, genSalt) {
	if (err) {
	    reply = formatResponse(412, {}, 'Hash generation failed');
	    res.status(reply.status).json(reply.response);
	    return;
	}
	hasher.crypt.hash(req.body.password, genSalt, function(err, genHash) {
	    if (err) {   
		reply = formatResponse(412, {}, 'Hash generation failed');
		res.status(reply.status).json(reply.response);
		return;
	    }
	    dbPool.query(
		'SELECT add_user_account($1::text, $2::text, $3::text, $4::text)', 
		[req.body.username, req.body.email, genHash, genSalt], 
		function (err, result) {
		    if (err) {
			reply = formatResponse(409, err, 'Insertion error: insert failed');
			res.status(reply.status).json(reply.response);
			return;
		    }
		    data = formatDatabaseResults(result);
		    if(data.add_user_account) reply = formatResponse(200, data, 'User added');
		    else reply = formatResponse(409, data, 'Username or email already in use');
		    res.status(reply.status).json(reply.response);
		    return;
		});
	});		 
    });
}

function loginUser() {
    let validation = {};

    validation = validateString(req.body.username, 'No username provided')
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

    validation = validateString(req.body.password, 'No password provided')
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

    let token = tokenGen.sign(res.body.username, tokenGen.superSecert, {
	expiresInMinutes: 1440
    });
    
}

function checkName(req, res, next) {
    let validation = {};

    validation = validateString(req.params.name, 'No username provided')
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

     dbPool.query('SELECT user_name FROM users WHERE user_name = $1::text', 
	 [req.params.name],
	 function (err, result) {
	     if (err) {
		 reply = formatResponse(409, err, 'Query Error: check failed');
		 res.status(reply.status).json(reply.response);
		 return;
	     } else {
		 if (result.rowCount > 0) reply = formatResponse(200, {user_name_used: true}, 'Username is already in use');
		 else reply = formatResponse(200, {user_name_used: false}, 'Username is free to use');
		 res.status(reply.status).json(reply.response);
		 return;
	     }	 
	 });
}

function checkEmail(req, res, next) {
    let validation = {};
    
    validation = validateString(req.params.email, 'No email provided')
    if (validation.error) {
	res.status(validation.info.status).json(validation.info.response);
	return;
    }

     dbPool.query('SELECT user_email FROM users WHERE user_email = $1::text', 
	 [req.params.email],
	 function (err, result) {
	     if (err) {
		 reply = formatResponse(409, err, 'Query Error: check failed');
		 res.status(reply.status).json(reply.response);
		 return;
	     } else {
		 if (result.rowCount > 0) reply = formatResponse(200, {user_email_used: true}, 'Email is already in use');
		 else reply = formatResponse(200, {user_email_used: false}, 'Email is free to use');
		 res.status(reply.status).json(reply.response);
		 return;
	     }	 
	 });

}

function validateString(importString, failedMessage){
    return !importString ? {error: true, info: formatResponse(400, {}, failedMessage)} : {error: false, info: {}}
}

function formatResponse(resCode, resData, resMessage){
    return {status : resCode, response: {data: resData, message: resMessage}}
}

function formatDatabaseResults(result){
    if(!result.rowAsArray) return result.rows[0]; 
    else{
	return result.rows;
    }
    
}

module.exports= {
    checkName: checkName,
    checkEmail: checkEmail,
    createUser: createUser,
    loginUser: loginUser
}
