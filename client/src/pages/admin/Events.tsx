import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EventsManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    showTime: "",
    soundCheckTime: "",
    location: "",
    locationMapUrl: "",
    uniformDescription: "",
    uniformImageUrl: "",
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.events.list.useQuery();
  
  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Evento creado exitosamente");
      utils.events.list.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error al crear evento: ${error.message}`);
    },
  });

  const updateEvent = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Evento actualizado exitosamente");
      utils.events.list.invalidate();
      setIsEditOpen(false);
      setSelectedEvent(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error al actualizar evento: ${error.message}`);
    },
  });

  const deleteEvent = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Evento eliminado exitosamente");
      utils.events.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Error al eliminar evento: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      showTime: "",
      soundCheckTime: "",
      location: "",
      locationMapUrl: "",
      uniformDescription: "",
      uniformImageUrl: "",
      notes: "",
    });
  };

  const handleCreate = () => {
    createEvent.mutate({
      ...formData,
      date: new Date(formData.date),
    });
  };

  const handleEdit = () => {
    if (!selectedEvent) return;
    updateEvent.mutate({
      id: selectedEvent.id,
      ...formData,
      date: formData.date ? new Date(formData.date) : undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este evento?")) {
      deleteEvent.mutate({ id });
    }
  };

  const openEditDialog = (event: any) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || "",
      date: event.date ? format(new Date(event.date), "yyyy-MM-dd'T'HH:mm") : "",
      showTime: event.showTime || "",
      soundCheckTime: event.soundCheckTime || "",
      location: event.location || "",
      locationMapUrl: event.locationMapUrl || "",
      uniformDescription: event.uniformDescription || "",
      uniformImageUrl: event.uniformImageUrl || "",
      notes: event.notes || "",
    });
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
          <p className="text-muted-foreground mt-1">
            Administra los toques y presentaciones de la banda
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
              <DialogDescription>
                Agrega un nuevo toque o presentación de la banda
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Concierto en Plaza Central"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha y Hora</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="showTime">Hora del Show</Label>
                  <Input
                    id="showTime"
                    value={formData.showTime}
                    onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
                    placeholder="Ej: 20:00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soundCheckTime">Hora de Prueba de Sonido</Label>
                <Input
                  id="soundCheckTime"
                  value={formData.soundCheckTime}
                  onChange={(e) => setFormData({ ...formData, soundCheckTime: e.target.value })}
                  placeholder="Ej: 18:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Dirección del evento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationMapUrl">URL de Google Maps</Label>
                <Input
                  id="locationMapUrl"
                  value={formData.locationMapUrl}
                  onChange={(e) => setFormData({ ...formData, locationMapUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniformDescription">Descripción del Uniforme</Label>
                <Textarea
                  id="uniformDescription"
                  value={formData.uniformDescription}
                  onChange={(e) => setFormData({ ...formData, uniformDescription: e.target.value })}
                  placeholder="Ej: Camisa blanca, pantalón negro, zapatos formales"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniformImageUrl">URL de Imagen del Uniforme</Label>
                <Input
                  id="uniformImageUrl"
                  value={formData.uniformImageUrl}
                  onChange={(e) => setFormData({ ...formData, uniformImageUrl: e.target.value })}
                  placeholder="URL de la imagen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre el evento"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={!formData.title || !formData.date}>
                Crear Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora Show</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {event.date ? format(new Date(event.date), "PPP", { locale: es }) : "-"}
                </TableCell>
                <TableCell>{event.showTime}</TableCell>
                <TableCell className="max-w-xs truncate">{event.location}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Modifica la información del evento seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título del Evento</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha y Hora</Label>
                <Input
                  id="edit-date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-showTime">Hora del Show</Label>
                <Input
                  id="edit-showTime"
                  value={formData.showTime}
                  onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-soundCheckTime">Hora de Prueba de Sonido</Label>
              <Input
                id="edit-soundCheckTime"
                value={formData.soundCheckTime}
                onChange={(e) => setFormData({ ...formData, soundCheckTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Ubicación</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-locationMapUrl">URL de Google Maps</Label>
              <Input
                id="edit-locationMapUrl"
                value={formData.locationMapUrl}
                onChange={(e) => setFormData({ ...formData, locationMapUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-uniformDescription">Descripción del Uniforme</Label>
              <Textarea
                id="edit-uniformDescription"
                value={formData.uniformDescription}
                onChange={(e) => setFormData({ ...formData, uniformDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-uniformImageUrl">URL de Imagen del Uniforme</Label>
              <Input
                id="edit-uniformImageUrl"
                value={formData.uniformImageUrl}
                onChange={(e) => setFormData({ ...formData, uniformImageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notas Adicionales</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
