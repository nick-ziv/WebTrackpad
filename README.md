# WebTrackpad
Control the host computer's mouse using a touchscreen device.

## Requirements
Python 3.7+ installed on the host computer.
Python libraries:
 - bottle
 - pynput

Client devices should have a touchscreen to be used properly.
## Usage
Run the python file `systemController.py` on the host computer.  Connect client devices through the network using the local IP and the port specified in the script (default is port 8080)

The touch screen should act as a track pad and enable you to move the mouse on the host computer.  A short, single tap acts as a click.  Use two fingers to scroll.  To click and drag, tap and hold until the screen changes color, then move your finger.

Only connect one client device at a time or you may have unexpected results.
