export type TagType =
    | 'pdf-page'
    | 'pdf-stack'
    | 'pdf-row'
    | 'pdf-box'
    | 'pdf-text';

export interface TagDefinition {
    name: TagType;
    allowedChildren: TagType[];
    attributes: Record<string, AttributeDefinition>;
    canHaveContent: boolean;
}

export interface AttributeDefinition {
    type: 'string' | 'number' | 'boolean' | 'percentage';
    required?: boolean;
    default?: any;
    values?: any[];
}

export const TAG_DEFINITIONS: Record<TagType, TagDefinition> = {
    'pdf-page': {
        name: 'pdf-page',
        allowedChildren: ['pdf-stack', 'pdf-row', 'pdf-box', 'pdf-text'],
        canHaveContent: false,
        attributes: {
            size: { type: 'string', default: 'A4' },
            padding: { type: 'number', default: 0 },
            background: { type: 'string' }
        }
    },
    'pdf-stack': {
        name: 'pdf-stack',
        allowedChildren: ['pdf-stack', 'pdf-row', 'pdf-box', 'pdf-text'],
        canHaveContent: false,
        attributes: {
            gap: { type: 'number', default: 0 }
        }
    },
    'pdf-row': {
        name: 'pdf-row',
        allowedChildren: ['pdf-box', 'pdf-text'],
        canHaveContent: false,
        attributes: {
            gap: { type: 'number', default: 0 }
        }
    },
    'pdf-box': {
        name: 'pdf-box',
        allowedChildren: ['pdf-stack', 'pdf-row', 'pdf-box', 'pdf-text'],
        canHaveContent: false,
        attributes: {
            width: { type: 'percentage' },
            height: { type: 'percentage' },
            padding: { type: 'number', default: 0 },
            background: { type: 'string' }
        }
    },
    'pdf-text': {
        name: 'pdf-text',
        allowedChildren: [],
        canHaveContent: true,
        attributes: {
            size: { type: 'number', default: 12 },
            bold: { type: 'boolean', default: false },
            color: { type: 'string', default: '#000000' },
            align: { type: 'string', default: 'left', values: ['left', 'center', 'right'] }
        }
    }
};