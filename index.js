var path = require('path');
module.exports = function (paths, args) {
	if (typeof args === 'string') {
		args = args.split(' ');
	}
	describe('jshint', function () {
		paths = paths || ['.'];
		paths.forEach(function (p) {
			it('should pass for ' + (p === '.' ? 'working directory' : p), function () {
				this.timeout && this.timeout(30000);
				var cwd = process.cwd();
				process.chdir(path.resolve(p));
				var jsHintCliPath = path.resolve(path.dirname(require.resolve('jshint')), 'cli.js');
				delete require.cache[jsHintCliPath];
				var jsHint = require(jsHintCliPath);
				var error = new Error('');
				error.message = '';
				error.stack = '';
				var options = {
					args: ['.'].concat(args || []),
					verbose: true,
					reporter: require('./reporter.js')(error)
				};
				jsHint.run(options);
				process.chdir(cwd);
				if (error.message) {
					throw error;
				}
			});
		});
	});
};
