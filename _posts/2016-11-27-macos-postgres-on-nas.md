---
layout: post
title: "Setting up Postgres on NAS"
excerpt: for MacOS using Autofs
tags: [postgres, macos, nas, wd]
comments: true
---

Network storages are really handy. Much more disk space,
RAID-0, fast and reliable shared storage which is available across family. 
They have decent small CPUs, 1Ghz in my case, on the board, you can manage the time table when storage is enabled and have nice mobile apps. I wish I had NAS before.

I bought one from Western Digital (MyCloud EX2Ultra to be specific), and
one of the main reason for that is being able to work with a huge database.
In my current case, it's Postgres, which runs on my Mac with 256GB, so any database larger than XX Gb is large enough to worry about. You can solve this problem with cloud, but what about 2TB database?

My first attempt was about mount drive manually and create the database there:

```
mount -t smbfs smb://MyCloudEX2Ultra/Public/db db
initdb --debug -D nas/db/postgres
```

It didn't work. One couldn't make symlinks on remote drive by default:

```
could not link file "pg_xlog/xlogtemp.71138" to "pg_xlog/000000010000000000000001": Operation not supported
```

After rebooting in safe mode (Cmd+R) I run:

```
csrutil disable
reboot
```

That needed because by default Mac has System Integrity Protection and it won't allow editing system files. You can disable that:

```
sudo nano /System/Library/LaunchDaemons/com.apple.smbd.plist
<key>ProgramArguments</key>
<array>
     <string>/usr/sbin/smbd</string>
     <string>--no-symlinks</string>
     <string>false</string>
</array>
```

But eventually, I still had some errors with symlinks while creating Postgres database.

I choose easier way, by storing logs locally.

```
initdb -D nas/db/postgres -X db_wal
```

And that worked. Now I could run postgres like
```
pg_ctl -D ~/nas/db/postgres start &
```

### Auto mounting

After successfully creating db on the remote shared disk all I needed is setting up automounting directory on the system startup using `autofs`.

It requires editing two files. **First, is /etc/auto_master**

```
sudo nano /etc/auto_master

#
# Automounter master map
#
+auto_master		# Use directory service
/net			-hosts		-nobrowse,hidefromfinder,nosuid
/home			auto_home	-nobrowse,hidefromfinder
/Network/Servers	-fstab
/-			-static
/Users/potomushto/nas		auto_nas
```

And **the second is newly created `auto_db`:**:

```
sudo nano /etc/auto_nas

db -fstype=smbfs ://login:password@MyCloudEX2Ultra/Public/db
```

Finally, run `sudo automount -vc` and got it worked. 

Now I always got `nas` folder mounted automatically.
