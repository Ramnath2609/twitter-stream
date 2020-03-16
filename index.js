const express = require('express')
const app = express()
const port = 3265
const socket = require('socket.io')

const server = app.listen(port, () => {
    console.log('connected to port', port)
})

io = socket(server)

io.on('connection', (socket) => {
    socket.on('GET_TWEETS', function(data){
        const Twit = require('twit')
        const keys = {
            consumer_key: 'dKX9QHcb4zQLHlwluysLOyEHd',
            consumer_secret: '5Tg9NyHb3rWHrPpEKHTTgZxtBD4XU45l7EUrKRj3ABPnjCRhR6',
            access_token: '1049547142749028352-mi6slIePMM4kQsPoZkQgnyNEix5IIv',
            access_token_secret: 'Yww865ZwOPfu2qslHs3MeGzdxp1jBdDHQ8XTEg4hyyf9t'
        };
        const T = new Twit(keys)

        const stream = T.stream('statuses/filter', { track : data})
        
        stream.on('tweet', function(tweet){
            console.log(tweet.text)
        })
    })
})
