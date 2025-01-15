# SAFA Announcement Scheduler

## Inspiration

As the Event Coordinator for SAFA (Student Association of Filipino Americans), I observed that me and my fellow e-board members would often have to schedule posts either by mentally remembering or writing it down on a to-do list. This was the inspiration for this project.

I wanted to streamline this process by creating a tool that would schedule Discord announcements via an accessible web dashboard.

Please feel free to pick up any issues.

> Note: The web dashboard is purposely password locked to prohibit the public from scheduling announcements

## System architecture
![Screenshot 2025-01-13 at 11 04 33 PM](https://github.com/user-attachments/assets/84c72c21-d924-4429-8911-d9383774441f)

### Technologies Used
1. NextJS 15 (and it's respective technologies i.e. React, Tailwind)
2. NextJS App Router
3. AWS Lambda
4. AWS EventBridge Scheduler
5. AWS S3

## Running this app

> Note: I use [`pnpm`](https://pnpm.io/installation) for my package manager to save disk space on my computer, please use it when working with this project.

The `frontend` directory is just a NextJS 15 application. As such:

1. `cd frontend`
2. `pnpm install`
3. `pnpm run dev`

Make sure to also use the necessary environment variables and store them in a `.env.local` file in the root  of the `frontend` directory. DM me on Discord for the env vars.
