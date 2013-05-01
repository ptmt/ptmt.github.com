---
layout: post
title: Вместо тысячи твитов
---
# {{ page.title }}

Запись с помощью `recordmydesktop`, потом конвертация с помощью `/usr/bin/ogv2avi`:

```
  #!/bin/bash
  # ogv to avi converting
  mencoder "$1" -ovc xvid -oac mp3lame -xvidencopts pass=1 -o "$2"
```

