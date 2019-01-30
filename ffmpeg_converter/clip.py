from subprocess import call
from pathlib import Path
import json


def get_seconds(timestamp):
    split = timestamp.split(":")
    hours = int(split[0]) * 60 * 60
    minutes = int(split[1]) * 60
    seconds = int(split[2])
    return hours + minutes + seconds


file = Path("clips.json").read_text()
clips = json.loads(file)
for clip in clips:
    start_seconds = get_seconds(clip["start"])
    stop_seconds = get_seconds(clip["stop"])
    duration_seconds = stop_seconds - start_seconds
    clipName = clip["name"]
    print(clipName, duration_seconds)
    command = f"ffmpeg -ss {start_seconds} -i original.mp4 -t {duration_seconds} -y {clipName}.mp4".split(" ") #54 seconds
    print(command)
    print()
    # call(command)


# ffmpeg -i input.mp4 -ss 00:00:00.0 -t 00:00:10.0 -y -vf fade=in:0:60,fade=out:240:30 -af afade=in:st=0:d=1,afade=out:st=5:d=5 slide_fade_in.mp4
# command = "ffmpeg -i original.mp4 -ss 00:00:00.0 -t 00:00:10.0 -y -vf fade=in:0:60,fade=out:240:30 -af afade=in:st=0:d=1,afade=out:st=5:d=5 output.mp4".split(" ")
# command = "ffmpeg -i original.mp4 -ss 50 -t 10 -y -vf fade=in:0:60,fade=out:240:30 -af afade=in:st=0:d=1,afade=out:st=5:d=5 output.mp4".split(" ")
