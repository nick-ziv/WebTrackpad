# 
# Nicholas Zivkovic
# Feb 10, 2021
# 
# Web Trackpad Server

import bottle
import threading
import json
from pynput.mouse import Button, Controller
import time
import datetime



def webServerThread(port, mouse):
    print('Starting server')
    app = bottle.Bottle()

    @app.route('/style.css')
    def retStyle():
        return bottle.static_file('style.css', root='./')

    @app.route('/script.js')
    def retStyleBS():
        return bottle.static_file('script.js', root='./')

    @app.route('/')
    def retIndex():
        return bottle.static_file('index.html', root='./')

    @app.post('/api')
    def apiFunc():
        output = {'error': '', 'data': {'request': {}}}
        reqAction = bottle.request.forms.get('action')
        if reqAction == 'newpos':
            datax = float(bottle.request.forms.get('datax'))
            datay = float(bottle.request.forms.get('datay'))
            scroll = bottle.request.forms.get('scroll') == 'true'
            if scroll:
                mouse.scroll(0, datay/3)
            else:
                mouse.move(datax, datay)
        elif reqAction == 'lclick':
            mouse.press(Button.left)
            mouse.release(Button.left)
        elif reqAction == 'hlclick':
            mouse.press(Button.left)
        elif reqAction == 'nhlclick':
            mouse.release(Button.left)


        return json.dumps(output)

    bottle.run(app, host='0.0.0.0', port=port, quiet=True)

if __name__ == '__main__':
    mouse = Controller()
    print('System starting')
    t = threading.Thread(target=webServerThread, args=(8080, mouse))
    t.start()
    while True:
        time.sleep(1)
