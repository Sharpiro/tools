import glob
import os
from subprocess import call

workingDirectory = os.getcwd()
files = glob.glob(f"{workingDirectory}/input/*")
for inputFilePath in files:
    fileName = os.path.basename(inputFilePath)
    outputFilePath = f"{workingDirectory}/output/{fileName}"
    command = f"ffmpeg -i \"{inputFilePath}\" -aq 0 -vn \"{outputFilePath}"[:-4] + ".mp3\""
    print(f"converting '{fileName}''")
    print(command)
    call(command)
