import { TAG_DEFINITIONS, TagType } from '../../dsl/tags-definition';
import { PDFNode, TextNode, ContainerNode } from '../ast/nodes';
import { RawNode } from './xml-parser';
import { parseInlineStyle } from '../styles/resolver';

export class ASTBuilder {
    build(rawNodes: RawNode[]): PDFNode[] {
        return rawNodes.map(node => this.buildNode(node));
    }

    private buildNode(rawNode: RawNode): PDFNode {
        const tagDef = TAG_DEFINITIONS[rawNode.name as TagType];

        if (!tagDef) {
            throw new Error(`Unknown tag: ${rawNode.name}`);
        }

        if (tagDef.name === 'pdf-text' && !rawNode.content?.trim()) {
            throw new Error('pdf-text tag must have content');
        }

        if (tagDef.name !== 'pdf-text' && rawNode.content) {
            throw new Error(`${rawNode.name} tag cannot have direct content`);
        }

        const rawStyle = rawNode.attributes?.style;
        const style = parseInlineStyle(rawStyle);

        const { style: _, ...cleanAttributes } = rawNode.attributes || {};

        const props = this.processAttributes(cleanAttributes, tagDef.attributes);

        const baseNode = {
            type: rawNode.name as TagType,
            props,
            style
        };

        if (rawNode.name === 'pdf-text') {
            return {
                ...baseNode,
                content: rawNode.content || ''
            } as TextNode;
        }

        const children: PDFNode[] = [];
        if (rawNode.children) {
            const childrenArray = Array.isArray(rawNode.children)
                ? rawNode.children
                : [rawNode.children];

            childrenArray.forEach(child => {
                if (!tagDef.allowedChildren.includes(child.name as TagType)) {
                    throw new Error(`${child.name} cannot be child of ${rawNode.name}`);
                }
                children.push(this.buildNode(child));
            });
        }

        return {
            ...baseNode,
            children
        } as ContainerNode;
    }

    private processAttributes(
        attributes: Record<string, string>,
        definitions: Record<string, any>
    ): Record<string, any> {
        const result: Record<string, any> = {};

        for (const [key, def] of Object.entries(definitions)) {
            result[key] = def.default;
        }

        for (const [key, value] of Object.entries(attributes)) {
            const def = definitions[key];
            if (!def) continue;

            switch (def.type) {
                case 'number':
                    result[key] = parseFloat(value);
                    break;
                case 'boolean':
                    if (typeof value === 'boolean') {
                        result[key] = value;
                    } else if (typeof value === 'string') {
                        result[key] =
                            value.toLowerCase() === 'true' ||
                            value === '1' ||
                            value === '';
                    } else {
                        result[key] = false;
                    }
                    break;
                case 'percentage':
                    result[key] = value.toString();
                    break;
                default:
                    result[key] = value;
            }
        }

        return result;
    }
}