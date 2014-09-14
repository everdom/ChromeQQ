seajs.config({
	base: "./",	
	alias:{
		"defaultConfig":"config/default.config.js"
	}
});

seajs.use("./main", function(main){
	main.launch();
});

