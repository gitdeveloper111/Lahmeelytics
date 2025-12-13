import { Sidebar } from "@/components/layout/Sidebar";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchKPIs, fetchTopUsers, fetchVerificationQueue, fetchSignupsTrend, fetchCountries, fetchTopFavorited } from "@/lib/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toLocaleString();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState('all');

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis', selectedCountry],
    queryFn: () => fetchKPIs(selectedCountry),
  });

  const { data: topUsers, isLoading: topUsersLoading } = useQuery({
    queryKey: ['topUsers'],
    queryFn: fetchTopUsers,
  });

  const { data: verificationQueue, isLoading: verificationLoading } = useQuery({
    queryKey: ['verificationQueue'],
    queryFn: fetchVerificationQueue,
  });

  const { data: signupsTrend } = useQuery({
    queryKey: ['signupsTrend'],
    queryFn: fetchSignupsTrend,
  });

  const { data: topFavoritedWomen, isLoading: topWomenLoading } = useQuery({
    queryKey: ['topFavoritedWomen'],
    queryFn: () => fetchTopFavorited('Female'),
  });

  const { data: topFavoritedMen, isLoading: topMenLoading } = useQuery({
    queryKey: ['topFavoritedMen'],
    queryFn: () => fetchTopFavorited('Male'),
  });

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  // Calculate totals for signups
  const totalSignups90d = signupsTrend?.reduce((acc: number, d: any) => acc + d.count, 0) || 0;

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-off-white font-sans text-text-dark antialiased">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-[-0.04em] text-text-dark">Your Growth Story</h1>
          <div className="flex gap-3 flex-wrap">
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white px-4 py-2 text-text-medium border border-border-light shadow-sm hover:border-gray-300 transition-colors">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <p className="text-sm font-medium leading-normal">Last 90 Days</p>
              <span className="material-symbols-outlined text-base">arrow_drop_down</span>
            </button>
            <div className="relative">
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white pl-10 pr-8 py-2 text-text-medium border border-border-light shadow-sm hover:border-gray-300 transition-colors text-sm font-medium appearance-none cursor-pointer"
              >
                <option value="all">All Countries</option>
                {countries?.map((c: any) => (
                  <option key={c.country} value={c.country}>{c.country} ({c.userCount})</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-base absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">public</span>
              <span className="material-symbols-outlined text-base absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">arrow_drop_down</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-soft-peach to-muted-teal p-6 md:p-10 rounded-2xl shadow-lg mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 0h20v20H0V0zm1 1h18v18H1V1zm2 2h14v14H3V3z\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')" }}></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-text-dark mb-4">Overall Performance Snapshot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1 p-5 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                <p className="text-base font-medium text-text-medium">Total Users</p>
                {kpisLoading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <p className="text-text-dark tracking-tight text-4xl font-extrabold leading-tight">{formatNumber(kpis?.totalUsers || 0)}</p>
                )}
                <p className="text-positive text-base font-semibold leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base !font-semibold">trending_up</span>+1.2%
                </p>
              </div>
              <div className="flex flex-col gap-1 p-5 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                <p className="text-base font-medium text-text-medium">Signups Today</p>
                {kpisLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <p className="text-text-dark tracking-tight text-4xl font-extrabold leading-tight">{formatNumber(kpis?.signupsToday || 0)}</p>
                )}
                <p className="text-positive text-base font-semibold leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base !font-semibold">trending_up</span>+5%
                </p>
              </div>
              <div className="flex flex-col gap-1 p-5 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                <p className="text-base font-medium text-text-medium">Active 30D</p>
                {kpisLoading ? (
                  <Skeleton className="h-10 w-28" />
                ) : (
                  <p className="text-text-dark tracking-tight text-4xl font-extrabold leading-tight">{formatNumber(kpis?.active30d || 0)}</p>
                )}
                <p className="text-positive text-base font-semibold leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base !font-semibold">trending_up</span>+0.8%
                </p>
              </div>
              <div className="flex flex-col gap-1 p-5 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                <p className="text-base font-medium text-text-medium">Active Premium</p>
                {kpisLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-text-dark tracking-tight text-4xl font-extrabold leading-tight">{formatNumber(kpis?.activePremium || 0)}</p>
                )}
                <p className="text-negative text-base font-semibold leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base !font-semibold">trending_down</span>-0.2%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium leading-normal">Total Matches</p>
            {kpisLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-text-dark tracking-tight text-3xl font-bold leading-tight">{formatNumber(kpis?.totalMatches || 0)}</p>
            )}
            <p className="text-positive text-base font-semibold leading-normal">+3%</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium leading-normal">Women:Men Ratio</p>
            {kpisLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-text-dark tracking-tight text-3xl font-bold leading-tight">{kpis?.womenMenRatio || '1 : 1'}</p>
            )}
            <p className="text-text-medium text-sm leading-normal">
              {formatNumber(kpis?.womenCount || 0)} W / {formatNumber(kpis?.menCount || 0)} M
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium leading-normal">Verification Queue</p>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-text-dark tracking-tight text-3xl font-bold leading-tight">{kpis?.verificationQueue || 0}</p>
            )}
            <p className="text-positive text-base font-semibold leading-normal">Pending</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium leading-normal">Deactivated Users</p>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-text-dark tracking-tight text-3xl font-bold leading-tight">{kpis?.deactivatedUsers || 0}</p>
            )}
            <p className="text-negative text-base font-semibold leading-normal">Inactive</p>
          </div>
        </div>

        <section className="mb-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-border-light p-8 bg-white shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-dark">Daily Signups</h3>
              <div className="flex gap-2 items-center">
                <p className="text-text-medium text-lg font-normal leading-normal">Last 90 Days</p>
                <p className="text-positive text-lg font-semibold leading-normal">+12.5%</p>
              </div>
            </div>
            <p className="text-text-dark tracking-tight text-5xl font-extrabold leading-tight truncate">{formatNumber(totalSignups90d)}</p>
            <div className="flex min-h-[220px] flex-1 flex-col justify-end pt-4">
              <svg fill="none" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_chart_light)"></path>
                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#77aaff" strokeLinecap="round" strokeWidth="3"></path>
                <defs><linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chart_light" x1="236" x2="236" y1="1" y2="149"><stop className="chart-gradient-blue"></stop><stop className="chart-gradient-blue-end" offset="1"></stop></linearGradient></defs>
              </svg>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
            <div className="p-8 bg-soft-peach/30">
              <h3 className="text-2xl font-bold text-text-dark">Top 10 Most Favorited Women</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-4 font-semibold" scope="col">User</th>
                    <th className="px-6 py-4 font-semibold" scope="col">Country</th>
                    <th className="px-6 py-4 font-semibold text-right" scope="col">Favorites</th>
                  </tr>
                </thead>
                <tbody>
                  {topWomenLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                      </tr>
                    ))
                  ) : topFavoritedWomen?.length > 0 ? (
                    topFavoritedWomen.map((user: any, idx: number) => (
                      <tr key={user.id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-text-dark">
                          <span className="text-soft-peach font-bold mr-2">#{idx + 1}</span>
                          <Link href={`/users/${user.id}`} className="hover:text-muted-teal hover:underline">
                            {user.first_name || user.code_name} {user.last_name || ''}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-text-medium">{user.country || 'N/A'}</td>
                        <td className="px-6 py-4 text-right font-bold text-muted-teal">{user.favorite_count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-5 text-center text-text-medium">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
            <div className="p-8 bg-muted-teal/20">
              <h3 className="text-2xl font-bold text-text-dark">Top 10 Most Favorited Men</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-4 font-semibold" scope="col">User</th>
                    <th className="px-6 py-4 font-semibold" scope="col">Country</th>
                    <th className="px-6 py-4 font-semibold text-right" scope="col">Favorites</th>
                  </tr>
                </thead>
                <tbody>
                  {topMenLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                      </tr>
                    ))
                  ) : topFavoritedMen?.length > 0 ? (
                    topFavoritedMen.map((user: any, idx: number) => (
                      <tr key={user.id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-text-dark">
                          <span className="text-muted-teal font-bold mr-2">#{idx + 1}</span>
                          <Link href={`/users/${user.id}`} className="hover:text-muted-teal hover:underline">
                            {user.first_name || user.code_name} {user.last_name || ''}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-text-medium">{user.country || 'N/A'}</td>
                        <td className="px-6 py-4 text-right font-bold text-muted-teal">{user.favorite_count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-5 text-center text-text-medium">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-text-dark">Top 20 Most Active Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-8 py-4 font-semibold" scope="col">User</th>
                    <th className="px-8 py-4 font-semibold" scope="col">Last Active</th>
                    <th className="px-8 py-4 font-semibold" scope="col">Gender</th>
                    <th className="px-8 py-4 font-semibold" scope="col">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="px-8 py-5"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-8 py-5"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-8 py-5"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-8 py-5"><Skeleton className="h-4 w-12" /></td>
                      </tr>
                    ))
                  ) : topUsers?.length > 0 ? (
                    topUsers.slice(0, 5).map((user: any) => (
                      <tr key={user.id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 font-medium text-text-dark">
                          <Link href={`/users/${user.id}`} className="hover:text-muted-teal hover:underline">
                            {user.first_name} {user.last_name}
                          </Link>
                          {user.code_name && <span className="text-text-light text-xs ml-2">({user.code_name})</span>}
                        </td>
                        <td className="px-8 py-5 text-text-medium">{timeAgo(user.last_online)}</td>
                        <td className="px-8 py-5 text-text-medium capitalize">{user.gender || 'N/A'}</td>
                        <td className="px-8 py-5 text-text-medium">{user.country || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-5 text-center text-text-medium">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-text-dark">New Users Waiting Verification</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-8 py-4 font-semibold" scope="col">User</th>
                    <th className="px-8 py-4 font-semibold" scope="col">Signup Date</th>
                    <th className="px-8 py-4 font-semibold text-right" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="px-8 py-5"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-8 py-5"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-8 py-5 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                      </tr>
                    ))
                  ) : verificationQueue?.length > 0 ? (
                    verificationQueue.slice(0, 5).map((user: any) => (
                      <tr key={user.id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 font-medium text-text-dark">
                          <Link href={`/users/${user.id}`} className="hover:text-muted-teal hover:underline">
                            {user.first_name} {user.last_name}
                          </Link>
                        </td>
                        <td className="px-8 py-5 text-text-medium">{formatDate(user.created_at)}</td>
                        <td className="px-8 py-5 text-right">
                          <button className="bg-muted-teal/30 text-text-dark font-semibold py-2 px-4 rounded-lg text-sm hover:bg-muted-teal/40 transition-colors">
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-5 text-center text-text-medium">No pending verifications</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
