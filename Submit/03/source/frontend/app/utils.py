from flask import abort
from requests import get

# get data from url used to multiprocessing


def get_request_data(url, cookies):
    resp = get(
        url,
        cookies=cookies,
    )
    if resp.status_code != 200:
        abort(resp.status_code)
    try:
        data = resp.json()
    except:
        abort(500)

    if data.get("status") != True:
        abort(404)

    data = data.get("data")
    resp.close()
    return data
