import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, FileText, Video, ExternalLink } from "lucide-react";

export default function ResourcesView() {
  const { data: resources, isLoading } = trpc.resources.list.useQuery();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Music className="h-6 w-6" />;
      case "document":
        return <FileText className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "audio":
        return "Audio";
      case "document":
        return "Documento";
      case "video":
        return "Video";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "audio":
        return "text-primary";
      case "document":
        return "text-blue-500";
      case "video":
        return "text-purple-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Cargando recursos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recursos</h1>
        <p className="text-muted-foreground mt-1">
          Audios, documentos y videos de la banda
        </p>
      </div>

      {resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`${getTypeColor(resource.type)} mt-1`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {getTypeLabel(resource.type)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.description && (
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(resource.url, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir Recurso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay recursos disponibles en este momento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
