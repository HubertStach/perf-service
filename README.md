# Perf Shop

Mock sklep internetowy (Next.js App Router + Prisma/Postgres) — frontend, REST API i baza danych
do testów wydajnościowych i obserwowalności. Szczegóły decyzji projektowych: [PLAN.md](./PLAN.md).

## Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Prisma](https://prisma.io) + PostgreSQL
- [Tailwind CSS](https://tailwindcss.com)
- Auth: własna implementacja na `node:crypto` (hash hasła `scrypt`, podpisane cookie sesji) —
  bez NextAuth/zewnętrznych bibliotek

## Uruchomienie (Docker)

Najprostszy sposób — stawia bazę i aplikację razem:

```bash
docker compose up --build
```

Aplikacja wystartuje na `http://localhost:3000`, baza na `localhost:5432`. Kontener aplikacji przy
starcie sam robi `prisma db push` i (jeśli baza jest pusta) seed — restart nie czyści danych, patrz
`FORCE_SEED=1` w `prisma/seed.ts` żeby wymusić reset. Konto demo: `demo@example.com` /
`password123`.

## Uruchomienie (lokalnie, bez Dockera)

```bash
./start-database.sh        # lub: docker run -d --name perf-service-postgres \
                            #   -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
                            #   -e POSTGRES_DB=perf-service -p 5432:5432 postgres
cp .env.example .env        # ustaw DATABASE_URL i SESSION_SECRET
npm install
npm run db:push             # tworzy tabele z prisma/schema.prisma
npm run db:seed              # 40 mockowych produktów + konto demo@example.com / password123
npm run dev
```

## Strony

| Ścieżka          | Opis                                            |
|-------------------|--------------------------------------------------|
| `/`               | Katalog produktów                                |
| `/products/[id]`  | Szczegóły produktu, dodanie do koszyka            |
| `/cart`           | Koszyk: ilości, usuwanie, suma (wymaga logowania) |
| `/login`          | Logowanie                                         |
| `/register`       | Rejestracja                                       |

## REST API

Wszystkie body/response w JSON. Endpointy koszyka wymagają sesji (cookie `session` ustawiane przy
logowaniu/rejestracji) — bez niej zwracają `401`.

### Auth

| Metoda | Ścieżka             | Body                        | Odpowiedź                        |
|--------|----------------------|------------------------------|-----------------------------------|
| POST   | `/api/auth/register` | `{ email, password }`        | `201 { id, email }` / `409` jeśli email zajęty |
| POST   | `/api/auth/login`    | `{ email, password }`        | `200 { id, email }` / `401` przy błędnych danych |
| POST   | `/api/auth/logout`   | —                             | `200 { ok: true }`                |

### Produkty

| Metoda | Ścieżka             | Opis                      | Odpowiedź              |
|--------|----------------------|----------------------------|--------------------------|
| GET    | `/api/products`      | Lista wszystkich produktów | `200 Product[]`         |
| GET    | `/api/products/:id`  | Jeden produkt              | `200 Product` / `404`   |

### Koszyk (wymaga zalogowania)

| Metoda | Ścieżka                  | Body               | Opis                                  | Odpowiedź                |
|--------|---------------------------|---------------------|-----------------------------------------|----------------------------|
| GET    | `/api/cart`                | —                   | Zawartość koszyka (z danymi produktu)   | `200 CartItem[]`           |
| POST   | `/api/cart`                 | `{ productId, quantity }` | Dodaje produkt / zwiększa ilość jeśli już w koszyku | `201 CartItem` / `404` jeśli brak produktu |
| PATCH  | `/api/cart/:productId`      | `{ quantity }`      | Ustawia ilość danej pozycji              | `200 CartItem` / `404`     |
| DELETE | `/api/cart/:productId`      | —                   | Usuwa pozycję z koszyka                  | `200 { ok: true }`         |

### Modele

```
Product   { id, name, description, priceCents, imageUrl, stock, createdAt }
CartItem  { id, userId, productId, quantity, product: Product }
User      { id, email }  (hasło nigdy nie jest zwracane)
```

## Skrypty

| Komenda          | Opis                                   |
|--------------------|------------------------------------------|
| `npm run dev`       | Serwer deweloperski (Turbopack)          |
| `npm run build`     | Build produkcyjny                        |
| `npm run db:push`   | Synchronizacja schematu Prisma z bazą    |
| `npm run db:seed`   | Reset i wypełnienie bazy mockowymi danymi |
| `npm run db:studio` | Prisma Studio (podgląd bazy w UI)        |
| `npm run check`     | Lint + typecheck                         |

## Poza zakresem (etap 1)

Observability (logi/tracing/metryki), checkout/płatności, panel admina, koszyk gościa, rate
limiting — patrz [PLAN.md](./PLAN.md#poza-zakresem-etapu-1-świadomie).
