import { queryClient } from "./queryClient";

const API_BASE = "/api";

export async function fetchKPIs(country?: string) {
  const params = new URLSearchParams();
  if (country && country !== 'all') params.append('country', country);
  const res = await fetch(`${API_BASE}/dashboard/kpis?${params}`);
  if (!res.ok) throw new Error('Failed to fetch KPIs');
  return res.json();
}

export async function fetchTopUsers() {
  const res = await fetch(`${API_BASE}/dashboard/top-users`);
  if (!res.ok) throw new Error('Failed to fetch top users');
  return res.json();
}

export async function fetchVerificationQueue() {
  const res = await fetch(`${API_BASE}/dashboard/verification-queue`);
  if (!res.ok) throw new Error('Failed to fetch verification queue');
  return res.json();
}

export async function fetchSignupsTrend() {
  const res = await fetch(`${API_BASE}/dashboard/signups-trend`);
  if (!res.ok) throw new Error('Failed to fetch signups trend');
  return res.json();
}

export async function fetchUsersByCountry() {
  const res = await fetch(`${API_BASE}/dashboard/users-by-country`);
  if (!res.ok) throw new Error('Failed to fetch users by country');
  return res.json();
}

export async function fetchEngagement() {
  const res = await fetch(`${API_BASE}/dashboard/engagement`);
  if (!res.ok) throw new Error('Failed to fetch engagement data');
  return res.json();
}

export async function fetchCountries() {
  const res = await fetch(`${API_BASE}/countries`);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
}
