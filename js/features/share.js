/**
 * share.js — مشاركة الموقع + نسخ الرابط.
 */

import { $, setText } from "../core/dom.js";
import { APP } from "../config.js";

const TAG = "[techwardi:share]";
const ui = {};
let statusTimer = null;

export function initShare() {
    ui.shareBtn = $("#share-button");
    ui.copyBtn = $("#copy-button");
    ui.status = $("#share-status");

    if (!ui.shareBtn || !ui.status) {
        console.warn(`${TAG} عناصر DOM ناقصة`);
        return;
    }

    ui.shareBtn.addEventListener("click", nativeShare);
    if (ui.copyBtn) ui.copyBtn.addEventListener("click", copyLink);

    console.info(`${TAG} جاهزة`);
}

async function nativeShare() {
    const data = {
        title: `${APP.name} | ${APP.nameEn}`,
        text: "مبادرة توعوية بسرطان الثدي — اختبر معلوماتك وشارك كلمة أمل.",
        url: window.location.href,
    };

    try {
        if (navigator.share) {
            await navigator.share(data);
            setStatus("تمت المشاركة 💗");
        } else {
            // لا يوجد Web Share — نتحوّل إلى النسخ
            await copyLink();
        }
    } catch (error) {
        if (error && error.name === "AbortError") return;
        console.warn(`${TAG} فشلت المشاركة:`, error);
        setStatus("تعذرت المشاركة تلقائيًا.");
    }
}

async function copyLink() {
    const url = window.location.href;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(url);
        } else {
            // بديل قديم لمتصفحات لا تدعم Clipboard API
            const ta = document.createElement("textarea");
            ta.value = url;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        setStatus("تم نسخ الرابط ✓");
    } catch (error) {
        console.warn(`${TAG} فشل النسخ:`, error);
        setStatus("انسخ الرابط يدويًا: " + url);
    }
}

function setStatus(text) {
    setText(ui.status, text);

    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(() => setText(ui.status, ""), 4_000);
}