/**
 * Copy of SyncTripApp/src/utils/richText.ts (only this note differs) - the app
 * and the website must format descriptions identically. Change both together.
 *
 * richText.ts
 *
 * WhatsApp-style formatting + link detection for any user-written text
 * (chat messages, event / activity / trip / club descriptions).
 *
 *   *bold*   _italic_   ~strike~   `code`   ```monospace block```
 *   "> " at the start of a line  → quote
 *   "- " / "* " at the start     → bullet  (rendered as "• ")
 *   URLs, bare domains, e-mails, Indian mobile numbers → tappable
 *
 * Close to WhatsApp, a little more forgiving: a marker only opens at the
 * start of a word and only closes at the end of one, and a pair never crosses
 * a line break - that keeps `2*3*4` and snake_case_names plain. Unlike
 * WhatsApp, "* Bold *" (spaces inside, as phone keyboards often insert) still
 * counts, as long as there is a letter inside - so "5 * 6 * 7" stays maths.
 *
 * Links are found FIRST and treated as solid blocks, so the underscores in
 * https://x.com/some_page_name can never be read as italics.
 *
 * Pure module (no React) so it can be unit-tested in Node.
 */

export type RichStyle = {
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    code?: boolean;   // inline `code` or ```block```
    quote?: boolean;
};

/** For kind 'mention', `href` is the mentioned user's id. */
export type RichLink = { kind: 'url' | 'email' | 'phone' | 'mention'; href: string };

/** "@Rahul Sharma" → user id. Found in order, so edits can't mis-point them. */
export type RichMention = { text: string; userId: string };

export type RichNode = { text: string; style: RichStyle; link?: RichLink };

// ── Link detection ──────────────────────────────────────────────────────────

// Last char may not be sentence punctuation or a formatting marker, so
// "see https://x.com." and "*https://x.com*" both stop at ".com".
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"']*[^\s<>"'.,!?:;)\]}*_~`]/gi;
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g;
// Bare domains ("synctrip.in", "instagram.com/club") - common TLDs only, so
// "e.g" or "3.5" never become links.
const DOMAIN_RE = /\b(?:[a-z0-9-]+\.)+(?:com|in|org|net|io|co|app|me|ly|gg|gl|gle|to|tv|fm|so|sh|cc|us|uk|xyz|dev|ai|club|events|live|link|site|online|store|shop|info|biz|page|tech|world|fun|games|studio|art|cafe|blog|news|bio|pro|travel|fit|social|team|space)\b(?:\/[^\s<>"']*[^\s<>"'.,!?:;)\]}*_~`])?/gi;
// Indian mobiles: optional +91 / 0, then 10 digits starting 6-9, allowing
// one space or dash in the middle ("98765 43210").
const PHONE_RE = /(?:\+91[\s-]?|\b0)?\b[6-9]\d{4}[\s-]?\d{5}\b/g;

type LinkSpan = { start: number; end: number; link: RichLink };

export function findLinks(text: string): LinkSpan[] {
    const spans: LinkSpan[] = [];
    const taken = (s: number, e: number) => spans.some((x) => s < x.end && e > x.start);
    const collect = (re: RegExp, make: (m: string) => RichLink | null) => {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
            const start = m.index, end = start + m[0].length;
            if (taken(start, end)) continue;
            const link = make(m[0]);
            if (link) spans.push({ start, end, link });
        }
    };
    collect(URL_RE, (u) => ({ kind: 'url', href: /^www\./i.test(u) ? `https://${u}` : u }));
    collect(EMAIL_RE, (e) => ({ kind: 'email', href: `mailto:${e}` }));
    collect(DOMAIN_RE, (d) => ({ kind: 'url', href: `https://${d}` }));
    collect(PHONE_RE, (p) => ({ kind: 'phone', href: `tel:${p.replace(/[^\d+]/g, '')}` }));
    return spans.sort((a, b) => a.start - b.start);
}

// ── Inline formatting ───────────────────────────────────────────────────────

const MARKERS: Record<string, keyof RichStyle> = { '*': 'bold', '_': 'italic', '~': 'strike', '`': 'code' };

const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c);
// A marker opens after start/space/punctuation and closes before end/space/
// punctuation - never inside a word (snake_case, 2*3*4).
const isWordChar = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c);

type Span = { start: number; end: number; style: RichStyle };

/**
 * Walks [from, to) of `src` (links already masked to letters) and emits text
 * spans with the style stack applied. Markers themselves are dropped.
 */
function parseInline(src: string, from: number, to: number, style: RichStyle, out: Span[]) {
    let textStart = from;
    let i = from;
    while (i < to) {
        const ch = src[i];
        const key = MARKERS[ch];
        if (key && !style[key] && !isWordChar(src[i - 1]) && src[i + 1] !== ch && src[i + 1] !== '\n' && i + 1 < to) {
            // Nearest valid closer on the same line, with a letter/number inside.
            let j = i + 1;
            let close = -1;
            while (j < to && src[j] !== '\n') {
                if (src[j] === ch && !isWordChar(src[j + 1]) && j > i + 1
                    && (!isSpace(src[i + 1]) || /\p{L}/u.test(src.slice(i + 1, j)))
                    && /[\p{L}\p{N}]/u.test(src.slice(i + 1, j))) { close = j; break; }
                j++;
            }
            if (close !== -1) {
                if (i > textStart) out.push({ start: textStart, end: i, style });
                const inner = { ...style, [key]: true };
                // Spaces just inside the markers belong to the markup ("* Bold *").
                let a = i + 1, b = close;
                while (a < b && src[a] === ' ') a++;
                while (b > a && src[b - 1] === ' ') b--;
                if (key === 'code') out.push({ start: a, end: b, style: inner });
                else parseInline(src, a, b, inner, out);
                i = close + 1;
                textStart = i;
                continue;
            }
        }
        i++;
    }
    if (to > textStart) out.push({ start: textStart, end: to, style });
}

// ── Public API ──────────────────────────────────────────────────────────────

export function parseRichText(input: string, opts: { links?: boolean; mentions?: RichMention[] } = {}): RichNode[] {
    if (!input) return [];
    const withLinks = opts.links !== false;

    // 1. Line-level: bullets and quotes. Rewritten into the working string
    //    (bullet) or recorded as ranges (quote) before inline parsing.
    const quoteRanges: Array<[number, number]> = [];
    let text = '';
    const lines = input.split('\n');
    lines.forEach((line, idx) => {
        let l = line;
        // "* " starts a bullet only when no closing * follows on the line -
        // "* Bold*" is bold, "* item" is a bullet.
        const bullet = /^(\s*)([-*])\s+(?=\S)/.exec(l);
        if (bullet && (bullet[2] === '-' || !l.slice(bullet[0].length).includes('*'))) {
            l = `${bullet[1]}• ${l.slice(bullet[0].length)}`;
        }
        const start = text.length;
        if (/^>\s?/.test(l)) {
            l = l.replace(/^>\s?/, '');
            quoteRanges.push([start, start + l.length]);
        }
        text += l + (idx < lines.length - 1 ? '\n' : '');
    });

    // 2. ```blocks``` are verbatim: no links, no nested markers.
    const blocks: Array<[number, number]> = [];
    const blockRe = /```([\s\S]+?)```/g;
    let bm: RegExpExecArray | null;
    while ((bm = blockRe.exec(text)) !== null) blocks.push([bm.index, bm.index + bm[0].length]);

    // 3. Links become solid runs of letters so no marker inside them counts.
    // Mentions first (they win over a URL-looking name), searched in order in
    // the rewritten text - offsets from the server refer to the raw text, and
    // line rewriting ("> " quotes) shifts positions.
    const mentionSpans: LinkSpan[] = [];
    let from = 0;
    for (const m of opts.mentions ?? []) {
        if (!m.text) continue;
        const at = text.indexOf(m.text, from);
        if (at === -1) continue;
        mentionSpans.push({ start: at, end: at + m.text.length, link: { kind: 'mention', href: m.userId } });
        from = at + m.text.length;
    }
    const inBlock = (l: LinkSpan) => blocks.some(([s, e]) => l.start < e && l.end > s);
    const autoLinks = withLinks
        ? findLinks(text).filter((l) => !inBlock(l) && !mentionSpans.some((m) => l.start < m.end && l.end > m.start))
        : [];
    const links = [...mentionSpans.filter((m) => !inBlock(m)), ...autoLinks].sort((a, b) => a.start - b.start);
    const masked = text.split('');
    for (const l of links) for (let k = l.start; k < l.end; k++) masked[k] = 'a';
    const src = masked.join('');

    // 4. Inline formatting outside blocks; blocks emitted as code.
    const spans: Span[] = [];
    let cursor = 0;
    for (const [s, e] of blocks) {
        if (s > cursor) parseInline(src, cursor, s, {}, spans);
        spans.push({ start: s + 3, end: e - 3, style: { code: true } });
        cursor = e;
    }
    if (cursor < text.length) parseInline(src, cursor, text.length, {}, spans);

    // 5. Cut spans at link and quote boundaries and attach both.
    const cuts = new Set<number>();
    for (const l of links) { cuts.add(l.start); cuts.add(l.end); }
    for (const [s, e] of quoteRanges) { cuts.add(s); cuts.add(e); }

    const nodes: RichNode[] = [];
    for (const sp of spans) {
        const points = [sp.start, ...[...cuts].filter((c) => c > sp.start && c < sp.end).sort((a, b) => a - b), sp.end];
        for (let k = 0; k < points.length - 1; k++) {
            const a = points[k], b = points[k + 1];
            if (b <= a) continue;
            const link = links.find((l) => a >= l.start && b <= l.end)?.link;
            const quote = quoteRanges.some(([s, e]) => a >= s && b <= e);
            const style = quote ? { ...sp.style, quote: true } : sp.style;
            const prev = nodes[nodes.length - 1];
            // Merge neighbours with identical style + link to keep the tree small.
            if (prev && prev.link?.href === link?.href && sameStyle(prev.style, style)) prev.text += text.slice(a, b);
            else nodes.push(link ? { text: text.slice(a, b), style, link } : { text: text.slice(a, b), style });
        }
    }
    return nodes;
}

function sameStyle(a: RichStyle, b: RichStyle) {
    return !!a.bold === !!b.bold && !!a.italic === !!b.italic && !!a.strike === !!b.strike
        && !!a.code === !!b.code && !!a.quote === !!b.quote;
}

/** Plain text with the markers removed - for previews, notifications, copy. */
export function stripRichText(input: string): string {
    return parseRichText(input, { links: false }).map((n) => n.text).join('');
}
