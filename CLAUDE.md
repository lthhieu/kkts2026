# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kiểm Kê Tài Sản** — A full-stack asset inventory management system for Vietnamese universities (CSVC — Cơ Sở Vật Chất). Built with NestJS backend and Next.js frontend.

## Monorepo Structure

```
/server   — NestJS API (port 8000)
/ui       — Next.js 16 frontend (port 3000)
```

## Commands

### Backend (`/server`)

```bash
npm run start:dev     # Development with watch mode
npm run build         # Compile TypeScript → dist/
npm run start:prod    # Run compiled production build
npm run lint          # ESLint with auto-fix
npm run test          # Jest unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend (`/ui`)

```bash
npm run dev     # Development server
npm run build   # Next.js production build
npm run start   # Start production server
```

### Environment Setup

Copy and configure `/server/.env`:
```
PORT=8000
MONGO_URI=mongodb://0.0.0.0:27017/kkts
JWT_SECRET=justasecretkey
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
SHOULD_INIT=true
INIT_PASSWORD=123456
FRONTEND_URI=http://localhost:3000
```

The UI reads `NEXT_PUBLIC_BACKEND_URI` from `.env.local` / `.env.production`.

## Backend Architecture

### Module pattern

Every feature follows the same NestJS pattern:

```
module-name/
  module-name.module.ts      — registers MongooseModule + CaslModule
  module-name.controller.ts  — HTTP endpoints with @ResponseMessage decorator
  module-name.service.ts     — business logic, pagination via api-query-params
  dto/
    create-module-name.dto.ts   — class-validator with Vietnamese messages
    update-module-name.dto.ts   — extends PartialType(CreateDto)
  schemas/
    module-name.schema.ts    — Mongoose schema with @Schema({ timestamps: true })
```

### Global infrastructure (`server/src/configs/`)

- **`transform.interceptor.ts`** — wraps all responses as `{ statusCode, message, data }`
- **`my.decorator.ts`** — custom decorators: `@ResponseMessage`, `@Public`, `@User`, `@CheckPolicies`
- **`http-exception.filter.ts`** — global exception filter
- **`jwt.config.service.ts`** / **`mongoose.config.service.ts`** — config services
- **`enum.ts`** — CASL `Action` enum (manage/create/read/update/delete) and Subject classes

### Authentication & Authorization

- **Backend**: Passport.js with Local + JWT strategies. Global `JwtAuthGuard` applied to all routes. Use `@Public()` to bypass.
- **Tokens**: `access_token` (7d) + `refresh_token` (30d, httpOnly cookie)
- **Authorization**: CASL ability factory in `src/casl/`. Use `@CheckPolicies()` with `CaslPoliciesGuard` for route-level authorization.

### API conventions

- Global prefix: `/api`
- Default versioning: `v1` (URI-based)
- All endpoints: `/api/v1/<resource>`
- Pagination: `?current=1&pageSize=10` — all `findAll` return `{ meta: { current, pageSize, pages, total }, result: [] }`
- Batch endpoints: `POST /<resource>/create-many`, `DELETE /<resource>/delete-many`

### Domain modules (`server/src/csvc/`)

**Main entities:**
- `datdai` — Đất đai (Land parcels)
- `toanha` — Tòa nhà (Buildings)
- `phgdht` — Phòng học, giảng đường, hội trường (Classrooms/lecture halls)
- `ktx` — Ký túc xá (Student dormitories)
- `ctk` — Công trình cơ sở vật chất (Infrastructure works)
- `ptn` — Phòng thí nghiệm (Laboratories, references CTK)
- `xth` — Xưởng thực hành (Workshops, references CTK)
- `tbiptn` — Thiết bị PTN (Lab equipment >500M VND, references CTK)
- `thuvien` — Thư viện (Libraries)

**Catalog/Danh mục (`server/src/csvc/danhmuc/`)** — lookup tables referenced by main entities:
- `hinhthucsohuu`, `hinhthucsudung`, `tinhtrangsudung`, `tinhtrangcsvc`
- `phanloai`, `loaiphonghoc`, `loaicongtrinhcsvc`, `loaiptn`, `loaidean`
- `mucdichsudungcsvc`, `mucdichsudungdat`, `linhvucdaotao`
- `tinhthanhpho`, `xaphuong`, `countries`, `luachon`

### Key relationship: PTN/XTH → CTK

`ptn` and `xth` schemas reference `Ctk` via `ma_ct_csvc` (ObjectId). They are sub-records of a CTK entry — when querying PTN/XTH, populate `ma_ct_csvc` to get the parent CTK data.

## Frontend Architecture

### Tech stack

Next.js 16 App Router, React 19, Ant Design 6, NextAuth 5 (beta), CASL React.

### Route groups (`ui/src/app/`)

- `(auth)` — login page
- `(public)` — public-facing pages (news, etc.)
- `(main)` — protected application pages (requires authentication)

### API calls

All backend API calls go through `ui/src/utils/api.ts` which wraps `fetch` with auth headers. The proxy config is in `ui/src/proxy.ts`.

### Authorization on frontend

Uses `@casl/react` — ability is derived from the user session in `ui/src/libs/getUserPermission.ts`. UI elements are conditionally rendered based on CASL `Can` component.

## Database

MongoDB via Mongoose. All schemas use `timestamps: true` (auto `createdAt`/`updatedAt`). Relationships use `ObjectId` refs and are populated in `findOne` queries. The `findAll` pagination pattern uses `api-query-params` to parse filter/sort from the query string.

## Field naming conventions

- Vietnamese abbreviations used throughout: `dt` (diện tích), `htsh` (hình thức sở hữu), `htsd` (hình thức sử dụng), `nam_sd` (năm sử dụng), `ma_*` (mã/code), `ten_*` (tên/name), `so_*` (số/count), `tong_*` (tổng/total)
- Enum-like references use ObjectId → danhmuc schemas instead of plain strings
