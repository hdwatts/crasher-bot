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
        const _self = this

        const getMembers = onSuccess =>{
            var url = baseUrl + "/groups/" + groupid + "?token=" + token;
            request({
                url: url,
                method: "GET",
                json: true,   // <--Very important!!!
                body: {}
                }, function(x,y,z) {
                    onSuccess(y.body.response.members)
                }
            );
        }

        const isAdmin = (user_id, onSuccess) =>
            getMembers(members=>{
                const member = members.find(member=>member.user_id == user_id)
                if (member && member.roles.find(role=>role=="admin" || role=="owner")) {
                    onSuccess(members)
                } else {
                    _self.sendMessage("Don't be shortsighted.")
                }
            });
        
        const sailWithoutHim = (members) => {
            const mention = message.attachments.find(att=>att.type=="mentions").user_ids
            if (mention && mention[0]) {
                const res = members.find(member=>member.user_id == mention[0])
                const id = res && res.id
                if (id) {
                    request({
                        url: baseUrl + "/groups/" + groupid + "/members/" + id + "/remove?token=" + token,
                        method: "POST",
                        json: true,
                        body: {}
                    }, function (error, response, body) {
                        _self.sendMessage("We sail without him!");
                    })
                }
            }
        }

        const gifs = [
            "https://giphy.com/gifs/filmeditor-movie-comedy-3oKIPiricDK2Rq1Q2Y",
            "https://media.giphy.com/media/xUPGcLjgsMlRQjtR2E/giphy.gif",
            "https://media.giphy.com/media/tCzQL8AwGqjIY/200.gif",
            "https://media.giphy.com/media/l1ug3xGEN1oZBT7qw/giphy.gif",
            "https://media.giphy.com/media/3o84snFF2FZaX3QfYc/giphy.gif",
            "https://media.giphy.com/media/3oeSAF90T9N04MyefS/giphy.gif",
            "https://media.giphy.com/media/xTiIzsBR8umdt5AEU0/giphy.gif",
            "https://media.giphy.com/media/3oeSASP8ACZN38Rezm/giphy.gif",
            "https://media.giphy.com/media/l1ugjWQhhalq5qc9y/giphy.gif",
            "https://media.giphy.com/media/xUPGcKkeiBue94can6/giphy.gif",
            "https://media.giphy.com/media/xTiIzqWB3s34DEiLE4/giphy.gif",
            "https://media.giphy.com/media/l1ugeglQYqUngJhNC/giphy.gif",
            "https://media.giphy.com/media/l1uglv1hPBHP8MUlG/giphy.gif",
            "https://media.giphy.com/media/3ohzdZqDY4cmbWYWSA/giphy.gif",
            "https://media.giphy.com/media/xUPGcqrZTmJAh4Gdeo/giphy.gif",
            "https://media.giphy.com/media/xUA7aT1vNqVWHPY1cA/giphy.gif",
            "https://media.giphy.com/media/3og0IKinzBYyoia9eE/giphy.gif",
            "https://media.giphy.com/media/3o84sxgvzX5e5GvnYk/giphy.gif",
            "https://media.giphy.com/media/xTiIzxfqeozcBHBYnm/giphy.gif",
            "https://media.giphy.com/media/l1uga8ObPBnIBoXUQ/giphy.gif",
            "https://media.giphy.com/media/3ohzdFvSAgvmXq6n2o/giphy.gif",
            "https://media.giphy.com/media/3o84sv2u7KSHKbwPza/giphy.gif",
            "https://media.giphy.com/media/CTCwGMQM8Td04/giphy.gif",
            "https://media.giphy.com/media/xUPGcdqoeWBWaYE5DW/giphy.gif",
            "https://media.giphy.com/media/3oeSAXCqOrDqoYlwqs/giphy.gif",
            "https://media.giphy.com/media/l1ug5li9GUojhhBlK/giphy.gif",
            "https://media.giphy.com/media/3o84sDsdzhEMpE1X32/giphy.gif",
            "https://media.giphy.com/media/xUPGciA8rvHU7CFoZy/giphy.gif",
            "https://media.giphy.com/media/xTiIzqkHhzLxeZ7r8c/giphy.gif",
            "https://media.giphy.com/media/xUPGcChVuaSN6m0Jig/giphy.gif",
            "https://media.giphy.com/media/l1ugbmx4Mp0EpomXe/giphy.gif",
            "https://media.giphy.com/media/l1ug5KQKhXKuyE3bG/giphy.gif",
            "https://media.giphy.com/media/l1ug45UhP1oPHhfmE/giphy.gif",
            "https://media.giphy.com/media/3og0IDPDdimwiK1fWw/giphy.gif",
            "https://media.giphy.com/media/3o84szMBMxasW5WulO/giphy.gif",
            "https://media.giphy.com/media/3o84szeFo8OMZWimly/giphy.gif",
            "https://media.giphy.com/media/3oeSAUQtmIUTN8sYwg/giphy.gif",
            "https://media.giphy.com/media/3oeSACepQ2WIOlFjos/giphy.gif",
            "https://media.giphy.com/media/3o84sLGNgVq1bPUIco/giphy.gif",
            "https://media.giphy.com/media/3oKIPhC42hSZDi5a6c/giphy.gif",
            "https://media.giphy.com/media/3oeSAI1L189vhKVbeU/giphy.gif",
            "https://media.giphy.com/media/l1ugkrDujMGWAlSGA/giphy.gif",
            "https://media.giphy.com/media/3oeSAOpVMuv4xUsxHi/giphy.gif"

        ]


        if (messageText && /^\/sail.*/.test(messageText)) {
            isAdmin(message.user_id, sailWithoutHim)
            return null;
        }

        if (messageText && /shut your mouth/.test(messageText)) {
            return "Hey, I got an idea. Why don't you just kiss my left nut?"
        }

        if (messageText == "/gif") {
            return gifs[Math.floor(Math.random() * gifs.length)];
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
