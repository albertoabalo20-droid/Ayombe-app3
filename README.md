# 🎵 Ayombe App - Gestión Interna

Aplicación web PWA para la gestión interna del grupo musical Ayombe.

## 🚀 Características

- ✅ Sistema de autenticación con roles (Admin/Músico)
- ✅ Dashboard con noticias urgentes destacadas
- ✅ Gestión de eventos con confirmación de asistencia
- ✅ Detalles completos de eventos (fecha, hora, ubicación, uniforme, prueba de sonido)
- ✅ Recursos multimedia (audio, documentos)
- ✅ Optimizado para dispositivos móviles (PWA)
- ✅ Tema oscuro con acentos musicales

## 🛠️ Tecnologías

- **Frontend:** React 19 + Tailwind CSS 4
- **Backend:** Express + tRPC
- **Base de Datos:** MySQL (compatible con Railway, PlanetScale)
- **Autenticación:** Sistema de roles Admin/Músico
- **Despliegue:** Vercel, Railway, o cualquier plataforma Node.js

## 📦 Instalación Local

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
# Copia .env.example y completa los valores

# Ejecutar migraciones de base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

## 🌐 Despliegue

Esta aplicación está lista para desplegarse en:
- **Vercel** (recomendado para frontend y backend)
- **Railway** (incluye base de datos MySQL)
- **Netlify** (alternativa)

## 📝 Variables de Entorno Requeridas

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=tu_secreto_seguro_aqui
NODE_ENV=production
```

## 👥 Roles de Usuario

- **Admin:** Control total (crear eventos, usuarios, noticias)
- **Músico:** Solo lectura y confirmación de asistencia

## 📄 Licencia

Proyecto privado del grupo musical Ayombe.
