# ffmpeg converter

## clip&#46;py

### Description

The `clip.py` script can be used to read in a video file and a JSON file containing information to create clips.

### Prerequisites

1. [Python 3.5+](https://www.python.org/downloads/)
2. [ffmpeg](https://ffmpeg.org/download.html) installed and available via path

### Usage

#### Sample clips json file

```json
[
    {
        "name": "clip_1",
        "start": "00:03:35",
        "stop": "00:04:03"
    },
    {
        "name": "clip_2",
        "start": "01:59:19",
        "stop": "02:01:07"
    }
]
```

**Warning**: clip names must not contain spaces

#### Command

Change ```input.vid``` to your input video file and ```clips.json``` to your clips file.

```sh
python clip.py input.vid clips.json
```

**Warning**:  In the above command on windows, ```python``` may need to be changed to ```py```.
On linux, ```python``` may need to be changed to ```python3```
