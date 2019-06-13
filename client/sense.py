import urllib3
from sense_hat import SenseHat
from urllib3.exceptions import NewConnectionError


def run_it():
    send_things(sense_things())


def sense_things():
    # while True:
        sense = SenseHat()
        o = sense.get_orientation()
        pitch = o["pitch"]
        roll = o["roll"]
        yaw = o["yaw"]
        print("pitch {0} roll {1} yaw {2}".format(pitch, roll, yaw))
        return o


def send_things(data):
    req = urllib3.Request("https://dogsplaypokemon.localtunnel.me")
    req.add_header("Content-Type", "application/json")
    try:
        response = urllib3.urlopen(req, data)
        print("Success!: " + response)
    except NewConnectionError as ex:
        print("Fail!: " + ex.message)


if __name__ == '__main__':
    run_it()

