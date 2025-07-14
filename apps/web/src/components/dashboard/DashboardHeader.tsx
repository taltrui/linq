interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Tomás" }: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Buenos días";
    }
    if (hour < 17) {
      return "Buenas tardes";
    }
    return "Buenas noches";
  };

  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <div className="mb-8">
      <div className="text-sm text-muted-foreground mb-1">
        {formatDate()}
      </div>
      <h1 className="text-3xl font-bold text-foreground">
        {getGreeting()}, {userName}
      </h1>
    </div>
  );
}