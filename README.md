## Simple blog

a very simple blog for demonstration purposes.
you can view the app on [here](https://simple-blog.hesamr.top)

- CAUTION: this is hosted on a free service ([Render](render.com)) so it might take a while to load up (it spins down after periods of inactivity)

### Features

- Email verfication
- Forget password mechanesim
- Authentication with session cookies
- Database with postgresql (using Prisma)
- UI with react
- Rich Text Editor (with tiptap)

### Development

make sure you create `.env` file based on `.env.example`
then run `npm run prisma:deploy` to set migration on database
then you can start by `npm run dev`

### Build

run `npm run build` then you can run on production with `npm run start:prod`
