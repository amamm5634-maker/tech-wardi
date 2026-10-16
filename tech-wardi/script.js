
document.addEventListener("DOMContentLoaded", () => {
    /* ========================================
       1. إظهار الأقسام عند الوصول إليها
       ======================================== */

    const revealElements = document.querySelectorAll(
        ".discover-section .section-card, .mission-section, .event-section"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("reveal-on-scroll");
        });

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    /* الفقاعة المتحركة في النافيجيشن */
    document.querySelectorAll(".nav-links").forEach((nav) => {
        const links = [...nav.querySelectorAll("a")];

        if (!links.length) return;

        const bubble = document.createElement("span");
        bubble.className = "nav-bubble";
        bubble.setAttribute("aria-hidden", "true");

        nav.prepend(bubble);

        function getActiveLink() {
            return nav.querySelector('a[aria-current="page"]')
                || links[0];
        }

        function moveBubble(link) {
            if (!link) return;

            const navRect = nav.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();

            bubble.style.left =
                `${linkRect.left - navRect.left}px`;

            bubble.style.top =
                `${linkRect.top - navRect.top}px`;

            bubble.style.width = `${linkRect.width}px`;
            bubble.style.height = `${linkRect.height}px`;

            nav.classList.add("bubble-ready");
        }

        links.forEach((link) => {
            link.addEventListener("pointerenter", () => {
                moveBubble(link);
            });

            link.addEventListener("focus", () => {
                moveBubble(link);
            });
        });

        nav.addEventListener("pointerleave", () => {
            moveBubble(getActiveLink());
        });

        nav.addEventListener("focusout", (event) => {
            if (!nav.contains(event.relatedTarget)) {
                moveBubble(getActiveLink());
            }
        });

        window.addEventListener("resize", () => {
            moveBubble(getActiveLink());
        });

        moveBubble(getActiveLink());
    });

    /* ========================================
       2. فراشة TECH WARDI
       تتحرك داخل الواجهة الرئيسية فقط
       ======================================== */

    const butterfly = document.getElementById("tech-wardi-butterfly");

    if (!butterfly) return;

    const hero = butterfly.closest(".hero");

    if (!hero) return;

    const title =
        hero.querySelector(".hero-label") ||
        hero.querySelector("h1");

    const butterflyWidth = 64;
    const butterflyHeight = 60;
    const margin = 42;

    let frameId = null;
    let running = false;

    let mode = "perch";
    let holdUntil = 0;

    let angle = 0;

    let current = { x: 0, y: 0 };
    let from = { x: 0, y: 0 };
    let to = { x: 0, y: 0 };

    let startTime = null;
    let duration = 2500;

    let routePoints = [];
    let routeIndex = 0;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    /* حساب مساحة الحركة من قسم البداية نفسه */
    function getBounds() {
        return {
            width: hero.clientWidth,
            height: hero.clientHeight
        };
    }

    /* نقطة الوقوف بجوار عنوان TECH WARDI */
    function getPerchPoint() {
        const bounds = getBounds();

        if (title) {
            const titleRect = title.getBoundingClientRect();
            const heroRect = hero.getBoundingClientRect();

            return {
                x: clamp(
                    titleRect.right - heroRect.left - 8,
                    butterflyWidth / 2 + 8,
                    bounds.width - butterflyWidth / 2 - 8
                ),

                y: clamp(
                    titleRect.top - heroRect.top - 3,
                    butterflyHeight / 2 + 8,
                    bounds.height - butterflyHeight / 2 - 8
                )
            };
        }

        return {
            x: bounds.width / 2,
            y: Math.min(75, bounds.height / 2)
        };
    }

    /* اختيار نقاط عشوائية داخل الواجهة الرئيسية */
    function getRandomPoint() {
        const bounds = getBounds();

        const minX = Math.min(
            margin + butterflyWidth / 2,
            bounds.width / 2
        );

        const maxX = Math.max(
            minX,
            bounds.width - margin - butterflyWidth / 2
        );

        const minY = Math.min(
            margin + butterflyHeight / 2,
            bounds.height / 2
        );

        const maxY = Math.max(
            minY,
            bounds.height - margin - butterflyHeight / 2
        );

        return {
            x: minX + Math.random() * (maxX - minX),
            y: minY + Math.random() * (maxY - minY)
        };
    }

    /* انتقال تدريجي وناعم */
    function easeInOut(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function beginSegment(destination) {
        from = { ...current };
        to = { ...destination };

        startTime = null;
        duration = 2200 + Math.random() * 1700;

        mode = "fly";
    }

    /* مسار جديد داخل الواجهة */
    function createRoute() {
        routePoints = [
            getRandomPoint(),
            getRandomPoint(),
            getPerchPoint()
        ];

        routeIndex = 0;

        beginSegment(routePoints[routeIndex]);
    }

    /* تحديث موضع الفراشة */
    function render() {
        butterfly.style.left = `${current.x}px`;
        butterfly.style.top = `${current.y}px`;

        butterfly.style.transform =
            `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    function animate(timestamp) {
        if (!running || document.hidden || reducedMotion.matches) {
            stopAnimation();
            return;
        }

        /* الوقوف بجوار العنوان قبل بدء رحلة جديدة */
        if (mode === "perch") {
            if (timestamp >= holdUntil) {
                createRoute();
            } else {
                frameId = requestAnimationFrame(animate);
                return;
            }
        }

        if (startTime === null) {
            startTime = timestamp;
        }

        const progress = Math.min(
            (timestamp - startTime) / duration,
            1
        );

        const t = easeInOut(progress);

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;

        /* انحناء بسيط يجعل الطيران طبيعيًا */
        const direction = routeIndex % 2 === 0 ? 1 : -1;
        const curve = Math.sin(t * Math.PI) * 10 * direction;

        current.x =
            from.x + dx * t - (dy / distance) * curve;

        current.y =
            from.y + dy * t + (dx / distance) * curve;

        /* تدوير الفراشة باتجاه حركتها */
        if (distance > 1) {
            const targetAngle =
                Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            const difference =
                ((targetAngle - angle + 540) % 360) - 180;

            angle += difference * 0.08;
        }

        render();

        if (progress >= 1) {
            current = { ...to };
            render();

            if (routeIndex >= routePoints.length - 1) {
                mode = "perch";

                holdUntil =
                    timestamp + 3500 + Math.random() * 1500;
            } else {
                routeIndex++;

                beginSegment(routePoints[routeIndex]);
            }
        }

        frameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        running = false;

        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    }

    function startAnimation() {
        stopAnimation();

        if (reducedMotion.matches || document.hidden) {
            return;
        }

        current = getPerchPoint();

        angle = 0;
        mode = "perch";
        holdUntil = performance.now() + 3500;

        render();

        running = true;

        frameId = requestAnimationFrame(animate);
    }

    /* إعادة حساب الموضع عند تغيير حجم الشاشة */
    window.addEventListener("resize", startAnimation);

    /* إيقاف الحركة في علامات التبويب المخفية */
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    /* احترام إعدادات تقليل الحركة في الجهاز */
    reducedMotion.addEventListener("change", () => {
        if (reducedMotion.matches) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    startAnimation();
});
