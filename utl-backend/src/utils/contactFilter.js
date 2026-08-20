/* eslint-disable no-undef */

/**
 * contactFilter.js
 *
 * Redacts attempts to share off-platform contact info in the ESCALATED
 * (human-to-human) tier of a chat thread. The AI tier never needs this —
 * there's no human on the other end to receive a phone number — but the
 * moment a thread escalates to a real vendor reply, this is the backstop.
 *
 * This is pattern-matching, not perfect. People WILL find creative ways
 * around it ("zero eight zero three...", images of phone numbers, etc).
 * Treat this as a first line of defense, not a guarantee — pair it with
 * the flagCount on Inquiry and manual review of repeat offenders, same
 * as your manual seller-approval process.
 */

// Nigerian + generic international phone patterns:
// 080xxxxxxxx, +234xxxxxxxxxx, 234xxxxxxxxxx, spaced/dashed variants
const PHONE_REGEX = /(\+?234|0)[\s-]?[789]\d[\s-]?\d{3}[\s-]?\d{4}/g;

// Generic 10-11 digit sequences (catches phone numbers not matching the
// Nigerian-specific pattern above, e.g. someone spacing/dashing differently)
const LOOSE_DIGIT_SEQUENCE_REGEX = /\b\d[\d\s-]{8,13}\d\b/g;

// Standard email pattern
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Phrases that signal an attempt to move off-platform, even without a
// number/email attached in the same message (e.g. "let's talk on WhatsApp"
// sent before the actual number)
const SUSPICIOUS_PHRASE_REGEX = /\b(whats\s?app|whatsapp|telegram|instagram|ig\s?:|@\w{3,}|call me|text me|add me|reach me|my number|contact me (directly|outside)|off\s?(this\s)?(app|platform|site))\b/gi;

const REDACTED = '[contact info removed]';

/**
 * Filters a message before it's stored/shown.
 * Returns { text, wasFiltered } — text has redactions applied,
 * wasFiltered tells the caller whether to bump flagCount.
 */
function filterMessage(rawText) {
  let text = rawText;
  let wasFiltered = false;

  if (PHONE_REGEX.test(text)) {
    text = text.replace(PHONE_REGEX, REDACTED);
    wasFiltered = true;
  }
  // Reset lastIndex since these regexes use the global flag and .test()
  // advances it — stale lastIndex causes silent misses on reuse.
  PHONE_REGEX.lastIndex = 0;

  if (EMAIL_REGEX.test(text)) {
    text = text.replace(EMAIL_REGEX, REDACTED);
    wasFiltered = true;
  }
  EMAIL_REGEX.lastIndex = 0;

  if (LOOSE_DIGIT_SEQUENCE_REGEX.test(text)) {
    text = text.replace(LOOSE_DIGIT_SEQUENCE_REGEX, REDACTED);
    wasFiltered = true;
  }
  LOOSE_DIGIT_SEQUENCE_REGEX.lastIndex = 0;

  if (SUSPICIOUS_PHRASE_REGEX.test(text)) {
    // Don't redact the phrase itself (it's not sensitive on its own,
    // and stripping it makes messages read as gibberish) — just flag it
    // so a human can review the thread later.
    wasFiltered = true;
  }
  SUSPICIOUS_PHRASE_REGEX.lastIndex = 0;

  return { text, wasFiltered };
}

module.exports = { filterMessage };