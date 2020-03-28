all: main

main: main.tw2
	mkdir -p web
	cp -rf css web
	cp -rf js web

	twee2 build main.tw2 web/index.html

	# cp main.tw2 tmp_main.tw2
	# echo -e "\n::StoryCSS [stylesheet]\n" >> tmp_main.tw2
	# cat css/main.css >> tmp_main.tw2
	# echo -e "\n::StoryJS [script]\n" >> tmp_main.tw2
	# cat js/main.js >> tmp_main.tw2
	# twee2 build tmp_main.tw2 web/index.html
	# rm tmp_main.tw2

	## used for testing with local webserver
	cp web/index.html index.html

	## Package for upload
	# rm -f web.zip
	# zip -r web web

clean:
	rm -rf web
	rm index.html
