// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

var https = require('https')
var http = require('http')

var word = "computer";

httpsGet(word);

function httpsGet(word){

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
            console.log(pop.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
            // console.log(returnData);
        });
    });
    req.end();
}
