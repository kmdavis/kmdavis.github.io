# Resume page tooling

From the repository root, install the tooling and Chromium once:

```sh
npm --prefix scripts install
npx --prefix scripts playwright install chromium
```

After each `resume/<page>/index.md` contains exactly one standalone `<!-- pagebreak -->`, generate static HTML and verify all seven pages with:

```sh
npm --prefix scripts run generate
npm --prefix scripts run verify
```

The verifier serves the static site locally, checks each resume in Letter and A4, and writes both PNG previews per page under the repository-level `previews/` directory. It writes `resume.pdf` next to each page using that page's default paper size. The generated previews and PDFs are output artifacts, not site content sources.

On narrow screens, résumé content flows continuously without paper borders; printing retains the explicit two-page layout.
