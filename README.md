This project is under active development.

## Todo

### Pages
- [x] `/auth/signin`
- [x] `/auth/signup`
- [ ] `/auth/reset-password`
- [ ] `/doc/:docId`
- [ ] `/folder/:folderId`
- [ ] `/share/:shareId`
- [ ] `/search`
- [ ] `/favorites`
- [ ] `/shares`
- [ ] `/trash`
- [ ] `/settings`
- [ ] `/help`
- [x] `404`

### Layouts
- [x] `AppLayout`
- [x] `AuthLayout`

### Components
- [x] `FormikField` : Input fields used in `auth` pages.
- [x] `FormikPasswordField`
- [ ] `Sidebar` : Sidebar for authenticated users
- [ ] `Checkbox`
- [ ] `ContentHeader` : Header at the top of `Folder` and `Document` pages
- [ ] `Breadcrum`
- [ ] `Button` (*unfinished : styles for theme "secondary" missing*)
- [ ] `AddNewButton` : Header button to quickly add folders or documents
- [ ] `ShareDocButton` : Header button to share a document
- [ ] `MoreOptionsButton` : `⋮` Button opening a popover

### Authentication
- [ ] Client side redirects
- [ ] Up to date user data, check if the user still exists in the database,...

### Styles
- [ ] Change auth routes styles (make everything smaller)

### Editor
- [ ] Undo/Redo