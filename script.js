
const SUPABASE_URL = "https://cpasmtfafirifugkijvw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iDtwCMg0rA2oNLMdmgQkIg_LamoTVXQ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// ==========================================
// بنك الأسئلة: 50 سؤالًا
// ==========================================

const questions = [
    // المحور الأول: فهم سرطان الثدي
    {
        question: "ما سرطان الثدي؟",
        options: [
            "مرض يصيب العظام فقط",
            "نمو غير طبيعي لخلايا في أنسجة الثدي",
            "عدوى تنتقل بالمصافحة"
        ],
        answer: 1
    },
    {
        question: "هل يمكن أن يصاب الرجال بسرطان الثدي؟",
        options: [
            "نعم، لكنه أقل شيوعًا لديهم",
            "لا، يصيب النساء فقط",
            "نعم، لكن بعد سن الستين فقط"
        ],
        answer: 0
    },
    {
        question: "هل كل كتلة في الثدي تعني وجود سرطان؟",
        options: [
            "نعم، كل الكتل سرطانية",
            "لا، معظم الكتل ليست سرطانًا، لكن يجب تقييمها طبيًا",
            "نعم، إذا كانت صغيرة"
        ],
        answer: 1
    },
    {
        question: "هل سرطان الثدي معدٍ؟",
        options: [
            "نعم، بالمصافحة",
            "نعم، بمشاركة الطعام",
            "لا، لا ينتقل بالمخالطة اليومية"
        ],
        answer: 2
    },
    {
        question: "هل يمكن أن يحدث سرطان الثدي دون وجود تاريخ عائلي للمرض؟",
        options: [
            "نعم، كثير من المصابين ليس لديهم تاريخ عائلي معروف",
            "لا، يجب أن يكون أحد الوالدين مصابًا",
            "لا، إلا إذا انتقل من شخص آخر"
        ],
        answer: 0
    },
    {
        question: "هل وجود تاريخ عائلي لسرطان الثدي قد يزيد خطر الإصابة؟",
        options: [
            "لا، ليس له أي علاقة",
            "نعم، وقد يستدعي تقييمًا فرديًا للمخاطر",
            "نعم، ويعني أن الإصابة مؤكدة"
        ],
        answer: 1
    },
    {
        question: "هل كل حالات سرطان الثدي لها النوع نفسه والعلاج نفسه؟",
        options: [
            "نعم، العلاج واحد للجميع",
            "نعم، ويعتمد فقط على العمر",
            "لا، تختلف الأنواع والعلاجات حسب الحالة"
        ],
        answer: 2
    },
    {
        question: "هل يمكن أن يصاب الشباب بسرطان الثدي؟",
        options: [
            "نعم، رغم أن الخطر يزداد عمومًا مع التقدم في العمر",
            "لا، لا يحدث قبل سن الأربعين",
            "لا، إلا عند وجود ألم"
        ],
        answer: 0
    },
    {
        question: "هل كل أورام الثدي الخبيثة تسبب ألمًا؟",
        options: [
            "نعم، الألم شرط لوجود السرطان",
            "لا، قد توجد كتلة سرطانية دون ألم",
            "نعم، لكن الألم لا يظهر إلا ليلًا"
        ],
        answer: 1
    },
    {
        question: "ما المقصود بالكشف المبكر عن سرطان الثدي؟",
        options: [
            "انتظار ظهور أعراض شديدة",
            "تشخيص المرض من صورة على الإنترنت",
            "اكتشاف المرض مبكرًا وتقييم العلامات غير الطبيعية دون تأخير"
        ],
        answer: 2
    },

    // المحور الثاني: العلامات وطلب الرعاية
    {
        question: "لاحظ شخص كتلة جديدة في الثدي لا تؤلمه. ما التصرف الأنسب؟",
        options: [
            "طلب تقييم طبي دون تأخير",
            "انتظار ظهور الألم أولًا",
            "تدليك الكتلة حتى تختفي"
        ],
        answer: 0
    },
    {
        question: "أي تغير قد يستدعي تقييمًا طبيًا؟",
        options: [
            "تغير لون الملابس",
            "تغير جديد في شكل الثدي أو حجمه",
            "الشعور بالجوع"
        ],
        answer: 1
    },
    {
        question: "هل خروج إفراز دموي من الحلمة يستحق التقييم؟",
        options: [
            "لا، يحدث دائمًا بصورة طبيعية",
            "فقط إذا صاحبه ارتفاع في الحرارة",
            "نعم، ينبغي تقييمه طبيًا"
        ],
        answer: 2
    },
    {
        question: "أي تغير في الجلد قد يستدعي الانتباه؟",
        options: [
            "تنقر أو تجعد جديد في جلد الثدي",
            "جفاف اليدين",
            "تغير لون الشعر"
        ],
        answer: 0
    },
    {
        question: "هل تغير الحلمة إلى الداخل حديثًا يستحق التقييم؟",
        options: [
            "لا، في جميع الحالات",
            "نعم، خصوصًا إذا كان تغيرًا جديدًا",
            "فقط إذا كان في الثديين معًا"
        ],
        answer: 1
    },
    {
        question: "إذا لم توجد أعراض، فهل يمكن أن يستفيد الشخص من الفحص المناسب لعمره ومستوى خطورته؟",
        options: [
            "لا، الفحص مفيد فقط عند وجود ألم",
            "لا، الأعراض وحدها تكفي دائمًا",
            "نعم، قد يُكتشف المرض قبل ظهور الأعراض"
        ],
        answer: 2
    },
    {
        question: "ما الفرق بين الفحص التشخيصي وفحص الكشف لدى من لا تظهر عليه أعراض؟",
        options: [
            "الفحص التشخيصي يقيّم علامة أو مشكلة، أما فحص الكشف فيبحث عن المرض قبل ظهور الأعراض",
            "لا يوجد أي فرق",
            "فحص الكشف يؤكد التشخيص دائمًا"
        ],
        answer: 0
    },
    {
        question: "هل الفحص الذاتي للثدي يغني عن كل الفحوصات الطبية الموصى بها؟",
        options: [
            "نعم، يغني عنها تمامًا",
            "لا، لا يحل محل الفحوصات المناسبة أو التقييم الطبي",
            "نعم، إذا أُجري يوميًا"
        ],
        answer: 1
    },
    {
        question: "إذا كانت كتلة الثدي تتحرك عند لمسها، فهل يمكن الجزم بأنها غير سرطانية؟",
        options: [
            "نعم، الحركة تنفي السرطان",
            "نعم، إذا لم تؤلم",
            "لا، لا يمكن تحديد طبيعتها باللمس وحده"
        ],
        answer: 2
    },
    {
        question: "ما التصرف الأفضل عند ملاحظة تغير جديد ومقلق في الثدي؟",
        options: [
            "التواصل مع مختص صحي لتقييمه",
            "الاعتماد على نصائح وسائل التواصل فقط",
            "تجاهله حتى يصبح شديدًا"
        ],
        answer: 0
    },

    // المحور الثالث: التشخيص والعلاج
    {
        question: "هل التصوير الطبي وحده يؤكد كل حالات سرطان الثدي؟",
        options: [
            "نعم، في جميع الحالات",
            "لا، قد يحتاج التشخيص إلى خزعة وفحوص أخرى",
            "نعم، إذا كانت الصورة واضحة"
        ],
        answer: 1
    },
    {
        question: "ما الخزعة في سياق تشخيص سرطان الثدي؟",
        options: [
            "تمرين رياضي",
            "نوع من المسكنات",
            "أخذ عينة من النسيج لفحصها"
        ],
        answer: 2
    },
    {
        question: "من يحدد العلاج الأنسب للمصاب بسرطان الثدي؟",
        options: [
            "الفريق الطبي بالتشاور مع المريض",
            "أي شخص على الإنترنت",
            "المريض الآخر الذي لديه تشخيص مشابه فقط"
        ],
        answer: 0
    },
    {
        question: "أي مما يلي قد يدخل ضمن علاج سرطان الثدي حسب الحالة؟",
        options: [
            "المضادات الحيوية وحدها لكل المرضى",
            "الجراحة أو العلاج الإشعاعي أو علاجات دوائية",
            "الأعشاب وحدها"
        ],
        answer: 1
    },
    {
        question: "هل يحتاج كل مريض إلى العلاج الكيميائي؟",
        options: [
            "نعم، بلا استثناء",
            "لا أحد يحتاج إليه",
            "لا، يعتمد العلاج على نوع المرض ومرحلته وعوامل أخرى"
        ],
        answer: 2
    },
    {
        question: "إذا خاف المريض من الآثار الجانبية للعلاج، فما الأفضل؟",
        options: [
            "مناقشة المخاوف والخيارات مع الفريق الطبي",
            "إيقاف العلاج من تلقاء نفسه",
            "إخفاء الأعراض عن الطبيب"
        ],
        answer: 0
    },
    {
        question: "هل ينبغي إبلاغ الطبيب بالأدوية والأعشاب والمكملات التي يستخدمها المريض؟",
        options: [
            "لا، المنتجات الطبيعية لا تؤثر أبدًا",
            "نعم، فقد تؤثر بعض المنتجات في العلاج أو تتداخل معه",
            "فقط إذا كانت غالية الثمن"
        ],
        answer: 1
    },
    {
        question: "ماذا يفعل المريض إذا ظهرت آثار جانبية جديدة أثناء العلاج؟",
        options: [
            "يتحملها دائمًا دون إخبار أحد",
            "يوقف جميع الأدوية فورًا",
            "يتواصل مع الفريق الطبي لمعرفة كيفية التعامل معها"
        ],
        answer: 2
    },
    {
        question: "هل يجوز تغيير جرعة علاج السرطان دون استشارة الطبيب؟",
        options: [
            "لا، يجب الرجوع إلى الفريق الطبي",
            "نعم، إذا شعر المريض بتحسن",
            "نعم، إذا نصحه صديق"
        ],
        answer: 0
    },
    {
        question: "إذا أراد المريض رأيًا طبيًا ثانيًا، فهل يمكنه طلبه؟",
        options: [
            "لا، هذا ممنوع دائمًا",
            "نعم، ويمكنه مناقشة ذلك مع طبيبه",
            "نعم، ويجب عليه إلغاء علاجه الحالي فورًا"
        ],
        answer: 1
    },

    // المحور الرابع: الأسرة والدعم النفسي
    {
        question: "ما أفضل طريقة لبدء مساندة شخص أخبرك بتشخيص إصابته؟",
        options: [
            "إخباره بأن مشاعره مبالغ فيها",
            "تغيير الموضوع مباشرة",
            "الاستماع إليه وسؤاله عن نوع الدعم الذي يحتاجه"
        ],
        answer: 2
    },
    {
        question: "إذا لم يرغب المصاب في الحديث عن المرض الآن، فما التصرف الأفضل؟",
        options: [
            "احترام رغبته وإخباره أنك موجود عندما يحتاجك",
            "إجباره على الحديث",
            "الابتعاد عنه نهائيًا"
        ],
        answer: 0
    },
    {
        question: "كيف يمكن للأسرة مساعدة المريض عمليًا؟",
        options: [
            "اتخاذ كل القرارات بدلًا عنه",
            "المساعدة في المواعيد أو المواصلات أو المهام التي يطلبها",
            "منعه من طرح الأسئلة على الطبيب"
        ],
        answer: 1
    },
    {
        question: "أي عبارة أكثر دعمًا لشخص يمر بعلاج السرطان؟",
        options: [
            "لا يحق لك أن تحزن",
            "لا تفكر في المرض أبدًا",
            "أنا معك، ما الذي يمكنني فعله لمساعدتك؟"
        ],
        answer: 2
    },
    {
        question: "هل من المناسب مقارنة تجربة مريض بتجربة مريض آخر؟",
        options: [
            "لا، فالتجارب والاحتياجات قد تختلف من شخص لآخر",
            "نعم، لأن العلاج والنتائج متطابقة دائمًا",
            "نعم، ويجب أن يتبع كل مريض التجربة نفسها"
        ],
        answer: 0
    },
    {
        question: "إذا شعر أحد أفراد الأسرة بالإرهاق من تقديم الرعاية، فما الأفضل؟",
        options: [
            "إخفاء الإرهاق وعدم طلب المساعدة",
            "طلب الدعم وتقاسم المسؤوليات والاهتمام بصحته",
            "إلقاء اللوم على المريض"
        ],
        answer: 1
    },
    {
        question: "هل يمكن أن يشعر المصاب بالخوف أو الحزن أو القلق بعد التشخيص؟",
        options: [
            "لا، هذه المشاعر غير طبيعية دائمًا",
            "نعم، لكن يجب ألا يتحدث عنها",
            "نعم، وقد يفيده الدعم النفسي عند الحاجة"
        ],
        answer: 2
    },
    {
        question: "ما التصرف الأنسب إذا طلب المريض مرافقة شخص يثق به إلى موعد طبي؟",
        options: [
            "مرافقته إذا أمكن، ومساعدته في تدوين أسئلته",
            "منعه من طرح الأسئلة",
            "التحدث نيابة عنه دون السماح له بالمشاركة"
        ],
        answer: 0
    },
    {
        question: "هل ينبغي نشر صورة مريض أو تفاصيل تشخيصه دون إذنه؟",
        options: [
            "نعم، إذا كان الهدف التوعية",
            "لا، يجب احترام الخصوصية والحصول على موافقة واضحة",
            "نعم، إذا لم يُذكر اسمه فقط، في كل الحالات"
        ],
        answer: 1
    },
    {
        question: "كيف تدعم صديقًا مصابًا دون أن تشعره بأنه فقد استقلاليته؟",
        options: [
            "تقرر كل شيء عنه",
            "تعامله دائمًا كأنه عاجز",
            "تسأله عن احتياجاته وتحترم اختياراته"
        ],
        answer: 2
    },

    // المحور الخامس: الحياة اليومية والمعلومات الصحيحة
    {
        question: "هل يمكن للأعشاب أو المكملات أن تحل محل علاج السرطان الموصوف؟",
        options: [
            "لا، لا ينبغي استبدال العلاج بها",
            "نعم، إذا كانت طبيعية",
            "نعم، إذا نصح بها شخص مشهور"
        ],
        answer: 0
    },
    {
        question: "هل كل معلومة عن سرطان الثدي منشورة على وسائل التواصل موثوقة؟",
        options: [
            "نعم، كل ما ينتشر صحيح",
            "لا، ينبغي التحقق من المصادر الصحية الموثوقة",
            "نعم، إذا كان المنشور مشهورًا"
        ],
        answer: 1
    },
    {
        question: "إذا نصح أحدهم مريضًا بترك العلاج والاعتماد على وصفة شعبية، فما الأفضل؟",
        options: [
            "ترك العلاج فورًا",
            "تجربة الوصفة بدلًا من استشارة الطبيب",
            "عدم ترك العلاج الموصوف ومناقشة أي منتج مع الفريق الطبي"
        ],
        answer: 2
    },
    {
        question: "هل تعني الإصابة بسرطان الثدي أن الشخص ارتكب خطأً أو يستحق المرض؟",
        options: [
            "لا، المرض ليس عقابًا ولا دليلًا على خطأ أخلاقي",
            "نعم، المرض نتيجة ضعف الشخصية",
            "نعم، المرض دائمًا نتيجة سلوك واحد"
        ],
        answer: 0
    },
    {
        question: "هل يمكن أن يحتاج الشخص إلى متابعة طبية بعد انتهاء العلاج؟",
        options: [
            "لا، لا حاجة لأي متابعة",
            "نعم، وفق خطة المتابعة التي يحددها الفريق الطبي",
            "فقط إذا عاد الألم"
        ],
        answer: 1
    },
    {
        question: "إذا أراد المريض ممارسة الرياضة أثناء العلاج، فما الأفضل؟",
        options: [
            "ممارسة أقصى جهد مهما كانت حالته",
            "تجنب أي حركة إلى الأبد",
            "مناقشة النشاط المناسب مع الفريق الطبي بحسب حالته"
        ],
        answer: 2
    },
    {
        question: "هل توجد طريقة واحدة مضمونة لمنع سرطان الثدي تمامًا؟",
        options: [
            "لا، لا توجد وسيلة تضمن منع جميع الحالات",
            "نعم، شرب نوع واحد من الأعشاب",
            "نعم، إجراء فحص ذاتي مرة واحدة"
        ],
        answer: 0
    },
    {
        question: "ما فائدة تدوين الأسئلة قبل موعد الطبيب؟",
        options: [
            "يستبدل الفحص الطبي",
            "يساعد المريض على تذكر مخاوفه وفهم خياراته",
            "يضمن نتيجة علاجية محددة"
        ],
        answer: 1
    },
    {
        question: "ما التصرف الأنسب إذا شعر المريض بوحدة شديدة أو بضيق نفسي مستمر؟",
        options: [
            "اعتبار طلب المساعدة ضعفًا",
            "تجاهل مشاعره دائمًا",
            "التحدث مع شخص موثوق أو مختص صحي وطلب الدعم"
        ],
        answer: 2
    },
    {
        question: "ما الرسالة الأهم التي ينبغي أن يخرج بها الزائر من اختبار التوعية؟",
        options: [
            "المعرفة الموثوقة وطلب الرعاية المناسبة ودعم المصابين أمور مهمة",
            "الاختبار الإلكتروني يغني عن الطبيب",
            "كل كتلة تعني سرطانًا مؤكدًا"
        ],
        answer: 0
    }
];

// ==========================================
// نظام الاختبار
// ==========================================

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;
let quizFinished = false;

const quizContainer = document.getElementById("quiz-container");
const startButton = document.getElementById("start-quiz");
const resultElement = document.getElementById("quiz-result");

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    quizFinished = false;

    // خلط الأسئلة واختيار 10 عشوائيًا
    const shuffledQuestions = [...questions];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledQuestions[i], shuffledQuestions[j]] =
            [shuffledQuestions[j], shuffledQuestions[i]];
    }

    quizQuestions = shuffledQuestions.slice(0, 10);

    if (quizQuestions.length === 0) {
        resultElement.textContent = "لا توجد أسئلة متاحة حاليًا.";
        return;
    }

    startButton.textContent = "إعادة الاختبار";
    resultElement.textContent = "";

    showQuestion();
}

function showQuestion() {
    answered = false;

    const current = quizQuestions[currentQuestion];

    quizContainer.innerHTML = `
        <h3>السؤال ${currentQuestion + 1} من ${quizQuestions.length}</h3>

        <p>${current.question}</p>

        <div id="quiz-options">
            ${current.options.map((option, index) => `
                <button
                    type="button"
                    class="quiz-option"
                    data-index="${index}"
                >
                    ${option}
                </button>
            `).join("")}
        </div>

        <p id="answer-feedback" aria-live="polite"></p>

        <button type="button" id="next-question" disabled>
            ${currentQuestion === quizQuestions.length - 1
                ? "عرض النتيجة"
                : "السؤال التالي"}
        </button>
    `;

    const optionButtons =
        quizContainer.querySelectorAll(".quiz-option");

    optionButtons.forEach(button => {
        button.addEventListener("click", () => {
            checkAnswer(Number(button.dataset.index));
        });
    });

    document
        .getElementById("next-question")
        .addEventListener("click", nextQuestion);
}

function checkAnswer(selectedIndex) {
    if (answered || quizFinished) return;

    answered = true;

    const current = quizQuestions[currentQuestion];
    const feedback = document.getElementById("answer-feedback");

    const optionButtons =
        quizContainer.querySelectorAll(".quiz-option");

    if (selectedIndex === current.answer) {
        score++;
        feedback.textContent = "إجابة صحيحة! أحسنت 💗";
    } else {
        feedback.textContent =
            "الإجابة الصحيحة هي: " +
            current.options[current.answer];
    }

    optionButtons.forEach(button => {
        button.disabled = true;
    });

    document.getElementById("next-question").disabled = false;
}

function nextQuestion() {
    if (!answered || quizFinished) return;

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

// تسجيل النتيجة وتحديث العداد عند انتهاء الاختبار
async function finishQuiz() {
    if (quizFinished) return;

    quizFinished = true;

    quizContainer.innerHTML = `
        <h3>انتهى الاختبار 💗</h3>
        <p>أجبت بصورة صحيحة عن ${score} من ${quizQuestions.length} أسئلة.</p>
    `;

    resultElement.textContent = "جارٍ تسجيل مشاركتك...";
    startButton.textContent = "جرّب مرة أخرى";

    try {
        const { error } = await supabaseClient
            .from("quiz_attempts")
            .insert({
                score: score
            });

        if (error) throw error;

        await updateQuizCount();

        resultElement.textContent =
            `نتيجتك: ${score} / ${quizQuestions.length} — تم تسجيل مشاركتك بنجاح 💗`;

    } catch (error) {
        console.error("Quiz attempt error:", error);

        resultElement.textContent =
            `نتيجتك: ${score} / ${quizQuestions.length} — تعذر تسجيل المشاركة. تحقق من الاتصال وحاول لاحقًا.`;
    }
}

// تحديث عداد المشاركات من قاعدة البيانات
async function updateQuizCount() {
    const quizCount = document.getElementById("quiz-count");

    if (!quizCount) return;

    try {
        const { count, error } = await supabaseClient
            .from("quiz_attempts")
            .select("id", {
                count: "exact",
                head: true
            });

        if (error) throw error;

        quizCount.textContent = count ?? 0;

    } catch (error) {
        console.error("Quiz count error:", error);
    }
}

startButton.addEventListener("click", startQuiz);

// ==========================================
// حائط الأمل
// ==========================================

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const messagesList = document.getElementById("messages-list");
const messagesCount = document.getElementById("messages-count");

// عرض حالة إرسال الرسالة
const messageStatus = document.createElement("p");
messageStatus.setAttribute("aria-live", "polite");
messageForm.appendChild(messageStatus);

// إرسال الرسالة إلى قاعدة البيانات بحالة pending
messageForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = messageInput.value.trim();

    const submitButton = messageForm.querySelector(
        'button[type="submit"], button:not([type])'
    );

    if (!message) {
        messageStatus.textContent = "اكتب رسالتك أولًا 💗";
        return;
    }

    submitButton.disabled = true;
    messageStatus.textContent = "جارٍ إرسال رسالتك...";

    try {
        const { error } = await supabaseClient
            .from("hope_messages")
            .insert({
                message: message,
                status: "pending"
            });

        if (error) throw error;

        messageForm.reset();

        messageStatus.textContent =
            "وصلتنا رسالتك بنجاح! ستظهر بعد مراجعتها والموافقة عليها 💗";

    } catch (error) {
        console.error("Message submission error:", error);

        messageStatus.textContent =
            "لم نتمكن من إرسال الرسالة. تحقق من الاتصال وحاول مرة أخرى.";

    } finally {
        submitButton.disabled = false;
    }
});

// عرض الرسائل التي تمت الموافقة عليها فقط
async function loadApprovedMessages() {
    messagesList.textContent = "جارٍ تحميل رسائل الأمل...";

    try {
        const { data, error } = await supabaseClient
            .from("hope_messages")
            .select("id, message, created_at")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) throw error;

        messagesList.replaceChildren();

        if (!data || data.length === 0) {
            messagesList.textContent =
                "لا توجد رسائل معتمدة حتى الآن. كن أول من يشارك كلمة أمل 💗";
            return;
        }

        data.forEach(function (item) {
            const card = document.createElement("article");
            const text = document.createElement("p");

            // عرض النص بأمان دون تفسيره على أنه HTML
            text.textContent = item.message;

            card.appendChild(text);
            messagesList.appendChild(card);
        });

    } catch (error) {
        console.error("Loading messages error:", error);

        messagesList.textContent =
            "تعذر تحميل الرسائل حاليًا. حاول مرة أخرى لاحقًا.";
    }
}

// حساب عدد الرسائل المعتمدة فقط
async function updateApprovedMessageCount() {
    if (!messagesCount) return;

    try {
        const { count, error } = await supabaseClient
            .from("hope_messages")
            .select("id", {
                count: "exact",
                head: true
            })
            .eq("status", "approved");

        if (error) throw error;

        messagesCount.textContent = count ?? 0;

    } catch (error) {
        console.error("Loading message count error:", error);
    }
}

// تحميل الرسائل والعدادات عند فتح الموقع
loadApprovedMessages();
updateApprovedMessageCount();
updateQuizCount();