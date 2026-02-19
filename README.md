# StructPDF: Motor DSL Declarativo para PDFs en Node.js

## ¿Qué es esto?
Este proyecto es un motor declarativo para generar documentos PDF usando un DSL (Domain-Specific Language) propio, diseñado específicamente para describir layouts de documentos estructurados.

- No es un conversor HTML → PDF.
- No es un wrapper de pdf-lib.
- No es un navegador embebido.

Es un sistema propio compuesto por:
- Un DSL tipo XML (`<pdf-page>`, `<pdf-text>`, etc.)
- Un parser propio
- Un AST interno
- Un motor de layout propio
- Un sistema de estilos propio
- Un renderer desacoplado
- Un adapter actual hacia [pdf-lib](https://pdf-lib.js.org/)

## Filosofía del Proyecto

El objetivo es resolver este problema:

> Generar PDFs estructurados sin depender de Chromium ni HTML completo, pero manteniendo una experiencia declarativa y legible.

En lugar de escribir:
```TypeScript
page.drawText("Hola", { x: 50, y: 700 });
```

Queremos escribir:
```XML
<pdf-page>
  <pdf-text size="18" bold="true">Hola mundo</pdf-text>
</pdf-page>
```

Y que el motor:

1. Interprete el DSL
2. Calcule el layout
3. Maneje paginación
4. Renderice el documento final

## Arquitectura General
```Código
DSL (string XML-like)
        ↓
Parser XML
        ↓
AST interno (nodos tipados)
        ↓
Style Resolver
        ↓
Layout Engine
        ↓
Renderer Interface
        ↓
PdfLibRenderer (adapter actual)
        ↓
PDF final
```

El core del sistema es independiente del backend de PDF.

El renderer actual usa pdf-lib, pero el diseño permite reemplazarlo en el futuro por un generador PDF propio implementado desde cero.

## ¿Qué es propio y qué no?

### 100% propio
- DSL
- Definición de etiquetas
- Validación semántica
- AST
- Sistema de estilos
- Modelo de caja
- Algoritmos de layout (stack, row)
- Paginación
- API pública
- Interfaz Renderer

### Temporalmente externo

- Backend de escritura PDF (pdf-lib)

Este backend está desacoplado mediante una interfaz para permitir reemplazo futuro.

## DSL Definido (v1)

Etiquetas soportadas:
- `<pdf-page>`
- `<pdf-stack>` (flujo vertical)
- `<pdf-row>` (flujo horizontal)
- `<pdf-box>` (contenedor)
- `<pdf-text>`

Ejemplo:
```XML
<pdf-page size="A4" padding="40">
  <pdf-stack gap="20">
    <pdf-text size="24" bold="true">
      Ticket
    </pdf-text>

    <pdf-row gap="10">
      <pdf-box width="50%">
        <pdf-text>Producto</pdf-text>
      </pdf-box>
      <pdf-box width="50%">
        <pdf-text>$1000</pdf-text>
      </pdf-box>
    </pdf-row>
  </pdf-stack>
</pdf-page>
```

Este DSL no es HTML.

- No intenta ser compatible con HTML.
- No soporta CSS real.
- No ejecuta JavaScript.

Es un lenguaje específico para describir documentos PDF estructurados.

## Responsabilidades de Cada Capa
1. Parser
- Convierte el DSL en un árbol intermedio.
- Valida etiquetas permitidas.
- Normaliza atributos.

2. AST
- Representación interna tipada:
- type
- props
- children
- content (para texto)
- Aquí ya no existen etiquetas XML.

3. Style Resolver
- Aplica defaults
- Convierte % → px
- Normaliza números
- Valida valores

4. Layout Engine Calcula:
- width
- height
- x / y
- padding
- flujo vertical (stack)
- flujo horizontal (row)
- salto automático de página
- word wrapping

Este es el corazón del sistema.

5. Renderer

Define una interfaz abstracta:
```TypeScript
interface Renderer {
  newPage(...)
  drawText(...)
  drawRect(...)
  save(...)
}
```

El renderer actual implementa esta interfaz usando pdf-lib.

## Objetivos Técnicos (v1)

- Layout vertical automático
- Layout horizontal básico
- Width en px y %
- Padding
- Background
- Font size
- Bold
- Word wrapping
- Paginación automática básica

No se soporta:
- CSS completo
- position absolute
- grid complejo
- media queries
- animaciones
- JS dinámico

## Futuro del Proyecto

Fase 2:
- Paginación inteligente
- Headers / footers
- Mejor medición de texto

Fase 3:
- Optimización de performance
- Cache de cálculos

Fase 4:
- Implementación propia del formato PDF
- Reemplazo del adapter pdf-lib por PDF writer interno

## ¿Por qué este proyecto es relevante?

Porque demuestra:
- Diseño de DSL
- Diseño de AST
- Ingeniería de layout
- Arquitectura desacoplada
- Capacidad de abstracción
- Pensamiento de infraestructura

No es simplemente “usar una librería”.
Es construir un motor declarativo completo.

## Resumen Final

Este proyecto es un:

>Motor declarativo de documentos PDF con DSL propio, layout engine propio y backend desacoplado.

Hoy usa pdf-lib como adaptador.
Mañana puede escribir el formato PDF desde cero.

El valor está en el DSL y el layout.
El backend es reemplazable.