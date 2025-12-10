import { Sidebar } from "@/components/layout/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchKPIs, fetchSignupsTrend, fetchEngagement, fetchUsersByCountry } from "@/lib/api";

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toLocaleString();
}

export default function ReportsPage() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => fetchKPIs(),
  });

  const { data: signupsTrend } = useQuery({
    queryKey: ['signupsTrend'],
    queryFn: fetchSignupsTrend,
  });

  const { data: usersByCountry } = useQuery({
    queryKey: ['usersByCountry'],
    queryFn: fetchUsersByCountry,
  });

  const totalSignups90d = signupsTrend?.reduce((acc: number, d: any) => acc + d.count, 0) || 0;

  // Group users by country
  const countryStats: Record<string, { women: number; men: number; total: number }> = {};
  usersByCountry?.forEach((row: any) => {
    if (!countryStats[row.country]) {
      countryStats[row.country] = { women: 0, men: 0, total: 0 };
    }
    if (row.gender?.toLowerCase() === 'female') {
      countryStats[row.country].women = row.count;
    } else if (row.gender?.toLowerCase() === 'male') {
      countryStats[row.country].men = row.count;
    }
    countryStats[row.country].total += row.count;
  });

  const sortedCountries = Object.entries(countryStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-off-white font-sans text-text-dark antialiased">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-[-0.04em] text-text-dark">Reports</h1>
            <p className="text-text-medium mt-2">Detailed analytics and insights</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium">Total Users</p>
            <p className="text-text-dark tracking-tight text-3xl font-bold">{formatNumber(kpis?.totalUsers || 0)}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium">Signups (90 Days)</p>
            <p className="text-text-dark tracking-tight text-3xl font-bold">{formatNumber(totalSignups90d)}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium">Premium Users</p>
            <p className="text-text-dark tracking-tight text-3xl font-bold">{formatNumber(kpis?.activePremium || 0)}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
            <p className="text-text-medium text-base font-medium">Total Matches</p>
            <p className="text-text-dark tracking-tight text-3xl font-bold">{formatNumber(kpis?.totalMatches || 0)}</p>
          </div>
        </div>

        {/* Users by Country */}
        <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden mb-10">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-text-dark">Users by Country</h3>
            <p className="text-text-medium mt-1">Distribution of verified users across countries</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="px-8 py-4 font-semibold" scope="col">Country</th>
                  <th className="px-8 py-4 font-semibold text-right" scope="col">Women</th>
                  <th className="px-8 py-4 font-semibold text-right" scope="col">Men</th>
                  <th className="px-8 py-4 font-semibold text-right" scope="col">Total</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {sortedCountries.map(([country, stats]) => {
                  const maxTotal = sortedCountries[0]?.[1]?.total || 1;
                  const percentage = (stats.total / maxTotal) * 100;
                  return (
                    <tr key={country} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 font-medium text-text-dark">{country}</td>
                      <td className="px-8 py-5 text-text-medium text-right">{stats.women}</td>
                      <td className="px-8 py-5 text-text-medium text-right">{stats.men}</td>
                      <td className="px-8 py-5 text-text-dark font-semibold text-right">{stats.total}</td>
                      <td className="px-8 py-5">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-muted-teal h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md p-8">
            <h3 className="text-2xl font-bold text-text-dark mb-6">Gender Distribution</h3>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-medium">Women</span>
                  <span className="font-bold text-text-dark">{formatNumber(kpis?.womenCount || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div 
                    className="bg-soft-peach h-4 rounded-full" 
                    style={{ width: `${((kpis?.womenCount || 0) / ((kpis?.womenCount || 0) + (kpis?.menCount || 1))) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-medium">Men</span>
                  <span className="font-bold text-text-dark">{formatNumber(kpis?.menCount || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div 
                    className="bg-muted-teal h-4 rounded-full" 
                    style={{ width: `${((kpis?.menCount || 0) / ((kpis?.womenCount || 0) + (kpis?.menCount || 1))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-text-medium mt-4 text-center">
              Ratio: <span className="font-bold text-text-dark">{kpis?.womenMenRatio}</span>
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md p-8">
            <h3 className="text-2xl font-bold text-text-dark mb-6">User Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-medium">Active (30 days)</span>
                  <span className="font-bold text-text-dark">{formatNumber(kpis?.active30d || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className="bg-muted-teal h-3 rounded-full" 
                    style={{ width: `${((kpis?.active30d || 0) / (kpis?.totalUsers || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-medium">Verified</span>
                  <span className="font-bold text-text-dark">{formatNumber(kpis?.verifiedUsers || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className="bg-chart-blue h-3 rounded-full" 
                    style={{ width: `${((kpis?.verifiedUsers || 0) / (kpis?.totalUsers || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-medium">Deactivated</span>
                  <span className="font-bold text-text-dark">{formatNumber(kpis?.deactivatedUsers || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className="bg-chart-red h-3 rounded-full" 
                    style={{ width: `${((kpis?.deactivatedUsers || 0) / (kpis?.totalUsers || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
