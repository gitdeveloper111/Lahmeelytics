import { Sidebar } from "@/components/layout/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "@/lib/api";
import { useRoute, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 30) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function UserDetailsPage() {
  const [match, params] = useRoute("/users/:id");
  const userId = params?.id;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserDetails(userId!),
    enabled: !!userId,
  });

  if (!match) {
    return null;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-off-white font-sans text-text-dark antialiased">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <Link href="/users" className="inline-flex items-center gap-2 text-text-medium hover:text-muted-teal mb-6 transition-colors" data-testid="link-back-users">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back to Users</span>
        </Link>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-red-400 mb-2 block">error</span>
            <p className="text-red-600 font-medium">User not found</p>
            <Link href="/users" className="text-muted-teal hover:underline mt-2 inline-block">
              Return to users list
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-64 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-[-0.04em] text-text-dark" data-testid="text-user-name">
                      {user?.first_name || user?.code_name} {user?.last_name || ''}
                    </h1>
                    <p className="text-text-medium mt-1" data-testid="text-user-code">{user?.code_name}</p>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {!isLoading && user?.status === 'pending' && (
                  <>
                    <button className="bg-red-100 text-red-600 font-semibold py-2 px-6 rounded-lg hover:bg-red-200 transition-colors" data-testid="button-reject">
                      Reject
                    </button>
                    <button className="bg-muted-teal text-white font-semibold py-2 px-6 rounded-lg hover:bg-muted-teal/90 transition-colors" data-testid="button-verify">
                      Verify User
                    </button>
                  </>
                )}
                {!isLoading && user?.deactivated === 1 && (
                  <button className="bg-muted-teal text-white font-semibold py-2 px-6 rounded-lg hover:bg-muted-teal/90 transition-colors" data-testid="button-reactivate">
                    Reactivate
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
                <p className="text-text-medium text-base font-medium">Status</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <span className={`inline-flex items-center gap-2 text-lg font-bold ${
                    user?.status === 'Verified' ? 'text-muted-teal' :
                    user?.status === 'pending' ? 'text-yellow-600' :
                    user?.deactivated === 1 ? 'text-red-500' :
                    'text-text-dark'
                  }`} data-testid="text-status">
                    <span className="material-symbols-outlined text-xl">
                      {user?.status === 'Verified' ? 'verified' :
                       user?.status === 'pending' ? 'pending' :
                       user?.deactivated === 1 ? 'block' : 'person'}
                    </span>
                    {user?.deactivated === 1 ? 'Deactivated' : user?.status}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
                <p className="text-text-medium text-base font-medium">Sent Requests</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-text-dark tracking-tight text-3xl font-bold" data-testid="text-sent-requests">{user?.stats?.sentRequests || 0}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
                <p className="text-text-medium text-base font-medium">Received Requests</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-text-dark tracking-tight text-3xl font-bold" data-testid="text-received-requests">{user?.stats?.receivedRequests || 0}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light bg-white shadow-sm">
                <p className="text-text-medium text-base font-medium">Matches</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-text-dark tracking-tight text-3xl font-bold" data-testid="text-matches">{user?.stats?.acceptedMatches || 0}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
                <div className="p-6 border-b border-border-light bg-gray-50">
                  <h3 className="text-xl font-bold text-text-dark">Profile Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Email</span>
                        <span className="text-text-dark font-medium" data-testid="text-email">{user?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Phone</span>
                        <span className="text-text-dark font-medium" data-testid="text-phone">{user?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Gender</span>
                        <span className="text-text-dark font-medium capitalize" data-testid="text-gender">{user?.gender || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Age</span>
                        <span className="text-text-dark font-medium" data-testid="text-age">
                          {user?.date_of_birth ? `${calculateAge(user.date_of_birth)} years` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-text-medium">Location</span>
                        <span className="text-text-dark font-medium" data-testid="text-location">
                          {[user?.city, user?.country].filter(Boolean).join(', ') || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
                <div className="p-6 border-b border-border-light bg-gray-50">
                  <h3 className="text-xl font-bold text-text-dark">Activity & Subscription</h3>
                </div>
                <div className="p-6 space-y-4">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Joined</span>
                        <span className="text-text-dark font-medium" data-testid="text-joined">{formatDate(user?.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Last Active</span>
                        <span className="text-text-dark font-medium" data-testid="text-last-active">{timeAgo(user?.last_online)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-light/50">
                        <span className="text-text-medium">Subscription</span>
                        {user?.subscription ? (
                          <span className="inline-flex items-center gap-1 text-muted-teal font-medium" data-testid="text-subscription">
                            <span className="material-symbols-outlined text-sm">diamond</span>
                            {user.subscription.plan_type || 'Premium'}
                          </span>
                        ) : (
                          <span className="text-text-medium" data-testid="text-subscription">Free</span>
                        )}
                      </div>
                      {user?.subscription && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-text-medium">Expires</span>
                          <span className="text-text-dark font-medium" data-testid="text-expires">{formatDate(user.subscription.expiry)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
