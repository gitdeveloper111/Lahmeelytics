import { Sidebar } from "@/components/layout/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchTopUsers, fetchCountries } from "@/lib/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

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

export default function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: fetchTopUsers,
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-off-white font-sans text-text-dark antialiased">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-[-0.04em] text-text-dark">Users</h1>
        </div>

        <div className="flex flex-col rounded-2xl border border-border-light bg-white shadow-md overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-text-dark">All Users</h3>
            <p className="text-text-medium mt-1">Recently active users on the platform</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="text-xs text-text-medium uppercase bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="px-8 py-4 font-semibold" scope="col">User</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Email</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Last Active</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Gender</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Country</th>
                  <th className="px-8 py-4 font-semibold" scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-border-light">
                      <td className="px-8 py-5"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-4 w-16" /></td>
                    </tr>
                  ))
                ) : users?.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user.id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 font-medium text-text-dark">
                        <Link href={`/users/${user.id}`} className="hover:text-muted-teal hover:underline">
                          {user.first_name || user.code_name} {user.last_name || ''}
                        </Link>
                      </td>
                      <td className="px-8 py-5 text-text-medium">{user.email}</td>
                      <td className="px-8 py-5 text-text-medium">{timeAgo(user.last_online)}</td>
                      <td className="px-8 py-5 text-text-medium capitalize">{user.gender || 'N/A'}</td>
                      <td className="px-8 py-5 text-text-medium">{user.country || 'N/A'}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Verified' ? 'bg-muted-teal/30 text-text-dark' : 
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-text-medium'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-text-medium">No users found</td>
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
