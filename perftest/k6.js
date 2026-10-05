import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const EMAIL = __ENV.DEMO_EMAIL || "demo@example.com";
const PASSWORD = __ENV.DEMO_PASSWORD || "password123";
const VUS = Number(__ENV.VUS) || 10;
const DURATION = __ENV.DURATION || "30s";

const scenarioDefaults = {
  executor: "constant-vus",
  vus: VUS,
  duration: DURATION,
};

export const options = {
  scenarios: {
    products_list: { ...scenarioDefaults, exec: "productsList" },
    product_detail: { ...scenarioDefaults, exec: "productDetail" },
    auth_register: { ...scenarioDefaults, exec: "authRegister" },
    auth_login: { ...scenarioDefaults, exec: "authLogin" },
    auth_logout: { ...scenarioDefaults, exec: "authLogout" },
    cart_get: { ...scenarioDefaults, exec: "cartGet" },
    cart_post: { ...scenarioDefaults, exec: "cartPost" },
    cart_patch: { ...scenarioDefaults, exec: "cartPatch" },
    cart_delete: { ...scenarioDefaults, exec: "cartDelete" },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

function login() {
  http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers: { "Content-Type": "application/json" } },
  );
}

function firstProductId() {
  const res = http.get(`${BASE_URL}/api/products`);
  const products = res.json();
  return Array.isArray(products) && products.length > 0 ? products[0].id : null;
}

// GET /api/products
export function productsList() {
  const res = http.get(`${BASE_URL}/api/products`);
  check(res, { "products list 200": (r) => r.status === 200 });
}

// GET /api/products/:id
export function productDetail() {
  const id = firstProductId();
  if (!id) return;
  const res = http.get(`${BASE_URL}/api/products/${id}`);
  check(res, { "product detail 200": (r) => r.status === 200 });
}

// POST /api/auth/register
export function authRegister() {
  const email = `perftest-${__VU}-${__ITER}-${Date.now()}@example.com`;
  const res = http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify({ email, password: "password123" }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(res, { "register 201": (r) => r.status === 201 });
}

// POST /api/auth/login
export function authLogin() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(res, { "login 200": (r) => r.status === 200 });
}

// POST /api/auth/logout
export function authLogout() {
  login();
  const res = http.post(`${BASE_URL}/api/auth/logout`);
  check(res, { "logout 200": (r) => r.status === 200 });
}

// GET /api/cart
export function cartGet() {
  login();
  const res = http.get(`${BASE_URL}/api/cart`);
  check(res, { "cart get 200": (r) => r.status === 200 });
}

// POST /api/cart
export function cartPost() {
  login();
  const id = firstProductId();
  if (!id) return;
  const res = http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({ productId: id, quantity: 1 }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(res, { "cart post 201": (r) => r.status === 201 });
}

// PATCH /api/cart/:productId
export function cartPatch() {
  login();
  const id = firstProductId();
  if (!id) return;
  http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({ productId: id, quantity: 1 }),
    { headers: { "Content-Type": "application/json" } },
  );
  const res = http.patch(
    `${BASE_URL}/api/cart/${id}`,
    JSON.stringify({ quantity: 2 }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(res, { "cart patch 200": (r) => r.status === 200 });
}

// DELETE /api/cart/:productId
export function cartDelete() {
  login();
  const id = firstProductId();
  if (!id) return;
  http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({ productId: id, quantity: 1 }),
    { headers: { "Content-Type": "application/json" } },
  );
  const res = http.del(`${BASE_URL}/api/cart/${id}`);
  check(res, { "cart delete 200": (r) => r.status === 200 });
}
