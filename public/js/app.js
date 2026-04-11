const read = (selector) => document.querySelector(selector);

const otSnapshot = read('[data-ot-snapshot]');
const otError = read('[data-ot-error]');
const convertForm = read('[data-convert-form]');
const conversionOutput = read('[data-conversion-output]');

const fallbackSnapshot = {
  ordinal_day: 'Unavailable',
  ot_date: 'Unavailable',
  gregorian_sync: 'Unavailable',
  time_utc: 'Unavailable',
};

const api = {
  async getCurrent() {
    const response = await fetch('/api/v1/ot/current', { headers: { accept: 'application/json' } });
    const payload = await response.json();

    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || 'Current time unavailable');
    }

    return payload.data;
  },
  async convert(query) {
    const url = new URL('/api/v1/ot/convert', window.location.origin);

    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    const response = await fetch(url, { headers: { accept: 'application/json' } });
    const payload = await response.json();

    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || 'Conversion unavailable');
    }

    return payload.data;
  },
};

const pick = (source, keys, fallback = '—') => {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
  }

  return fallback;
};

const normalizeCurrent = (data) => ({
  ordinal_day: pick(data, ['ordinal_day_label', 'ordinal_day', 'day_label', 'day']),
  ot_date: pick(data, ['ot_date', 'onegodian_date', 'date']),
  gregorian_sync: pick(data, ['gregorian_sync', 'gregorian_date', 'iso_utc']),
  time_utc: pick(data, ['time_utc', 'utc_time', 'utc']),
});

const renderSnapshot = (snapshot) => {
  if (!otSnapshot) {
    return;
  }

  ['ordinal_day', 'ot_date', 'gregorian_sync', 'time_utc'].forEach((key) => {
    const target = otSnapshot.querySelector(`[data-field="${key}"]`);

    if (target) {
      target.textContent = snapshot[key] || '—';
    }
  });
};

const showFallback = () => {
  renderSnapshot(fallbackSnapshot);

  if (otError) {
    otError.hidden = false;
  }
};

const initCurrentTime = async () => {
  if (!otSnapshot) {
    return;
  }

  try {
    const data = await api.getCurrent();
    renderSnapshot(normalizeCurrent(data));

    if (otError) {
      otError.hidden = true;
    }
  } catch (_error) {
    showFallback();
  }
};

if (convertForm && conversionOutput) {
  convertForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(convertForm);
    const isoUtc = String(formData.get('iso_utc') || '').trim();

    if (!isoUtc) {
      conversionOutput.textContent = 'Please provide a Gregorian ISO UTC timestamp.';
      return;
    }

    conversionOutput.textContent = 'Loading canonical conversion…';

    try {
      const payload = await api.convert({ iso_utc: isoUtc });
      conversionOutput.textContent = JSON.stringify(payload, null, 2);
    } catch (_error) {
      conversionOutput.textContent = 'Canonical conversion is currently unavailable. Please retry shortly.';
    }
  });
}

void initCurrentTime();
