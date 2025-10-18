# Research & Decisions: 블로그 사이트 제작

**Date**: 2025-10-11
**Status**: Completed

## 1. Frontend Framework

- **Decision**: React
- **Rationale**: 사용자 요구사항(FR-001)에 명시됨. 컴포넌트 기반 아키텍처와 방대한 생태계를 통해 현대적인 웹 애플리케이션을 효율적으로 구축할 수 있음.
- **Alternatives considered**: 없음 (사용자 지정).

## 2. Backend & Database (BaaS)

- **Decision**: Supabase
- **Rationale**: 사용자 요구사항(FR-001)에 명시됨. PostgreSQL 기반의 오픈소스 BaaS로, 인증, 데이터베이스, 스토리지 등 백엔드 기능을 통합 제공하여 빠른 개발을 지원함.
- **Alternatives considered**: 없음 (사용자 지정).

## 3. Architectural Pattern

- **Decision**: Model-View-Controller (MVC)
- **Rationale**: 사용자의 핵심 요구사항. 관심사 분리를 통해 코드의 유지보수성과 확장성을 높일 수 있음. React 환경에 맞게 `models` (데이터 및 비즈니스 로직), `views` (UI 컴포넌트 및 레이아웃), `controllers` (상태 및 이벤트 처리)로 역할을 분리하여 적용함.
- **Alternatives considered**: 없음 (사용자 지정).
