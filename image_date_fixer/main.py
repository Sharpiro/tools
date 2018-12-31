import sys
from subprocess import Popen, PIPE, call
from glob import glob

fileTypes = ["*.jpg", "*.png"]
files = []
for x in fileTypes:
    files = files + glob(x)

print(files)

for file in files:
    print(file)
    getCommand = f"C:\\Users\\sharpiro\\Desktop\\temp\\python_image_testing\\exiftool.exe {file}"
    pOpen = Popen(getCommand, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = pOpen.communicate()
    rc = pOpen.returncode
    temp = output.decode()
    # print(temp)
    firstList = temp.split("\r\n")[:-1]
    test = dict([[innerItem.replace(" ", "")
                  for innerItem in item.split(":", 1)] for item in firstList])

    if err or not output:
        sys.exit(f"code '{rc}': {err}")

    fileType = test.get("FileType")
    modifiedDate = test.get("FileModificationDate/Time")

    if fileType == "JPEG":
        if test.get("CreateDate"):
            print("has creation date!")
        else:
            print("no date!")
            updateCommand = f"C:\\Users\\sharpiro\\Desktop\\temp\\python_image_testing\\exiftool.exe -createdate={modifiedDate} {file}"
            call(updateCommand)
    elif fileType == "PNG":
        if test.get("CreationTime"):
            print("has creation date!")
        else:
            print("no date!")
            updateCommand = f"C:\\Users\\sharpiro\\Desktop\\temp\\python_image_testing\\exiftool.exe -creationtime={modifiedDate} {file}"
            call(updateCommand)
