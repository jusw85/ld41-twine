# Ludum Dare 41 - Theme: Combine two incompatible genres
Ludum Dare 41 in Twine

Title: Four Hours in Chernobyl

https://ldjam.com/events/ludum-dare/41/four-hours-in-chernobyl

## Build notes

Download and update twee2

Edit twee2 path as required
```
git clone https://github.com/Dan-Q/twee2
cd twee2
gem build
gem install twee2-0.5.0.gem
wget https://github.com/klembot/twinejs/archive/2.3.5.zip
unzip -p 2.3.5.zip "twinejs-2.3.5/story-formats/sugarcube-2.30.0/format.js" > ~/.gem/ruby/2.7.0/gems/twee2-0.5.0/storyFormats/SugarCube2/format.js
```

Make
```
make
```

Host locally using http-server
```
npm -g install http-server
hs -p 8081 -c-1
```
