var express = require('express');
const path = require('path');
var app = express();


var PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, function() {
		console.log("listening to port" + PORT);
});
