import { XMLParser as FastXMLParser } from 'fast-xml-parser';
import { TAG_DEFINITIONS, TagType } from '../../dsl/tags-definition';
import { PDFNode, TextNode, ContainerNode } from '../ast/nodes';

export interface RawNode {
    name: string;
    attributes: Record<string, string>;
    children?: RawNode[] | RawNode;
    content?: string;
}

export class XMLParser {
    private parser: FastXMLParser;

    constructor() {
        this.parser = new FastXMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
            allowBooleanAttributes: true,
            parseAttributeValue: true,
            trimValues: true,
            parseTagValue: false,
        });
    }

    parse(xmlString: string): RawNode[] {
        try {
            const result = this.parser.parse(xmlString);
            const rootKey = Object.keys(result)[0];
            const rootData = result[rootKey];

            return [this.normalizeNode(rootKey, rootData)];
        } catch (error) {
            throw new Error(`Error parsing XML: ${error}`);
        }
    }

    private normalizeNode(name: string, data: any): RawNode {
        const node: RawNode = {
            name,
            attributes: {},
        };

        if (typeof data === 'string') {
            node.content = data;
            return node;
        }
        // Separar atributos (primitivos) de children (objetos)
        const children: RawNode[] = [];

        for (const key in data) {
            const value = data[key];

            if (key === '#text') {
                node.content = value;
            }
            else if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    value.forEach(child => {
                        children.push(this.normalizeNode(key, child));
                    });
                } else {
                    children.push(this.normalizeNode(key, value));
                }
            }
            else {
                // Es atributo
                node.attributes[key] = value;
            }
        }

        if (children.length > 0) {
            node.children = children;
        }

        return node;
    }
}