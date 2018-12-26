import sys
import youtube_dl

if len(sys.argv) < 3:
    sys.exit("must provide arg url")

command = sys.argv[1]
url = sys.argv[2]

# proxy = "http://localhost:8888"
# proxy = "http://localhost:5000"
proxy = ""


def audio():
    options = {
        'proxy': proxy,
        'nocheckcertificate': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
        'format': "251 "
    }
    youtube = youtube_dl.YoutubeDL(options)
    youtube.download([url])


def video():
    options = {
        'proxy': proxy,
        'nocheckcertificate': True,
    }
    youtube = youtube_dl.YoutubeDL(options)
    youtube.download([url])


def list():
    print("listing...")
    options = {
        'proxy': proxy,
        'nocheckcertificate': True,
        'listformats': "true"
    }
    youtube = youtube_dl.YoutubeDL(options)
    youtube.download([url])


if command == "list":
    list()
elif command == "audio":
    audio()
elif command == "video":
    video()
else:
    print("invalid command")
