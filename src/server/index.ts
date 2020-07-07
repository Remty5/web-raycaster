import http from 'http';
import fs from 'fs';

const port = 8080;

http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse) {
	let urlPath = req.url?.slice(1);
	let realPath;

	//* Path conversion and checking
	if (!urlPath) {
		// Default is index.html
		realPath = 'index.html';
	} else if (urlPath.includes('..')) {
		// Don't go up the tree >:3
		realPath = '404.html';
	} else {
		// The rest
		realPath = urlPath;
	}

	//* Does requested file exist?
	// Init status for 404 handling
	let status;

	try {
		// Check if file exists & is readable
		fs.accessSync(`dist/app/${realPath}`, fs.constants.F_OK & fs.constants.R_OK);
	} catch (error) {
		// Return 404 and 404 page
		// Used in next try..catch block
		// console.error(error);
		status = 404;
		realPath = '404.html';
	}

	//* Init type and data
	// Type is 'text/plain' if no extension is found
	let type = 'text/plain';
	let data;

	//* Try reading file
	try {
		data = fs.readFileSync(`dist/app/${realPath}`);
		// File read, give OK status if file existed last try..catch block
		status = status || 200;
		// Parse file extension
		let index = realPath.indexOf('.');
		if (index > -1) {
			// File extension found, parse and set mime type accordingly
			let extension = realPath.slice(index + 1);
			switch (extension) {
				case 'html':
					type = 'text/html';
					break;
				case 'js':
					type = 'application/javascript';
					break;
				case 'css':
					type = 'text/css';
					break;
				case 'json':
					type = 'application/json';
					break;
				case 'ico':
					type = 'image/vnd.microsoft.icon';
					break;
				default:
					type = 'text/plain';
					break;
			}
		}
	} catch (error) {
		// Reading file encountered an error, what the heck
		console.error(error);
		status = 503;
	}
	res.writeHead(status, { 'Content-Type': type });
	res.write(data || 'What the fuck happened?');
	res.end();
	// res.end(`You are here: ${urlPath}, ${realPath}`);
}).listen(port);

console.log(`Web server started at http://localhost:${port}`);
