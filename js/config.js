import { APP, FEATURES } from "./config.js";
import { initCounters } from "./features/impact-counters.js";
import { initQuiz } from "./features/quiz.js";
import { initHopeWall } from "./features/hope-wall.js";
import { initCountdown } from "./features/countdown.js";
import { initShare } from "./features/share.js";

const TAG = "[techwardi]";

function onReady(fn) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
}

function setFooterYear() {
    const el = document.getElementById("footer-year");
    if (!el) return;
    el.textContent = `© ${new Date().getFullYear()} ${APP.name}`;
}

function boot() {
    console.info(`${TAG} v${APP.version} — بدء التشغيل`);

    setFooterYear();

    const queue = [
        { name: "countdown", enabled: FEATURES.countdown, fn: initCountdown },
        { name: "counters", enabled: FEATURES.counters, fn: initCounters },
        { name: "quiz", enabled: FEATURES.quiz, fn: initQuiz },
        { name: "hopeWall", enabled: FEATURES.hopeWall, fn: initHopeWall },
        { name: "share", enabled: FEATURES.share, fn: initShare },
    ];

    for (const { name, enabled, fn } of queue) {
        if (!enabled) {
            console.info(`${TAG} "${name}" معطّلة عبر FEATURES`);
            continue;
        }
        try {
            fn();
        } catch (error) {
            console.error(`${TAG} فشل تهيئة "${name}":`, error);
        }
    }

    console.info(`${TAG} جاهز`);
}

window.addEventListener("error", (event) => {
    console.error(`${TAG} [خطأ غير معالَج]`, event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
    console.error(`${TAG} [وعد مرفوض]`, event.reason);
});

onReady(boot);