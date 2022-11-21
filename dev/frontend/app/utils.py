from flask import abort
from requests import get

# get data from url used to multiprocessing
def get_request_data(url, cookies):
    resp = get(
        url,
        cookies=cookies,
    )
    data = resp.json()
    
    if data.get('status') == False:
        abort(404)

    data = data.get("data")
    resp.close()
    return data