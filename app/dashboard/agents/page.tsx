import Agents from "./_components/Agents";
import ApplicationsTable from "./_components/Applications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";

export default async function AgentsPage() {
  const supabase = await createClient();

  const { count: activeCount } = await supabase.from('brokers').select('*', { count: 'exact', head: true });
  const { count: pendingCount } = await supabase.from('broker_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: rejectedCount } = await supabase.from('broker_applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Agent Management</h2>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Agents <span className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">{activeCount || 0}</span></TabsTrigger>
          <TabsTrigger value="pending">Pending <span className="ml-2 inline-flex items-center justify-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">{pendingCount || 0}</span></TabsTrigger>
          <TabsTrigger value="rejected">Rejected <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">{rejectedCount || 0}</span></TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Agents />
        </TabsContent>
        <TabsContent value="pending">
          <ApplicationsTable status="pending" />
        </TabsContent>
        <TabsContent value="rejected">
          <ApplicationsTable status="rejected" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
