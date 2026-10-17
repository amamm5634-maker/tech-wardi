/**
 * quiz.js — تحدي الوعي (نسخة مستقلة).
 * لا يحتاج أي ملف آخر. يعمل بلا Supabase (اختياري).
 */

(function () {
    "use strict";

    // ============================================================
    // الإعدادات
    // ============================================================
    const CONFIG = {
  size: 10,
  durationMs: 30_000,
  supabaseUrl: "https://cpasmtfafirifugkijvw.supabase.co",
  supabaseKey: "sb_publishable_iDtwCMg0rA2oNLMdmgQkIg_LamoTVXQ",
};

    const STATS_KEY = "techwardi:quiz-stats";

    // ============================================================
    // بنك الأسئلة
    // ============================================================
    const QUESTIONS = [
        { q: "ما سرطان الثدي؟", o: ["مرض يصيب العظام فقط","نمو غير طبيعي لخلايا في أنسجة الثدي","عدوى تنتقل بالمصافحة"], a: 1, x: "ينشأ من خلايا الثدي نفسها، ولا علاقة له بالعظام أو بالعدوى." },
        { q: "هل يمكن أن يصاب الرجال بسرطان الثدي؟", o: ["نعم، لكنه أقل شيوعًا لديهم","لا، يصيب النساء فقط","نعم، لكن بعد سن الستين فقط"], a: 0, x: "الرجال لديهم أنسجة ثدي، لذا يمكن أن يصابوا، لكن بنسبة أقل بكثير." },
        { q: "هل كل كتلة في الثدي تعني وجود سرطان؟", o: ["نعم، كل الكتل سرطانية","لا، معظم الكتل ليست سرطانًا، لكن يجب تقييمها طبيًا","نعم، إذا كانت صغيرة"], a: 1, x: "معظم الكتل حميدة، لكن لا يمكن التأكد إلا بالتقييم الطبي." },
        { q: "هل سرطان الثدي معدٍ؟", o: ["نعم، بالمصافحة","نعم، بمشاركة الطعام","لا، لا ينتقل بالمخالطة اليومية"], a: 2, x: "لا ينتقل عبر المخالطة أو الهواء أو الطعام؛ ليس مرضًا معديًا." },
        { q: "هل يمكن أن يحدث سرطان الثدي دون وجود تاريخ عائلي للمرض؟", o: ["نعم، كثير من المصابين ليس لديهم تاريخ عائلي معروف","لا، يجب أن يكون أحد الوالدين مصابًا","لا، إلا إذا انتقل من شخص آخر"], a: 0, x: "كثير من الحالات تحدث دون أي تاريخ عائلي معروف." },
        { q: "هل وجود تاريخ عائلي لسرطان الثدي قد يزيد خطر الإصابة؟", o: ["لا، ليس له أي علاقة","نعم، وقد يستدعي تقييمًا فرديًا للمخاطر","نعم، ويعني أن الإصابة مؤكدة"], a: 1, x: "يزيد الخطر قليلًا فقط، ولا يعني أن الإصابة مؤكدة." },
        { q: "هل كل حالات سرطان الثدي لها النوع نفسه والعلاج نفسه؟", o: ["نعم، العلاج واحد للجميع","نعم، ويعتمد فقط على العمر","لا، تختلف الأنواع والعلاجات حسب الحالة"], a: 2, x: "هناك أنواع متعددة، ولكل نوع علاج مختلف حسب خصائصه." },
        { q: "هل يمكن أن يصاب الشباب بسرطان الثدي؟", o: ["نعم، رغم أن الخطر يزداد عمومًا مع التقدم في العمر","لا، لا يحدث قبل سن الأربعين","لا، إلا عند وجود ألم"], a: 0, x: "نادر لكنه ممكن، والخطر يزداد مع التقدم في العمر." },
        { q: "هل كل أورام الثدي الخبيثة تسبب ألمًا؟", o: ["نعم، الألم شرط لوجود السرطان","لا، قد توجد كتلة سرطانية دون ألم","نعم، لكن الألم لا يظهر إلا ليلًا"], a: 1, x: "كثير من الأورام لا تسبب ألمًا في البداية — لهذا الفحص مهم." },
        { q: "ما المقصود بالكشف المبكر عن سرطان الثدي؟", o: ["انتظار ظهور أعراض شديدة","تشخيص المرض من صورة على الإنترنت","اكتشاف المرض مبكرًا وتقييم العلامات غير الطبيعية دون تأخير"], a: 2, x: "يهدف لاكتشاف المرض قبل ظهور الأعراض لتسهيل العلاج." },

        { q: "لاحظ شخص كتلة جديدة في الثدي لا تؤلمه. ما التصرف الأنسب؟", o: ["طلب تقييم طبي دون تأخير","انتظار ظهور الألم أولًا","تدليك الكتلة حتى تختفي"], a: 0, x: "الألم ليس شرطًا؛ أي كتلة جديدة تحتاج تقييمًا." },
        { q: "أي تغير قد يستدعي تقييمًا طبيًا؟", o: ["تغير لون الملابس","تغير جديد في شكل الثدي أو حجمه","الشعور بالجوع"], a: 1, x: "أي تغيّر جديد في الشكل أو الحجم يستحق الانتباه." },
        { q: "هل خروج إفراز دموي من الحلمة يستحق التقييم؟", o: ["لا، يحدث دائمًا بصورة طبيعية","فقط إذا صاحبه ارتفاع في الحرارة","نعم، ينبغي تقييمه طبيًا"], a: 2, x: "الإفراز الدموي من الحلمة يحتاج دائمًا تقييمًا طبيًا." },
        { q: "أي تغير في الجلد قد يستدعي الانتباه؟", o: ["تنقر أو تجعد جديد في جلد الثدي","جفاف اليدين","تغير لون الشعر"], a: 0, x: "التنقّر أو التجعد من العلامات التي قد تشير لمشكلة." },
        { q: "هل تغير الحلمة إلى الداخل حديثًا يستحق التقييم؟", o: ["لا، في جميع الحالات","نعم، خصوصًا إذا كان تغيرًا جديدًا","فقط إذا كان في الثديين معًا"], a: 1, x: "انسحاب الحلمة حديثًا تغيّر يستحق التقييم." },
        { q: "إذا لم توجد أعراض، فهل يمكن أن يستفيد الشخص من الفحص المناسب لعمره ومستوى خطورته؟", o: ["لا، الفحص مفيد فقط عند وجود ألم","لا، الأعراض وحدها تكفي دائمًا","نعم، قد يُكتشف المرض قبل ظهور الأعراض"], a: 2, x: "الفحص الدوري قد يكتشف المرض قبل الأعراض." },
        { q: "ما الفرق بين الفحص التشخيصي وفحص الكشف لدى من لا تظهر عليه أعراض؟", o: ["الفحص التشخيصي يقيّم علامة أو مشكلة، أما فحص الكشف فيبحث عن المرض قبل ظهور الأعراض","لا يوجد أي فرق","فحص الكشف يؤكد التشخيص دائمًا"], a: 0, x: "التشخيصي يقيّم مشكلة قائمة، والكشف يبحث بدون أعراض." },
        { q: "هل الفحص الذاتي للثدي يغني عن كل الفحوصات الطبية الموصى بها؟", o: ["نعم، يغني عنها تمامًا","لا، لا يحل محل الفحوصات المناسبة أو التقييم الطبي","نعم، إذا أُجري يوميًا"], a: 1, x: "مكمّل وليس بديلًا عن الفحوصات الطبية." },
        { q: "إذا كانت كتلة الثدي تتحرك عند لمسها، فهل يمكن الجزم بأنها غير سرطانية؟", o: ["نعم، الحركة تنفي السرطان","نعم، إذا لم تؤلم","لا، لا يمكن تحديد طبيعتها باللمس وحده"], a: 2, x: "الحركة لا تنفي السرطان — يجب التقييم." },
        { q: "ما التصرف الأفضل عند ملاحظة تغير جديد ومقلق في الثدي؟", o: ["التواصل مع مختص صحي لتقييمه","الاعتماد على نصائح وسائل التواصل فقط","تجاهله حتى يصبح شديدًا"], a: 0, x: "التواصل مع مختص أفضل من الانتظار أو الاعتماد على الإنترنت." },

        { q: "هل التصوير الطبي وحده يؤكد كل حالات سرطان الثدي؟", o: ["نعم، في جميع الحالات","لا، قد يحتاج التشخيص إلى خزعة وفحوص أخرى","نعم، إذا كانت الصورة واضحة"], a: 1, x: "كثير من الحالات تحتاج خزعة للتأكيد." },
        { q: "ما الخزعة في سياق تشخيص سرطان الثدي؟", o: ["تمرين رياضي","نوع من المسكنات","أخذ عينة من النسيج لفحصها"], a: 2, x: "أخذ عينة نسيجية لفحصها تحت المجهر." },
        { q: "من يحدد العلاج الأنسب للمصاب بسرطان الثدي؟", o: ["الفريق الطبي بالتشاور مع المريض","أي شخص على الإنترنت","المريض الآخر الذي لديه تشخيص مشابه فقط"], a: 0, x: "قرار جماعي بين الفريق الطبي والمريض." },
        { q: "أي مما يلي قد يدخل ضمن علاج سرطان الثدي حسب الحالة؟", o: ["المضادات الحيوية وحدها لكل المرضى","الجراحة أو العلاج الإشعاعي أو علاجات دوائية","الأعشاب وحدها"], a: 1, x: "الجراحة والإشعاع والعلاجات الدوائية حسب الحالة." },
        { q: "هل يحتاج كل مريض إلى العلاج الكيميائي؟", o: ["نعم، بلا استثناء","لا أحد يحتاج إليه","لا، يعتمد العلاج على نوع المرض ومرحلته وعوامل أخرى"], a: 2, x: "ليس لكل مريض؛ يعتمد على نوع الورم وخصائصه." },
        { q: "إذا خاف المريض من الآثار الجانبية للعلاج، فما الأفضل؟", o: ["مناقشة المخاوف والخيارات مع الفريق الطبي","إيقاف العلاج من تلقاء نفسه","إخفاء الأعراض عن الطبيب"], a: 0, x: "الحوار مع الفريق الطبي أفضل من إيقاف العلاج." },
        { q: "هل ينبغي إبلاغ الطبيب بالأدوية والأعشاب والمكملات التي يستخدمها المريض؟", o: ["لا، المنتجات الطبيعية لا تؤثر أبدًا","نعم، فقد تؤثر بعض المنتجات في العلاج أو تتداخل معه","فقط إذا كانت غالية الثمن"], a: 1, x: "بعضها قد يتفاعل مع العلاج — أبلغ الطبيب دائمًا." },
        { q: "ماذا يفعل المريض إذا ظهرت آثار جانبية جديدة أثناء العلاج؟", o: ["يتحملها دائمًا دون إخبار أحد","يوقف جميع الأدوية فورًا","يتواصل مع الفريق الطبي لمعرفة كيفية التعامل معها"], a: 2, x: "التواصل مع الطبيب للتعامل معها بدلًا من التحمل أو الإيقاف." },
        { q: "هل يجوز تغيير جرعة علاج السرطان دون استشارة الطبيب؟", o: ["لا، يجب الرجوع إلى الفريق الطبي","نعم، إذا شعر المريض بتحسن","نعم، إذا نصحه صديق"], a: 0, x: "لا يجوز دون استشارة الطبيب." },
        { q: "إذا أراد المريض رأيًا طبيًا ثانيًا، فهل يمكنه طلبه؟", o: ["لا، هذا ممنوع دائمًا","نعم، ويمكنه مناقشة ذلك مع طبيبه","نعم، ويجب عليه إلغاء علاجه الحالي فورًا"], a: 1, x: "حق طبيعي للمريض، ويُناقش مع طبيبه." },

        { q: "ما أفضل طريقة لبدء مساندة شخص أخبرك بتشخيص إصابته؟", o: ["إخباره بأن مشاعره مبالغ فيها","تغيير الموضوع مباشرة","الاستماع إليه وسؤاله عن نوع الدعم الذي يحتاجه"], a: 2, x: "الاستماع أولًا، ثم سؤاله عما يحتاجه." },
        { q: "إذا لم يرغب المصاب في الحديث عن المرض الآن، فما التصرف الأفضل؟", o: ["احترام رغبته وإخباره أنك موجود عندما يحتاجك","إجباره على الحديث","الابتعاد عنه نهائيًا"], a: 0, x: "احترام رغبته يدعم استقلاليته." },
        { q: "كيف يمكن للأسرة مساعدة المريض عمليًا؟", o: ["اتخاذ كل القرارات بدلًا عنه","المساعدة في المواعيد أو المواصلات أو المهام التي يطلبها","منعه من طرح الأسئلة على الطبيب"], a: 1, x: "المساعدة العملية أنفع من اتخاذ القرارات بدلًا عنه." },
        { q: "أي عبارة أكثر دعمًا لشخص يمر بعلاج السرطان؟", o: ["لا يحق لك أن تحزن","لا تفكر في المرض أبدًا","أنا معك، ما الذي يمكنني فعله لمساعدتك؟"], a: 2, x: "الحضور الفعلي والتساؤل عن المساعدة أكثر دعمًا من النصائح الجاهزة." },
        { q: "هل من المناسب مقارنة تجربة مريض بتجربة مريض آخر؟", o: ["لا، فالتجارب والاحتياجات قد تختلف من شخص لآخر","نعم، لأن العلاج والنتائج متطابقة دائمًا","نعم، ويجب أن يتبع كل مريض التجربة نفسها"], a: 0, x: "كل تجربة فريدة، والمقارنة قد تزيد الألم." },
        { q: "إذا شعر أحد أفراد الأسرة بالإرهاق من تقديم الرعاية، فما الأفضل؟", o: ["إخفاء الإرهاق وعدم طلب المساعدة","طلب الدعم وتقاسم المسؤوليات والاهتمام بصحته","إلقاء اللوم على المريض"], a: 1, x: "طلب الدعم لا يعني التقصير — بل يحفظ استمراريته." },
        { q: "هل يمكن أن يشعر المصاب بالخوف أو الحزن أو القلق بعد التشخيص؟", o: ["لا، هذه المشاعر غير طبيعية دائمًا","نعم، لكن يجب ألا يتحدث عنها","نعم، وقد يفيده الدعم النفسي عند الحاجة"], a: 2, x: "المشاعر طبيعية، والدعم النفسي جزء من الرعاية." },
        { q: "ما التصرف الأنسب إذا طلب المريض مرافقة شخص يثق به إلى موعد طبي؟", o: ["مرافقته إذا أمكن، ومساعدته في تدوين أسئلته","منعه من طرح الأسئلة","التحدث نيابة عنه دون السماح له بالمشاركة"], a: 0, x: "المرافقة مع تمكين المريض من المشاركة أفضل." },
        { q: "هل ينبغي نشر صورة مريض أو تفاصيل تشخيصه دون إذنه؟", o: ["نعم، إذا كان الهدف التوعية","لا، يجب احترام الخصوصية والحصول على موافقة واضحة","نعم، إذا لم يُذكر اسمه فقط، في كل الحالات"], a: 1, x: "نشر صورة أو تفاصيل دون إذن واضح انتهاك للخصوصية." },
        { q: "كيف تدعم صديقًا مصابًا دون أن تشعره بأنه فقد استقلاليته؟", o: ["تقرر كل شيء عنه","تعامله دائمًا كأنه عاجز","تسأله عن احتياجاته وتحترم اختياراته"], a: 2, x: "السؤال عن الاحتياجات يحترم الاستقلالية." },

        { q: "هل يمكن للأعشاب أو المكملات أن تحل محل علاج السرطان الموصوف؟", o: ["لا، لا ينبغي استبدال العلاج بها","نعم، إذا كانت طبيعية","نعم، إذا نصح بها شخص مشهور"], a: 0, x: "لا تستبدل العلاج الموصوف؛ ناقش أي منتج مع الفريق الطبي." },
        { q: "هل كل معلومة عن سرطان الثدي منشورة على وسائل التواصل موثوقة؟", o: ["نعم، كل ما ينتشر صحيح","لا، ينبغي التحقق من المصادر الصحية الموثوقة","نعم، إذا كان المنشور مشهورًا"], a: 1, x: "تحقّق من المصادر الموثوقة قبل المشاركة." },
        { q: "إذا نصح أحدهم مريضًا بترك العلاج والاعتماد على وصفة شعبية، فما الأفضل؟", o: ["ترك العلاج فورًا","تجربة الوصفة بدلًا من استشارة الطبيب","عدم ترك العلاج الموصوف ومناقشة أي منتج مع الفريق الطبي"], a: 2, x: "التخلي عن العلاج الموصوف خطر — ناقش أي منتج مع الطبيب." },
        { q: "هل تعني الإصابة بسرطان الثدي أن الشخص ارتكب خطأً أو يستحق المرض؟", o: ["لا، المرض ليس عقابًا ولا دليلًا على خطأ أخلاقي","نعم، المرض نتيجة ضعف الشخصية","نعم، المرض دائمًا نتيجة سلوك واحد"], a: 0, x: "المرض لا يميّز، وليس عقابًا." },
        { q: "هل يمكن أن يحتاج الشخص إلى متابعة طبية بعد انتهاء العلاج؟", o: ["لا، لا حاجة لأي متابعة","نعم، وفق خطة المتابعة التي يحددها الفريق الطبي","فقط إذا عاد الألم"], a: 1, x: "المتابعة الدورية تكشف أي تغييرات مبكرًا." },
        { q: "إذا أراد المريض ممارسة الرياضة أثناء العلاج، فما الأفضل؟", o: ["ممارسة أقصى جهد مهما كانت حالته","تجنب أي حركة إلى الأبد","مناقشة النشاط المناسب مع الفريق الطبي بحسب حالته"], a: 2, x: "النشاط المناسب يُحدَّد مع الفريق الطبي حسب الحالة." },
        { q: "هل توجد طريقة واحدة مضمونة لمنع سرطان الثدي تمامًا؟", o: ["لا، لا توجد وسيلة تضمن منع جميع الحالات","نعم، شرب نوع واحد من الأعشاب","نعم، إجراء فحص ذاتي مرة واحدة"], a: 0, x: "لا توجد وسيلة تمنع جميع الحالات، لكن الفحص والوعي يخفضان المخاطر." },
        { q: "ما فائدة تدوين الأسئلة قبل موعد الطبيب؟", o: ["يستبدل الفحص الطبي","يساعد المريض على تذكر مخاوفه وفهم خياراته","يضمن نتيجة علاجية محددة"], a: 1, x: "يساعد على التركيز أثناء الموعد وعدم نسيان المخاوف." },
        { q: "ما التصرف الأنسب إذا شعر المريض بوحدة شديدة أو بضيق نفسي مستمر؟", o: ["اعتبار طلب المساعدة ضعفًا","تجاهل مشاعره دائمًا","التحدث مع شخص موثوق أو مختص صحي وطلب الدعم"], a: 2, x: "طلب المساعدة قوة لا ضعف، والدعم النفسي متاح." },
        { q: "ما الرسالة الأهم التي ينبغي أن يخرج بها الزائر من اختبار التوعية؟", o: ["المعرفة الموثوقة وطلب الرعاية المناسبة ودعم المصابين أمور مهمة","الاختبار الإلكتروني يغني عن الطبيب","كل كتلة تعني سرطانًا مؤكدًا"], a: 0, x: "المعرفة + طلب الرعاية + الدعم = رسالة الفعالية." },
    ];

    // ============================================================
    // أدوات
    // ============================================================
    const $ = (sel, root = document) => root.querySelector(sel);

    function el(tag, attrs = {}, children = []) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (v === null || v === undefined || v === false) continue;
            if (k === "class") node.className = v;
            else if (k === "text") node.textContent = String(v);
            else if (k === "dataset" && typeof v === "object") Object.assign(node.dataset, v);
            else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
            else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
            else node.setAttribute(k, v);
        }
        const list = Array.isArray(children) ? children : [children];
        for (const c of list) {
            if (c === null || c === undefined || c === false) continue;
            node.append(c);
        }
        return node;
    }

    const clear = (node) => node.replaceChildren();

    function shuffle(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    const sample = (arr, n) => shuffle(arr).slice(0, n);

    // ============================================================
    // Supabase (اختياري)
    // ============================================================
    let supabase = null;
    if (CONFIG.supabaseUrl && CONFIG.supabaseKey) {
        if (window.supabase && typeof window.supabase.createClient === "function") {
            supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        } else {
            console.warn("[quiz] Supabase library غير محمّلة — الحفظ سيتخطى");
        }
    }

    // ============================================================
    // الإحصائيات المحلية
    // ============================================================
    function readStats() {
        try {
            const raw = localStorage.getItem(STATS_KEY);
            if (!raw) return { best: 0, last: 0, plays: 0 };
            const p = JSON.parse(raw);
            return {
                best:  Number(p.best)  || 0,
                last:  Number(p.last)  || 0,
                plays: Number(p.plays) || 0,
            };
        } catch {
            return { best: 0, last: 0, plays: 0 };
        }
    }

    function writeStats(data) {
        try { localStorage.setItem(STATS_KEY, JSON.stringify(data)); } catch { /* */ }
    }

    function formatStatsLine(stats) {
        if (stats.plays === 0) return "";
        const parts = [`⭐ أعلى نتيجة: ${stats.best}/10`];
        if (stats.plays > 1) parts.push(`آخر نتيجة: ${stats.last}/10`);
        return parts.join(" · ");
    }

    // ============================================================
    // حالة اللعبة
    // ============================================================
    const ui = {};
    const state = {
        round: [],
        index: 0,
        score: 0,
        streak: 0,
        answered: false,
        finished: false,
        timerId: null,
        timeLeft: 0,
        paused: false,
        lastTick: 0,
    };

    // ============================================================
    // الأيقونات
    // ============================================================
    const HINT_ICON_SVG = `
    <svg class="hint-icon" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.7"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path class="hint-bulb" d="M9 17h6M10 20h4M12 4a5.5 5.5 0 0 0-3.7 9.5c.7.6.9 1.4.9 2.3h5.6c0-.9.2-1.7.9-2.3A5.5 5.5 0 0 0 12 4Z"/>
        <line class="hint-ray hint-ray-1" x1="12"   y1="1.6" x2="12"   y2="0.4"/>
        <line class="hint-ray hint-ray-2" x1="5.4"  y1="4.6" x2="4.6"  y2="3.8"/>
        <line class="hint-ray hint-ray-3" x1="18.6" y1="4.6" x2="19.4" y2="3.8"/>
        <line class="hint-ray hint-ray-4" x1="3.6"  y1="10"  x2="2.4"  y2="10"/>
        <line class="hint-ray hint-ray-5" x1="20.4" y1="10"  x2="21.6" y2="10"/>
    </svg>`;

    const ICON_CHECK = `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

    const ICON_FLAME = `<svg class="stat-icon stat-flame" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="url(#flameGradient)" stroke="#a92f61" stroke-width="0.8" stroke-linejoin="round"/></svg>`;

    const ICON_TROPHY = `<svg class="trophy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

    // ============================================================
    // Easter egg
    // ============================================================
    const EASTER_CLICKS = 7;
    const EASTER_WINDOW_MS = 3000;

    function wireEasterEgg(button) {
        let clicks = 0;
        let firstClickAt = 0;

        button.addEventListener("click", () => {
            const now = Date.now();
            if (now - firstClickAt > EASTER_WINDOW_MS) {
                clicks = 0;
                firstClickAt = now;
            }
            clicks++;
            if (clicks >= EASTER_CLICKS) {
                clicks = 0;
                showEasterEgg();
            }
        });
    }

    function showEasterEgg() {
        const overlay = document.createElement("div");
        overlay.className = "easter-egg-overlay";

        const card = document.createElement("div");
        card.className = "easter-egg-card";
        card.innerHTML = `
            <div class="easter-egg-icon">🎮</div>
            <p class="easter-egg-name">مصطفى عادل محمود</p>
            <p class="easter-egg-role">كلية علوم الحاسوب – جامعة بحري</p>
            <p class="easter-egg-bio">
                طالب، وشغوف بالألعاب وتطويرها. أؤمن أن أصغر المشاريع قد تحمل
                أثراً كبيراً، وأن التقنية ليست مجرد أكواد، بل وسيلة لصناعة
                شيء يستحق أن يُذكر.
            </p>
            <p class="easter-egg-signature">Keep creating. Make it matter. 🎮</p>
        `;

        overlay.append(card);
        document.body.append(overlay);

        const remove = () => overlay.remove();
        overlay.addEventListener("click", remove);
        setTimeout(remove, 6000);
    }

    // ============================================================
    // التهيئة
    // ============================================================
    function init() {
        ui.container = $("#quiz-container");
        ui.startButton = $("#start-quiz");
        ui.result = $("#quiz-result");
        ui.modal = $("#quiz-modal");
        ui.closeBtn = $("#quiz-close");

        if (!ui.container || !ui.startButton || !ui.result || !ui.modal || !ui.closeBtn) {
            console.warn("[quiz] عناصر DOM ناقصة");
            return;
        }

        ui.startButton.addEventListener("click", openAndStart);
        ui.closeBtn.addEventListener("click", closeModal);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !ui.modal.classList.contains("is-hidden")) {
                closeModal();
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (state.timerId === null) return;
            if (document.hidden) pauseTimer();
            else resumeTimer();
        });

        const stats = readStats();
        if (stats.plays > 0) {
            ui.result.textContent = formatStatsLine(stats);
        }
    }

    function openModal() {
        ui.modal.classList.remove("is-hidden");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        stopTimer();
        ui.modal.classList.add("is-hidden");
        document.body.style.overflow = "";
        resetState();
    }

    function openAndStart() {
        openModal();
        start();
    }

    function start() {
        resetState();
        state.round = buildRound();

        if (state.round.length === 0) {
            console.error("[quiz] لا أسئلة في الجولة");
            ui.result.textContent = "لا توجد أسئلة متاحة.";
            return;
        }

        ui.result.textContent = "";
        showQuestion();
    }

    function resetState() {
        stopTimer();
        state.round = [];
        state.index = 0;
        state.score = 0;
        state.streak = 0;
        state.answered = false;
        state.finished = false;
        state.paused = false;
    }

    function buildRound() {
        return sample(QUESTIONS, CONFIG.size).map((q) => {
            const wrapped = q.o.map((text, i) => ({ text, correct: i === q.a }));
            const sh = shuffle(wrapped);
            return {
                question: q.q,
                options: sh.map((o) => o.text),
                answer: sh.findIndex((o) => o.correct),
                explanation: q.x || "",
            };
        });
    }

    function buildStatsNode() {
        const wrap = document.createElement("span");
        wrap.className = "quiz-stats";
        wrap.id = "quiz-stats";

        const check = document.createElement("span");
        check.className = "stat-item is-check";
        check.innerHTML = ICON_CHECK;
        check.append(document.createTextNode(String(state.score)));
        wrap.append(check);

        if (state.streak >= 2) {
            const flame = document.createElement("span");
            flame.className = "stat-item is-flame";
            flame.innerHTML = ICON_FLAME;
            flame.append(document.createTextNode(String(state.streak)));
            wrap.append(flame);
        }

        return wrap;
    }

    function refreshStats() {
        const old = $("#quiz-stats", ui.container);
        if (old) old.replaceWith(buildStatsNode());
    }

    function setNextEnabled(enabled) {
        const btn = $("#next-question", ui.container);
        if (!btn) return;
        btn.classList.toggle("is-disabled", !enabled);
        btn.setAttribute("aria-disabled", String(!enabled));
    }

    function showQuestion() {
        state.answered = false;

        const current = state.round[state.index];
        const isLast = state.index === state.round.length - 1;
        const progressPercent = ((state.index + 1) / state.round.length) * 100;

        const optionButtons = current.options.map((text, i) =>
            el("button", {
                type: "button",
                class: "quiz-option",
                dataset: { index: String(i) },
                text,
            })
        );

        const restartBtn = el("button", {
            type: "button",
            id: "restart-quiz",
            text: "إعادة الاختبار",
        });

        const nextButton = el("button", {
            type: "button",
            id: "next-question",
            class: "is-disabled",
            "aria-disabled": "true",
            text: isLast ? "عرض النتيجة" : "السؤال التالي",
        });

        clear(ui.container);
        ui.container.append(
            el("div", { class: "quiz-progress" }, [
                el("div", { class: "quiz-progress-bar", style: { width: `${progressPercent}%` } }),
            ]),
            el("div", { class: "quiz-timer" }, [
                el("div", { class: "quiz-timer-bar", id: "quiz-timer-bar" }),
            ]),
            el("div", { class: "quiz-header" }, [
                el("span", { class: "quiz-counter", text: `السؤال ${state.index + 1} من ${state.round.length}` }),
                buildStatsNode(),
            ]),
            el("p", { class: "quiz-question", text: current.question }),
            el("div", { id: "quiz-options" }, optionButtons),
            el("div", { class: "quiz-feedback-zone" }, [
                el("p", { id: "answer-feedback", "aria-live": "polite" }),
                el("div", { id: "answer-explanation", hidden: true, class: "hint-card" }),
            ]),
            el("div", { class: "quiz-actions" }, [restartBtn, nextButton])
        );

        optionButtons.forEach((btn, i) => {
            btn.addEventListener("click", () => checkAnswer(i, optionButtons));
        });

        restartBtn.addEventListener("click", start);
        nextButton.addEventListener("click", next);
        wireEasterEgg(nextButton);

        startTimer();
    }

    function showExplanation(text) {
        const block = $("#answer-explanation", ui.container);
        if (!block) return;

        block.replaceChildren();

        const iconWrap = document.createElement("span");
        iconWrap.className = "hint-icon-wrap";
        iconWrap.innerHTML = HINT_ICON_SVG;

        const textEl = document.createElement("span");
        textEl.className = "hint-text";
        textEl.textContent = text;

        block.append(iconWrap, textEl);
        block.hidden = false;
    }

    function startTimer() {
        stopTimer();
        state.timeLeft = CONFIG.durationMs;
        state.paused = false;
        state.lastTick = Date.now();

        updateTimerBar();

        state.timerId = setInterval(() => {
            if (state.paused) return;

            const now = Date.now();
            const delta = now - state.lastTick;
            state.lastTick = now;
            state.timeLeft -= delta;

            if (state.timeLeft <= 0) {
                state.timeLeft = 0;
                updateTimerBar();
                handleTimeout();
                return;
            }
            updateTimerBar();
        }, 100);
    }

    function stopTimer() {
        if (state.timerId !== null) {
            clearInterval(state.timerId);
            state.timerId = null;
        }
    }

    function pauseTimer() { state.paused = true; }

    function resumeTimer() {
        if (state.timerId === null) return;
        state.paused = false;
        state.lastTick = Date.now();
    }

    function updateTimerBar() {
        const bar = $("#quiz-timer-bar", ui.container);
        if (!bar) return;

        const pct = state.timeLeft / CONFIG.durationMs;
        bar.style.width = `${pct * 100}%`;

        const hue   = 342 - 202 * pct;
        const sat   = 72  - 17  * pct;
        const light = 40  + 32  * pct;
        bar.style.backgroundColor = `hsl(${hue}, ${sat}%, ${light}%)`;

        bar.classList.toggle("is-urgent", pct <= 0.15);
    }

    function handleTimeout() {
        if (state.answered || state.finished) return;
        state.answered = true;

        const current = state.round[state.index];
        const optionButtons = ui.container.querySelectorAll(".quiz-option");

        state.streak = 0;

        optionButtons.forEach((btn, i) => {
            btn.classList.add("is-disabled-option");
            if (i === current.answer) btn.classList.add("is-correct");
        });

        const feedback = $("#answer-feedback", ui.container);
        feedback.textContent = "انتهى الوقت ⏱️";
        feedback.dataset.level = "error";

        if (current.explanation) showExplanation(current.explanation);

        refreshStats();
        setNextEnabled(true);
    }

    function checkAnswer(selectedIndex, optionButtons) {
        if (state.answered || state.finished) return;

        stopTimer();
        state.answered = true;

        const current = state.round[state.index];
        const feedback = $("#answer-feedback", ui.container);

        optionButtons.forEach((btn, i) => {
            btn.classList.add("is-disabled-option");
            if (i === current.answer) btn.classList.add("is-correct");
            else if (i === selectedIndex) btn.classList.add("is-wrong");
        });

        if (selectedIndex === current.answer) {
            state.score++;
            state.streak++;
            let msg = "إجابة صحيحة 💗";
            if (state.streak >= 2) msg += ` · سلسلة ${state.streak}`;
            feedback.textContent = msg;
            feedback.dataset.level = "ok";
        } else {
            state.streak = 0;
            feedback.textContent = "الإجابة الصحيحة: " + current.options[current.answer];
            feedback.dataset.level = "error";
        }

        if (current.explanation) showExplanation(current.explanation);

        refreshStats();
        setNextEnabled(true);
    }

    function next() {
        if (!state.answered || state.finished) return;
        state.index++;
        if (state.index < state.round.length) showQuestion();
        else finish();
    }

    function getEndMessage(score, total) {
        if (score === total) return { tier: "perfect", title: "درجة كاملة!", text: "معلوماتك ممتازة — أنت سفير الوعي الحقيقي 🎗️" };
        if (score >= 8)      return { tier: "great",   title: "أداء رائع!",  text: "معرفتك قوية. شاركها مع من حولك لتصل الفائدة." };
        if (score >= 4)      return { tier: "good",    title: "بداية جيدة!", text: "معرفتك أساس يمكن البناء عليه. جرّب مرة أخرى لتتعلم أكثر." };
        return                      { tier: "start",   title: "كل رحلة تبدأ بخطوة 💗", text: "لا بأس! المعلومات الجديدة فرصة للتعلم. أعد المحاولة 🌸" };
    }

    function launchConfetti() {
        const colors = ["#d94f83", "#a92f61", "#ffd93d", "#ff8c42", "#f8c6da", "#e8f5e9"];
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement("div");
            piece.className = "confetti-piece";
            piece.style.left = `${Math.random() * 100}vw`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = `${Math.random() * 1.2}s`;
            piece.style.animationDuration = `${2.4 + Math.random() * 2}s`;
            piece.style.setProperty("--spin", `${(Math.random() * 720 - 360)}deg`);
            piece.style.width = `${6 + Math.random() * 6}px`;
            piece.style.height = `${10 + Math.random() * 8}px`;
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 5000);
        }
    }

    async function finish() {
        if (state.finished) return;
        state.finished = true;

        stopTimer();

        const total = state.round.length;
        const message = getEndMessage(state.score, total);

        const restartBtn = el("button", {
            type: "button",
            id: "restart-finish",
            text: "إعادة الاختبار",
            onClick: start,
        });

        const trophyNode = document.createElement("span");
        trophyNode.className = "trophy-wrap";
        trophyNode.innerHTML = ICON_TROPHY;

        clear(ui.container);
        ui.container.append(
            el("div", { class: `quiz-finish is-${message.tier}` }, [
                trophyNode,
                el("h3", { class: "quiz-finish-title", text: message.title }),
                el("p", { class: "quiz-finish-message", text: message.text }),
                el("p", { class: "quiz-finish-score" }, [
                    "نتيجتك: ",
                    el("strong", { text: `${state.score}/${total}` }),
                ]),
                el("p", { id: "quiz-finish-status", class: "quiz-finish-status", text: "جارٍ تسجيل مشاركتك…" }),
                el("div", { class: "quiz-finish-actions" }, [restartBtn]),
            ])
        );

        if (message.tier === "perfect") launchConfetti();

        // حفظ الإحصائيات المحلية
        const stats = readStats();
        const isNewBest = state.score > stats.best;
        stats.last = state.score;
        if (isNewBest) stats.best = state.score;
        stats.plays += 1;
        writeStats(stats);

        // محاولة حفظ في Supabase (إن كان مضبوطًا)
        let saved = false;
        if (supabase) {
            try {
                const { error } = await supabase
                    .from("quiz_attempts")
                    .insert({ score: state.score });
                if (error) throw error;
                saved = true;
            } catch (error) {
                console.error("[quiz] فشل تسجيل المحاولة:", error);
            }
        }

        const status = $("#quiz-finish-status", ui.container);
        if (status) {
            if (saved) {
                status.textContent = isNewBest && stats.plays > 1
                    ? "🎉 نتيجة جديدة!"
                    : "تم تسجيل مشاركتك 💗";
            } else if (supabase) {
                status.textContent = "تعذر التسجيل. حاول لاحقًا.";
            } else {
                status.textContent = isNewBest && stats.plays > 1
                    ? "🎉 نتيجة جديدة!"
                    : "أحسنت 💗";
            }
        }

        ui.result.textContent = formatStatsLine(stats);
    }

    // ============================================================
    // الإطلاق
    // ============================================================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

/* ===== القائمة والفقاعة الوردية ===== */
(function initQuizNavigation() {
    const nav = document.querySelector(
        'body[data-page="quiz"] .nav-links'
    );
    const toggle = document.querySelector(
        'body[data-page="quiz"] .menu-toggle'
    );

    if (!nav || !toggle) return;

    const links = [...nav.querySelectorAll("a")];
    if (!links.length) return;

    let bubble = nav.querySelector(".nav-bubble");

    if (!bubble) {
        bubble = document.createElement("span");
        bubble.className = "nav-bubble";
        bubble.setAttribute("aria-hidden", "true");
        nav.prepend(bubble);
    }

    const activeLink = () =>
        nav.querySelector('a[aria-current="page"]') || links[0];

    function moveBubble(link) {
        if (!link || !nav.getClientRects().length) return;

        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        bubble.style.left = `${linkRect.left - navRect.left - nav.clientLeft + nav.scrollLeft}px`;
        bubble.style.top = `${linkRect.top - navRect.top - nav.clientTop + nav.scrollTop}px`;
        bubble.style.width = `${linkRect.width}px`;
        bubble.style.height = `${linkRect.height}px`;

        nav.classList.add("bubble-ready");
    }

    function closeMenu() {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "فتح القائمة");
    }

    toggle.addEventListener("click", () => {
        const opening = toggle.getAttribute("aria-expanded") !== "true";

        if (opening) {
            nav.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "إغلاق القائمة");

            requestAnimationFrame(() => moveBubble(activeLink()));
        } else {
            closeMenu();
        }
    });

    links.forEach(link => {
        link.addEventListener("pointerenter", () => moveBubble(link));
        link.addEventListener("focus", () => moveBubble(link));
        link.addEventListener("click", closeMenu);
    });

    nav.addEventListener("pointerleave", () => moveBubble(activeLink()));

    nav.addEventListener("focusout", event => {
        if (!nav.contains(event.relatedTarget)) {
            moveBubble(activeLink());
        }
    });

    document.addEventListener("click", event => {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) closeMenu();
        requestAnimationFrame(() => moveBubble(activeLink()));
    });

    window.addEventListener("load", () => moveBubble(activeLink()));

    requestAnimationFrame(() => moveBubble(activeLink()));
})();

