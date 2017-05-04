require('./app/utils/env').env.ENVSET();
require('./app/utils/log').log4j.set();

let cluster = require('cluster');
let numCPUS = require('os').cpus().length;
if (cluster.isMaster) {
  //Fork a worker to run the main program
  console.log(' Fork %s worker(s) from master', numCPUS);
  for (var i = 0; i < numCPUS; i++) cluster.fork();

  cluster.on('online', (worker) => {
  	console.log('worker is running on %s pid', worker.process.pid);
  })
cluster.on('exit', (worker, code, signal) => {
  	console.log('worker with %s is closed', worker.process.pid);
})
} else if(cluster.isWorker) {
  //Run main program
  console.log('worker (%s) is running', cluster.worker.process.pid);
  require('./server.js').boot();
}

cluster.on('death', function(worker) {
  //If the worker died, fork a new worker
  console.log('worker ' + worker.pid + ' died. restart...');
  cluster.fork();
});