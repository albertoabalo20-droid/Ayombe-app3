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
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function NewsManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isUrgent: false,
  });

  const utils = trpc.useUtils();
  const { data: newsList, isLoading } = trpc.news.list.useQuery();
  
  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      toast.success("Noticia creada exitosamente");
      utils.news.list.invalidate();
      utils.news.urgent.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error al crear noticia: ${error.message}`);
    },
  });

  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      toast.success("Noticia actualizada exitosamente");
      utils.news.list.invalidate();
      utils.news.urgent.invalidate();
      setIsEditOpen(false);
      setSelectedNews(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error al actualizar noticia: ${error.message}`);
    },
  });

  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      toast.success("Noticia eliminada exitosamente");
      utils.news.list.invalidate();
      utils.news.urgent.invalidate();
    },
    onError: (error) => {
      toast.error(`Error al eliminar noticia: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      isUrgent: false,
    });
  };

  const handleCreate = () => {
    createNews.mutate(formData);
  };

  const handleEdit = () => {
    if (!selectedNews) return;
    updateNews.mutate({
      id: selectedNews.id,
      ...formData,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      deleteNews.mutate({ id });
    }
  };

  const openEditDialog = (news: any) => {
    setSelectedNews(news);
    setFormData({
      title: news.title || "",
      content: news.content || "",
      isUrgent: news.isUrgent === 1,
    });
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Cargando noticias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
          <p className="text-muted-foreground mt-1">
            Administra las noticias y avisos urgentes de la banda
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Noticia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Noticia</DialogTitle>
              <DialogDescription>
                Publica un aviso o noticia para todos los músicos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Ensayo cancelado hoy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe el contenido de la noticia..."
                  rows={6}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isUrgent"
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) => setFormData({ ...formData, isUrgent: checked })}
                />
                <Label htmlFor="isUrgent" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Marcar como urgente (se mostrará destacada en el dashboard)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={!formData.title || !formData.content}>
                Crear Noticia
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
              <TableHead>Contenido</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsList?.map((news) => (
              <TableRow key={news.id}>
                <TableCell className="font-medium">{news.title}</TableCell>
                <TableCell className="max-w-md truncate">{news.content}</TableCell>
                <TableCell>
                  {news.isUrgent === 1 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      Urgente
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Normal
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {news.createdAt ? format(new Date(news.createdAt), "PPP", { locale: es }) : "-"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(news)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(news.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Noticia</DialogTitle>
            <DialogDescription>
              Modifica la información de la noticia seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Contenido</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isUrgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked) => setFormData({ ...formData, isUrgent: checked })}
              />
              <Label htmlFor="edit-isUrgent" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Marcar como urgente
              </Label>
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
