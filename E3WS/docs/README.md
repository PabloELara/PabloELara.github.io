# 🌍⚡ E3WS - Sistema de Alerta Sísmica Temprana

Este proyecto contiene la maqueta inicial del sitio web para **E3WS**, un sistema de alerta sísmica temprana orientado a proteger vidas y comunidades en Latinoamérica.

---

## 🛠️ Estado del Proyecto

Hasta la fecha, se ha implementado un **sitio web base (`index.html`)** con:

### 1. Diseño general
- Paleta de colores definida con variables CSS:
  - Fondo claro.
  - Texto en tonos gris oscuro.
  - Azul principal y azul claro como colores de marca.
  - Fondo alterno para secciones destacadas.
- Uso de tipografía **Roboto** desde Google Fonts.
- Sombras y bordes redondeados para un estilo limpio y moderno.

### 2. Menú de navegación (Navbar)
- Barra superior fija de color oscuro (`#111111`).
- Logo claro integrado (`img/logo-claro.png`).
- Menú con enlaces a todas las secciones:
  - Inicio, Nosotros, E3WS, Sistema, Beneficios, Casos, Novedades, Demo y Contacto.
- Efecto hover y activo con color de la marca.

### 3. Hero (portada)
- Fondo en **degradado azul → celeste**.
- Título y subtítulo claros y directos.
- Dos botones de acción:
  - **Ver Demo** (principal).
  - **Conocer más** (secundario).
- Logo integrado también en esta sección como imagen principal.

### 4. Secciones principales
- **Nosotros**: tarjetas con Visión, Misión y Valores.
- **¿Qué es E3WS?**: descripción resumida en bloque destacado.
- **El Sistema**: explicación técnica simplificada.
- **Beneficios**: tres tarjetas con íconos (tiempo real, infraestructura, comunidad).
- **Casos**: carrusel básico con ejemplos de implementación.
- **Novedades**: cards tipo blog con imagen de fondo simulada.
- **Demo**: placeholder para integrar visualización de datos en el futuro.
- **Contacto**: formulario funcional a nivel de maqueta:
  - Validación básica.
  - Honeypot anti-bots.
  - Mensaje de éxito simulado.

### 5. Footer
- Pie de página con derechos reservados.

### 6. JavaScript implementado
- Scroll suave con compensación del header fijo.
- Activación de enlaces de navegación según sección visible.
- Animaciones de entrada (fade + lift).
- Carrusel básico en **Casos**.
- Validación de formulario de contacto (simulada).

---

## 📌 Pendientes

1. **Responsive móvil**
   - Menú hamburguesa para pantallas pequeñas.
   - Ajuste de logo y texto en la portada.
   - Revisar márgenes/paddings en todas las secciones.

2. **Recursos externos**
   - Fuentes: ahora solo se usa Google Fonts (`Roboto`).
   - Íconos: Font Awesome vía CDN.
   - Evaluar integración local de estos recursos para independencia de conexión.

3. **Logo**
   - Confirmar uso único del `logo-claro.png` o alternar entre logo claro/oscuro según contexto.
   - Ajustar tamaños para desktop y móvil.

4. **Contenido**
   - Sustituir textos ficticios con contenido real.
   - Reemplazar placeholders de imágenes en la sección de Novedades.

5. **Accesibilidad y SEO**
   - Revisar atributos `alt` de todas las imágenes.
   - Completar metadatos: `description`, `keywords`.
   - Revisar etiquetas `aria` en carrusel y formulario.

---

## 📂 Estructura de Archivos
E3WS/
│
├── index.html # Archivo base del sitio
├── README.md # Documentación del proyecto (este archivo)
└── img/
├── logo-claro.png
└── logo-oscuro.png (pendiente decidir uso)

## 🚀 Próximos pasos
- Optimizar la versión móvil.  
- Decidir tipografía definitiva y estilo de íconos.  
- Integrar visualización real en la sección Demo.  
- Definir estrategia SEO básica para buscadores.  

---
