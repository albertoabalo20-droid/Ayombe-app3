import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, MapPin, Shirt, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function Dashboard() {
  const utils = trpc.useUtils();
  const { data: urgentNews } = trpc.news.urgent.useQuery();
  const { data: upcomingEvents, isLoading: eventsLoading } = trpc.events.upcoming.useQuery();
  const { data: myAttendances } = trpc.attendances.myAttendances.useQuery();

  const upsertAttendance = trpc.attendances.upsert.useMutation({
    onSuccess: () => {
      toast.success("Asistencia actualizada");
      utils.attendances.myAttendances.invalidate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const getAttendanceStatus = (eventId: number) => {
    return myAttendances?.find((a) => a.eventId === eventId)?.status || "pending";
  };

  const handleAttendance = (eventId: number, status: "confirmed" | "declined") => {
    upsertAttendance.mutate({ eventId, status });
  };

  return (
    <div className="space-y-6">
      {/* Franja de Noticias Urgentes */}
      {urgentNews && urgentNews.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">
                {urgentNews[0].title}
              </h3>
              <p className="text-sm text-foreground/90">{urgentNews[0].content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Ayombe</h1>
        <p className="text-muted-foreground mt-1">
          Próximos eventos y confirmaciones de asistencia
        </p>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-4">
        {eventsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Cargando eventos...</div>
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => {
            const attendanceStatus = getAttendanceStatus(event.id);
            return (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="bg-card/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {event.date && format(new Date(event.date), "PPPP", { locale: es })}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        attendanceStatus === "confirmed"
                          ? "default"
                          : attendanceStatus === "declined"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {attendanceStatus === "confirmed"
                        ? "Confirmado"
                        : attendanceStatus === "declined"
                        ? "No asistiré"
                        : "Pendiente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Información del Evento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Hora del Show</p>
                        <p className="text-sm text-muted-foreground">{event.showTime}</p>
                      </div>
                    </div>
                    {event.soundCheckTime && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Prueba de Sonido</p>
                          <p className="text-sm text-muted-foreground">{event.soundCheckTime}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Ubicación</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        {event.locationMapUrl && (
                          <a
                            href={event.locationMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Ver en Google Maps →
                          </a>
                        )}
                      </div>
                    </div>
                    {event.uniformDescription && (
                      <div className="flex items-start gap-3">
                        <Shirt className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Uniforme</p>
                          <p className="text-sm text-muted-foreground">{event.uniformDescription}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Imagen del Uniforme */}
                  {event.uniformImageUrl && (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={event.uniformImageUrl}
                        alt="Uniforme"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Notas Adicionales */}
                  {event.notes && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">Notas Adicionales</p>
                      <p className="text-sm text-muted-foreground">{event.notes}</p>
                    </div>
                  )}

                  {/* Botones de Confirmación */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant={attendanceStatus === "confirmed" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => handleAttendance(event.id, "confirmed")}
                      disabled={attendanceStatus === "confirmed"}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Asistencia
                    </Button>
                    <Button
                      variant={attendanceStatus === "declined" ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => handleAttendance(event.id, "declined")}
                      disabled={attendanceStatus === "declined"}
                    >
                      <X className="mr-2 h-4 w-4" />
                      No Asistiré
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No hay eventos próximos programados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
