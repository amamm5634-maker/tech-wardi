/**
 * dom.js — أدوات DOM صغيرة.
 * el() هي البديل الآمن لـ innerHTML عند بناء عناصر من بيانات المستخدم.
 */

export const $ = (selector, root = document) =>
    root.querySelector(selector);

export const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

export function requireEl(selector, root = document) {
    const node = $(selector, root);
    if (!node) {
        console.error(`[techwardi:dom] عنصر مطلوب غير موجود: ${selector}`);
        throw new Error(`Missing element: ${selector}`);
    }
    return node;
}

/**
 * ينشئ عنصرًا بسمات وأبناء.
 * مفاتيح خاصة: class/className, text, dataset, style, onClick…
 */
export function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;

        if (key === "class" || key === "className") {
            node.className = value;
        } else if (key === "text") {
            node.textContent = String(value);
        } else if (key === "dataset" && typeof value === "object") {
            Object.assign(node.dataset, value);
        } else if (key === "style" && typeof value === "object") {
            Object.assign(node.style, value);
        } else if (key.startsWith("on") && typeof value === "function") {
            node.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            node.setAttribute(key, value);
        }
    }

    const list = Array.isArray(children) ? children : [children];
    for (const child of list) {
        if (child === null || child === undefined || child === false) continue;
        node.append(child);
    }

    return node;
}

export function clear(node) {
    node.replaceChildren();
}

export function setText(node, text) {
    node.textContent = String(text);
}

export function setHidden(node, hidden) {
    node.hidden = Boolean(hidden);
}

// تفويض حدث على حاوية — للقوائم المتغيرة
export function delegate(root, eventName, selector, handler) {
    root.addEventListener(eventName, (event) => {
        const match = event.target.closest(selector);
        if (match && root.contains(match)) {
            handler.call(match, event, match);
        }
    });
}
