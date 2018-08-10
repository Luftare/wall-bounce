## Host locally for dev

cd edit-levels &&
npm install &&
node .

### Editor:
localhost:9999

### Game:
localhost:9999/game

### Python 2 (game only):
python -m SimpleHTTPServer 8888

### Python 3 (game only):
py -m http.server 8888

## TODO:
* Orc image
* Recreate levels with new editor
* Add image entity type that does not collide with anything
* Round collision box type
* Editor displays images of entities
* Add sound effects and background music
* Render owned items
* Items can be equipped and unequipped
* Allies that can be bounced to move
* Create lobby where map can be selected
* Create boots item that allow making new move while moving
# Create sword item that makes hero not bounce from slain enemies
* Create bow item that allows shooting
