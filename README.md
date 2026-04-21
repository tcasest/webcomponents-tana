# Proyecto Web Components

**Autor:** Tanausú Castrillo Estévez  

---

## 1. Descripción

Este proyecto consiste en el desarrollo de una pequeña aplicación utilizando **Web Components**, aplicando buenas prácticas como el uso de **Shadow DOM**, **módulos ES** y **comunicación desacoplada mediante eventos personalizados**.

El objetivo principal es construir componentes reutilizables e independientes que no tengan dependencias directas entre ellos, sino que se comuniquen a través del DOM.

---

## 2. Estructura del proyecto

El proyecto está organizado de la siguiente forma:

```
/
├── index.html
├── main.js
├── styles/
│   └── global.css
├── utils/
│   └── events.js
└── components/
    ├── button/
    ├── checkbox/
    ├── spinner/
    └── status-panel/
```

- **components/** → cada componente en su propia carpeta  
- **styles/** → estilos globales  
- **utils/** → funciones auxiliares  
- **main.js** → punto de entrada  
- **index.html** → página de prueba  

---

## 3. Componentes

### 3.1. `mi-button`

Componente de botón reutilizable con varias variantes visuales:

- primary
- secondary
- danger
- ghost

**Características:**
- Uso de Shadow DOM
- Renderizado con lit-html
- Delegación de eventos
- Emite `button-click` mediante CustomEvent

---

### 3.2. `mi-checkbox`

Componente de casilla de verificación personalizada.

**Características:**
- Permite marcar y desmarcar opciones
- Mantiene estado interno (`checked`)
- Uso de Shadow DOM y lit-html
- Emite `checkbox-change`

---

### 3.3. `mi-spinner`

Componente para controlar una cantidad numérica.

**Características:**
- Botones de incremento y decremento
- Soporte de valores mínimo y máximo
- Uso de lit-html
- Emite `spinner-change`

---

### 3.4. `mi-status-panel`

Componente encargado de mostrar el estado de la aplicación.

**Características:**
- Escucha eventos en `document`
- No tiene dependencia directa con otros componentes
- Muestra:
  - última acción realizada
  - número de checkboxes seleccionados
  - valor actual del spinner

Este componente sigue el mismo patrón que el carrito visto en clase.

---

## 4. Comunicación entre componentes

Los componentes no se comunican directamente entre ellos.

Utilizan **CustomEvent** con:

- `bubbles: true`
- `composed: true`

Flujo de comunicación:

```
Componente → emite evento → DOM → otro componente escucha
```

Ejemplo:
- `mi-checkbox` emite `checkbox-change`
- `mi-status-panel` escucha el evento
- El panel actualiza la interfaz

---

## 5. Ciclo de vida

Todos los componentes implementan:

- `connectedCallback()` → registrar eventos  
- `disconnectedCallback()` → limpiar listeners  

Se utiliza un patrón de **disposables** para evitar fugas de memoria.

---

## 6. Tecnologías utilizadas

- Web Components
- Shadow DOM
- lit-html
- JavaScript ES Modules

---

## 7. Conclusión

Este proyecto demuestra cómo construir una aplicación modular basada en componentes, manteniendo:

- encapsulación
- reutilización
- desacoplamiento
- escalabilidad

El uso de eventos permite que los componentes interactúen sin depender unos de otros, facilitando su mantenimiento y evolución.
