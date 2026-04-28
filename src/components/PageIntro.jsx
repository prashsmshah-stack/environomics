function MaterialIcon({ name }) {
  return (
    <span
      className="material-symbols-outlined text-lg"
      style={{ fontVariationSettings: "'FILL' 1" }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default function PageIntro({
  icon,
  title,
  subtitle,
  description = "",
  badgeLabel,
  align = "center",
  className = "",
  variant = "card",
}) {
  const isCentered = align !== "left";
  const alignmentClass = isCentered ? "mx-auto max-w-4xl text-center" : "max-w-4xl text-left";
  const subtitleClass = isCentered ? "mx-auto max-w-3xl" : "max-w-3xl";

  if (variant === "plain") {
    const plainAlignmentClass = isCentered
      ? "mx-auto max-w-6xl text-center"
      : "max-w-[1500px] text-left";

    return (
      <div className={`${plainAlignmentClass} ${className}`.trim()}>
        <h1 className="optika-bold text-4xl leading-[1.05] text-on-surface sm:text-5xl md:text-6xl xl:text-7xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="optika-medium mt-4 text-lg text-tertiary sm:text-xl md:text-2xl">
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className="helixa-regular mt-6 max-w-[1500px] text-base leading-relaxed text-tertiary sm:text-lg lg:text-[1.08rem]">
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] border border-slate-200 bg-white px-6 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-12 lg:px-12 lg:py-14 ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,89,162,0.04),transparent_52%,rgba(42,175,111,0.08))]" />
      <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-[#1572c8]/0 via-[#1572c8]/35 to-[#1572c8]/0" />
      <div className="absolute -right-12 top-6 h-40 w-40 rounded-full bg-[#1572c8]/10 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#2AAF6F]/10 blur-3xl" />
      <div className="absolute right-6 top-6 hidden h-16 w-16 rounded-full border border-[#1572c8]/10 bg-[radial-gradient(circle,_rgba(21,114,200,0.2)_1px,_transparent_1px)] bg-[length:12px_12px] sm:block" />

      <div className={`relative ${alignmentClass}`}>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1572c8]/15 bg-[#0059a2]/5 px-4 py-2 text-[#0059a2]">
          <MaterialIcon name={icon} />
          <span className="font-helixa-bold text-[0.72rem] uppercase tracking-[0.24em]">
            {badgeLabel ?? title}
          </span>
        </div>

        <h1 className="optika-bold text-4xl leading-[1.05] text-on-surface sm:text-5xl md:text-6xl xl:text-7xl">
          {title}
        </h1>

        {subtitle ? (
          <p className={`optika-medium mt-4 text-lg text-tertiary sm:text-xl md:text-2xl ${subtitleClass}`.trim()}>
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className={`helixa-regular mt-4 text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg ${subtitleClass}`.trim()}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
