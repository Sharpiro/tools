import sys
import youtube_dl

help_string = """
syntax: <command> <url>
ex: list https://www.youtube.com/watch?v=C0DPdy98e4c

commands:
list <url>
audio <url>
download <url> <formatValue>
"""

if len(sys.argv) < 3:
    sys.exit(help_string)

command = sys.argv[1]
url = sys.argv[2]

if len(sys.argv) >= 4:
    formatValue = sys.argv[3]

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
        'format': "251"
    }
    youtube = youtube_dl.YoutubeDL(options)
    youtube.download([url])


def download():
    options = {
        'proxy': proxy,
        'nocheckcertificate': True,
        'format': formatValue
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
elif command == "download":
    download()
else:
    print("invalid command")
