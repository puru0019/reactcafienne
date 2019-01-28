var express = require('express');
var app = express();


var PORT = process.env.PORT || 5000;
app.use(express.static(__dirname + '/public'));
app.listen(PORT, function() {
		console.log("listening to port" + PORT);
});
