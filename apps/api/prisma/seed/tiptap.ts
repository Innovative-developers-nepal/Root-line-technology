export type TipTapNode = Record<string, unknown>;

export type BlogSection = {
    type:      string;
    text?:     string;
    items?:    string[];
    language?: string;
};

function text(t: string): TipTapNode {
    return { type: "text", text: t };
}

function paragraph(t: string): TipTapNode {
    return { type: "paragraph", content: [text(t)] };
}

function heading(t: string, level: number): TipTapNode {
    return { type: "heading", attrs: { level }, content: [text(t)] };
}

function bulletList(items: string[]): TipTapNode {
    return {
        type: "bulletList",
        content: items.map(item => ({
            type:    "listItem",
            content: [{ type: "paragraph", content: [text(item)] }],
        })),
    };
}

function codeBlock(code: string, language?: string): TipTapNode {
    return { type: "codeBlock", attrs: { language: language ?? null }, content: [text(code)] };
}

function doc(...nodes: TipTapNode[]): TipTapNode {
    return { type: "doc", content: nodes };
}

export function sectionsToTipTap(sections: BlogSection[]): TipTapNode {
    const nodes = sections.map(s => {
        if (s.type === "heading")    return heading(s.text!, 2);
        if (s.type === "subheading") return heading(s.text!, 3);
        if (s.type === "paragraph")  return paragraph(s.text!);
        if (s.type === "bullets")    return bulletList(s.items!);
        if (s.type === "code")       return codeBlock(s.text!, s.language);
        return paragraph(s.text ?? "");
    });
    return doc(...nodes);
}

export function stringToTipTap(str: string): TipTapNode {
    const paras = str.split(/\n\n+/).filter(Boolean).map(p => paragraph(p.trim()));
    return doc(...paras);
}

export function keyWinsToTipTap(items: string[]): TipTapNode {
    return doc(bulletList(items));
}
