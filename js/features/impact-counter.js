/**
 * impact-counters.js — عدّادات الأثر.
 * يُستورد منه refreshQuizCount / refreshMessagesCount لتحديث فوري.
 */

import { $, setText } from "../core/dom.js";
import { supabase } from "../core/supabase.js";

const TAG = "[techwardi:counters]";
const ui = {};

export function initCounters() {
    ui.quiz = $("#quiz-count");
    ui.messages = $("#messages-count");

    if (!ui.quiz && !ui.messages) {
        console.warn(`${TAG} لا عناصر عدّادات في الصفحة`);
        return;
    }

    refreshQuizCount();
    refreshMessagesCount();

    console.info(`${TAG} جاهزة`);
}

export async function refreshQuizCount() {
    if (!ui.quiz) return;

    try {
        const { count, error } = await supabase
            .from("quiz_attempts")
            .select("id", { count: "exact", head: true });

        if (error) throw error;

        setText(ui.quiz, count ?? 0);
    } catch (error) {
        console.warn(`${TAG} تعذر تحديث عدّاد الاختبار:`, error);
    }
}

export async function refreshMessagesCount() {
    if (!ui.messages) return;

    try {
        const { count, error } = await supabase
            .from("hope_messages")
            .select("id", { count: "exact", head: true })
            .eq("status", "approved");

        if (error) throw error;

        setText(ui.messages, count ?? 0);
    } catch (error) {
        console.warn(`${TAG} تعذر تحديث عدّاد الرسائل:`, error);
    }
}
