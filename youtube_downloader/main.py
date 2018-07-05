import youtube_dl
import sys

if len(sys.argv) < 3:
    sys.exit("must provide arg url")

command = sys.argv[1]
url = sys.argv[2]

def download():
    options = {
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
        'format':"140 "  
    }
    youtube = youtube_dl.YoutubeDL(options)
    youtube.download([url])

def list():
    print("listing...")
    options = {
        'listformats': "true"
    }   
    youtube = youtube_dl.YoutubeDL(options)
    youtube.download([url])

if command == "list":
    list()
else:
    download()
