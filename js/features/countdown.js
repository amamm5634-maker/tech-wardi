/**
 * countdown.js — العدّاد التنازلي للفعالية.
 * يقرأ التاريخ من config.eventDate ويهندس الفروق الزمنية.
 */

import { $, setText } from "../core/dom.js";
import { APP } from "../config.js";

const TAG = "[techwardi:countdown]";
const ui = {};
let timerId = null;

const TARGET_MS = new Date(APP.eventDate).getTime();

export function initCountdown() {
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

    console.info(`${TAG} جاهزة — الهدف: ${new Date(TARGET_MS).toLocaleString("ar")}`);
}

function tick() {
    const diff = TARGET_MS - Date.now();

    if (diff <= 0) {
        clearInterval(timerId);
        timerId = null;
        setText(ui.days, "0");
        setText(ui.hours, "0");
        setText(ui.minutes, "0");
        setText(ui.seconds, "0");
        if (ui.status) setText(ui.status, "🎗️ الفعالية بدأت!");
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    setText(ui.days, pad(days));
    setText(ui.hours, pad(hours));
    setText(ui.minutes, pad(minutes));
    setText(ui.seconds, pad(seconds));
}

const pad = (n) => String(n).padStart(2, "0");