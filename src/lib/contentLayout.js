function normalizeWhitespace(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function truncateText(value, maxLength) {
  const text = String(value ?? "").trim();

  if (!maxLength || text.length <= maxLength) {
    return text;
  }

  const slice = text.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cutoff = lastSpace > Math.floor(maxLength * 0.6) ? lastSpace : maxLength;

  return `${slice.slice(0, cutoff).trim()}...`;
}

function appendEllipsis(value) {
  const text = String(value ?? "").trim().replace(/\.{3,}$/, "");
  return text ? `${text}...` : "...";
}

export function normalizeSingleLineText(value, fallback = "") {
  const normalized = normalizeWhitespace(value).replace(/\n+/g, " ").trim();
  return normalized || String(fallback ?? "").trim();
}

export function balanceTwoLineText(value, { fallback = "", maxLength = 42 } = {}) {
  const normalized = truncateText(normalizeSingleLineText(value, fallback), maxLength);

  if (!normalized) {
    return String(fallback ?? "").trim();
  }

  const words = normalized.split(" ").filter(Boolean);

  if (words.length < 2) {
    return normalized;
  }

  let bestIndex = 1;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const score = Math.abs(first.length - second.length);

    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return `${words.slice(0, bestIndex).join(" ")}\n${words.slice(bestIndex).join(" ")}`;
}

export function normalizeDisplayLines(
  value,
  { fallback = "", maxLines = 4, maxLineLength = 34 } = {}
) {
  const source = normalizeWhitespace(value) || normalizeWhitespace(fallback);
  const segments = source
    .split("\n")
    .flatMap((line) => line.split(","))
    .map((segment) => normalizeSingleLineText(segment))
    .filter(Boolean);

  if (!segments.length) {
    return [];
  }

  const lines = [];

  for (let index = 0; index < segments.length; index += 1) {
    const segment = truncateText(segments[index], maxLineLength);
    const currentLine = lines[lines.length - 1];

    if (!currentLine) {
      lines.push(segment);
      continue;
    }

    if (`${currentLine}, ${segment}`.length <= maxLineLength) {
      lines[lines.length - 1] = `${currentLine}, ${segment}`;
      continue;
    }

    if (lines.length >= maxLines) {
      lines[lines.length - 1] = appendEllipsis(lines[lines.length - 1]);
      return lines;
    }

    lines.push(segment);
  }

  return lines.slice(0, maxLines);
}

export const singleLineClampStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export function createLineClampStyle(lines, minHeight) {
  return {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: String(lines),
    ...(minHeight ? { minHeight } : {}),
  };
}
