# ffmpeg

```bash
# clip a 10 minute video starting at the 30 minute mark
# timestamp format: HH:MM:SS.xxx 
ffmpeg -i "input.mp4" -ss 00:30:00.0 -t 00:10:00.0 "output.mp4"
```