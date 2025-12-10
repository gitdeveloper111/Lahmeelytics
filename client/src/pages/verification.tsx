import { Sidebar } from "@/components/layout/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchVerificationQueue } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function VerificationPage() {
  const { data: queue, isLoading } = useQuery({
    queryKey: ['verificationQueue'],
    queryFn: fetchVerificationQueue,
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-off-white font-sans text-text-dark antialiased">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-[-0.04em] text-text-dark">Verification</h1>
            <p className="text-text-medium mt-2">Review and verify new user registrations</p>
          </div>
          <div className="flex items-center gap-2 bg-soft-peach/50 px-4 py-2 rounded-lg">
            <span className="material-symbols-outlined text-text-dark">pending</span>
            <span className="font-bold text-text-dark">{queue?.length || 0}</span>
            <span className="text-text-medium">pending</span>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-text-dark">Pending Verifications</h3>
            <p className="text-text-medium mt-1">Users waiting for profile approval</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="px-8 py-4 font-semibold" scope="col">User</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Email</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Signup Date</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Country</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Gender</th>
                  <th className="px-8 py-4 font-semibold text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border-light">
                      <td className="px-8 py-5"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-8 py-5 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : queue?.length > 0 ? (
                  queue.map((user: any) => (
                    <tr key={user.id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 font-medium text-text-dark">
                        <Link href={`/users/${user.id}`} className="hover:text-muted-teal hover:underline">
                          {user.first_name || user.code_name} {user.last_name || ''}
                        </Link>
                      </td>
                      <td className="px-8 py-5 text-text-medium">{user.email}</td>
                      <td className="px-8 py-5 text-text-medium">{formatDate(user.created_at)}</td>
                      <td className="px-8 py-5 text-text-medium">{user.country || 'N/A'}</td>
                      <td className="px-8 py-5 text-text-medium capitalize">{user.gender || 'N/A'}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                          <button className="bg-muted-teal/30 text-text-dark font-semibold py-2 px-4 rounded-lg text-sm hover:bg-muted-teal/40 transition-colors">
                            Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-text-medium">
                      <span className="material-symbols-outlined text-4xl text-muted-teal mb-2 block">verified</span>
                      No pending verifications
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
