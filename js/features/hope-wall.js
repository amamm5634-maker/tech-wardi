/**
 * hope-wall.js — حائط الأمل.
 */

import { $, el, clear } from "../core/dom.js";
import { supabase } from "../core/supabase.js";
import { MESSAGES } from "../config.js";
import { refreshMessagesCount } from "./impact-counters.js";

const TAG = "[techwardi:wall]";
const ui = {};
let refreshTimer = null;

export function initHopeWall() {
    ui.form = $("#message-form");
    ui.input = $("#message");
    ui.list = $("#messages-list");

    if (!ui.form || !ui.input || !ui.list) {
        console.warn(`${TAG} عناصر DOM ناقصة`);
        return;
    }

    ui.status = el("p", { "aria-live": "polite" });
    ui.form.append(ui.status);

    ui.form.addEventListener("submit", onSubmit);

    loadApprovedMessages();
    startAutoRefresh();

    console.info(`${TAG} جاهزة`);
}

async function onSubmit(event) {
    event.preventDefault();

    const message = ui.input.value.trim();
    if (!message) {
        setStatus("اكتب رسالتك أولًا.", "warn");
        return;
    }

    const submitBtn = ui.form.querySelector('button[type="submit"]');
    if (!submitBtn) {
        console.error(`${TAG} زر الإرسال غير موجود`);
        return;
    }

    submitBtn.disabled = true;
    setStatus("جارٍ الإرسال…", "info");

    try {
        const { error } = await supabase
            .from("hope_messages")
            .insert({ message, status: "pending" });

        if (error) throw error;

        ui.form.reset();
        setStatus("وصلت رسالتك، ستظهر بعد المراجعة 💗", "ok");

        // قد يعتمد المشرف الرسالة خلال ثوانٍ — ننعش العرض قريبًا
        setTimeout(() => {
            loadApprovedMessages();
            refreshMessagesCount();
        }, 5_000);
    } catch (error) {
        console.error(`${TAG} فشل الإرسال:`, error);
        setStatus("تعذر الإرسال. حاول مجددًا.", "error");
    } finally {
        submitBtn.disabled = false;
    }
}

async function loadApprovedMessages() {
    clear(ui.list);
    ui.list.append(el("p", { text: "جارٍ التحميل…" }));

    try {
        const { data, error } = await supabase
            .from("hope_messages")
            .select("id, message, created_at")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(MESSAGES.fetchLimit);

        if (error) throw error;

        clear(ui.list);

        if (!data || data.length === 0) {
            ui.list.append(el("p", { text: "لا رسائل معتمدة بعد. كن أول من يشارك 💗" }));
            return;
        }

        for (const item of data) {
            ui.list.append(buildCard(item));
        }
    } catch (error) {
        console.error(`${TAG} فشل التحميل:`, error);
        clear(ui.list);
        ui.list.append(el("p", { text: "تعذر تحميل الرسائل." }));
    }
}

function buildCard(item) {
    // textContent آمن ضد XSS — لا تفسير لوسوم HTML
    return el("article", {}, [el("p", { text: item.message })]);
}

function setStatus(text, level) {
    ui.status.textContent = text;
    ui.status.dataset.level = level || "";
}

function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);

    refreshTimer = setInterval(() => {
        if (document.visibilityState === "visible") {
            loadApprovedMessages();
            refreshMessagesCount();
        }
    }, MESSAGES.refreshIntervalMs);
}