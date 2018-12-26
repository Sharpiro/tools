from glob import glob
import sys
from subprocess import call

print("enter input file pattern. E.g. *.mp3;*.avi")
res = input()

# res = "*avi;*.wmv"
fileTypes = res.split(";")
files = []
for x in fileTypes:
    files = files + glob(x)

print("enter output file extension. E.g. .mp3")
outputFileExtension = input()

print(
    f"do you want to convert {len(files)} files? (y/n)")
print(files)
res = input()
if res != "y":
    sys.exit("user exited")
for inputFilePath in files:
    command = f"ffmpeg -i {inputFilePath} {inputFilePath[:-4] + outputFileExtension}"
    print(f"converting '{inputFilePath}''")
    print(command)
    call(command)
