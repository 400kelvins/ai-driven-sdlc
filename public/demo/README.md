# Demo recording

Put the final clip here as `demo.mp4`. The Demo slide plays it from the deck itself, with no
network needed.

- Format: MP4, H.264 video, AAC audio
- Length: under 3 minutes
- Size: aim for under 50 MB (Vercel and git handle this without Git LFS)

Compress a screen recording (e.g. `recording.mov`) to fit:

```sh
ffmpeg -i recording.mov -vf "scale=-2:1080,fps=30" -c:v libx264 -crf 28 -preset slow \
  -c:a aac -b:a 128k -movflags +faststart public/demo/demo.mp4
```

Trim to a section first with `-ss 00:01:20 -to 00:04:10` before `-vf`.

Until `demo.mp4` exists, the slide shows "Recording not added yet".
