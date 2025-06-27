import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import { JobStatus } from "@repo/api-client"
import { formatStatus } from "@/lib/utils"

function StatusCard({
  status,
  count,
}: {
  status: JobStatus
  count: number
}) {
  return (
    <Link to="/jobs" search={{ status: status }}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg">{formatStatus(status)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{count}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default StatusCard