import { StatCard } from "@/components/dashboard/StatCard"
import { AlertTriangle, Briefcase, FileText, Users } from "lucide-react"
import { useDashboardStats } from "@/services/queries/useDashboardStats"

function StatsGrid() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  return (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCard
      title="Jobs Today"
      value={stats?.jobsToday}
      icon={<Briefcase className="size-5 text-muted-foreground" />}
      description="All scheduled jobs for today"
      loading={isLoadingStats}
    />
    <StatCard
      title="Active Workers"
      value={stats?.activeWorkers}
      icon={<Users className="size-5 text-muted-foreground" />}
      description="Technicians available for work"
      loading={isLoadingStats}
    />
    <StatCard
      title="Unassigned Jobs"
      value={stats?.unassignedJobs}
      icon={<AlertTriangle className="size-5 text-muted-foreground" />}
      description="Jobs needing a technician"
      loading={isLoadingStats}
      isWarning={!!stats?.unassignedJobs}
    />
    <StatCard
      title="Pending Invoices"
      value={stats?.pendingInvoices}
      icon={<FileText className="size-5 text-muted-foreground" />}
      description="Awaiting client payment"
      loading={isLoadingStats}
    />
  </div>)
}

export default StatsGrid