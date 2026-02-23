import { XMLParser } from '../../src/core/parser/xml-parser';
import { ASTBuilder } from '../../src/core/parser/ast-builder';
import { isTextNode, isContainerNode } from '../../src/core/ast/nodes';

describe('StructPDF Parser', () => {
  const parser = new XMLParser();
  const builder = new ASTBuilder();

  test('should parse simple text element', () => {
    const xml = '<pdf-text>Hello World</pdf-text>';
    const raw = parser.parse(xml);
    const ast = builder.build(raw);

    expect(ast).toHaveLength(1);
    expect(ast[0].type).toBe('pdf-text');

    if (!isTextNode(ast[0])) {
      throw new Error('Expected text node');
    }

    expect(ast[0].content).toBe('Hello World');
  });

  test('should parse element with attributes', () => {
    const xml = '<pdf-text size="18" bold="true">Hello</pdf-text>';
    const raw = parser.parse(xml);
    const ast = builder.build(raw);

    if (!isTextNode(ast[0])) {
      throw new Error('Expected text node');
    }

    expect(ast[0].props.size).toBe(18);
    expect(ast[0].props.bold).toBe(true);
  });

  test('should apply default values', () => {
    const xml = '<pdf-text>Hello</pdf-text>';
    const raw = parser.parse(xml);
    const ast = builder.build(raw);

    if (!isTextNode(ast[0])) {
      throw new Error('Expected text node');
    }

    expect(ast[0].props.size).toBe(12);
    expect(ast[0].props.bold).toBe(false);
    expect(ast[0].props.color).toBe('#000000');
    expect(ast[0].props.align).toBe('left');
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

    expect(ast).toHaveLength(1);

    if (!isContainerNode(ast[0])) {
      throw new Error('Expected container node');
    }

    expect(ast[0].type).toBe('pdf-stack');
    expect(ast[0].props.gap).toBe(10);
    expect(ast[0].children).toHaveLength(2);
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

  test('should throw error for unknown tag', () => {
    const xml = `<unknown-tag>Test</unknown-tag>`;

    const raw = parser.parse(xml);

    expect(() => builder.build(raw)).toThrow();
  });

  test('should throw error when pdf-text has no content', () => {
    const xml = `<pdf-text></pdf-text>`;

    const raw = parser.parse(xml);

    expect(() => builder.build(raw)).toThrow();
  });
});