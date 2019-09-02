from pathlib import Path
import shutil

iphone_directory = Path(
    "/run/user/1000/gvfs/gphoto2:host=Apple_Inc._iPhone_2e5a7a973f3ed78e2a02efcb648e905fb060f78f/DCIM")
iphone_files = list(i for i in iphone_directory.glob("**/*") if i.is_file())

destination_directory = Path("/home/sharpiro/Dropbox/pictures/camera_roll")
destination_files = list(i for i in destination_directory.glob("*") if i.is_file())
destination_file_names = list(i.name.lower() for i in destination_files)


print("iphone:", len(iphone_files))
print("destination:", len(destination_files))
destination_dict = dict(zip(destination_file_names, destination_files))

files_copied = 0
for iphone_file in iphone_files:
    if destination_dict.get(iphone_file.name.lower()) == None:
        new_file_path = f"/home/sharpiro/Dropbox/pictures/camera_roll/{iphone_file.name}"
        shutil.copy(iphone_file.absolute(), new_file_path)
        files_copied += 1

print("files copied:", files_copied)
