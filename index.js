'use strict';
var Alexa = require('alexa-sdk');
var https = require('https');




var APP_ID = "amzn1.ask.skill.26f6d9e9-a0c4-4c56-98ca-2f78821aae9a"; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'My Dictionary';



exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Introduce');
    },
    'GetDefinitionIntent': function () {
        this.emit('GetDefinition');
    },
    'Introduce': function(){
        this.emit(':ask', "Welcome to my dictionary, what definition would you like");
        // this.emit(':ask', "How can I help you?")
    },
    'GetDefinition': function () {
        var word = this.event.request.intent.slots.word.value;
        httpsGet(word, (myResult) => {
            var speechOutput = "The definition for " + word + " is " + myResult;
            this.emit(':tell', speechOutput);
        })

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can give me a word to define or say exit..";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'SayGoodbyeIntent': function(){
        this.emit(':tell', 'Goodbye!')
    },
    'Unhandled': function(){
        var speechOutput = "You can give me a starting currency with or without an amount and an ending currency or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
};


function httpsGet(word, callback){
    var options = {
        headers: {
          "Accept": "application/json",
          "app_id": "0740b1bb",
          "app_key": "bf44f2db47bf9647ede0d028eae400f5"
        },
        host: 'od-api.oxforddictionaries.com',
        port: 443,
        path: "/api/v1/entries/en/" + word,
        method: 'GET',
    };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            var pop = JSON.parse(returnData);
            console.log(pop);
            var definition = pop.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
            // console.log(pop.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
            callback(definition);
        });
    });
    req.end();
}
