from glob import glob
import os
import sys
from subprocess import call

# print(sys.argv)
workingDirectory = os.getcwd()
files = glob(f"{workingDirectory}/*.aac")
files = files + glob(f"{workingDirectory}/*.m4a")
files = files + glob(f"{workingDirectory}/*.wmv")
if not files:
    sys.exit("no audio files to convert")

print(f"do you want to convert {len(files)} files in {workingDirectory}? (y/n)")
res = input()
if res != "y":
    sys.exit("user exited")
for inputFilePath in files:
    fileName = os.path.basename(inputFilePath)
    outputFilePath = f"{workingDirectory}/{fileName}"
    command = f"ffmpeg -i \"{inputFilePath}\" -aq 0 -vn \"{outputFilePath}"[:-4] + ".mp3\""
    print(f"converting '{fileName}''")
    print(command)
    call(command)
