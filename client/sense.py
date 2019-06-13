import time
import urllib3
import json
from sense_hat import SenseHat


def run_it():
    start_time = time.time()
    while True:
        send_things(sense_things())
        time.sleep(1.0 - ((time.time() - start_time) % 1.0))


def sense_things():
    sense = SenseHat()
    o = sense.get_orientation()
    a = sense.get_accelerometer_raw()
    data = dict([("orientation", o), ("acceleration", a)])
    print(data)
    return data


def send_things(data):
    http = urllib3.PoolManager()
    response = http.request("POST",
                            "https://dogsplaypokemon.localtunnel.me",
                            body=json.dumps(data).encode("utf-8"),
                            headers={"Content-Type": "application/json"})
    code = response.status
    if code == 200 or code == 201:
        print("Success!: " + str(code))
    else:
        print("Fail!: " + str(code))


if __name__ == '__main__':
    run_it()

