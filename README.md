# 🐾 AniValientesApp

**AniValientes** es una aplicación móvil desarrollada como ejercicio de la asignatura Proyecto 3 - Media del
Grado Universitario en Técnicas de Interacción Digital y Multimedia de la UOC. El objetivo del proyecto es
el desarrollo de una plataforma integral para la lucha contra el abandono animal. Permite a cualquier ciudadano 
denunciar casos de abandono de forma muy sencilla a través de su teléfono móvil y a las administraciones gestionar 
dichas denuncias de forma efectiva, manteniendo una comunicación constante con los ciudadanos.

---

## 📱 Aplicación Móvil


Esta es la app oficial del proyecto AniValientes. Desde ella, los ciudadanos pueden:

- Crear una denuncia con fotografía, localización y descripción.
- Seleccionar la administración responsable (automática o manualmente).
- Conocer el estado de sus denuncias (pendiente, resuelta, etc.)
- Recibir notificaciones sobre cambios en la denuncia.

🔒 **Privacidad**: la app solo accede a la ubicación cuando es necesario para determinar la administración responsable, y **nunca la usa sin consentimiento**.

---

## 🔑 Acceso de prueba

Puedes iniciar sesión con el siguiente usuario de prueba:

| Email                         | Contraseña |
|------------------------------|------------|
| alumnouocbcn@email.com       | password   |

Este usuario está vinculado a una administración de ejemplo y permite probar el funcionamiento completo.

---

## 🌐 Plataforma web asociada

La plataforma AniValientes incluye también un panel web de administración accesible públicamente:

🔗 [http://138.68.174.17:8080](http://138.68.174.17:8080)  
🔍 Documentación de la API REST: [http://138.68.174.17:8080/docs](http://138.68.174.17:8080/docs)

Repositorio correspondiente: [AnivalientesWeb_PR](https://github.com/jourdian/AnivalientesWeb_PR)

---

## 🚀 Instalación de la APK

> ⚠️ Esta versión es solo para pruebas académicas y **no está publicada en Google Play**.

### ▶️ Instrucciones

1. Descarga la última versión desde la sección [Releases](https://github.com/jourdian/AnivalientesApp_PR/releases).
2. Transfiere el archivo `.apk` a tu dispositivo Android.
3. En el dispositivo:
   - Activa *"Instalar desde fuentes desconocidas"* si aún no está habilitado.
   - Abre el archivo `.apk` y sigue las instrucciones para instalar.

---

## 📂 Estructura del proyecto

- `/assets/`: Recursos gráficos (iconos, splash, etc.)
- `/screens/`: Pantallas de la app (Home, Report Detail, New Report, etc.)
- `/services/`: Servicios como API REST, autenticación, etc.
- `/navigation/`: Configuración de navegación con React Navigation

---

## ⚙️ Tecnologías utilizadas

- **React Native + Expo**
- **Firebase** (notificaciones push)
- **Laravel + MySQL** (backend y panel de administración)
- **Leaflet + Google Maps** (mapas)
- **EAS Build** (compilación y firma de la APK)

---

## 🔐 Seguridad

- La app **no solicita permisos peligrosos** ni accede a información personal más allá de lo necesario.
- El acceso a la ubicación se gestiona de forma responsable, con solicitud explícita y uso restringido.
- La APK ha sido generada mediante [EAS Build](https://docs.expo.dev/eas/) y está **firmada automáticamente** por los servidores de Expo.
- Puedes verificar su integridad con el siguiente hash SHA-256:


sha256sum AniValientesApp.apk


## 👨‍💻 Autor

Proyecto desarrollado por Jordi Hernández Vinyals como parte del Grado en Técnicas de Interacción Digital y Multimedia – Universitat Oberta de Catalunya (UOC).


## 📄 Licencia

Este proyecto es de carácter académico. El código y los recursos únicamente pueden reutilizarse con fines educativos citando al autor.
Queda prohibido su uso comercial o redistribución sin autorización expresa.