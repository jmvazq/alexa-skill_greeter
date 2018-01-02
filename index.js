const helpText = "You can say: \"Fist bump Felix\", \"Say hi to Amanda\", \"Say hello to Joseph\", or \"Greet Lincey\", and I will do my job.";
const compliments = [
    "You're looking good today. I like it.",
    "My, you're glowing today!",
    "Have a good time today!",
    "ROCKIN' it, aren't you?!",
    "The Heart of the Party has arrived!"
];

function getRandomCompliment() {
    var i = Math.floor((Math.random() * (compliments.length - 1)));
    return compliments[i];
}

exports.handler = (event, context, callback) => {
    var request = event.request;
    try {
        if(request.type === "LaunchRequest") {
            handleLaunchRequest(context);
            
        } else if(request.type === "IntentRequest") {
            if (request.intent.name === "HelloIntent") {
                handleHelloIntent(request, context);
            } 
            if (request.intent.name === "GoodbyeIntent") {
                handleGoodbyeIntent(request, context);
            } else if (request.intent.name === "AMAZON.StopIntent") {
                handleSessionEndedRequest(context);
            } else if (request.intent.name === "AMAZON.HelpIntent") {
                handleHelpRequest(context);
            } else {
                context.fail("Unknown intent");
            }

        } else if (request.type === "SessionEndedRequest") {
            handleSessionEndedRequest(context);
        } else {
            context.fail("Unknown request");
        }
    } catch(e) {
        context.fail("Exception thrown: " + e);
    }
};

function handleLaunchRequest(context) {
    var options = {};

    options.speechText = "Hi! This is Jessica, your causal, friendly host. I can greet or fist bump your awesome friends for you.";
    options.repromptText = "You can say: \"Fist bump Felix\", or \"Say hi to Amanda\", and I will do my job. Whom should I fist bump?"
    options.endSession = false;

    context.succeed(buildResponse(options));
}

function handleHelloIntent(request, context) {
    var options = {};
    var name = request.intent.slots.FirstName.value || "Stranger";
    var compliment = getRandomCompliment();
    
    options.speechText = `'Sup, ${name}! ${compliment}`;
    options.endSession = true;
    
    context.succeed(buildResponse(options));
}

function handleGoodbyeIntent(request, context) {
    var options = {};
    var name = request.intent.slots.FirstName.value || "Stranger";
    
    options.speechText = `Goodbye, ${name}! Hope you enjoyed your stay.`;
    options.endSession = true;
    
    context.succeed(buildResponse(options));
}

function handleSessionEndedRequest(context) {
    context.succeed(buildResponse({
        speechText: "Thank you guys for adding me to the party. Goodbye!",
        endSession: true
    }));
}

function handleHelpRequest(context) {
    context.succeed(buildResponse({
        speechText: helpText,
        endSession: true
    }));
}

function buildResponse(options) {
    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: options.speechText
            },
            shouldEndSession: options.endSession
        }
    }

    if (options.repromptText) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromptText
            },
        }
    }

    return response;
}
