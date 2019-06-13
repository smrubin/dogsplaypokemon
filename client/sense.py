
import time
import datetime
import urllib3
import json
from sense_hat import SenseHat


send_rate_in_seconds = 0.5
# sense_rate_in_seconds = 0.1
sense = SenseHat()
default_acceleration = dict([("x", 0.0), ("y", 0.0), ("z", 0.0)])
default_orientation = dict([("pitch", 0.0), ("roll", 0.0), ("yaw", 0.0)])

current_acceleration = default_acceleration.copy()
current_orientation = default_orientation.copy()


def run_it():
    start_time = time.time()
    while True:
        while time.time() - start_time < send_rate_in_seconds:
            sense_things()
        send_things()
        global current_acceleration
        global current_orientation
        global default_acceleration
        global default_orientation
        current_acceleration = default_acceleration.copy()
        current_orientation = default_orientation.copy()
        start_time = time.time()


def sense_things():
    sense_orientation()
    sense_acceleration()
    print(get_request_body())


def sense_orientation():
    global current_orientation
    current_orientation = sense.get_orientation()


def sense_acceleration():
    a = sense.get_accelerometer_raw()
    global current_acceleration
    if a["x"] > current_acceleration["x"]:
        current_acceleration["x"] = a["x"]

    if a["y"] > current_acceleration["y"]:
        current_acceleration["y"] = a["y"]

    if a["z"] > current_acceleration["z"]:
        current_acceleration["z"] = a["z"]


def send_things():
    http = urllib3.PoolManager()
    data = get_request_body()
    print("Sending at " + str(datetime.datetime.now()))
    response = http.request("POST",
                            "https://dogsplaypokemon.localtunnel.me",
                            body=json.dumps(data).encode("utf-8"),
                            headers={"Content-Type": "application/json"})
    print("Received at " + str(datetime.datetime.now()))
    code = response.status
    if code == 200 or code == 201:
        print("Success!: " + str(code))
    else:
        print("Fail!: " + str(code))


def get_request_body():
    return dict([("orientation", current_orientation), ("acceleration", current_acceleration)])


if __name__ == '__main__':
    run_it()

