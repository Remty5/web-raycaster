import * as http from 'http';
import * as fs from 'fs';

const port = 8080;

http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse) {
	let urlPath = req.url?.slice(1);
	let realPath;

	//* Path conversion and checking
	if (!urlPath) {
		// Default is index.html
		realPath = 'html/index.html';
	} else if (urlPath.includes('..')) {
		// Don't go up the tree >:3
		realPath = 'html/404.html';
	} else if (urlPath.startsWith('js/') || urlPath.startsWith('css/')) {
		// Javascript & CSS resources
		realPath = urlPath;
	} else {
		// Others
		realPath = `html/${urlPath}`;
	}

	//* Init status and type
	let status;
	let type;

	//* Does requested file exist?
	try {
		// Check if file exists & is readable
		fs.accessSync(`dist/app/${realPath}`, fs.constants.F_OK & fs.constants.R_OK);
	} catch (error) {
		// Return 404 and 404 page
		// console.error(error);
		status = 404;
		realPath = 'html/404.html';
	}

	let data;

	try {
		data = fs.readFileSync(`dist/app/${realPath}`);
		status = status || 200;
		console.log(realPath);
		let index = realPath.indexOf('.');
		console.log(index);
		if (index === -1) {
			type = 'text/html';
		} else {
			let extension = realPath.slice(index + 1);
			console.log(extension);
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
				default:
					type = 'text/plain';
					break;
			}
		}
	} catch (error) {
		console.error(error);
		status = 503;
	}
	res.writeHead(status, { 'Content-Type': type });
	res.write(data || 'What the fuck happened?');
	res.end();
	// res.end(`You are here: ${urlPath}, ${realPath}`);
}).listen(port);
