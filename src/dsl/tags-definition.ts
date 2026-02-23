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
            size: { type: 'string', default: 'A4' }
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
            width: { type: 'percentage' },  // layout
            height: { type: 'percentage' }  // layout
        }
    },

    'pdf-text': {
        name: 'pdf-text',
        allowedChildren: [],
        canHaveContent: true,
        attributes: {}
    }
};