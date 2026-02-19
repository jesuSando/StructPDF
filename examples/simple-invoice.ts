import { XMLParser } from '../src/core/parser/xml-parser';
import { ASTBuilder } from '../src/core/parser/ast-builder';

const dsl = `
<pdf-page size="A4" padding="20">
  <pdf-stack gap="15">
    <pdf-text size="24" bold="true">Factura #001</pdf-text>
    
    <pdf-row gap="10">
      <pdf-box width="70%">
        <pdf-text>Producto: Laptop</pdf-text>
      </pdf-box>
      <pdf-box width="30%">
        <pdf-text align="right">$1,200.00</pdf-text>
      </pdf-box>
    </pdf-row>
    
    <pdf-row gap="10">
      <pdf-box width="70%">
        <pdf-text>Producto: Mouse</pdf-text>
      </pdf-box>
      <pdf-box width="30%">
        <pdf-text align="right">$25.00</pdf-text>
      </pdf-box>
    </pdf-row>
  </pdf-stack>
</pdf-page>
`;

const parser = new XMLParser();
const builder = new ASTBuilder();

try {
    const raw = parser.parse(dsl);
    const ast = builder.build(raw);

    console.log('AST generado exitosamente:');
    console.log(JSON.stringify(ast, null, 2));
} catch (error: any) {
    console.error('Error:', error.message);
}