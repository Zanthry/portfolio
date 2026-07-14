# 🌑 Portafolio de Carboncillo | Santuario de Galería Digital

Bienvenido al **Portafolio de Carboncillo**, un santuario digital diseñado específicamente para exhibir obras de arte en carboncillo con alta textura y alto contraste.

Este proyecto cierra la brecha entre la naturaleza cruda y táctil del polvo de carbón y la precisión de la ingeniería web moderna.

## 👁️ La Visión

El objetivo de este portafolio es actuar como un **Santuario de Galería Digital**. En lugar de abrumar el arte con elementos complejos de interfaz, el diseño da un paso atrás, apoyándose en una paleta monocromática de *Negro Obsidiana* y *Blanco Tiza* para dejar respirar la profundidad de los dibujos.

### Características Principales
- **Cuadrícula Masonry Inmersiva**: Un diseño fluido y orgánico que respeta las proporciones originales de cada obra.
- **Lightbox Etéreo**: Una experiencia de visualización a pantalla completa sin bordes.
- **Ruta Fantasma (Ghost Route)**: Un portal de subida oculto al que solo se puede acceder mediante la ruta secreta `#admin` en la URL.
- **Interfaz Atmosférica**: Cuenta con sutiles efectos de granulado y sombras de *papel sobre piedra* para simular una obra física.

## 🛠️ Cómo Fue Construido

Este proyecto fue construido con un enfoque en el **rendimiento ligero** y el uso de **tecnologías web puras**, evitando la sobrecarga de frameworks innecesarios.

### Stack Tecnológico
- **HTML5 y CSS3 (Puros)**: Para un control estructural estricto y animaciones fluidas (como los estados de carga granulados).
- **JavaScript Nativo (Módulos ES6)**: Para manejar la manipulación del DOM, el enrutamiento y la renderización dinámica de la galería.
- **Backend con Firebase (v10)**:
  - **Firestore**: Almacena los metadatos (títulos, fechas de carga y URLs).
  - **Firebase Storage**: Gestiona el alojamiento de las imágenes de las obras de arte.

### Tipografía
- **Playfair Display**: Utilizada para los encabezados, reflejando trazos orgánicos y clásicos del carboncillo.
- **Inter**: Utilizada para los elementos de interfaz, proporcionando precisión técnica y legibilidad.

## 🔒 La Ruta Fantasma (Acceso de Administrador)

Para mantener una interfaz perfectamente limpia para los visitantes, no hay botones de inicio de sesión visibles. En su lugar, el sitio utiliza un enfoque de "Ruta Fantasma" para la gestión del contenido.

1. Navega a la URL de tu sitio y añade `#admin` al final (ej. `https://zanthry.github.io/portfolio/#admin`).
2. El sitio se desvanecerá instantáneamente en un desenfoque cinematográfico (`backdrop-filter: blur(10px)`).
3. El elegante portal de subida se deslizará a la vista, permitiendo publicar nuevas piezas directamente en tu galería y en Firebase.

---
*Diseñado con contraste. Construido con precisión.*
