<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep prototype content and records in the typed `src/data` mock layer so future API replacement remains isolated.
- Use separate public and role-workspace layouts because their navigation and information density differ.
- Keep all prototype interactions local to React state; this phase intentionally has no persistence or server integration.
