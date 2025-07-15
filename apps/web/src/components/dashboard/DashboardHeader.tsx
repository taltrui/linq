import { format } from "date-fns";
import { es } from "date-fns/locale/es";

interface DashboardHeaderProps {
  userName: string;
}

const getWelcomeByTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div>
      <span className="text-lg">
        {format(new Date(), "EEEE, dd 'de' MMMM", { locale: es })}
      </span>
      <h1>
        {getWelcomeByTime()}, {userName}
      </h1>
    </div>
  );
}
