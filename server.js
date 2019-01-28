var express = require('express');
var app = express();


var PORT = process.env.PORT || 9000;
console.log(__dirname,"dir name");
app.use(express.static(__dirname + '/dist'));

app.listen(PORT, function() {
		console.log("listening to port" + PORT);
});
