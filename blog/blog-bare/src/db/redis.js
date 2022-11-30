const { createClient } = require('redis')
const { REDIS_CONF } = require('../conf/db')

const redisClient = createClient({url: `redis://${REDIS_CONF.host}:${REDIS_CONF.port}`})
redisClient.on('error', err => {
    console.error(err)
})

redisClient.connect();

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val)
}

function get(key) {
    return redisClient.get(key)
}

module.exports = {
    set,
    get
}

// set("1669804305735_0.32643367209159035", {username: 'zhangsan', realname: 'zs'})
// get("1669804305735_0.32643367209159035")
// .then(data => {
// console.log(data)
// })