from subprocess import call
from pathlib import Path
import json
import sys


def get_seconds(timestamp):
    split = timestamp.split(":")
    hours = int(split[0]) * 60 * 60
    minutes = int(split[1]) * 60
    seconds = int(split[2])
    return hours + minutes + seconds


def validate_clips(clips):
    for clip in clips:
        if clip["name"] == "":
            raise EnvironmentError("invalid json, 'name' was empty")
        if clip["start"] == "":
            raise EnvironmentError("invalid json, 'start' was empty")
        if clip["stop"] == "":
            raise EnvironmentError("invalid json, 'stop' was empty")
        get_seconds(clip["start"])
        get_seconds(clip["stop"])


print(sys.argv)
if len(sys.argv) < 3:
    sys.exit("error: not enoughg args, ex: clip input.mp4 clips.json")

video_file_name = sys.argv[1]
print(video_file_name)
clips_file_name = sys.argv[2]
print(clips_file_name)

file = Path(clips_file_name).read_text()
clips = json.loads(file)
validate_clips(clips)
for clip in clips:
    start_seconds = get_seconds(clip["start"])
    stop_seconds = get_seconds(clip["stop"])
    duration_seconds = stop_seconds - start_seconds
    video_fade_out_start_frames = (duration_seconds - 3) * 30
    audio_fade_out_start_seconds = (duration_seconds - 3)
    fade_duration_frames = 3 * 30
    clipName = clip["name"]
    print(clipName, ":", duration_seconds, "seconds")
    command = f"ffmpeg -ss {start_seconds} -i {video_file_name} -t {duration_seconds} -y -vf fade=in:0:{fade_duration_frames},fade=out:{video_fade_out_start_frames}:{fade_duration_frames} -af afade=in:st=0:d=3,afade=out:st={audio_fade_out_start_seconds}:d=3 {clipName}.mp4".split(" ")
    print(command)
    print()
    call(command)
