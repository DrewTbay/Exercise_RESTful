var dbPool = require(__dirname + '/../global.js').dbPool;


function getSchedules(req, res, next) {
	dbPool.query('SELECT schedule_name FROM schedules', function (err, data) {
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

