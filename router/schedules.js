var pool = require(__dirname + '/../global.js').pool;

//Start connection pool
function getSchedules(req, res, next) {
	pool.query('SELECT schedule_name FROM schedules', function (err, data) {
		res.json({
			status: 'successful',
			data: data,
			message: 'Retrieved all schedules'			
		});		
	});
}

module.exports= {
	getSchedules: getSchedules
}

