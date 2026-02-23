import { TagType } from '../../dsl/tags-definition';
import { StyleObject } from './types';

export interface BaseNode {
    type: TagType;
    props: Record<string, any>; // SOLO props estructurales
    style: StyleObject;         // TODO lo visual
    children?: BaseNode[];
}

export interface TextNode extends BaseNode {
    type: 'pdf-text';
    content: string;
}

export interface ContainerNode extends BaseNode {
    type: Exclude<TagType, 'pdf-text'>;
    children: BaseNode[];
}

export type PDFNode = TextNode | ContainerNode;

// Type guards
export function isTextNode(node: PDFNode): node is TextNode {
    return node.type === 'pdf-text';
}

export function isContainerNode(node: PDFNode): node is ContainerNode {
    return node.type !== 'pdf-text';
}