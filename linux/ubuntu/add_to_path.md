# Adding environment variables for all users and root user

## Add to path for all users
Open `/etc/environment` and add new directory to ```PATH```:

```
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/opt/node-v10.13.0-linux-x
64/bin"
```

## Allow new directory to be used by super users
Open `/etc/sudoers` and add new directory to ```secure_path```:
```
secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/opt/node-v10.13.0-li
nux-x64/bin"
```