import Header from "@/components/Header";
import { AuditTrailDashboard } from "@/components/AuditTrailDashboard";

export default function AuditTrail() {
  return (
    <div className="min-h-screen bg-studio-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AuditTrailDashboard />
      </main>
    </div>
  );
}