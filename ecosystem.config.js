module.exports = {
	apps: [
		{
			name: "chat",
			script: "./src/server/index.js",
			watch: true,
			env: {
				"PORT": 80,
				"NODE_ENV": "dev",
			},
			env_prod: {
				"PORT": 8003,
				"NODE_ENV": "prod"
			}
		}
	]
}