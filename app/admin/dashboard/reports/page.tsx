import { createAdminClient } from "@/lib/supabase/admin";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = createAdminClient();

  // Fetch reports joined with profiles
  const { data: reports, error } = await supabase
    .from("reports")
    .select(`
      id,
      reason,
      status,
      created_at,
      reporter:reporter_id(id, full_name, email, avatar_url),
      reported:reported_id(id, full_name, email, avatar_url)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error loading reports: {error.message}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">User Reports</h1>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        {!reports || reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reports found.</div>
        ) : (
          <div className="divide-y">
            {reports.map((report: any) => (
              <div key={report.id} className="flex flex-col p-5 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reported:</span>
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={report.reported?.avatar_url} />
                      <AvatarFallback>{report.reported?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-gray-900">{report.reported?.full_name || "Unknown User"}</span>
                    <span className="text-sm text-gray-500">({report.reported?.email || "No email"})</span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="bg-red-50 text-red-900 p-4 rounded-md text-sm mb-4 border border-red-100">
                  <span className="font-semibold block mb-1 text-red-800">Reason:</span>
                  {report.reason}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span className="font-medium">Reported by:</span>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={report.reporter?.avatar_url} />
                    <AvatarFallback>{report.reporter?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span>{report.reporter?.full_name || "Unknown"} ({report.reporter?.email})</span>
                  
                  <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium border border-gray-200 uppercase text-[10px] tracking-wider">
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
