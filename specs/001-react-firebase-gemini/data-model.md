# Data Model: 블로그 사이트

**Date**: 2025-10-11
**Status**: Draft

이 문서는 블로그 사이트 기능에 필요한 데이터베이스 테이블 구조를 정의합니다. Supabase (PostgreSQL)를 기준으로 작성되었습니다.

## Table: `users`

사용자 계정 정보를 저장합니다.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, default: `uuid_generate_v4()` | 사용자의 고유 ID |
| `email` | `text` | Unique, Not Null | 사용자 이메일 (로그인 시 사용) |
| `password_hash` | `text` | Not Null | 해시 처리된 사용자 비밀번호 |
| `role` | `text` | Not Null, default: `'user'` | 사용자 역할 ('user' 또는 'admin') |
| `created_at` | `timestamptz` | Not Null, default: `now()` | 계정 생성 시각 |

## Table: `posts`

게시글의 내용을 저장합니다.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, default: `uuid_generate_v4()` | 게시글의 고유 ID |
| `author_id` | `uuid` | Foreign Key -> `users.id` | 작성자의 ID |
| `title` | `text` | Not Null | 게시글 제목 |
| `content` | `text` | | 게시글 본문 (Markdown 형식) |
| `created_at` | `timestamptz` | Not Null, default: `now()` | 게시글 생성 시각 |
| `updated_at` | `timestamptz` | Not Null, default: `now()` | 게시글 마지막 수정 시각 |

## Table: `tabs`

게시글에 사용될 탭(태그) 정보를 저장합니다.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `serial` | Primary Key | 탭의 고유 ID |
| `name` | `text` | Unique, Not Null | 탭 이름 |

## Table: `post_tabs`

게시글과 탭의 다대다(Many-to-Many) 관계를 정의하는 연결 테이블입니다.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `post_id` | `uuid` | Primary Key, Foreign Key -> `posts.id` | 게시글 ID |
| `tab_id` | `integer` | Primary Key, Foreign Key -> `tabs.id` | 탭 ID |

## Relationships

- A `user` can have many `posts`.
- A `post` belongs to one `user`.
- A `post` can have many `tabs`.
- A `tab` can be associated with many `posts`.
