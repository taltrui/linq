import { useState } from "react";
import { Calendar } from "@/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/TextArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/PrimitiveSelect";
import { Plus, Briefcase, Bell, CheckSquare } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "job" | "reminder" | "task";
  description?: string;
  priority?: "low" | "medium" | "high";
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunión con cliente - ABC Corp",
    date: new Date(2024, 11, 28),
    type: "job",
    description: "Consulta inicial para nuevo proyecto",
  },
  {
    id: "2",
    title: "Seguimiento con proveedor",
    date: new Date(2024, 11, 29),
    type: "reminder",
    priority: "medium",
  },
  {
    id: "3",
    title: "Completar propuesta de proyecto",
    date: new Date(2024, 11, 30),
    type: "task",
    priority: "high",
  },
  {
    id: "4",
    title: "Reunión de equipo",
    date: new Date(2025, 0, 2),
    type: "job",
    description: "Sincronización semanal del equipo",
  },
  {
    id: "5",
    title: "Revisar informes trimestrales",
    date: new Date(2025, 0, 3),
    type: "task",
    priority: "medium",
  },
];

const eventTypeConfig = {
  job: {
    icon: Briefcase,
    color: "bg-blue-500",
    badge: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    label: "trabajo",
  },
  reminder: {
    icon: Bell,
    color: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    label: "recordatorio",
  },
  task: {
    icon: CheckSquare,
    color: "bg-green-500",
    badge: "bg-green-100 text-green-800 hover:bg-green-200",
    label: "tarea",
  },
};

export function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "task" as const,
    description: "",
    priority: "medium" as const,
  });

  const eventsForSelectedDate = events.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  const getDayEvents = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      type: newEvent.type,
      description: newEvent.description,
      priority: newEvent.priority,
    };

    setEvents((prev) => [...prev, event]);
    setNewEvent({
      title: "",
      type: "task",
      description: "",
      priority: "medium",
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Calendario y Eventos
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Ingresa el título del evento"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value: "job" | "reminder" | "task") =>
                      setNewEvent((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Trabajo</SelectItem>
                      <SelectItem value="reminder">Recordatorio</SelectItem>
                      <SelectItem value="task">Tarea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={newEvent.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setNewEvent((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Ingresa la descripción del evento (opcional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateEvent}>Crear Evento</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                hasEvents: (date) => getDayEvents(date).length > 0,
              }}
              modifiersClassNames={{
                hasEvents:
                  "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
              }}
              className="[--cell-size:theme(spacing.12)]"
            />
          </div>

          <div className="flex-1 md:border-l md:pl-6 border-t pt-6 md:border-t-0 md:pt-0">
            <h3 className="font-semibold mb-3">
              Eventos para{" "}
              {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
            </h3>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No hay eventos para esta fecha</p>
                <p className="text-xs mt-1">
                  Haz clic en "Agregar Evento" para crear uno
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {eventsForSelectedDate.map((event) => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={`p-1.5 rounded-md ${config.color} text-white flex-shrink-0`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {event.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={`${config.badge} text-xs flex-shrink-0`}
                          >
                            {config.label}
                          </Badge>
                          {event.priority && (
                            <Badge
                              variant={
                                event.priority === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs flex-shrink-0"
                            >
                              {event.priority === "high"
                                ? "Alta"
                                : event.priority === "medium"
                                  ? "Media"
                                  : "Baja"}
                            </Badge>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
