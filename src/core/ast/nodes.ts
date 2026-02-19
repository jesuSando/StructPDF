import { TagType } from '../../dsl/tags-definition';

export interface BaseNode {
    type: TagType;
    props: Record<string, any>;
    children?: BaseNode[];
}

export interface TextNode extends BaseNode {
    type: 'pdf-text';
    content: string;
    props: {
        size: number;
        bold: boolean;
        color: string;
        align: 'left' | 'center' | 'right';
    };
}

export interface ContainerNode extends BaseNode {
    type: Exclude<TagType, 'pdf-text'>;
    children: BaseNode[];
    props: {
        gap?: number;
        width?: string | number;
        height?: string | number;
        padding?: number;
        background?: string;
    };
}

export type PDFNode = TextNode | ContainerNode;

// Type guards
export function isTextNode(node: PDFNode): node is TextNode {
    return node.type === 'pdf-text';
}

export function isContainerNode(node: PDFNode): node is ContainerNode {
    return node.type !== 'pdf-text';
}