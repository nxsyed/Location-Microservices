export default (request) => { 
    const kvstore = require('kvstore');
    const xhr = require('xhr');
    const pubnub = require('pubnub');
    
    const message = JSON.parse(request.message);
    
    console.log(message);
    
    kvstore.getItem(message[1]).then((value) => {
    var location = JSON.parse(value);
    
    var distanceDelta = distance(message[2], message[3], location.lat, location.long, "K");
    pubnub.publish({
                "message":{
                    "ID": message[1],
                    "distance": distanceDelta
                }, 
                "channel": `${message[0]}-distance`
            }).then();
    })
        
    
    return request.ok(); // Return a promise when you're done 
   
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
	    console.log(lat1, lon1, lat2, lon2);
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}