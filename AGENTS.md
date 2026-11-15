# Homework design standard

User instruction, 14 November 2026: for any future homework creation or edit at any level, use **A2.1 – H1 3–4. Ders** as the design and interaction reference:
https://ispanyolcacim.github.io/a2.1-tareas-ida/3-4.html

This applies to homework (ödev); do not confuse homework with classroom activities (ders içi etkinlik).

- Preserve each level's palette: A1.1 yellow, A1.2 purple, A2.1 vivid rose pink, A2.2 peach/coral, B1.1 cornflower blue.
- Follow the reference's compact centered cards, Nunito typography, rounded buttons, spacing, name dropdowns and responsive layout.
- Show student and correct/incorrect counts above the questions. Place **✔ Ödevi Teslim Et** in a separate bar above the progress indicator and question card.
- Present one question at a time. Place **← Geri**, the question counter and **İleri →** below the question card. Keep answered questions and feedback when navigating.
- For multiple choice, selecting an answer immediately locks it, marks the correct option green and the selected wrong option red, and shows the correct answer and explanation. Written answers use **Kontrol et** before showing feedback; preserve their grading rules.
- Use a collapsed section/question list for direct navigation when needed; keep its status indicators and progress updated.
- The top submission button opens a separate name-confirmation screen. Actual submission happens only on its final **✔ Ödevi Teslim Et** button; then show results and submission status. Preserve the original assignment key, score scale, endpoint and student roster.
- Preserve question content, listening assets and existing student drafts unless a user explicitly requests changes. Keep full listening transcripts locked until the relevant recording's questions are checked, unless the user specifies otherwise.
- Verify the changed interactions and submission payload without sending test student submissions to production.
- Reference implementation of the adapted layout: https://ispanyolcacim.github.io/a1.1-tareas/a11-9-10-ida.html

## Media provider restriction

User instruction, 15 November 2026: never use Fal for future work. Do not invoke Fal tools, upload to Fal, start Fal generations, suggest Fal, or resume previously prepared Fal jobs. Continue with other available methods.

## Required homework panel in every classroom activity

User instruction, 15 November 2026: every new or updated classroom activity at every level must include its lesson homework. Always add the established homework panel with a visible entry near lesson navigation. Verify the level and lesson against the current student portal and actual homework files; include every existing part and any real writing, listening or video assignment. Include the next lesson's Quizlet preparation when listed in the portal. Never invent a missing task or copy another lesson's links. Before publication, verify the panel opens and closes and that its links point to the correct live assignments. Treat a missing homework panel as unfinished work.

## Classroom activity file names

User instruction, 15 November 2026: use `DD-DD-ders-ici-ispanyolcacim-LEVEL.html` for classroom activity entry files. Both lesson numbers use two digits: `01-02`, `03-04`, `07-08`, `09-10`, `11-12`, etc. Level suffixes are `a11`, `a12`, `a21`, `a22`, `b11` and must match the page's actual level. For example, A1.1 uses `09-10-ders-ici-ispanyolcacim-a11.html` and `11-12-ders-ici-ispanyolcacim-a11.html`.

- Keep each activity in its level's existing repository. The canonical HTML entry is at the repository root; preserve its relative asset URLs.
- Preserve previously published entry URLs as small redirects to the canonical file, carrying the query string and any legacy hash for initial section selection; the canonical activity then removes the hash from the address. Keep the full activity in the canonical file only.
- Retain existing localStorage keys, lesson content, embedded resources, homework links and student data when renaming. Update maintained indexes, documentation and edited backlinks to the canonical URL.
- A compatibility redirect is a routing file, not another activity page; do not duplicate the lesson UI in it.
- This naming rule applies to classroom activities, not homework filenames. Do not invent an activity for a lesson that has not been prepared.

## Clean classroom activity URLs

User instruction, 15 November 2026: share and display classroom URLs ending in `.html`, without section fragments such as `#dictation-1`, `#estructura`, `#futuro` or `#bolum-2`, at every level. Tabs, keyboard navigation and previous/next controls must update the activity directly without adding a fragment. Honor an incoming legacy fragment for the initial section, then remove it with `history.replaceState` while preserving the path, query string, existing history state, answers and storage keys. Never append a default section on load. Use clean canonical URLs in messages, indexes and maintained activity links.
