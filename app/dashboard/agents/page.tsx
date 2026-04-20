import Agents from "./_components/Agents";
import ApplicationsTable from "./_components/Applications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentsPage() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Agent Management</h2>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Agents</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
