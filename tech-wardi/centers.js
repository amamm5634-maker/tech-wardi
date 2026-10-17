/**
 * centers.js — مراكز الفحص
 * يعمل بشكل مستقل تماماً.
 */

(function () {
    "use strict";

    // ============================================================
    // 1. البيانات
    // ============================================================
    const centersData = [
        { name: "مركز فحص الثدي التخصصي", location: "ولاية الخرطوم – حي الرياض", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Khartoum+Riyadh+Sudan" },
        { name: "مستشفى الخرطوم التعليمي", location: "ولاية الخرطوم – شارع الجمهورية", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Khartoum+Teaching+Hospital+Sudan" },
        { name: "مركز الأمل للكشف المبكر", location: "ولاية الخرطوم – بحري، شمبات", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shambat+Bahri+Sudan" },
        { name: "مركز بحري للأورام", location: "ولاية الخرطوم – بحري، كافوري", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kafouri+Bahri+Sudan" },
        { name: "مركز إسعاد الطبي", location: "ولاية الخرطوم – أم درمان، الموردة", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Omdurman+Sudan" },
        { name: "مستشفى الجزيرة التعليمي", location: "ولاية الجزيرة – ودمدني", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wad+Madani+Hospital+Sudan" },
        { name: "مستشفى بورتسودان التعليمي", location: "ولاية البحر الأحمر – بورتسودان", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Port+Sudan+Teaching+Hospital" },
        { name: "مركز النيل الأزرق للكشف", location: "ولاية النيل الأزرق – الدمازين", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ad+Damazin+Sudan" }
    ];

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
    
    // أيقونة القلب الطبي (اللون الوردي مباشر)
    const HEART_MED_ICON = `
        <svg viewBox="0 0 24 24" fill="#d94f83" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            <path d="M12 7v8" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M8 11h8" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `;

    // ============================================================
    // 4. المنطق الأساسي
    // ============================================================
    const ui = {};

    function init() {
        ui.list = $("#centers-list");
        ui.count = $("#centers-count");
        ui.shareBtn = $("#share-centers");
        ui.shareStatus = $("#share-status");

        if (!ui.list) return; 

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
        
        const icon = el("span", { class: "centers-icon", "aria-hidden": "true" });
        icon.innerHTML = HEART_MED_ICON;

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
