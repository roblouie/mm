var http = require("http"),
fs = require('fs'),
url = require('url');
	http.createServer(function (request, response) {
		var url_parts = url.parse(request.url, true);
		var queryObject = url_parts.query;
		switch(url_parts.pathname) {
			case '/':
				show_login(response);
				break;
			case '/map':
				show_map(response);
				break;
			case '/createuser':
				break;
			case '/getlocations':
				console.log('Receiving request...');
				var callback = function(err, result) {
					response.writeHead(200, {
						'Content-Type' : 'x-application/json'
					});
					console.log('json', result);
					response.end(result);
				};
				getSQL(callback, 'SELECT * FROM user_location WHERE user_id = ' + queryObject.userid);
				break;
			case '/savelocation':
				console.log('Receiving request...');
				var callback = function(err, result) {
					response.writeHead(200, {
						'Content-Type' : 'x-application/json'
					});
					console.log('json', result);
					response.end(result);
				};
				var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
				
				getSQL(callback, "INSERT INTO user_location (`latitude`, `longitude`, `time_stamp`, `user_id`) VALUES (" + queryObject.lat + ", " + queryObject.lon + ", '" + date + "', " + queryObject.id +")");
				break;
			case '/getid':
				console.log('Receiving request...');
				var callback = function(err, result) {
					response.writeHead(200, {
						'Content-Type' : 'x-application/json'
					});
					console.log('json', result);
					response.end(result);
				};
				getSQL(callback, "SELECT id FROM users WHERE username = '"+ queryObject.username + "'" );
				break;
			default:
				show_login(response);
		}

		function show_login(response) {
			fs.readFile('views/SamplePage.html', function (err, html) {
				if (err) {
				throw err;
				}
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(html);
			response.end();
			});
		}
		
		function show_map(response) {
			fs.readFile('views/SamplePage1.html', function (err, html) {
				if (err) {
				throw err;
				}
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(html);
			response.end();
			});
		}
		function getSQL(callback, query) {
			var pg = require('pg');
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    		client.query(query, function(err, result) {
      			done();
      			if (err)
       			{ callback(err, null ); }
      			else
       			{ callback(null, JSON.stringify(result.rows) ); }
    	});
  });
		}
	}).listen(process.env.PORT || 8080);
console.log("Server running at http://127.0.0.1:8081/");
