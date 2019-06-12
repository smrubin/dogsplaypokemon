# Windows Virtual Keystroke Example: https://gist.githubusercontent.com/chriskiehl/2906125/raw/77d8b333f7910e1cdc6e7e1be454f6d6d26103fa/Vitual%2520keystroke%2520example

import win32api
import win32con
import win32ui
import time,sys

keyDelay = 0.05
keymap = {
    "w": ord("W"), # up d-pad
    "a": ord("A"), # left d-pad
    "s": ord("S"), # down d-pad
    "d": ord("D"), # right d-pad
    "z": ord("Z"), # A button
    "x": ord("X"), # B button
    "M": ord("M"), # start
    "n": ord("N"), # select
    "l": ord("L"), # L bumper (only for GBA)
    "p": ord("P") # R bumper (only for GBA)
}

def press(*args):
    '''
    one press, one release.
    accepts as many arguments as you want. e.g. press('w', 'a', 'b').
    '''
    for i in args:
        win32api.keybd_event(keymap[i], 0, 0, 0)
        time.sleep(.05)
        win32api.keybd_event(keymap[i], 0 , win32con.KEYEVENTF_KEYUP , 0)

if __name__ == "__main__":
    win = win32ui.FindWindow(None, 'Pokemon - Red Version (USA, Europe) (SGB Enhanced) - VisualBoyAdvance-M 2.1.3')
    win.SetForegroundWindow()
    win.SetFocus()
    press(sys.argv[1])
