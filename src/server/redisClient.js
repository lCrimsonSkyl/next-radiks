import redis from 'redis';

var redisClient = redis.createClient();

// redisClient.on('connect', function () {
//     console.log('ok1');
// });

// redisClient.on('error', function (err) {
//     console.log('erro2r');
// });

export default redisClient;