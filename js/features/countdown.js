/**
 * countdown.js — العدّاد التنازلي للفعالية.
 */

import { $, setText } from "../core/dom.js";
import { APP } from "../config.js";

const TAG = "[techwardi:countdown]";
const ui = {};
let timerId = null;
let last = { days: null, hours: null, minutes: null };

const TARGET_MS = new Date(APP.eventDate).getTime();

export function initCountdown() {
    ui.section = $("#countdown");
    ui.days = $("#cd-days");
    ui.hours = $("#cd-hours");
    ui.minutes = $("#cd-minutes");
    ui.seconds = $("#cd-seconds");
    ui.status = $("#countdown-status");

    if (!ui.days || !ui.hours || !ui.minutes || !ui.seconds) {
        console.warn(`${TAG} عناصر DOM ناقصة`);
        return;
    }

    if (Number.isNaN(TARGET_MS)) {
        console.error(`${TAG} eventDate غير صالح في config.js:`, APP.eventDate);
        setText(ui.status, "تاريخ الفعالية غير محدد.");
        return;
    }

    tick();
    timerId = setInterval(tick, 1000);

    document.addEventListener("visibilitychange", onVisibility);

    console.info(`${TAG} جاهزة — الهدف: ${new Date(TARGET_MS).toLocaleString("ar")}`);
}

function onVisibility() {
    if (document.visibilityState === "visible" && timerId !== null) {
        tick();
    }
}

function tick() {
    const diff = TARGET_MS - Date.now();

    if (diff <= 0) {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
        setText(ui.days, "0");
        setText(ui.hours, "0");
        setText(ui.minutes, "0");
        setText(ui.seconds, "0");
        if (ui.status) setText(ui.status, "🎗️ شكرًا لكل من شارك في الفعالية.");
        if (ui.section) ui.section.classList.add("is-complete");
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    if (days !== last.days) { setText(ui.days, pad(days)); pulse(ui.days); last.days = days; }
    if (hours !== last.hours) { setText(ui.hours, pad(hours)); pulse(ui.hours); last.hours = hours; }
    if (minutes !== last.minutes) { setText(ui.minutes, pad(minutes)); pulse(ui.minutes); last.minutes = minutes; }
    setText(ui.seconds, pad(seconds));
    pulse(ui.seconds);
}

function pulse(node) {
    node.classList.remove("is-tick");
    // إجبار المتصفح على إعادة التدفق لتشغيل الحركة من جديد
    void node.offsetWidth;
    node.classList.add("is-tick");
}

const pad = (n) => String(n).padStart(2, "0");