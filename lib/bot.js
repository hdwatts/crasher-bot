'use strict';
const request = require('request');
const baseUrl = 'https://api.groupme.com/v3'
const token = process.env.GROUPME_API_TOKEN
const groupid = process.env.GROUPME_GROUP_ID //6085514 for test, 4461787 for tummy

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const https = require('https');

class Bot {
    /**
     * Called when the bot receives a message.
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */
    static checkMessage(message) {
        const messageText = message.text;

        const gifs = [
            "https://giphy.com/gifs/filmeditor-movie-comedy-3oKIPiricDK2Rq1Q2Y",
            "https://media.giphy.com/media/xUPGcLjgsMlRQjtR2E/giphy.gif",
            "https://media.giphy.com/media/tCzQL8AwGqjIY/200.gif"
        ]

        // Learn about regular expressions in JavaScript: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions
        const botRegex = /^\/shrug/;

        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && botRegex.test(messageText)) {
            // Check is successful, return a message!
            return '¯\\_(ツ)_/¯';
        }

        if (messageText && /^\/sail.*/.test(messageText)) {
            const mention = message.attachments.find(att=>att.type=="mentions").user_ids
            if (mention && mention[0]) {
                var url = baseUrl + "/groups/" + groupid + "?token=" + token;
                console.log(url)
                request({
                    url: url,
                    method: "GET",
                    json: true,   // <--Very important!!!
                    body: {}
                }, function (error, response, body){
                    const res = JSON.parse(response)
                    console.log("First!")
                    console.log(response)
                    const id = res.response.members.find(member=>member.user_id == mention[0]).id
                    url = baseUrl + "/groups/" + groupid + "/members/" + id + "/remove?token=" + token,
                    console.log(url)
                    request({
                        url: url,
                        method: "GET",
                        json: true,
                        body: {}
                    }, function (error, response, body) {
                        console.log("Second!")
                        console.log(response)
                    })
                });
            }
            return 'We sail without him!';
        }

        if (messageText == "/gif") {
            return gifs[Math.floor(Math.random() * gifs.length)];
        }

        if (messageText == "/results") {

        }
        return null;
    };

    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
    static sendMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText
        };

        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function(response) {
            if (response.statusCode !== 202) {
                console.log('Rejecting bad status code ' + response.statusCode);
            }
        });

        // On error
        botRequest.on('error', function(error) {
            console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function(error) {
            console.log('Timeout posting message ' + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };
};

module.exports = Bot;
