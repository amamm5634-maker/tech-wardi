/**
 * quiz.js — تحدي الوعي.
 * خلط الأسئلة والخيارات معًا لمنع تخمين النمط.
 */

import { $, el, clear } from "../core/dom.js";
import { sample, shuffle } from "../core/utils.js";
import { supabase } from "../core/supabase.js";
import { QUIZ } from "../config.js";
import { questions } from "../data/questions.js";
import { refreshQuizCount } from "./impact-counters.js";

const TAG = "[techwardi:quiz]";
const ui = {};

const state = {
    round: [],
    index: 0,
    score: 0,
    answered: false,
    finished: false,
};

export function initQuiz() {
    ui.container = $("#quiz-container");
    ui.startButton = $("#start-quiz");
    ui.result = $("#quiz-result");

    if (!ui.container || !ui.startButton || !ui.result) {
        console.warn(`${TAG} عناصر DOM ناقصة`);
        return;
    }

    ui.startButton.addEventListener("click", start);

    console.info(`${TAG} جاهزة`);
}

function start() {
    state.round = buildRound();
    state.index = 0;
    state.score = 0;
    state.answered = false;
    state.finished = false;

    if (state.round.length === 0) {
        console.error(`${TAG} لا أسئلة في الجولة`);
        ui.result.textContent = "لا توجد أسئلة متاحة.";
        return;
    }

    ui.startButton.textContent = "إعادة الاختبار";
    ui.result.textContent = "";

    showQuestion();
}

/**
 * يبني جولة: يختار N سؤالًا عشوائيًا ويخلط خيارات كل واحد.
 * الخلط يحفظ الإجابة الصحيحة بمقارنة الحالة، لا النص.
 */
function buildRound() {
    return sample(questions, QUIZ.size).map((q) => {
        const wrapped = q.options.map((text, i) => ({
            text,
            correct: i === q.answer,
        }));

        const shuffled = shuffle(wrapped);

        return {
            question: q.question,
            options: shuffled.map((o) => o.text),
            answer: shuffled.findIndex((o) => o.correct),
        };
    });
}

function showQuestion() {
    state.answered = false;

    const current = state.round[state.index];
    const isLast = state.index === state.round.length - 1;

    const optionButtons = current.options.map((text, i) =>
        el("button", {
            type: "button",
            class: "quiz-option",
            dataset: { index: String(i) },
            text,
        })
    );

    const nextButton = el("button", {
        type: "button",
        id: "next-question",
        text: isLast ? "عرض النتيجة" : "السؤال التالي",
        disabled: true,
    });

    clear(ui.container);
    ui.container.append(
        el("h3", { text: `السؤال ${state.index + 1} من ${state.round.length}` }),
        el("p", { text: current.question }),
        el("div", { id: "quiz-options" }, optionButtons),
        el("p", { id: "answer-feedback", "aria-live": "polite" }),
        nextButton
    );

    optionButtons.forEach((btn, i) => {
        btn.addEventListener("click", () => checkAnswer(i, optionButtons, nextButton));
    });

    nextButton.addEventListener("click", next);
}

function checkAnswer(selectedIndex, optionButtons, nextButton) {
    if (state.answered || state.finished) return;
    state.answered = true;

    const current = state.round[state.index];
    const feedback = $("#answer-feedback", ui.container);

    optionButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === current.answer) btn.classList.add("is-correct");
        else if (i === selectedIndex) btn.classList.add("is-wrong");
    });

    if (selectedIndex === current.answer) {
        state.score++;
        feedback.textContent = "إجابة صحيحة 💗";
        feedback.dataset.level = "ok";
    } else {
        feedback.textContent = "الإجابة الصحيحة: " + current.options[current.answer];
        feedback.dataset.level = "error";
    }

    nextButton.disabled = false;
}

function next() {
    if (!state.answered || state.finished) return;

    state.index++;
    if (state.index < state.round.length) showQuestion();
    else finish();
}

async function finish() {
    if (state.finished) return;
    state.finished = true;

    const total = state.round.length;

    clear(ui.container);
    ui.container.append(
        el("h3", { text: "انتهى الاختبار 💗" }),
        el("p", { text: `نتيجتك: ${state.score} من ${total}` })
    );

    ui.startButton.textContent = "جرّب مرة أخرى";
    ui.result.textContent = "جارٍ تسجيل مشاركتك…";

    try {
        const { error } = await supabase
            .from("quiz_attempts")
            .insert({ score: state.score });

        if (error) throw error;

        await refreshQuizCount();
        ui.result.textContent = `تم تسجيل مشاركتك 💗 (${state.score}/${total})`;
    } catch (error) {
        console.error(`${TAG} فشل تسجيل المحاولة:`, error);
        ui.result.textContent = `تعذر التسجيل. نتيجتك: ${state.score}/${total}`;
    }
}
