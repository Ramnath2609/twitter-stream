const express = require('express')
const app = express()
const port = 3265
const socket = require('socket.io')
require('dotenv').config()
const Twit = require('twit')
const keys = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
};
const server = app.listen(port, () => {
    console.log('connected to port', port)
})

io = socket(server)


io.on('connection', (socket) => {
    socket.on('GET_TWEETS', function(data){
        
        const T = new Twit(keys)

        const stream = T.stream('statuses/filter', { track : data, language : 'en'})
        
        stream.on('tweet', function(tweet){
            socket.emit('RECIEVE_TWEETS', tweet)
        })
    })
})
