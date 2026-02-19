import { XMLParser } from '../../src/core/parser/xml-parser';
import { ASTBuilder } from '../../src/core/parser/ast-builder';

describe('StructPDF Parser', () => {
    const parser = new XMLParser();
    const builder = new ASTBuilder();

    test('should parse simple text element', () => {
        const xml = '<pdf-text>Hello World</pdf-text>';
        const raw = parser.parse(xml);
        const ast = builder.build(raw);

        expect(ast[0].type).toBe('pdf-text');
        expect((ast[0] as any).content).toBe('Hello World');
    });

    test('should parse element with attributes', () => {
        const xml = '<pdf-text size="18" bold="true">Hello</pdf-text>';
        const raw = parser.parse(xml);
        const ast = builder.build(raw);

        expect(ast[0].props.size).toBe(18);
        expect(ast[0].props.bold).toBe(true);
    });

    test('should parse nested structure', () => {
        const xml = `
      <pdf-stack gap="10">
        <pdf-text>Line 1</pdf-text>
        <pdf-text>Line 2</pdf-text>
      </pdf-stack>
    `;

        const raw = parser.parse(xml);
        const ast = builder.build(raw);

        expect(ast[0].type).toBe('pdf-stack');
        expect(ast[0].props.gap).toBe(10);
        expect((ast[0] as any).children).toHaveLength(2);
    });

    test('should throw error for invalid child', () => {
        const xml = `
      <pdf-text>
        <pdf-stack>Invalid</pdf-stack>
      </pdf-text>
    `;

        const raw = parser.parse(xml);
        expect(() => builder.build(raw)).toThrow();
    });
});