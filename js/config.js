/**
 * config.js — ثوابت الموقع العامة.
 */

export const APP = Object.freeze({
    name: "تِك وردي",
    nameEn: "TECH WARDI",
    version: "0.1.0",
    // ISO 8601 بتوقيت السودان (UTC+2) — يقرؤه Intl بشكل صحيح
    eventDate: "2026-10-20T10:00:00+02:00",
});

// المفتاح publishable مُخصَّص للنشر العلني؛ الحماية الفعلية من RLS في Supabase.
export const SUPABASE = Object.freeze({
    url: "https://cpasmtfafirifugkijvw.supabase.co",
    publishableKey: "sb_publishable_iDtwCMg0rA2oNLMdmgQkIg_LamoTVXQ",
});

export const QUIZ = Object.freeze({
    size: 10,
});

export const MESSAGES = Object.freeze({
    maxLength: 500,
    fetchLimit: 50,
    refreshIntervalMs: 30_000,
});

// أعلام تشغيل/إيقاف ميزة دون حذف كودها
export const FEATURES = Object.freeze({
    quiz: true,
    hopeWall: true,
    counters: true,
    countdown: true,
});
