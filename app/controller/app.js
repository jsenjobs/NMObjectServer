let log4js = require('log4js');
let logger = log4js.getLogger('ControllerApp');
let os = require('os');
let exec = require('child_process').exec;
let async = require('async');
let started_at = new Date();

exports.status = function(req, res) {
	logger.info('Status Api Call');
	let server = req.app;
	if(req.param('info')) {
		let connections = {}, swap;

		async.parallel([
			(done) => {
				exec('netstat -an | grep :80 | wc -l', (e, res) => {
					connections['80'] = parseInt(res, 10);
					done();
				});
			},
			(done) => {
				exec('netstat -an | grep :' + server.set('port') + ' | wc -l', (e, res) => {
					connections[server.set('port')] = parseInt(res, 10);
					done();
				});
			}// ,
			// (done) => {
			// 	exec('vmstat -SM -s | grep "used swap" | sed -E "s/[^0-9]*([0-9]{1,8}).*/\1/"', (e, res) => {
			// 		swap = res;
			// 		done();
			// 	});
			// }
		],
		(e) => {
			res.json({
				status: 'up',
				version: server.get('version'),
				sha:server.get('git sha'),
				started_at:started_at,
				node: {
					version:process.version,
					memory:Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
					uptime:process.uptime(),		// 进程执行时间
				},
				system: {
					loadavg:os.loadavg(),
					freeMemory:Math.round(os.freemem() / 1024 / 1024) + 'M'
				},
				env: process.env.NODE_ENV,
				hostname:os.hostname(),
				connections:connections,
				swap:swap
			});
		}
		); // end parallel
	} else {
		res.json({
			status:'up'
		})
	}
	/*
	res.json({
		pid:process.pid,
		memory:process.memoryUsage(),
		uptime:process.uptime()		// 进程执行时间
	})*/
}