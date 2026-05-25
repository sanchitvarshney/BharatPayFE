# BharatPayFE Project Documentation

## 1. Project Overview

BharatPayFE is a Vite-based React frontend for internal business operations. The application is structured around authenticated modules such as master data, procurement, warehouse inwarding, production, dispatch, reporting, queries, SOP files, CRM uploads, and transfer workflows.

The app is not a public marketing site. It is an operational dashboard with route-driven modules, Redux Toolkit slices for server state, reusable data-entry controls, AG Grid tables, file uploads/downloads, and real-time report/download status through Socket.IO.

## 2. Technology Stack

| Area | Libraries / Tools |
| --- | --- |
| Runtime | React 18, React DOM |
| Build tool | Vite 5 |
| Language | TypeScript |
| Routing | `react-router-dom` |
| State | Redux Toolkit, React Redux |
| API | Axios |
| Styling | Tailwind CSS, `tailwindcss-animate`, `tailwind-scrollbar` |
| Component systems | shadcn/Radix UI, MUI, Ant Design |
| Tables | AG Grid Community/Enterprise, TanStack Table, MUI Data Grid |
| Forms | React Hook Form, Zod, custom reusable controls |
| Dates | Day.js, date-fns, Moment, MUI date pickers, Ant DatePicker |
| Realtime | Socket.IO client |
| Auth integrations | Google OAuth, two-step OTP support |
| File handling | XLSX, upload utilities, file download helpers |
| Rich text | TipTap editor |
| Charts | Chart.js, Nivo line |

## 3. Repository Layout

```text
BharatPayFE/
  public/                    Static images, SVGs, brand and UI assets
  src/
    api/                     Shared Axios instance
    components/              UI, shared, reusable, drawer, form, table-adjacent components
    constants/               Constants used by workflows
    data/                    Menu and navigation data
    features/                Redux Toolkit slices and related types
    helper/                  Small helper functions
    hooks/                   Custom hooks
    layouts/                 Route/module layout wrappers
    lib/                     Library setup and local utility helpers
    pages/                   Route-level screens grouped by business module
    services/                Socket service layer
    table/                   AG Grid/table components and cell renderers
    theme/                   MUI theme and chat styles
    types/                   Shared TypeScript types
    utils/                   Cross-cutting frontend utilities
    main.tsx                 React root and provider composition
    route.tsx                Browser router definition
  package.json               Scripts and dependencies
  tailwind.config.js         Tailwind configuration
  tsconfig.json              TypeScript configuration and `@/*` path alias
  vite.config.ts             Vite configuration
```

## 4. Application Boot Flow

The application starts in `src/main.tsx`.

1. Global styles and AG Grid styles are loaded.
2. AG Grid modules are registered through `moduleregistri()` from `src/lib/aggrid/moduleregistry.tsx`.
3. The React app is mounted into `#root`.
4. Global providers are composed around the router:
   - `GoogleOAuthProvider`
   - Redux `Provider`
   - Ant Design `ConfigProvider`
   - MUI `ThemeProvider`
   - shadcn/Radix `Toaster`
   - custom `ToasterProvider`
   - `SocketProvider`
   - `RootLayout`
   - React Router `RouterProvider`

This means most pages can assume Redux, theme providers, socket context, toast handling, and router context already exist.

## 5. Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server with `NODE_ENV=development` |
| `npm run build` | Runs TypeScript checks with `tsc`, then creates a production Vite build |
| `npm run lint` | Runs ESLint across TypeScript and TSX files |
| `npm run preview` | Serves the production build locally |

## 6. Environment Variables

Vite exposes environment variables with the `VITE_` prefix. The codebase references:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `VITE_REACT_APP_API_BASE_URL` | `src/api/axiosInstance.ts`, SOP/BOM file links | Base URL for HTTP API requests and file URLs |
| `VITE_REACT_APP_GOOGLE_CLIENT_ID` | `src/main.tsx` | Google OAuth client ID |
| `VITE_REACT_APP_ENVIRONMENT` | `src/App.tsx`, `src/layouts/MainLayout.tsx` | Enables DEV/DEVME-only UI such as bug/chat tooling and DEV header styling |
| `VITE_SOKET_URL` | `src/services/socket/SocketService.ts`, `DownloadIndecator.tsx` | Socket.IO server URL |
| `VITE_REACT_APP_SOCKET_BASE_URL` | `.env` only at time of writing | Present locally, but not currently referenced by source |

Note: `VITE_SOKET_URL` is intentionally documented with the current spelling used by the source code.

## 7. Routing Model

Routes are defined in `src/route.tsx` with `createBrowserRouter`.

The route tree has three main categories:

- Authenticated app routes wrapped by `<Protected authentication>` and `<App />`.
- Public/auth routes such as `/login`, `/forgot-password`, and `/password-recovery`, wrapped by `<Protected authentication={false}>`.
- Utility/fallback routes such as `*`, `/not-permission`, and `/under-construction`.

Most authenticated pages are rendered inside `MainLayout`, and module-specific navigation is provided by layout wrappers such as `MasterComponentsLayout`, `ProductionMaterialRequisitionLayout`, `DispatchLayout`, `ReportLayout`, `QueryLayout`, and others.

### Major Route Groups

| Group | Representative routes |
| --- | --- |
| Home and profile | `/`, `/dashboard`, `/profile`, `/stockdetail` |
| Auth and verification | `/login`, `/forgot-password`, `/password-recovery`, `/verify-mail`, `/verify-otp`, `/verify-mobile`, `/change-password` |
| Master data | `/master-uom`, `/master-category`, `/master-components`, `/master-product-fg`, `/master-product-sfg`, `/master-bom-create`, `/master-location`, `/master-client`, `/master-vender-detail` |
| Warehouse | `/pending-material-approval`, `/material-requisition-request`, `/raw-min`, `/raw-min-v2`, `/sim-min`, `/warehouse/prod-return-MIN`, `/warehouse/part-code-conversion` |
| Procurement | `/procurement/create`, `/procurement/manage`, `/procurement/completed`, `/procurement/edit-po/:id` |
| Production | `/production/material-req-with-bom`, `/production/material-req-without-bom`, `/production/battery-qc`, `/production/create`, `/production/add-trc`, `/production/view-trc`, `/production/master-qr-generator` |
| Dispatch and challan | `/dispatch/create`, `/dispatch/manage`, `/create-challan`, `/manage-challan`, `/update-challan/:id`, `/dispatch/wrong-device` |
| E-way bill | `/eway-bill-details`, `/create/e-waybill/:id` |
| Reports and queries | `/report/:id`, `/master-report`, `/queries/:id`, `/view-image` |
| Uploads and SOP | `/upload/swipe-device-status`, `/upload/migration-status`, `/sop`, `/docViewer` |
| Transfers and worker data | `/device/transfer`, `/swipe/transfer`, `/worker-data`, `/view-worker-data`, `/workers/reports` |
| CRM | `/crm/report`, `/crm/upload-excel` |

## 8. Authentication and Session Flow

Authentication is centered around:

- `src/components/shared/Protected.tsx`
- `src/hooks/useAuth.ts`
- `src/hooks/useUser.ts`
- `src/features/authentication/authSlice.ts`
- `src/utils/tokenUtills.ts`
- `src/utils/returnTo.ts`

`Protected` checks whether the current route expects an authenticated or unauthenticated user. If an authenticated route is opened without a valid auth state, it stores the current path as a return target and redirects to `/login`. If an unauthenticated-only route is opened while already logged in, it redirects to `/`.

`useUser` reads `loggedinUser` from `localStorage`. The stored value is Base64-encoded JSON. Invalid Base64 or invalid JSON is removed.

The main authenticated app (`App.tsx`) checks verification flags from `user.other`:

- `e_v`: email verification
- `c_p`: password change requirement
- `m_v`: mobile verification appears in the user type and verification routes

If email is not verified, the app renders `MailVerifyPage`. If password change is required, it renders `ChangePassword`. If a login response requests two-step verification, `showOtpPage` in `localStorage` can route the user to OTP verification.

## 9. HTTP API Layer

All standard API calls should use `src/api/axiosInstance.ts`.

The shared Axios instance:

- Uses `VITE_REACT_APP_API_BASE_URL` as `baseURL`.
- Sends JSON by default.
- Adds bearer token and custom headers when a token exists.
- Adds the financial-year session key.
- Adds the selected branch from `localStorage.companyBranch`, defaulting to `BRMSC031`.
- Adds a unique click token per request.
- Adds cached browser fingerprint and location metadata.
- Adds `menuKey` from `sessionStorage`.
- Handles `401` by saving the current return path, clearing `localStorage`, and redirecting to `/login`.
- Shows API error messages through the custom toaster context.

### Request Headers Added by Interceptor

| Header | Source |
| --- | --- |
| `Authorization` | `Bearer ${token}` |
| `authorization` | raw token |
| `session` | `localStorage.session` if valid, else current Indian financial-year key |
| `companyBranch` | `localStorage.companyBranch` or fallback |
| `x-click-token` | generated UUID |
| `x-location` | cached geolocation helper result |
| `x-fingerprint` | FingerprintJS visitor ID |
| `menuKey` | `sessionStorage.menuKey` |
| `ngrok-skip-browser-warning` | static bypass header |

## 10. Redux Architecture

Redux store setup lives in `src/features/Store.ts`.

The store combines many module slices under domain-specific keys:

| Store key | Slice responsibility |
| --- | --- |
| `auth` | Login, Google login, OTP, password/email verification |
| `common` | Shared user, issue, currency, cost center, image utilities |
| `menu` | User menu permissions and menu tabs |
| `dashboard` | Dashboard device/raw material/issue data |
| `uom`, `category`, `component`, `componentPercentage`, `product`, `bom`, `location` | Master data |
| `vendor`, `client` | Vendor/client master workflows |
| `rawmin`, `divicemin`, `simmin` | Warehouse inwarding/MIN workflows |
| `pendingMr` | Material request approval and swipe approval |
| `materialRequestWithoutBom` | Production material request and branch/swap request flows |
| `addTrc`, `viewTrc` | TRC add/view/final submit flows |
| `batteryQcReducer`, `manageProduction`, `qr` | Production, QC, QR flows |
| `dispatch` | Dispatch, challan, e-way bill, branch transfer, wrong-device flows |
| `report`, `query` | Report and query pages |
| `sop` | SOP folders and file upload/list/delete |
| `upload` | Migration/swipe upload flows |
| `po` | Procurement and PO MIN flows |
| `materialManagement` | Material movement/transfer |
| `partCodeConversion` | Part-code conversion |
| `gpdcChallan` | GP/DC challan creation/list/print |
| `placeMaster` | Worker/area report and transfer place data |
| `deviceTransfer` | Device and swipe transfer |
| `crmRemark` | CRM serial fetch and upload/submit |

The store disables Redux Toolkit serializable checks because many flows pass API response objects, files, and form data through async thunks.

Use the typed hooks from `src/hooks/useReduxHook.ts`:

```ts
const dispatch = useAppDispatch();
const value = useAppSelector((state) => state.someSlice.value);
```

## 11. Socket Architecture

Socket setup lives in:

- `src/services/socket/SocketService.ts`
- `src/components/context/SocketContext.tsx`

`SocketService` connects to `VITE_SOKET_URL` with WebSocket transport and sends the current auth token in the socket `auth.authorization` field.

`SocketProvider` exposes helper methods for long-running report/download workflows and notifications. Examples include:

- `emitDownloadReport`
- `emitDownloadR1Report`
- `emitDownloadR4Report`
- `emitDownloadQ2Report`
- `emitDownloadBillingReport`
- `emitDownloadSwipeReport`
- `emitDeviceInwardReport`
- `emitGetNotification`
- `onDownloadReport`
- `onnotification`
- `refreshConnection`

The provider monitors connection/loading status and exposes `isConnected` and `isLoading` to consumers.

## 12. UI Architecture

The frontend mixes several UI systems:

- `src/components/ui`: shadcn/Radix-style base components.
- `src/components/reusable`: business-friendly selectors, uploaders, drawers, inputs, modals, loaders, and date controls.
- `src/components/shared`: app shell helpers such as sidebars, quick links, navigation sliders, online/offline indicator, profile sidebar, footer nav, and protected routes.
- `src/components/Drawers`: module-specific drawer workflows.
- `src/components/form`: module forms and update forms.
- `src/table`: AG Grid/table components grouped by domain.
- `src/table/Cellrenders`: AG Grid cell renderers.

When adding new UI, prefer existing components in `components/reusable` or `components/ui` before creating a new abstraction.

## 13. Table and Grid Setup

AG Grid modules are registered once in `src/lib/aggrid/moduleregistry.tsx`.

Registered modules include:

- Client-side row model
- Server-side row model
- CSV export
- Excel export
- Menu
- Filters tool panel
- Set filter
- Columns tool panel
- Row grouping
- Range selection
- Status bar

The same file exports `gridOptions` with column and filter side panel configuration. Table components can import this shared setup when they need consistent AG Grid sidebars.

## 14. Styling and Theme

Global styles are loaded from:

- `src/index.css`
- `src/App.css`
- `src/font.css`
- AG Grid CSS imports in `main.tsx`

Tailwind is configured in `tailwind.config.js` with:

- `darkMode: ["class"]`
- app-wide `src/**/*.{ts,tsx}` content scanning
- custom `ember` font family
- custom colors such as `hbg` and `maincolor`
- shadcn-compatible CSS variable colors
- accordion animations
- scrollbar plugin

MUI theme setup is in `src/theme/index.ts`. Ant Design token overrides are applied directly in `src/main.tsx`.

## 15. Business Module Map

### Authentication

Files:

- `src/pages/commonPages/LogningV2.tsx`
- `src/pages/authentication/ForgotPassword.tsx`
- `src/pages/authentication/RecoveryPassword.tsx`
- `src/pages/commonPages/otpPage.tsx`
- `src/pages/commonPages/MailVerifyPage.tsx`
- `src/pages/commonPages/MobileVerifyPage.tsx`
- `src/pages/commonPages/ChangePassword.tsx`
- `src/features/authentication/*`

Responsibilities:

- Username/password login
- Google login
- Two-step OTP verification
- Password recovery/reactivation
- Email update and verification
- Password change enforcement

### Master Data

Files:

- `src/pages/master/*`
- `src/features/master/*`
- `src/table/master/*`
- `src/components/Drawers/master/*`

Responsibilities:

- UOM
- Category/subcategory
- Components and component percentages
- FG/SFG products
- BOM creation, detail, edit, alternate components, upload
- Locations
- Vendor and vendor branch data
- Client, billing address, shipping address

### Procurement

Files:

- `src/pages/procurement/*`
- `src/features/procurement/poSlices.ts`
- `src/features/procurement/poTypes.ts`

Responsibilities:

- Create PO
- Manage PO
- Edit PO
- Completed PO
- PO print
- PO-based MIN
- Part-code challan from procurement flows

### Warehouse and MIN

Files:

- `src/pages/wearhouse/*`
- `src/features/wearhouse/*`
- `src/table/wearhouse/*`
- `src/pages/min/*`

Responsibilities:

- Raw material inwarding
- Device material inwarding
- SIM MIN
- Production return MIN
- Material approval and requisition request
- Swipe material approval
- Stock/location availability checks

Note: The folder name is currently spelled `wearhouse` in source paths.

### Production

Files:

- `src/pages/production/*`
- `src/features/production/*`
- `src/table/production/*`
- `src/components/stepper/deviceMinSteps/*`

Responsibilities:

- Material request with BOM
- Material request without BOM
- Swipe device requests
- PPR screens
- Battery QC
- Production creation/management
- QR lot/single QR generation
- QR Excel download
- TRC add/store/view/final submit

### Dispatch, Challan, E-Way Bill

Files:

- `src/pages/Dispatch/*`
- `src/features/Dispatch/*`
- `src/table/dispatch/*`
- `src/components/ewayBill/*`
- `src/pages/ewayBill/*`

Responsibilities:

- Create/manage dispatch
- Device dispatch and swipe dispatch
- Wrong-device dispatch
- Create/update/manage challan
- Part-code challan
- E-way bill detail submission, creation, and cancellation
- Branch transfer approval/rejection and challan print

### Reports and Queries

Files:

- `src/pages/report/*`
- `src/table/report/*`
- `src/features/report/report/*`
- `src/pages/queries/*`
- `src/table/query/*`
- `src/features/query/query/*`

Responsibilities:

- R-series reports
- Q-series query views
- Detail tables
- Socket-powered report downloads
- Physical quantity update
- Device timelines and location/history views

### SOP File Management

Files:

- `src/pages/fileupload/SopPage.tsx`
- `src/features/Sop/sopSlice.ts`
- `src/table/sop/FilesTable.tsx`
- `src/components/shared/sop/*`

Responsibilities:

- Folder listing
- Folder creation
- File upload
- File listing
- Delete
- File preview/download

### Transfers, Material Movement, Part-Code Conversion

Files:

- `src/pages/transferDevice/*`
- `src/features/transfer/deviceTransferSlice.ts`
- `src/pages/materialManagement/MaterialManagement.tsx`
- `src/features/materialManagement/materialManagementSlices.ts`
- `src/pages/partCodeConversion/*`
- `src/features/partCodeConversion/partCodeConversionSlices.ts`

Responsibilities:

- Device transfer
- Swipe transfer
- Material movement
- Component stock lookup
- Part-code conversion submission and report

### Worker/Area Reporting

Files:

- `src/pages/areaReport/*`
- `src/features/areaSlice/*`

Responsibilities:

- Worker data entry
- Worker reports
- Place/department data
- Part-code transfer support

### CRM Remark

Files:

- `src/pages/crm-remark/*`
- `src/features/crmRemark/crmRemarkSlice.ts`

Responsibilities:

- CRM serial fetching
- Excel upload/report style CRM workflows

## 16. File Uploads and Downloads

The app uses both standard HTTP downloads and Socket.IO progress-based workflows.

Common patterns:

- Form data uploads are sent with `Content-Type: multipart/form-data`.
- Excel and CSV support is provided by `xlsx` and AG Grid export modules.
- SOP files use API URLs built from `VITE_REACT_APP_API_BASE_URL`.
- Some report downloads are triggered by socket events and tracked with progress notifications.

Useful files:

- `src/utils/downloadFile.ts`
- `src/utils/exportToExcel.tsx`
- `src/components/shared/DownloadIndecator.tsx`
- `src/components/reusable/FileUploader.tsx`
- `src/components/reusable/FileUploaderTest.tsx`
- `src/components/ui/Fileupload.tsx`

## 17. Utilities and Helpers

Important utility areas:

| File | Purpose |
| --- | --- |
| `src/utils/tokenUtills.ts` | Token get/set helpers |
| `src/utils/toasterContext.tsx` | Global custom toaster access |
| `src/utils/toastUtils.ts` | Toast helper functions |
| `src/utils/returnTo.ts` | Preserve intended route when auth redirects |
| `src/utils/indianFinancialYear.ts` | Session key and financial-year utilities |
| `src/utils/rangePresets.ts` | Date range presets |
| `src/utils/numberFormatUtils.ts` | Number formatting |
| `src/utils/exportToExcel.tsx` | Export helper |
| `src/helper/getLocation.ts` | Browser/location helper used in API headers |
| `src/helper/checkPermissions.tsx` | Permission helper |
| `src/lib/utils.ts` | General className utility |

## 18. Development Conventions

### Imports

The project uses the `@/*` path alias for `src/*`, configured in both `tsconfig.json` and `vite.config.ts`.

Prefer:

```ts
import CustomButton from "@/components/reusable/CustomButton";
```

over long relative paths.

### Adding a New Page

1. Create the screen under the matching `src/pages/<module>/` folder.
2. Add or reuse a layout under `src/layouts/` if the module needs its own tabs/navigation.
3. Add the route in `src/route.tsx`.
4. Add menu metadata if the page should appear in a sidebar or module nav.
5. Add Redux slice actions only if the page owns reusable async state.
6. Use `axiosInstance` for HTTP calls.
7. Use existing reusable controls and table patterns.

### Adding a Redux Slice

1. Create `<module>Slice.ts` and optional `<module>Type.ts`.
2. Use `createAsyncThunk` for API calls.
3. Keep API calls on `axiosInstance`.
4. Track `loading`, data, and error or message state consistently.
5. Register the reducer in `src/features/Store.ts`.
6. Use `useAppDispatch` and `useAppSelector` in components.

### Adding an API Call

Use:

```ts
const response = await axiosInstance.get("/endpoint");
```

Do not create a new Axios client unless a genuinely separate backend or headers contract is required.

### Adding a Socket Workflow

1. Add the low-level event emit/listen behavior to `SocketContext.tsx`.
2. Keep connection handling inside `SocketService`.
3. Expose a semantic helper from context, such as `emitDownloadR23Report`.
4. Unsubscribe with `off(eventName)` when a component registers listeners that should not persist.

### Adding a Table

1. Place route-specific tables under `src/table/<module>/`.
2. Place reusable cell renderers under `src/table/Cellrenders/`.
3. Reuse `gridOptions` if side panels are needed.
4. Keep row action behavior close to the table if it is table-specific.

## 19. Known Project Notes

- `README.md` was previously the default Vite template; it now links to this documentation.
- Several names are misspelled in source paths or symbols, such as `wearhouse`, `Divicemin`, `devaiceMinSlice`, `CraetePPR`, and `VITE_SOKET_URL`. Treat these as existing public/internal names and change them only with a deliberate migration.
- `src/route.tsx` has a duplicate `/procurement/manage` route.
- Some route/menu paths differ by spelling, for example menu data has `/production/craete` while the router defines `/production/create`.
- The `.env` file includes `VITE_REACT_APP_SOCKET_BASE_URL`, but source references `VITE_SOKET_URL`.
- Redux serializable checks are disabled, so be careful when introducing non-serializable values into state. Existing patterns rely on this flexibility.

## 20. Build and Deployment

The app builds with:

```bash
npm run build
```

The build output is generated in `dist/`.

`vercel.json` is present, so the project is prepared for Vercel-style SPA deployment. The app uses browser routing, so deployment must serve `index.html` for unknown frontend routes.

## 21. Testing and Quality

Current package scripts include linting and building, but no explicit unit/e2e test command.

Recommended checks before merging changes:

```bash
npm run lint
npm run build
```

For high-risk workflow changes, manually verify:

- login and protected route redirects
- API headers in network requests
- module routes and sidebar links
- upload/download flows
- socket report progress
- AG Grid table behavior
- mobile/tablet layouts if the target users need them

## 22. Troubleshooting

### App redirects to login

Check:

- token exists through `tokenUtills`
- `loggedinUser` exists in `localStorage`
- `loggedinUser` is valid Base64-encoded JSON
- API did not return `401`

### API calls fail immediately

Check:

- `VITE_REACT_APP_API_BASE_URL`
- token and request headers
- backend CORS/auth behavior
- `session` and `companyBranch` local storage values

### Socket features do not work

Check:

- `VITE_SOKET_URL`
- token sent in socket auth
- browser WebSocket connectivity
- event name expected by backend
- `SocketProvider` wrapping the page

### AG Grid table features are missing

Check that `moduleregistri()` is still called in `main.tsx`, and that the relevant AG Grid Enterprise module is included in `src/lib/aggrid/moduleregistry.tsx`.

### DEV-only UI does not appear

Check `VITE_REACT_APP_ENVIRONMENT`. `BugAndChat` appears only when it is `DEV` or `DEVME`; the main header uses special DEV styling when it is `DEV`.

