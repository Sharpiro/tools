# ffmpeg commands

## basic
``` 
ffmpeg -i input.abc output.123
```

## audio
### itunes mp3
```
ffmpeg -i input.mp3 -aq 0 -vn output.mp3
ffmpeg -i input.mp3 -b:a 128 -vn output.mp3	-b:a 128=audio bitrate
```

## plyback speed
```
ffmpeg -i videoplayback.m4a -af "atempo=1.5" -vn videoplayback-fast.mp3
```

## flags
| flag          | usage             | description           
| ------------- |------------------ |-------------
| -aq           | -aq               | audio quality(lower better, fixes common iTunes length bug)
| -vn           | -vn               | disable video(fixes 'invalid pixel' bug even on some audio files in rare cases)
| -s            | -s 640x480        | resolution	  
| -af           | -af "atempo=1.5"  | audio format for changing playback speed	  