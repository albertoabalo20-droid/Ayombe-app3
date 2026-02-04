# Ayombe App - Lista de Tareas

## Base de Datos y Modelos
- [x] Diseñar esquema de base de datos (usuarios, eventos, noticias, asistencias, recursos)
- [x] Crear tablas en drizzle/schema.ts
- [x] Implementar helpers de consulta en server/db.ts
- [x] Ejecutar migraciones con pnpm db:push

## Sistema de Autenticación y Usuarios
- [x] Configurar roles Admin y Músico en el sistema
- [x] Implementar procedimiento para crear usuarios manualmente (solo Admin)
- [x] Crear procedimiento para listar todos los usuarios
- [x] Crear procedimiento para editar usuarios
- [x] Crear procedimiento para eliminar usuarios
- [x] Implementar middleware de protección para rutas de Admin
- [x] Escribir tests para autenticación y roles

## Panel de Administración
- [x] Crear layout de dashboard con sidebar para Admin
- [x] Implementar página de gestión de usuarios (crear, editar, eliminar)
- [x] Implementar página de gestión de eventos (crear, editar, eliminar)
- [x] Implementar página de gestión de noticias (crear, editar, eliminar)
- [x] Implementar página de gestión de recursos (agregar, editar, eliminar)
- [x] Agregar formularios con validación para todas las entidades

## Dashboard de Músicos
- [x] Crear layout principal con franja de noticias destacada arriba
- [x] Implementar componente de banner de noticias urgentes
- [x] Crear lista cronológica de eventos próximos
- [x] Mostrar detalles de eventos (fecha, hora, ubicación, uniforme, prueba de sonido)
- [x] Integrar enlaces a Google Maps para ubicaciones
- [x] Implementar visualización de fotos de uniformes

## Confirmación de Asistencia
- [x] Crear tabla de asistencias en base de datos
- [x] Implementar procedimiento para confirmar/cancelar asistencia
- [x] Agregar botón de confirmación en cada evento
- [x] Mostrar estado de asistencia del músico en cada evento
- [ ] Panel Admin: ver lista de confirmaciones por evento

## Recursos Multimedia
- [x] Crear sección de recursos accesible para todos
- [x] Implementar reproductor de audio enlazado a Google Drive
- [x] Agregar visualizador de documento de reglamento
- [x] Permitir a Admin subir/actualizar recursos

## Optimización PWA
- [x] Configurar manifest.json con nombre, iconos y colores de Ayombe
- [x] Implementar service worker para funcionamiento offline
- [x] Optimizar imágenes y recursos para carga rápida
- [x] Asegurar diseño responsive para móviles
- [x] Implementar lazy loading de imágenes
- [x] Agregar meta tags para PWA

## Diseño y UX
- [x] Definir paleta de colores y tipografía para banda musical
- [x] Diseñar interfaz mobile-first
- [x] Implementar estados de carga y errores
- [x] Agregar animaciones sutiles para mejor UX
- [x] Asegurar contraste adecuado para legibilidad

## Testing y Deployment
- [x] Escribir tests unitarios para procedimientos críticos
- [x] Probar flujo completo de Admin y Músico
- [x] Verificar funcionamiento en dispositivos móviles
- [ ] Crear checkpoint final
- [ ] Generar credenciales de administrador
- [ ] Documentar credenciales y URL de acceso
