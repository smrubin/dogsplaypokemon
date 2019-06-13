import time
import urllib3
import json
from sense_hat import SenseHat


send_rate_in_seconds = 1.0
sense_rate_in_seconds = 0.1
sense = SenseHat()
default_acceleration = dict([("x", 0.0), ("y", 0.0), ("z", 0.0)])
default_orientation = dict([("pitch", 0.0), ("roll", 0.0), ("yaw", 0.0)])

current_acceleration = default_acceleration
current_orientation = default_orientation


def run_it():
    start_time = time.time()
    while True:
        while time.time() - start_time < send_rate_in_seconds:
            sense_things()
            time.sleep(sense_rate_in_seconds)
        send_things()
        current_acceleration = default_acceleration
        current_orientation = default_orientation
        start_time = time.time()


def sense_things():
    o = sense_orientation()
    a = sense_acceleration()
    data = dict([("orientation", o), ("acceleration", a)])
    print(data)
    return data


def sense_orientation():
    current_orientation = sense.get_orientation()


def sense_acceleration():
    a = sense.get_accelerometer_raw()
    if a["x"] > current_accelerations["x"]:
        current_accelerations["x"] = a["x"]

    if a["y"] > current_accelerations["y"]:
        current_accelerations["y"] = a["y"]

    if a["z"] > current_accelerations["z"]:
        current_accelerations["z"] = a["z"]


def send_things():
    http = urllib3.PoolManager()
    data = get_request_body()
    response = http.request("POST",
                            "https://dogsplaypokemon.localtunnel.me",
                            body=json.dumps(data).encode("utf-8"),
                            headers={"Content-Type": "application/json"})
    code = response.status
    if code == 200 or code == 201:
        print("Success!: " + str(code))
    else:
        print("Fail!: " + str(code))

def get_request_body():
    return dict([("orientation", current_orientation), ("acceleration", current_acceleration)])


if __name__ == '__main__':
    run_it()

