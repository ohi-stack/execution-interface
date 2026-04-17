import { renderLayout } from './layout.js';

export const renderIndexView = ({ pageTitle }) => renderLayout({
  pageTitle,
  body: `<main class="content-wrap">
  <section class="card hero-card">
    <p class="section-label">Canonical Display</p>
    <h2>Live Onegodian Time Snapshot</h2>
    <p class="supporting-copy">This interface renders canonical values from onegodian-api and does not perform authority calculations in the browser.</p>

    <div class="metadata-grid ot-snapshot" data-ot-snapshot>
      <div>
        <dt>The [Ordinal] Day™ — [Name]</dt>
        <dd data-field="ordinal_day">Loading…</dd>
      </div>
      <div>
        <dt>OT Date</dt>
        <dd data-field="ot_date">Loading…</dd>
      </div>
      <div>
        <dt>Gregorian Sync</dt>
        <dd data-field="gregorian_sync">Loading…</dd>
      </div>
      <div>
        <dt>Time / UTC</dt>
        <dd data-field="time_utc">Loading…</dd>
      </div>
    </div>

    <div class="alert-banner" hidden data-ot-error>
      Live canonical data is temporarily unavailable. Displaying fallback guidance.
    </div>
  </section>

  <section class="card info-card">
    <h3>What is Onegodian Time?</h3>
    <p>Onegodian Time is a structured calendar and time system with its own day naming, date expression, and synchronized Gregorian correspondence for interoperability.</p>
  </section>

  <section class="card info-card">
    <h3>Day Order™</h3>
    <p>Week display begins on Skénra (Sunday), followed by the canonical sequence used by the Onegodian standard.</p>
    <ol class="day-order-list">
      <li><strong>Skénra</strong> (Sunday)</li>
      <li>Monday</li>
      <li>Tuesday</li>
      <li>Wednesday</li>
      <li>Thursday</li>
      <li>Friday</li>
      <li>Saturday</li>
    </ol>
  </section>

  <section class="card info-card">
    <h3>Dual Dating</h3>
    <p>Dual dating presents Onegodian date data beside Gregorian date/time to support global readability while preserving Onegodian-native expression.</p>
  </section>

  <section class="card info-card">
    <h3>How conversion works</h3>
    <p>Conversion requests are sent to onegodian-api. The website only displays returned canonical conversion results and does not implement conversion logic in UI components.</p>

    <form class="convert-form" data-convert-form>
      <label for="iso_utc" class="form-label">Gregorian ISO UTC</label>
      <div class="form-row">
        <input id="iso_utc" name="iso_utc" type="text" placeholder="2026-04-09T12:00:00Z" autocomplete="off" />
        <button type="submit">Convert</button>
      </div>
    </form>

    <pre class="raw-json" data-conversion-output>Submit a Gregorian ISO timestamp to view canonical conversion output.</pre>
  </section>
</main>`,
});
