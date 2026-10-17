/**
 * centers.js — مراكز الفحص
 * يعمل بشكل مستقل تماماً.
 */

(function () {
    "use strict";

    // ============================================================
    // 1. البيانات (استبدلها بالبيانات الحقيقية لاحقاً)
    // ============================================================
    const centersData = [
       { name: "مستشفى الخرطوم لعلاج الاورام(الذرة)", location: "وسط الخرطوم – شارع القصر", mapsUrl: "مستشفى الخرطوم لعلاج الأورام" },
        { name: "مركز الضمان للاورام", location: "ولاية الشمالية - مروي", mapsUrl: "https://maps.app.goo.gl/GnYL3zViFWk8UsLy8?g_st=ac" },
        { name: "مستشفى حاج الصافي التعليمي", location: "ولاية الخرطوم - بحري", mapsUrl: "https://maps.app.goo.gl/VTXdXfcBrkMhxTyAA" },
        { name: "مركز النادر الطبي لعلاج الاورام", location: "امدرمان - حي الروضة", mapsUrl: "https://maps.app.goo.gl/GuySoiEmZhE73Bxv6?g_st=ac" },
        { name: "مركز طيبة للاورام", location: "خرطوم 3 - شارع عبد الفضيل الماظ", mapsUrl: "https://maps.app.goo.gl/nypamhL2NvnkYw118?g_st=ac" },
        { name: "المعهد القومي للاورام", location: "ولاية الجزيرة - مدني", mapsUrl: "https://maps.app.goo.gl/H2rfD4DqSoxQcvo18?g_st=ac" },
        { name: "مركز علاج الاورام و ابحاث السرطان", location: "ولاية نهر النيل - شندي", mapsUrl: "https://maps.app.goo.gl/Ty3UDzwd4UCBLZuM6" },
        { name: "مركز بورتسودان لعلاج الاورام", location: "ولاية البحر الأحمر - بورتسودان", mapsUrl: "https://maps.app.goo.gl/2eFmuBNT5mMAMaQNA" },
        { name: "مركز النيل الابيض للاورام", location: "ولاية النيل الابيض - كوستي", mapsUrl: "https://maps.app.goo.gl/YTB2vE5JXYiH8oYa8?g_st=ac" }, ];

    // ============================================================
    // 2. أدوات DOM المدمجة
    // ============================================================
    const $ = (sel, root = document) => root.querySelector(sel);
    
    function el(tag, attrs = {}, children = []) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (v === null || v === undefined) continue;
            if (k === "class") node.className = v;
            else if (k === "text") node.textContent = String(v);
            else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
            else node.setAttribute(k, v);
        }
        const list = Array.isArray(children) ? children : [children];
        for (const c of list) {
            if (c === null || c === undefined) continue;
            node.append(c);
        }
        return node;
    }

    const clear = (node) => node.replaceChildren();

    // ============================================================
    // 3. الأيقونات
    // ============================================================
    const MAP_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

    // ============================================================
    // 4. المنطق الأساسي
    // ============================================================
    const ui = {};

    function init() {
        ui.list = $("#centers-list");
        ui.count = $("#centers-count");
        ui.shareBtn = $("#share-centers");
        ui.shareStatus = $("#share-status");

        if (!ui.list) return; // الصفحة لا تحتوي على القائمة

        renderList();
        if (ui.shareBtn) initShare();
    }

    function renderList() {
        clear(ui.list);

        if (centersData.length === 0) {
            ui.list.append(el("p", { class: "centers-empty", text: "لا توجد مراكز متاحة حاليًا." }));
            if (ui.count) ui.count.textContent = "0";
            return;
        }

        for (const c of centersData) {
            ui.list.append(buildCard(c));
        }
        if (ui.count) ui.count.textContent = `${centersData.length} مراكز متاحة`;
    }

    function buildCard(center) {
        const card = el("article", { class: "centers-card" });
        
        const icon = el("span", { class: "centers-icon", "aria-hidden": "true", text: "🏥" });

        const body = el("div", { class: "centers-body" }, [
            el("h3", { class: "centers-name", text: center.name }),
            el("p", { class: "centers-location", text: center.location }),
        ]);

        const mapLink = el("a", {
            class: "centers-map-link",
            href: center.mapsUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": `رؤية ${center.name} في خرائط غوغل`,
        });
        mapLink.innerHTML = MAP_ICON;
        mapLink.append(el("span", { text: "رؤية في خرائط غوغل" }));

        card.append(icon, body, mapLink);
        return card;
    }

    function initShare() {
        ui.shareBtn.addEventListener("click", async () => {
            const data = {
                title: "مراكز الفحص | تِك وردي",
                text: "قائمة بمراكز الفحص والعلاج للتوعية بسرطان الثدي.",
                url: window.location.href,
            };

            try {
                if (navigator.share) {
                    await navigator.share(data);
                    setStatus("تمت المشاركة 💗");
                } else if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(window.location.href);
                    setStatus("تم نسخ الرابط ✓");
                } else {
                    setStatus("انسخي الرابط يدويًا: " + window.location.href);
                }
            } catch (err) {
                if (err && err.name === "AbortError") return;
                console.warn("[centers] فشلت المشاركة:", err);
                setStatus("تعذرت المشاركة.");
            }
        });
    }

    function setStatus(text) {
        if (!ui.shareStatus) return;
        ui.shareStatus.textContent = text;
        setTimeout(() => {
            if (ui.shareStatus.textContent === text) ui.shareStatus.textContent = "";
        }, 4000);
    }

    // ============================================================
    // التشغيل
    // ============================================================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();