/**
 * utils.js — أدوات مستقلة عن DOM و Supabase.
 */

// Fisher–Yates — المصفوفة الأصلية لا تتغيّر
export function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function sample(array, n) {
    return shuffle(array).slice(0, n);
}

export function debounce(fn, waitMs) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), waitMs);
    };
}

export function throttle(fn, waitMs) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= waitMs) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

export const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

export function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ---------- تخزين محلي بمُسمّى ----------

const STORAGE_PREFIX = "techwardi:";
const STORAGE_TAG = "[techwardi:storage]";

function isStorageAvailable() {
    try {
        const key = STORAGE_PREFIX + "__test__";
        localStorage.setItem(key, "1");
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

const STORAGE_OK = isStorageAvailable();

if (!STORAGE_OK) {
    console.warn(`${STORAGE_TAG} localStorage غير متاح — سيُستخدم التخزين المؤقت في الذاكرة`);
}

const memoryStore = new Map();

export const storage = {
    get(key, fallback = null) {
        if (!STORAGE_OK) {
            return memoryStore.has(key) ? memoryStore.get(key) : fallback;
        }
        try {
            const raw = localStorage.getItem(STORAGE_PREFIX + key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (error) {
            console.warn(`${STORAGE_TAG} فشل القراءة للمفتاح "${key}":`, error);
            return fallback;
        }
    },

    set(key, value) {
        if (!STORAGE_OK) {
            memoryStore.set(key, value);
            return true;
        }
        try {
            localStorage.setItem(
                STORAGE_PREFIX + key,
                JSON.stringify(value)
            );
            return true;
        } catch (error) {
            console.warn(`${STORAGE_TAG} فشل الكتابة للمفتاح "${key}":`, error);
            return false;
        }
    },

    remove(key) {
        if (!STORAGE_OK) {
            memoryStore.delete(key);
            return;
        }
        try {
            localStorage.removeItem(STORAGE_PREFIX + key);
        } catch (error) {
            console.warn(`${STORAGE_TAG} فشل الحذف للمفتاح "${key}":`, error);
        }
    },
};

// ---------- تنسيق ----------

export function formatDate(input, locale = "ar") {
    try {
        return new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(input));
    } catch (error) {
        console.warn("[techwardi:utils] فشل تنسيق التاريخ:", error);
        return String(input);
    }
}

export function timeAgo(input, locale = "ar") {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const seconds = Math.round(
        (Date.now() - new Date(input).getTime()) / 1000
    );
    const abs = Math.abs(seconds);

    if (abs < 60) return rtf.format(-seconds, "second");
    if (abs < 3_600) return rtf.format(-Math.round(seconds / 60), "minute");
    if (abs < 86_400) return rtf.format(-Math.round(seconds / 3_600), "hour");
    return rtf.format(-Math.round(seconds / 86_400), "day");
}
