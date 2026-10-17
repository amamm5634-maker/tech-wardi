
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       1. إعداد Supabase
    ========================================= */

    const SUPABASE_URL =
        "https://cpasmtfafirifugkijvw.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_iDtwCMg0rA2oNLMdmgQkIg_LamoTVXQ";

    const TABLE_NAME = "hope_messages";
    const PAGE_SIZE = 4;

    let supabaseClient = window.supabaseClient || null;

    if (
        !supabaseClient &&
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
    }

    /* =========================================
       2. عناصر الصفحة
    ========================================= */

    const form = document.getElementById("wall-message-form");
    const nameInput = document.getElementById("wall-name");
    const messageInput = document.getElementById(
        "wall-message-input"
    );

    const characterCount = document.getElementById(
        "wall-character-count"
    );

    const submitButton = document.getElementById(
        "wall-submit-button"
    );

    const feedback = document.getElementById(
        "wall-form-feedback"
    );

    const messagesContainer = document.getElementById(
        "wall-messages"
    );

    const messageCount = document.getElementById(
        "wall-message-count"
    );

    const statusElement = document.getElementById(
        "wall-status"
    );

    const loadMoreWrap = document.getElementById(
        "wall-load-more-wrap"
    );

    const loadMoreButton = document.getElementById(
        "wall-load-more"
    );

    /* =========================================
       3. عدّاد الأحرف
    ========================================= */

    function updateCharacterCount() {
        if (!messageInput || !characterCount) return;

        characterCount.textContent =
            `${messageInput.value.length}/300`;
    }

    if (messageInput) {
        messageInput.addEventListener(
            "input",
            updateCharacterCount
        );

        updateCharacterCount();
    }

    /* =========================================
       4. رسائل الحالة
    ========================================= */

    function setStatus(message) {
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    function setFeedback(message, type = "") {
        if (!feedback) return;

        feedback.textContent = message;
        feedback.hidden = !message;

        feedback.classList.remove(
            "is-success",
            "is-error"
        );

        if (type === "success") {
            feedback.classList.add("is-success");
        }

        if (type === "error") {
            feedback.classList.add("is-error");
        }
    }

    /* =========================================
       5. تنسيق التاريخ
    ========================================= */

    function formatDate(value) {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat("ar", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }).format(date);
    }

    /* =========================================
       6. إنشاء بطاقة رسالة بأمان
    ========================================= */

    function createMessageCard(item) {
        const card = document.createElement("article");
        card.className = "wall-message-card";

        const name = document.createElement("p");
        name.className = "wall-message-card__name";

        name.textContent =
            typeof item.name === "string" && item.name.trim()
                ? item.name.trim()
                : "مجهول";

        const date = document.createElement("p");
        date.className = "wall-message-card__date";
        date.textContent = formatDate(item.created_at);

        const message = document.createElement("p");
        message.className = "wall-message-card__message";

        const messageText =
            typeof item.message === "string"
                ? item.message.trim()
                : "";

        // عرض النص بأمان دون تفسيره كـ HTML.
        message.textContent = messageText;

        card.append(name);

        if (date.textContent) {
            card.append(date);
        }

        card.append(message);

        // زر قراءة المزيد للرسائل الطويلة.
        if (messageText.length > 110) {
            message.classList.add("is-collapsed");

            const moreButton = document.createElement("button");

            moreButton.type = "button";
            moreButton.className = "wall-read-more";
            moreButton.textContent = "اقرأ المزيد";
            moreButton.setAttribute("aria-expanded", "false");

            moreButton.addEventListener("click", () => {
                const expanded =
                    message.classList.contains("is-expanded");

                if (expanded) {
                    message.classList.remove("is-expanded");
                    message.classList.add("is-collapsed");

                    moreButton.textContent = "اقرأ المزيد";
                    moreButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                } else {
                    message.classList.remove("is-collapsed");
                    message.classList.add("is-expanded");

                    moreButton.textContent = "عرض أقل";
                    moreButton.setAttribute(
                        "aria-expanded",
                        "true"
                    );
                }
            });

            card.append(moreButton);
        }

        return card;
    }

    /* =========================================
       7. تحميل الرسائل المعتمدة
    ========================================= */

    let approvedMessages = [];
    let visibleMessages = 0;

    function renderNextMessages() {
        if (!messagesContainer) return;

        const nextMessages = approvedMessages.slice(
            visibleMessages,
            visibleMessages + PAGE_SIZE
        );

        const fragment = document.createDocumentFragment();

        nextMessages.forEach((item) => {
            fragment.appendChild(createMessageCard(item));
        });

        messagesContainer.appendChild(fragment);

        visibleMessages += nextMessages.length;

        if (loadMoreWrap) {
            loadMoreWrap.hidden =
                visibleMessages >= approvedMessages.length;
        }
    }

    async function loadApprovedMessages() {
        if (!messagesContainer) return;

        messagesContainer.replaceChildren();

        approvedMessages = [];
        visibleMessages = 0;

        if (loadMoreWrap) {
            loadMoreWrap.hidden = true;
        }

        if (messageCount) {
            messageCount.textContent = "جاري التحميل...";
        }

        if (!supabaseClient) {
            setStatus(
                "تعذر الاتصال بقاعدة البيانات. تحقق من تحميل مكتبة Supabase وإعداداتها."
            );

            if (messageCount) {
                messageCount.textContent = "تعذر التحميل";
            }

            return;
        }

        setStatus("نبحث عن رسائل الأمل المعتمدة 💗");

        try {
            const { data, error, count } = await supabaseClient
                .from(TABLE_NAME)
                .select(
                    "id, name, message, created_at",
                    { count: "exact" }
                )
                .eq("status", "approved")
                .order("created_at", { ascending: false })
                .limit(500);

            if (error) {
                throw error;
            }

            approvedMessages = Array.isArray(data) ? data : [];

            if (messageCount) {
                const total = count ?? approvedMessages.length;

                messageCount.textContent = `${total} رسالة`;
            }

            if (approvedMessages.length === 0) {
                setStatus(
                    "لا توجد رسائل معتمدة حتى الآن. كن أول من يشارك كلمة أمل 💗"
                );

                return;
            }

            setStatus("");
            renderNextMessages();

        } catch (error) {
            console.error(
                "تعذر تحميل رسائل حائط الأمل:",
                error?.message || error,
                error
            );

            setStatus(
                "لم نتمكن من تحميل الرسائل الآن. حاول تحديث الصفحة بعد قليل."
            );

            if (messageCount) {
                messageCount.textContent = "تعذر التحميل";
            }
        }
    }

    /* =========================================
       8. زر عرض المزيد
    ========================================= */

    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            renderNextMessages();
        });
    }

    /* =========================================
       9. إرسال رسالة جديدة للمراجعة
    ========================================= */

    if (form && messageInput && submitButton) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = nameInput
                ? nameInput.value.trim()
                : "";

            const message = messageInput.value.trim();

            setFeedback("");

            // التحقق من الاسم.
            if (name.length > 50) {
                setFeedback(
                    "الاسم يجب ألا يتجاوز 50 حرفًا.",
                    "error"
                );
                return;
            }

            // التحقق من طول الرسالة.
            if (message.length < 10) {
                setFeedback(
                    "اكتب رسالة لا تقل عن 10 أحرف.",
                    "error"
                );
                messageInput.focus();
                return;
            }

            if (message.length > 300) {
                setFeedback(
                    "الرسالة يجب ألا تتجاوز 300 حرف.",
                    "error"
                );
                messageInput.focus();
                return;
            }

            if (!supabaseClient) {
                setFeedback(
                    "تعذر الاتصال بقاعدة البيانات. حاول لاحقًا.",
                    "error"
                );
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "جارٍ إرسال رسالتك...";

            try {
                const { error } = await supabaseClient
                    .from(TABLE_NAME)
                    .insert({
                        name: name || "مجهول",
                        message: message,
                        status: "pending"
                    });

                if (error) {
                    throw error;
                }

                // لا نعرض الرسالة مباشرةً؛ تنتظر الموافقة.
                setFeedback(
                    "وصلتنا رسالتك بنجاح 💗 ستظهر في الحائط بعد مراجعتها والموافقة عليها.",
                    "success"
                );

                form.reset();
                updateCharacterCount();

            } catch (error) {
                console.error(
                    "تعذر إرسال رسالة حائط الأمل:",
                    error?.message || error,
                    error
                );

                setFeedback(
                    "لم نتمكن من إرسال الرسالة. تحقق من الاتصال وحاول مرة أخرى.",
                    "error"
                );

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "أرسل رسالتك 💗";
            }
        });
    }

    /* =========================================
       10. تشغيل الصفحة
    ========================================= */

    loadApprovedMessages();
});
