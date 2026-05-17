"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => Md2doPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  scanPattern: "**/*.md",
  excludeFolders: ["node_modules", ".git", "dist", "build", ".obsidian"],
  warningsEnabled: true,
  defaultGroupMode: "file",
  defaultSortMode: "dueDate",
  showCompletedTasks: true,
  autoScan: true
};
var Md2doSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "md2do Settings" });
    containerEl.createEl("h3", { text: "Scanning" });
    new import_obsidian.Setting(containerEl).setName("File pattern").setDesc("Glob pattern for files to scan (default: **/*.md)").addText(
      (text) => text.setPlaceholder("**/*.md").setValue(this.plugin.settings.scanPattern).onChange(async (value) => {
        this.plugin.settings.scanPattern = value || "**/*.md";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Excluded folders").setDesc("Comma-separated list of folders to exclude from scanning").addText(
      (text) => text.setPlaceholder("node_modules, .git, dist").setValue(this.plugin.settings.excludeFolders.join(", ")).onChange(async (value) => {
        this.plugin.settings.excludeFolders = value.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Auto-scan").setDesc("Automatically scan for tasks when files change").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoScan).onChange(async (value) => {
        this.plugin.settings.autoScan = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "Display" });
    new import_obsidian.Setting(containerEl).setName("Default grouping").setDesc("How tasks are grouped in the sidebar").addDropdown(
      (dropdown) => dropdown.addOption("file", "By File").addOption("assignee", "By Assignee").addOption("priority", "By Priority").addOption("dueDate", "By Due Date").addOption("tag", "By Tag").addOption("flat", "Flat List").setValue(this.plugin.settings.defaultGroupMode).onChange(async (value) => {
        this.plugin.settings.defaultGroupMode = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Default sorting").setDesc("How tasks are sorted within groups").addDropdown(
      (dropdown) => dropdown.addOption("dueDate", "By Due Date").addOption("priority", "By Priority").addOption("alphabetical", "Alphabetically").addOption("line", "By Line Number").setValue(this.plugin.settings.defaultSortMode).onChange(async (value) => {
        this.plugin.settings.defaultSortMode = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show completed tasks").setDesc("Include completed tasks in the task list").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showCompletedTasks).onChange(async (value) => {
        this.plugin.settings.showCompletedTasks = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "Warnings" });
    new import_obsidian.Setting(containerEl).setName("Enable warnings").setDesc("Show task formatting warnings").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.warningsEnabled).onChange(async (value) => {
        this.plugin.settings.warningsEnabled = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/views/task-list-view.ts
var import_obsidian2 = require("obsidian");

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/toDate.mjs
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    return new Date(argument);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/constructFrom.mjs
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/addDays.mjs
function addDays(date, amount) {
  const _date = toDate(date);
  if (isNaN(amount)) return constructFrom(date, NaN);
  if (!amount) {
    return _date;
  }
  _date.setDate(_date.getDate() + amount);
  return _date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/constants.mjs
var daysInYear = 365.2425;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var minTime = -maxTime;
var millisecondsInWeek = 6048e5;
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
var millisecondsInSecond = 1e3;
var secondsInHour = 3600;
var secondsInDay = secondsInHour * 24;
var secondsInWeek = secondsInDay * 7;
var secondsInYear = secondsInDay * daysInYear;
var secondsInMonth = secondsInYear / 12;
var secondsInQuarter = secondsInMonth * 3;

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/defaultOptions.mjs
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfWeek.mjs
function startOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfISOWeek.mjs
function startOfISOWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getISOWeekYear.mjs
function getISOWeekYear(date) {
  const _date = toDate(date);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.mjs
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfISOWeekYear.mjs
function startOfISOWeekYear(date) {
  const year = getISOWeekYear(date);
  const fourthOfJanuary = constructFrom(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/isDate.mjs
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/isValid.mjs
function isValid(date) {
  if (!isDate(date) && typeof date !== "number") {
    return false;
  }
  const _date = toDate(date);
  return !isNaN(Number(_date));
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/formatDistance.mjs
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildFormatLongFn.mjs
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/formatLong.mjs
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/formatRelative.mjs
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildLocalizeFn.mjs
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/localize.mjs
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildMatchFn.mjs
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/_lib/buildMatchPatternFn.mjs
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US/_lib/match.mjs
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/locale/en-US.mjs
var enUS = {
  code: "en-US",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getISOWeek.mjs
function getISOWeek(date) {
  const _date = toDate(date);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getWeekYear.mjs
function getWeekYear(date, options) {
  const _date = toDate(date);
  const year = _date.getFullYear();
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom(date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/startOfWeekYear.mjs
function startOfWeekYear(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getWeek.mjs
function getWeek(date, options) {
  const _date = toDate(date);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/format/longFormatters.mjs
var dateLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "P":
      return formatLong2.date({ width: "short" });
    case "PP":
      return formatLong2.date({ width: "medium" });
    case "PPP":
      return formatLong2.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong2.date({ width: "full" });
  }
};
var timeLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "p":
      return formatLong2.time({ width: "short" });
    case "pp":
      return formatLong2.time({ width: "medium" });
    case "ppp":
      return formatLong2.time({ width: "long" });
    case "pppp":
    default:
      return formatLong2.time({ width: "full" });
  }
};
var dateTimeLongFormatter = (pattern, formatLong2) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/_lib/protectedTokens.mjs
var dayOfYearTokenRE = /^D+$/;
var weekYearTokenRE = /^Y+$/;
var throwTokens = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format, input) {
  const _message = message(token, format, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getDefaultOptions.mjs
function getDefaultOptions2() {
  return Object.assign({}, getDefaultOptions());
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/getISODay.mjs
function getISODay(date) {
  const _date = toDate(date);
  let day = _date.getDay();
  if (day === 0) {
    day = 7;
  }
  return day;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/transpose.mjs
function transpose(fromDate, constructor) {
  const date = constructor instanceof Date ? constructFrom(constructor, 0) : new constructor(0);
  date.setFullYear(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );
  date.setHours(
    fromDate.getHours(),
    fromDate.getMinutes(),
    fromDate.getSeconds(),
    fromDate.getMilliseconds()
  );
  return date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/Setter.mjs
var TIMEZONE_UNIT_PRIORITY = 10;
var Setter = class {
  constructor() {
    __publicField(this, "subPriority", 0);
  }
  validate(_utcDate, _options) {
    return true;
  }
};
var ValueSetter = class extends Setter {
  constructor(value, validateValue, setValue, priority, subPriority) {
    super();
    this.value = value;
    this.validateValue = validateValue;
    this.setValue = setValue;
    this.priority = priority;
    if (subPriority) {
      this.subPriority = subPriority;
    }
  }
  validate(date, options) {
    return this.validateValue(date, this.value, options);
  }
  set(date, flags, options) {
    return this.setValue(date, flags, this.value, options);
  }
};
var DateToSystemTimezoneSetter = class extends Setter {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", TIMEZONE_UNIT_PRIORITY);
    __publicField(this, "subPriority", -1);
  }
  set(date, flags) {
    if (flags.timestampIsSet) return date;
    return constructFrom(date, transpose(date, Date));
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/Parser.mjs
var Parser = class {
  run(dateString, token, match2, options) {
    const result = this.parse(dateString, token, match2, options);
    if (!result) {
      return null;
    }
    return {
      setter: new ValueSetter(
        result.value,
        this.validate,
        this.set,
        this.priority,
        this.subPriority
      ),
      rest: result.rest
    };
  }
  validate(_utcDate, _value, _options) {
    return true;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/EraParser.mjs
var EraParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 140);
    __publicField(this, "incompatibleTokens", ["R", "u", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
      // A, B
      case "GGGGG":
        return match2.era(dateString, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return match2.era(dateString, { width: "wide" }) || match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
    }
  }
  set(date, flags, value) {
    flags.era = value;
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/constants.mjs
var numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
var timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/utils.mjs
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  const sign = matchResult[1] === "+" ? 1 : -1;
  const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}
function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  const isCommonEra = currentYear > 0;
  const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  let result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    const rangeEnd = absCurrentYear + 50;
    const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
    const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/YearParser.mjs
var YearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(dateString, token, match2) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "yy"
    });
    switch (token) {
      case "y":
        return mapValue(parseNDigits(4, dateString), valueCallback);
      case "yo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "year"
          }),
          valueCallback
        );
      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }
  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }
  set(date, flags, value) {
    const currentYear = date.getFullYear();
    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = normalizeTwoDigitYear(
        value.year,
        currentYear
      );
      date.setFullYear(normalizedTwoDigitYear, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/LocalWeekYearParser.mjs
var LocalWeekYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "YY"
    });
    switch (token) {
      case "Y":
        return mapValue(parseNDigits(4, dateString), valueCallback);
      case "Yo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "year"
          }),
          valueCallback
        );
      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }
  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }
  set(date, flags, value, options) {
    const currentYear = getWeekYear(date, options);
    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = normalizeTwoDigitYear(
        value.year,
        currentYear
      );
      date.setFullYear(
        normalizedTwoDigitYear,
        0,
        options.firstWeekContainsDate
      );
      date.setHours(0, 0, 0, 0);
      return startOfWeek(date, options);
    }
    const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, options.firstWeekContainsDate);
    date.setHours(0, 0, 0, 0);
    return startOfWeek(date, options);
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/ISOWeekYearParser.mjs
var ISOWeekYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", [
      "G",
      "y",
      "Y",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token) {
    if (token === "R") {
      return parseNDigitsSigned(4, dateString);
    }
    return parseNDigitsSigned(token.length, dateString);
  }
  set(date, _flags, value) {
    const firstWeekOfYear = constructFrom(date, 0);
    firstWeekOfYear.setFullYear(value, 0, 4);
    firstWeekOfYear.setHours(0, 0, 0, 0);
    return startOfISOWeek(firstWeekOfYear);
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/ExtendedYearParser.mjs
var ExtendedYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(dateString, token) {
    if (token === "u") {
      return parseNDigitsSigned(4, dateString);
    }
    return parseNDigitsSigned(token.length, dateString);
  }
  set(date, _flags, value) {
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/QuarterParser.mjs
var QuarterParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 120);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
      case "QQ":
        return parseNDigits(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return match2.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return match2.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return match2.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return match2.quarter(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 4;
  }
  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/StandAloneQuarterParser.mjs
var StandAloneQuarterParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 120);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      // 1, 2, 3, 4
      case "q":
      case "qq":
        return parseNDigits(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return match2.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return match2.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return match2.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return match2.quarter(dateString, {
          width: "wide",
          context: "standalone"
        }) || match2.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 4;
  }
  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/MonthParser.mjs
var MonthParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "L",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
    __publicField(this, "priority", 110);
  }
  parse(dateString, token, match2) {
    const valueCallback = (value) => value - 1;
    switch (token) {
      // 1, 2, ..., 12
      case "M":
        return mapValue(
          parseNumericPattern(numericPatterns.month, dateString),
          valueCallback
        );
      // 01, 02, ..., 12
      case "MM":
        return mapValue(parseNDigits(2, dateString), valueCallback);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "month"
          }),
          valueCallback
        );
      // Jan, Feb, ..., Dec
      case "MMM":
        return match2.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.month(dateString, { width: "narrow", context: "formatting" });
      // J, F, ..., D
      case "MMMMM":
        return match2.month(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return match2.month(dateString, { width: "wide", context: "formatting" }) || match2.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.month(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/StandAloneMonthParser.mjs
var StandAloneMonthParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 110);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    const valueCallback = (value) => value - 1;
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return mapValue(
          parseNumericPattern(numericPatterns.month, dateString),
          valueCallback
        );
      // 01, 02, ..., 12
      case "LL":
        return mapValue(parseNDigits(2, dateString), valueCallback);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "month"
          }),
          valueCallback
        );
      // Jan, Feb, ..., Dec
      case "LLL":
        return match2.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.month(dateString, { width: "narrow", context: "standalone" });
      // J, F, ..., D
      case "LLLLL":
        return match2.month(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return match2.month(dateString, { width: "wide", context: "standalone" }) || match2.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.month(dateString, { width: "narrow", context: "standalone" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/setWeek.mjs
function setWeek(date, week, options) {
  const _date = toDate(date);
  const diff = getWeek(_date, options) - week;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/LocalWeekParser.mjs
var LocalWeekParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 100);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "w":
        return parseNumericPattern(numericPatterns.week, dateString);
      case "wo":
        return match2.ordinalNumber(dateString, { unit: "week" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 53;
  }
  set(date, _flags, value, options) {
    return startOfWeek(setWeek(date, value, options), options);
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/setISOWeek.mjs
function setISOWeek(date, week) {
  const _date = toDate(date);
  const diff = getISOWeek(_date) - week;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/ISOWeekParser.mjs
var ISOWeekParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 100);
    __publicField(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "I":
        return parseNumericPattern(numericPatterns.week, dateString);
      case "Io":
        return match2.ordinalNumber(dateString, { unit: "week" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 53;
  }
  set(date, _flags, value) {
    return startOfISOWeek(setISOWeek(date, value));
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/DateParser.mjs
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [
  31,
  29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];
var DateParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "subPriority", 1);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "d":
        return parseNumericPattern(numericPatterns.date, dateString);
      case "do":
        return match2.ordinalNumber(dateString, { unit: "date" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear = isLeapYearIndex(year);
    const month = date.getMonth();
    if (isLeapYear) {
      return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
    } else {
      return value >= 1 && value <= DAYS_IN_MONTH[month];
    }
  }
  set(date, _flags, value) {
    date.setDate(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/DayOfYearParser.mjs
var DayOfYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "subpriority", 1);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "E",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "D":
      case "DD":
        return parseNumericPattern(numericPatterns.dayOfYear, dateString);
      case "Do":
        return match2.ordinalNumber(dateString, { unit: "date" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear = isLeapYearIndex(year);
    if (isLeapYear) {
      return value >= 1 && value <= 366;
    } else {
      return value >= 1 && value <= 365;
    }
  }
  set(date, _flags, value) {
    date.setMonth(0, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/setDay.mjs
function setDay(date, day, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date);
  const currentDay = _date.getDay();
  const remainder = day % 7;
  const dayIndex = (remainder + 7) % 7;
  const delta = 7 - weekStartsOn;
  const diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
  return addDays(_date, diff);
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/DayParser.mjs
var DayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // T
      case "EEEEE":
        return match2.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // Tuesday
      case "EEEE":
      default:
        return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/LocalDayParser.mjs
var LocalDayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2, options) {
    const valueCallback = (value) => {
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
    };
    switch (token) {
      // 3
      case "e":
      case "ee":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      // 3rd
      case "eo":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "day"
          }),
          valueCallback
        );
      // Tue
      case "eee":
        return match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // T
      case "eeeee":
        return match2.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      // Tuesday
      case "eeee":
      default:
        return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/StandAloneLocalDayParser.mjs
var StandAloneLocalDayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "e",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2, options) {
    const valueCallback = (value) => {
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
    };
    switch (token) {
      // 3
      case "c":
      case "cc":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      // 3rd
      case "co":
        return mapValue(
          match2.ordinalNumber(dateString, {
            unit: "day"
          }),
          valueCallback
        );
      // Tue
      case "ccc":
        return match2.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
      // T
      case "ccccc":
        return match2.day(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
      // Tuesday
      case "cccc":
      default:
        return match2.day(dateString, { width: "wide", context: "standalone" }) || match2.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/setISODay.mjs
function setISODay(date, day) {
  const _date = toDate(date);
  const currentDay = getISODay(_date);
  const diff = day - currentDay;
  return addDays(_date, diff);
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/ISODayParser.mjs
var ISODayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "E",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match2) {
    const valueCallback = (value) => {
      if (value === 0) {
        return 7;
      }
      return value;
    };
    switch (token) {
      // 2
      case "i":
      case "ii":
        return parseNDigits(token.length, dateString);
      // 2nd
      case "io":
        return match2.ordinalNumber(dateString, { unit: "day" });
      // Tue
      case "iii":
        return mapValue(
          match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // T
      case "iiiii":
        return mapValue(
          match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // Tu
      case "iiiiii":
        return mapValue(
          match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // Tuesday
      case "iiii":
      default:
        return mapValue(
          match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 7;
  }
  set(date, _flags, value) {
    date = setISODay(date, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/AMPMParser.mjs
var AMPMParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 80);
    __publicField(this, "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "a":
      case "aa":
      case "aaa":
        return match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaaa":
        return match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return match2.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/AMPMMidnightParser.mjs
var AMPMMidnightParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 80);
    __publicField(this, "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "b":
      case "bb":
      case "bbb":
        return match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbbb":
        return match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return match2.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/DayPeriodParser.mjs
var DayPeriodParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 80);
    __publicField(this, "incompatibleTokens", ["a", "b", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBBB":
        return match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return match2.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match2.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/Hour1to12Parser.mjs
var Hour1to12Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["H", "K", "k", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "h":
        return parseNumericPattern(numericPatterns.hour12h, dateString);
      case "ho":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 12;
  }
  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else if (!isPM && value === 12) {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/Hour0to23Parser.mjs
var Hour0to23Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "H":
        return parseNumericPattern(numericPatterns.hour23h, dateString);
      case "Ho":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 23;
  }
  set(date, _flags, value) {
    date.setHours(value, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/Hour0To11Parser.mjs
var Hour0To11Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["h", "H", "k", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "K":
        return parseNumericPattern(numericPatterns.hour11h, dateString);
      case "Ko":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/Hour1To24Parser.mjs
var Hour1To24Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "k":
        return parseNumericPattern(numericPatterns.hour24h, dateString);
      case "ko":
        return match2.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 24;
  }
  set(date, _flags, value) {
    const hours = value <= 24 ? value % 24 : value;
    date.setHours(hours, 0, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/MinuteParser.mjs
var MinuteParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 60);
    __publicField(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "m":
        return parseNumericPattern(numericPatterns.minute, dateString);
      case "mo":
        return match2.ordinalNumber(dateString, { unit: "minute" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 59;
  }
  set(date, _flags, value) {
    date.setMinutes(value, 0, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/SecondParser.mjs
var SecondParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 50);
    __publicField(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(dateString, token, match2) {
    switch (token) {
      case "s":
        return parseNumericPattern(numericPatterns.second, dateString);
      case "so":
        return match2.ordinalNumber(dateString, { unit: "second" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 59;
  }
  set(date, _flags, value) {
    date.setSeconds(value, 0);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/FractionOfSecondParser.mjs
var FractionOfSecondParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 30);
    __publicField(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(dateString, token) {
    const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
    return mapValue(parseNDigits(token.length, dateString), valueCallback);
  }
  set(date, _flags, value) {
    date.setMilliseconds(value);
    return date;
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/ISOTimezoneWithZParser.mjs
var ISOTimezoneWithZParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 10);
    __publicField(this, "incompatibleTokens", ["t", "T", "x"]);
  }
  parse(dateString, token) {
    switch (token) {
      case "X":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalMinutes,
          dateString
        );
      case "XX":
        return parseTimezonePattern(timezonePatterns.basic, dateString);
      case "XXXX":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalSeconds,
          dateString
        );
      case "XXXXX":
        return parseTimezonePattern(
          timezonePatterns.extendedOptionalSeconds,
          dateString
        );
      case "XXX":
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }
  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return constructFrom(
      date,
      date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
    );
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/ISOTimezoneParser.mjs
var ISOTimezoneParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 10);
    __publicField(this, "incompatibleTokens", ["t", "T", "X"]);
  }
  parse(dateString, token) {
    switch (token) {
      case "x":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalMinutes,
          dateString
        );
      case "xx":
        return parseTimezonePattern(timezonePatterns.basic, dateString);
      case "xxxx":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalSeconds,
          dateString
        );
      case "xxxxx":
        return parseTimezonePattern(
          timezonePatterns.extendedOptionalSeconds,
          dateString
        );
      case "xxx":
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }
  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return constructFrom(
      date,
      date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
    );
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/TimestampSecondsParser.mjs
var TimestampSecondsParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 40);
    __publicField(this, "incompatibleTokens", "*");
  }
  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }
  set(date, _flags, value) {
    return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers/TimestampMillisecondsParser.mjs
var TimestampMillisecondsParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 20);
    __publicField(this, "incompatibleTokens", "*");
  }
  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }
  set(date, _flags, value) {
    return [constructFrom(date, value), { timestampIsSet: true }];
  }
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse/_lib/parsers.mjs
var parsers = {
  G: new EraParser(),
  y: new YearParser(),
  Y: new LocalWeekYearParser(),
  R: new ISOWeekYearParser(),
  u: new ExtendedYearParser(),
  Q: new QuarterParser(),
  q: new StandAloneQuarterParser(),
  M: new MonthParser(),
  L: new StandAloneMonthParser(),
  w: new LocalWeekParser(),
  I: new ISOWeekParser(),
  d: new DateParser(),
  D: new DayOfYearParser(),
  E: new DayParser(),
  e: new LocalDayParser(),
  c: new StandAloneLocalDayParser(),
  i: new ISODayParser(),
  a: new AMPMParser(),
  b: new AMPMMidnightParser(),
  B: new DayPeriodParser(),
  h: new Hour1to12Parser(),
  H: new Hour0to23Parser(),
  K: new Hour0To11Parser(),
  k: new Hour1To24Parser(),
  m: new MinuteParser(),
  s: new SecondParser(),
  S: new FractionOfSecondParser(),
  X: new ISOTimezoneWithZParser(),
  x: new ISOTimezoneParser(),
  t: new TimestampSecondsParser(),
  T: new TimestampMillisecondsParser()
};

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/parse.mjs
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function parse(dateStr, formatStr, referenceDate, options) {
  const defaultOptions2 = getDefaultOptions2();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  if (formatStr === "") {
    if (dateStr === "") {
      return toDate(referenceDate);
    } else {
      return constructFrom(referenceDate, NaN);
    }
  }
  const subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  const setters = [new DateToSystemTimezoneSetter()];
  const tokens = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter in longFormatters) {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp);
  const usedTokens = [];
  for (let token of tokens) {
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, dateStr);
    }
    if (!options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, dateStr);
    }
    const firstCharacter = token[0];
    const parser = parsers[firstCharacter];
    if (parser) {
      const { incompatibleTokens } = parser;
      if (Array.isArray(incompatibleTokens)) {
        const incompatibleToken = usedTokens.find(
          (usedToken) => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter
        );
        if (incompatibleToken) {
          throw new RangeError(
            `The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`
          );
        }
      } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
        throw new RangeError(
          `The format string mustn't contain \`${token}\` and any other token at the same time`
        );
      }
      usedTokens.push({ token: firstCharacter, fullToken: token });
      const parseResult = parser.run(
        dateStr,
        token,
        locale.match,
        subFnOptions
      );
      if (!parseResult) {
        return constructFrom(referenceDate, NaN);
      }
      setters.push(parseResult.setter);
      dateStr = parseResult.rest;
    } else {
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
        );
      }
      if (token === "''") {
        token = "'";
      } else if (firstCharacter === "'") {
        token = cleanEscapedString(token);
      }
      if (dateStr.indexOf(token) === 0) {
        dateStr = dateStr.slice(token.length);
      } else {
        return constructFrom(referenceDate, NaN);
      }
    }
  }
  if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) {
    return constructFrom(referenceDate, NaN);
  }
  const uniquePrioritySetters = setters.map((setter) => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map(
    (priority) => setters.filter((setter) => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)
  ).map((setterArray) => setterArray[0]);
  let date = toDate(referenceDate);
  if (isNaN(date.getTime())) {
    return constructFrom(referenceDate, NaN);
  }
  const flags = {};
  for (const setter of uniquePrioritySetters) {
    if (!setter.validate(date, subFnOptions)) {
      return constructFrom(referenceDate, NaN);
    }
    const result = setter.set(date, flags, subFnOptions);
    if (Array.isArray(result)) {
      date = result[0];
      Object.assign(flags, result[1]);
    } else {
      date = result;
    }
  }
  return constructFrom(referenceDate, date);
}
function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/setHours.mjs
function setHours(date, hours) {
  const _date = toDate(date);
  _date.setHours(hours);
  return _date;
}

// ../../node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/setMinutes.mjs
function setMinutes(date, minutes) {
  const _date = toDate(date);
  _date.setMinutes(minutes);
  return _date;
}

// ../core/dist/index.mjs
var import_crypto = require("crypto");
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var TASK_CHECKBOX = /^(\s*)-\s+\[([ xX])\]\s+/;
var ASSIGNEE = /@([\w-]+)/;
var PRIORITY_URGENT = /!!!/;
var PRIORITY_HIGH = /!!/;
var PRIORITY_NORMAL = /(?<!!)!(?!!)/;
var DUE_DATE_ABSOLUTE = /#due\/(\d{4}-\d{2}-\d{2})|\[due:\s*(\d{4}-\d{2}-\d{2})(?:\s+(\d{1,2}:\d{2}))?\s*\]/i;
var DUE_DATE_RELATIVE = /\[due:\s*(tomorrow|today|next\s+week|next\s+month)\]/i;
var DUE_DATE_SHORT = /\[due:\s*(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\]/i;
var TAG = /#(?!due\/)([\w-]+)/g;
var TODOIST_ID = /\{todoist:(\d+)\}|\[todoist:\s*(\d+)\]/i;
var COMPLETED_DATE = /\{completed:(\d{4}-\d{2}-\d{2})\}|\[completed:\s*(\d{4}-\d{2}-\d{2})\]/i;
var PATTERNS = {
  TASK_CHECKBOX,
  ASSIGNEE,
  PRIORITY_URGENT,
  PRIORITY_HIGH,
  PRIORITY_NORMAL,
  DUE_DATE_ABSOLUTE,
  DUE_DATE_RELATIVE,
  DUE_DATE_SHORT,
  TAG,
  TODOIST_ID,
  COMPLETED_DATE
};
function parseTime(timeStr) {
  const match2 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match2 || !match2[1] || !match2[2]) return null;
  const hours = parseInt(match2[1], 10);
  const minutes = parseInt(match2[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return { hours, minutes };
}
function parseAbsoluteDate(dateStr, timeStr) {
  const referenceDate = /* @__PURE__ */ new Date();
  let date = parse(dateStr, "yyyy-MM-dd", referenceDate);
  if (!isValid(date)) {
    date = parse(dateStr, "M/d/yy", referenceDate);
  }
  if (!isValid(date)) {
    date = parse(dateStr, "M/d/yyyy", referenceDate);
  }
  if (!isValid(date)) return null;
  if (timeStr) {
    const time = parseTime(timeStr);
    if (time) {
      date = setHours(date, time.hours);
      date = setMinutes(date, time.minutes);
    }
  }
  return date;
}
function generateTaskId(file, line, text) {
  const content = `${file}:${line}:${text}`;
  return (0, import_crypto.createHash)("md5").update(content).digest("hex").substring(0, 8);
}
function extractAssignee(text) {
  const match2 = text.match(PATTERNS.ASSIGNEE);
  return match2?.[1];
}
function extractPriority(text) {
  if (PATTERNS.PRIORITY_URGENT.test(text)) return "urgent";
  if (PATTERNS.PRIORITY_HIGH.test(text)) return "high";
  if (PATTERNS.PRIORITY_NORMAL.test(text)) return "normal";
  return void 0;
}
function extractTags(text) {
  const matches = text.matchAll(PATTERNS.TAG);
  return Array.from(matches, (match2) => match2[1]).filter(
    (tag) => tag !== void 0
  );
}
function extractTodoistId(text) {
  const match2 = text.match(PATTERNS.TODOIST_ID);
  if (!match2) return void 0;
  return match2[1] || match2[2];
}
function extractCompletedDate(text) {
  const match2 = text.match(PATTERNS.COMPLETED_DATE);
  if (!match2) return void 0;
  const dateStr = match2[1] || match2[2];
  if (!dateStr) return void 0;
  const date = parseAbsoluteDate(dateStr);
  return date ?? void 0;
}
function extractDueDate(text, context) {
  const absoluteMatch = text.match(PATTERNS.DUE_DATE_ABSOLUTE);
  if (absoluteMatch) {
    const dateStr = absoluteMatch[1] || absoluteMatch[2];
    if (dateStr) {
      let timeStr = absoluteMatch[3];
      if (!timeStr && context.defaultDueTime) {
        if (context.defaultDueTime === "start" && context.workdayStartTime) {
          timeStr = context.workdayStartTime;
        } else if (context.defaultDueTime === "end" && context.workdayEndTime) {
          timeStr = context.workdayEndTime;
        }
      }
      const date = parseAbsoluteDate(dateStr, timeStr);
      return { date: date ?? void 0 };
    }
  }
  const shortMatch = text.match(PATTERNS.DUE_DATE_SHORT);
  if (shortMatch?.[1]) {
    let timeStr;
    if (context.defaultDueTime) {
      if (context.defaultDueTime === "start" && context.workdayStartTime) {
        timeStr = context.workdayStartTime;
      } else if (context.defaultDueTime === "end" && context.workdayEndTime) {
        timeStr = context.workdayEndTime;
      }
    }
    const date = parseAbsoluteDate(shortMatch[1], timeStr);
    return { date: date ?? void 0 };
  }
  const relativeMatch = text.match(PATTERNS.DUE_DATE_RELATIVE);
  if (relativeMatch?.[1]) {
    return {
      date: void 0,
      warning: {
        severity: "warning",
        source: "md2do",
        ruleId: "relative-date-no-context",
        file: "",
        // Will be filled in by caller
        line: 0,
        // Will be filled in by caller
        text: text.trim(),
        message: "Relative due dates are no longer supported. Use #due/YYYY-MM-DD with a concrete date instead.",
        reason: "Relative due dates are no longer supported. Use #due/YYYY-MM-DD with a concrete date instead."
      }
    };
  }
  return { date: void 0 };
}
function cleanTaskText(text) {
  return text.replace(PATTERNS.DUE_DATE_ABSOLUTE, "").replace(PATTERNS.DUE_DATE_RELATIVE, "").replace(PATTERNS.DUE_DATE_SHORT, "").replace(PATTERNS.TODOIST_ID, "").replace(PATTERNS.COMPLETED_DATE, "").replace(PATTERNS.ASSIGNEE, "").replace(PATTERNS.TAG, "").replace(/!!!/g, "").replace(/!!/g, "").replace(/!/g, "").replace(/\s+/g, " ").trim();
}
function parseTask(line, lineNumber, file, context) {
  const warnings = [];
  if (/^\s*[*+]\s+\[[ xX]\]/.test(line)) {
    warnings.push({
      severity: "warning",
      source: "md2do",
      ruleId: "unsupported-bullet",
      file,
      line: lineNumber,
      text: line.trim(),
      message: "Unsupported bullet marker (* or +). Use dash (-) for task lists.",
      reason: "Unsupported bullet marker (* or +). Use dash (-) for task lists."
    });
    return { task: null, warnings };
  }
  if (/^\s*-\s+\[[xX]\s+\]/.test(line) || /^\s*-\s+\[\s+[xX]\]/.test(line)) {
    warnings.push({
      severity: "warning",
      source: "md2do",
      ruleId: "malformed-checkbox",
      file,
      line: lineNumber,
      text: line.trim(),
      message: "Malformed checkbox with extra spaces. Use [x] or [ ] without extra spaces.",
      reason: "Malformed checkbox with extra spaces. Use [x] or [ ] without extra spaces."
    });
    return { task: null, warnings };
  }
  if (/^\s*-\s+\[[ xX]\][^\s]/.test(line)) {
    warnings.push({
      severity: "warning",
      source: "md2do",
      ruleId: "missing-space-after",
      file,
      line: lineNumber,
      text: line.trim(),
      message: 'Missing space after checkbox. Use "- [x] Task" format.',
      reason: 'Missing space after checkbox. Use "- [x] Task" format.'
    });
    return { task: null, warnings };
  }
  if (/^\s*-\[[ xX]\]/.test(line)) {
    warnings.push({
      severity: "warning",
      source: "md2do",
      ruleId: "missing-space-before",
      file,
      line: lineNumber,
      text: line.trim(),
      message: 'Missing space before checkbox. Use "- [x] Task" format.',
      reason: 'Missing space before checkbox. Use "- [x] Task" format.'
    });
    return { task: null, warnings };
  }
  const taskMatch = line.match(PATTERNS.TASK_CHECKBOX);
  if (!taskMatch?.[0] || !taskMatch[2]) {
    return { task: null, warnings };
  }
  const completed = taskMatch[2].toLowerCase() === "x";
  const fullText = line.substring(taskMatch[0].length);
  const assignee = extractAssignee(fullText);
  const priority = extractPriority(fullText);
  const tags = extractTags(fullText);
  const todoistId = extractTodoistId(fullText);
  const completedDate = extractCompletedDate(fullText);
  const dueDateResult = extractDueDate(fullText, context);
  if (dueDateResult.warning) {
    warnings.push({
      ...dueDateResult.warning,
      file,
      line: lineNumber
    });
  }
  if (!completed && !dueDateResult.date) {
    warnings.push({
      severity: "info",
      source: "md2do",
      ruleId: "missing-due-date",
      file,
      line: lineNumber,
      text: fullText.trim(),
      message: "Task has no due date. Add #due/YYYY-MM-DD.",
      reason: "Task has no due date. Add #due/YYYY-MM-DD."
    });
  }
  if (completed && !completedDate) {
    warnings.push({
      severity: "info",
      source: "md2do",
      ruleId: "missing-completed-date",
      file,
      line: lineNumber,
      text: fullText.trim(),
      message: "Completed task missing completion date. Add {completed:YYYY-MM-DD}.",
      reason: "Completed task missing completion date. Add {completed:YYYY-MM-DD}."
    });
  }
  const cleanText = cleanTaskText(fullText);
  const id = generateTaskId(file, lineNumber, cleanText);
  const task = {
    id,
    text: cleanText,
    completed,
    file,
    line: lineNumber,
    tags
  };
  if (assignee !== void 0) task.assignee = assignee;
  if (priority !== void 0) task.priority = priority;
  if (dueDateResult.date !== void 0) task.dueDate = dueDateResult.date;
  if (todoistId !== void 0) task.todoistId = todoistId;
  if (completedDate !== void 0) task.completedDate = completedDate;
  if (context.project !== void 0) task.project = context.project;
  if (context.person !== void 0) task.person = context.person;
  return { task, warnings };
}
function extractProjectFromPath(filePath) {
  const match2 = filePath.match(/projects\/([^/]+)/);
  return match2?.[1];
}
function extractPersonFromFilename(filePath) {
  const match2 = filePath.match(/1-1s\/([^/]+)\.md$/);
  return match2?.[1];
}
var MarkdownScanner = class {
  /**
   * Scan a single markdown file's content
   *
   * Processes the file line-by-line, tracking context and extracting tasks.
   *
   * @param filePath - Relative file path (for context extraction)
   * @param content - File content as string
   * @param options - Optional scanner options including workday config
   * @returns Object containing tasks and warnings
   */
  scanFile(filePath, content, options) {
    const tasks = [];
    const warnings = [];
    const todoistIds = /* @__PURE__ */ new Map();
    const context = {};
    const project = extractProjectFromPath(filePath);
    if (project !== void 0) context.project = project;
    const person = extractPersonFromFilename(filePath);
    if (person !== void 0) context.person = person;
    if (options?.workdayStartTime) {
      context.workdayStartTime = options.workdayStartTime;
    }
    if (options?.workdayEndTime) {
      context.workdayEndTime = options.workdayEndTime;
    }
    if (options?.defaultDueTime) {
      context.defaultDueTime = options.defaultDueTime;
    }
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lineNumber = i + 1;
      const result = parseTask(line, lineNumber, filePath, context);
      if (result.task) {
        tasks.push(result.task);
        if (result.task.todoistId) {
          const existing = todoistIds.get(result.task.todoistId);
          if (existing) {
            warnings.push({
              severity: "error",
              source: "md2do",
              ruleId: "duplicate-todoist-id",
              file: filePath,
              line: lineNumber,
              text: result.task.text,
              message: `Duplicate Todoist ID {todoist:${result.task.todoistId}}. Also found at ${existing.file}:${existing.line}.`,
              reason: `Duplicate Todoist ID {todoist:${result.task.todoistId}}. Also found at ${existing.file}:${existing.line}.`
            });
          } else {
            todoistIds.set(result.task.todoistId, {
              file: filePath,
              line: lineNumber
            });
          }
        }
      }
      if (result.warnings.length > 0) {
        warnings.push(...result.warnings);
      }
    }
    return { tasks, warnings };
  }
  /**
   * Scan multiple files
   *
   * Note: This method expects file contents to be provided by the caller.
   * File I/O should be handled in the CLI package using fast-glob.
   *
   * @param files - Array of {path, content} objects
   * @returns Combined scan results from all files
   */
  scanFiles(files) {
    const allTasks = [];
    const allWarnings = [];
    const todoistIds = /* @__PURE__ */ new Map();
    for (const file of files) {
      const result = this.scanFile(file.path, file.content);
      allTasks.push(...result.tasks);
      allWarnings.push(...result.warnings);
      for (const task of result.tasks) {
        if (task.todoistId) {
          const existing = todoistIds.get(task.todoistId);
          if (existing && existing.file !== task.file) {
            allWarnings.push({
              severity: "error",
              source: "md2do",
              ruleId: "duplicate-todoist-id",
              file: task.file,
              line: task.line,
              text: task.text,
              message: `Duplicate Todoist ID {todoist:${task.todoistId}} across files. Also found at ${existing.file}:${existing.line}.`,
              reason: `Duplicate Todoist ID {todoist:${task.todoistId}} across files. Also found at ${existing.file}:${existing.line}.`
            });
          } else if (!existing) {
            todoistIds.set(task.todoistId, {
              file: task.file,
              line: task.line
            });
          }
        }
      }
    }
    return {
      tasks: allTasks,
      warnings: allWarnings
    };
  }
};
var filters_exports = {};
__export2(filters_exports, {
  byAssignee: () => byAssignee,
  byCompleted: () => byCompleted,
  byPath: () => byPath,
  byPerson: () => byPerson,
  byPriority: () => byPriority,
  byProject: () => byProject,
  byTag: () => byTag,
  combineFilters: () => combineFilters,
  combineFiltersOr: () => combineFiltersOr,
  hasDueDate: () => hasDueDate,
  hasNoDueDate: () => hasNoDueDate,
  isDueThisWeek: () => isDueThisWeek,
  isDueToday: () => isDueToday,
  isDueWithinDays: () => isDueWithinDays,
  isOverdue: () => isOverdue,
  not: () => not
});
function byAssignee(assignee) {
  return (task) => task.assignee === assignee;
}
function byCompleted(completed) {
  return (task) => task.completed === completed;
}
function byPriority(priority) {
  return (task) => task.priority === priority;
}
function byProject(project) {
  return (task) => task.project === project;
}
function byPerson(person) {
  return (task) => task.person === person;
}
function byTag(tag) {
  return (task) => task.tags.includes(tag);
}
function byPath(path, options = { recursive: true }) {
  const normalizedPath = path.replace(/\\/g, "/");
  const isDirectory = !normalizedPath.endsWith(".md");
  return (task) => {
    const taskPath = task.file.replace(/\\/g, "/");
    if (!isDirectory) {
      return taskPath === normalizedPath;
    }
    if (options.recursive) {
      return taskPath.startsWith(normalizedPath + "/") || taskPath === normalizedPath;
    } else {
      const dirPrefix = normalizedPath + "/";
      if (!taskPath.startsWith(dirPrefix)) {
        return false;
      }
      const remainder = taskPath.substring(dirPrefix.length);
      return !remainder.includes("/");
    }
  };
}
function getUTCStartOfDay(date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
}
function getUTCEndOfDay(date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
}
function addUTCDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}
function getUTCStartOfWeek(date) {
  const dayOfWeek = date.getUTCDay();
  const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const result = addUTCDays(date, diff);
  return getUTCStartOfDay(result);
}
function getUTCEndOfWeek(date) {
  const dayOfWeek = date.getUTCDay();
  const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const result = addUTCDays(date, diff);
  return getUTCEndOfDay(result);
}
function isOverdue(referenceDate = /* @__PURE__ */ new Date()) {
  const today = getUTCStartOfDay(referenceDate);
  return (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }
    return task.dueDate < today;
  };
}
function isDueToday(referenceDate = /* @__PURE__ */ new Date()) {
  const todayStart = getUTCStartOfDay(referenceDate);
  const todayEnd = getUTCEndOfDay(referenceDate);
  return (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }
    return task.dueDate >= todayStart && task.dueDate <= todayEnd;
  };
}
function isDueThisWeek(referenceDate = /* @__PURE__ */ new Date()) {
  const weekStart = getUTCStartOfWeek(referenceDate);
  const weekEnd = getUTCEndOfWeek(referenceDate);
  return (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }
    return task.dueDate >= weekStart && task.dueDate <= weekEnd;
  };
}
function isDueWithinDays(days, referenceDate = /* @__PURE__ */ new Date()) {
  const start = getUTCStartOfDay(referenceDate);
  const end = getUTCEndOfDay(addUTCDays(referenceDate, days));
  return (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }
    return task.dueDate >= start && task.dueDate <= end;
  };
}
function hasDueDate() {
  return (task) => task.dueDate !== void 0;
}
function hasNoDueDate() {
  return (task) => task.dueDate === void 0;
}
function combineFilters(filters) {
  return (task) => filters.every((filter) => filter(task));
}
function combineFiltersOr(filters) {
  return (task) => filters.some((filter) => filter(task));
}
function not(filter) {
  return (task) => !filter(task);
}
var sorting_exports = {};
__export2(sorting_exports, {
  byAssignee: () => byAssignee2,
  byCompletionStatus: () => byCompletionStatus,
  byDueDate: () => byDueDate,
  byFile: () => byFile,
  byPerson: () => byPerson2,
  byPriority: () => byPriority2,
  byProject: () => byProject2,
  combineComparators: () => combineComparators,
  reverse: () => reverse
});
var PRIORITY_ORDER = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3
};
function getPrioritySortValue(priority) {
  return priority !== void 0 ? PRIORITY_ORDER[priority] : 3;
}
function byDueDate() {
  return (a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  };
}
function byPriority2() {
  return (a, b) => {
    const aPriority = getPrioritySortValue(a.priority);
    const bPriority = getPrioritySortValue(b.priority);
    return aPriority - bPriority;
  };
}
function byFile() {
  return (a, b) => {
    const fileCompare = a.file.localeCompare(b.file);
    if (fileCompare !== 0) return fileCompare;
    return a.line - b.line;
  };
}
function byProject2() {
  return (a, b) => {
    if (!a.project && !b.project) return 0;
    if (!a.project) return 1;
    if (!b.project) return -1;
    return a.project.localeCompare(b.project);
  };
}
function byPerson2() {
  return (a, b) => {
    if (!a.person && !b.person) return 0;
    if (!a.person) return 1;
    if (!b.person) return -1;
    return a.person.localeCompare(b.person);
  };
}
function byAssignee2() {
  return (a, b) => {
    if (!a.assignee && !b.assignee) return 0;
    if (!a.assignee) return 1;
    if (!b.assignee) return -1;
    return a.assignee.localeCompare(b.assignee);
  };
}
function byCompletionStatus() {
  return (a, b) => {
    return Number(a.completed) - Number(b.completed);
  };
}
function combineComparators(comparators) {
  return (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}
function reverse(comparator) {
  return (a, b) => -comparator(a, b);
}
function filterWarnings(warnings, config = {}) {
  if (config.enabled === false) {
    return [];
  }
  if (!config.rules) {
    return warnings;
  }
  return warnings.filter((warning) => {
    const level = config.rules?.[warning.ruleId];
    if (level === void 0) {
      return true;
    }
    return level !== "off";
  });
}

// src/utils/task-writer.ts
async function toggleTaskCompletion(app, file, line) {
  try {
    const content = await app.vault.read(file);
    const lines = content.split("\n");
    if (line < 1 || line > lines.length) {
      return {
        success: false,
        error: `Invalid line number ${line}. File has ${lines.length} lines.`
      };
    }
    const lineIndex = line - 1;
    const originalLine = lines[lineIndex];
    if (!originalLine || !TASK_CHECKBOX.test(originalLine)) {
      return {
        success: false,
        error: `Line ${line} is not a task.`
      };
    }
    const isCompleted = /- \[x\]/i.test(originalLine);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let updatedLine;
    if (isCompleted) {
      updatedLine = originalLine.replace(/- \[x\]/i, "- [ ]").replace(/\s*(\{completed:[^}]+\}|\[completed:\s*[^\]]+\])/, "");
    } else {
      updatedLine = originalLine.replace(/- \[ \]/, "- [x]");
      if (!updatedLine.includes("{completed:") && !updatedLine.includes("[completed:")) {
        updatedLine = updatedLine.trimEnd() + ` {completed:${today}}`;
      }
    }
    lines[lineIndex] = updatedLine;
    await app.vault.modify(file, lines.join("\n"));
    const parseResult = parseTask(updatedLine, line, file.path, {});
    return {
      success: true,
      task: parseResult.task ?? void 0
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to toggle task: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// src/views/task-list-view.ts
var TASK_LIST_VIEW_TYPE = "md2do-task-list";
var TaskListView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.showIncompleteOnly = false;
    this.showOverdueOnly = false;
    this.contentEl_ = null;
    this.plugin = plugin;
    this.groupMode = plugin.settings.defaultGroupMode;
    this.sortMode = plugin.settings.defaultSortMode;
    this.showIncompleteOnly = !plugin.settings.showCompletedTasks;
  }
  getViewType() {
    return TASK_LIST_VIEW_TYPE;
  }
  getDisplayText() {
    return "md2do Tasks";
  }
  getIcon() {
    return "check-square";
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("md2do-task-list");
    this.renderToolbar(container);
    this.contentEl_ = container.createDiv({ cls: "md2do-task-content" });
    this.renderTasks();
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async onClose() {
    this.contentEl_ = null;
  }
  refresh() {
    if (this.contentEl_) {
      this.renderTasks();
    }
  }
  renderToolbar(container) {
    const toolbar = container.createDiv({ cls: "md2do-toolbar" });
    const groupBtn = toolbar.createEl("button", {
      cls: "md2do-toolbar-btn",
      attr: { "aria-label": "Group by" }
    });
    (0, import_obsidian2.setIcon)(groupBtn, "layout-list");
    groupBtn.addEventListener("click", (e) => {
      const menu = new import_obsidian2.Menu();
      const modes = [
        { mode: "file", label: "By File" },
        { mode: "assignee", label: "By Assignee" },
        { mode: "priority", label: "By Priority" },
        { mode: "dueDate", label: "By Due Date" },
        { mode: "tag", label: "By Tag" },
        { mode: "flat", label: "Flat List" }
      ];
      for (const { mode, label } of modes) {
        menu.addItem(
          (item) => item.setTitle(label).setChecked(this.groupMode === mode).onClick(() => {
            this.groupMode = mode;
            this.renderTasks();
          })
        );
      }
      menu.showAtMouseEvent(e);
    });
    const sortBtn = toolbar.createEl("button", {
      cls: "md2do-toolbar-btn",
      attr: { "aria-label": "Sort by" }
    });
    (0, import_obsidian2.setIcon)(sortBtn, "arrow-up-down");
    sortBtn.addEventListener("click", (e) => {
      const menu = new import_obsidian2.Menu();
      const modes = [
        { mode: "dueDate", label: "Due Date" },
        { mode: "priority", label: "Priority" },
        { mode: "alphabetical", label: "Alphabetically" },
        { mode: "line", label: "Line Number" }
      ];
      for (const { mode, label } of modes) {
        menu.addItem(
          (item) => item.setTitle(label).setChecked(this.sortMode === mode).onClick(() => {
            this.sortMode = mode;
            this.renderTasks();
          })
        );
      }
      menu.showAtMouseEvent(e);
    });
    toolbar.createDiv({ cls: "md2do-toolbar-separator" });
    const incompleteBtn = toolbar.createEl("button", {
      cls: "md2do-toolbar-btn",
      attr: { "aria-label": "Show incomplete only" }
    });
    (0, import_obsidian2.setIcon)(incompleteBtn, "circle");
    if (this.showIncompleteOnly) incompleteBtn.addClass("is-active");
    incompleteBtn.addEventListener("click", () => {
      this.showIncompleteOnly = !this.showIncompleteOnly;
      incompleteBtn.toggleClass("is-active", this.showIncompleteOnly);
      this.renderTasks();
    });
    const overdueBtn = toolbar.createEl("button", {
      cls: "md2do-toolbar-btn",
      attr: { "aria-label": "Show overdue only" }
    });
    (0, import_obsidian2.setIcon)(overdueBtn, "alert-triangle");
    if (this.showOverdueOnly) overdueBtn.addClass("is-active");
    overdueBtn.addEventListener("click", () => {
      this.showOverdueOnly = !this.showOverdueOnly;
      overdueBtn.toggleClass("is-active", this.showOverdueOnly);
      this.renderTasks();
    });
    toolbar.createDiv({ cls: "md2do-toolbar-separator" });
    const refreshBtn = toolbar.createEl("button", {
      cls: "md2do-toolbar-btn",
      attr: { "aria-label": "Refresh tasks" }
    });
    (0, import_obsidian2.setIcon)(refreshBtn, "refresh-cw");
    refreshBtn.addEventListener("click", () => {
      void this.plugin.refreshTasks();
    });
  }
  renderTasks() {
    if (!this.contentEl_) return;
    this.contentEl_.empty();
    let tasks = [...this.plugin.tasks];
    if (this.showIncompleteOnly) {
      tasks = tasks.filter(filters_exports.byCompleted(false));
    }
    if (this.showOverdueOnly) {
      tasks = tasks.filter(filters_exports.isOverdue());
    }
    tasks.sort(this.getComparator());
    if (tasks.length === 0) {
      this.contentEl_.createDiv({
        cls: "md2do-empty-state",
        text: "No tasks found"
      });
      return;
    }
    if (this.groupMode === "flat") {
      this.renderTaskList(this.contentEl_, tasks);
    } else {
      const groups = this.groupTasks(tasks);
      for (const group of groups) {
        this.renderGroup(this.contentEl_, group);
      }
    }
  }
  getComparator() {
    switch (this.sortMode) {
      case "dueDate":
        return sorting_exports.byDueDate();
      case "priority":
        return sorting_exports.byPriority();
      case "alphabetical":
        return (a, b) => a.text.localeCompare(b.text);
      case "line":
        return sorting_exports.byFile();
      default:
        return sorting_exports.byDueDate();
    }
  }
  groupTasks(tasks) {
    const groupMap = /* @__PURE__ */ new Map();
    for (const task of tasks) {
      let key;
      switch (this.groupMode) {
        case "file":
          key = task.file;
          break;
        case "assignee":
          key = task.assignee || "Unassigned";
          break;
        case "priority":
          key = task.priority || "normal";
          break;
        case "dueDate":
          key = this.getDueDateGroupLabel(task);
          break;
        case "tag":
          if (task.tags.length === 0) {
            key = "No Tags";
          } else {
            for (const tag of task.tags) {
              const tagKey = `#${tag}`;
              if (!groupMap.has(tagKey)) {
                groupMap.set(tagKey, []);
              }
              groupMap.get(tagKey).push(task);
            }
            continue;
          }
          break;
        default:
          key = task.file;
      }
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key).push(task);
    }
    return Array.from(groupMap.entries()).map(([label, groupTasks]) => ({
      label,
      tasks: groupTasks,
      collapsed: false
    }));
  }
  getDueDateGroupLabel(task) {
    if (!task.dueDate) return "No Due Date";
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(
      task.dueDate.getFullYear(),
      task.dueDate.getMonth(),
      task.dueDate.getDate()
    );
    const diffDays = Math.floor(
      (dueDay.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)
    );
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return "This Week";
    if (diffDays <= 30) return "This Month";
    return "Later";
  }
  renderGroup(container, group) {
    const groupEl = container.createDiv({ cls: "md2do-group" });
    const header = groupEl.createDiv({
      cls: `md2do-group-header${group.collapsed ? " is-collapsed" : ""}`
    });
    const collapseIcon = header.createSpan({
      cls: "md2do-group-collapse-icon"
    });
    (0, import_obsidian2.setIcon)(collapseIcon, "chevron-down");
    header.createSpan({ text: group.label });
    header.createSpan({
      cls: "md2do-group-count",
      text: String(group.tasks.length)
    });
    const taskContainer = groupEl.createDiv({ cls: "md2do-group-tasks" });
    if (!group.collapsed) {
      this.renderTaskList(taskContainer, group.tasks);
    }
    header.addEventListener("click", () => {
      group.collapsed = !group.collapsed;
      header.toggleClass("is-collapsed", group.collapsed);
      taskContainer.empty();
      if (!group.collapsed) {
        this.renderTaskList(taskContainer, group.tasks);
      }
    });
  }
  renderTaskList(container, tasks) {
    for (const task of tasks) {
      this.renderTaskItem(container, task);
    }
  }
  renderTaskItem(container, task) {
    const item = container.createDiv({
      cls: `md2do-task-item${task.completed ? " is-completed" : ""}`
    });
    const checkbox = item.createEl("input", {
      cls: "md2do-task-checkbox",
      type: "checkbox",
      attr: { ...task.completed ? { checked: "" } : {} }
    });
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      const file = this.app.vault.getAbstractFileByPath(task.file);
      if (file instanceof import_obsidian2.TFile) {
        void toggleTaskCompletion(this.app, file, task.line).then(
          () => this.plugin.refreshTasks()
        );
      }
    });
    const textEl = item.createDiv({ cls: "md2do-task-text" });
    textEl.createSpan({ text: task.text });
    if (this.groupMode !== "file") {
      textEl.createDiv({
        cls: "md2do-task-file",
        text: `${task.file}:${task.line}`
      });
    }
    const meta = item.createDiv({ cls: "md2do-task-meta" });
    if (task.priority && task.priority !== "normal") {
      meta.createSpan({
        cls: `md2do-priority md2do-priority-${task.priority}`,
        text: task.priority === "urgent" ? "!!!" : task.priority === "high" ? "!!" : "!"
      });
    }
    if (task.assignee) {
      meta.createSpan({
        cls: "md2do-assignee",
        text: `@${task.assignee}`
      });
    }
    if (task.dueDate) {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isOverdue2 = !task.completed && task.dueDate < today;
      const isToday = task.dueDate.getFullYear() === today.getFullYear() && task.dueDate.getMonth() === today.getMonth() && task.dueDate.getDate() === today.getDate();
      const dateStr = task.dueDate.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric"
      });
      meta.createSpan({
        cls: `md2do-due-date${isOverdue2 ? " is-overdue" : isToday ? " is-due-today" : ""}`,
        text: dateStr
      });
    }
    for (const tag of task.tags.slice(0, 3)) {
      meta.createSpan({
        cls: "md2do-tag",
        text: `#${tag}`
      });
    }
    item.addEventListener("click", () => {
      const file = this.app.vault.getAbstractFileByPath(task.file);
      if (file instanceof import_obsidian2.TFile) {
        const leaf = this.app.workspace.getLeaf(false);
        void leaf.openFile(file).then(() => {
          const editor = this.app.workspace.activeEditor?.editor;
          if (editor) {
            const pos = { line: task.line - 1, ch: 0 };
            editor.setCursor(pos);
            editor.scrollIntoView({ from: pos, to: pos }, true);
          }
        });
      }
    });
  }
};

// src/providers/diagnostic-provider.ts
var import_obsidian3 = require("obsidian");
var DiagnosticProvider = class {
  constructor(plugin) {
    this.gutterMarkers = /* @__PURE__ */ new Map();
    this.plugin = plugin;
  }
  updateDiagnostics(warnings) {
    if (!this.plugin.settings.warningsEnabled) {
      this.clearAll();
      return;
    }
    const filtered = filterWarnings(warnings, { enabled: true });
    const byFile2 = /* @__PURE__ */ new Map();
    for (const w of filtered) {
      if (!byFile2.has(w.file)) byFile2.set(w.file, []);
      byFile2.get(w.file).push(w);
    }
    this.plugin.warningsByFile = byFile2;
  }
  showDiagnosticSummary() {
    const warnings = this.plugin.warnings;
    if (!this.plugin.settings.warningsEnabled || warnings.length === 0) {
      new import_obsidian3.Notice("md2do: No warnings");
      return;
    }
    const filtered = filterWarnings(warnings, { enabled: true });
    const errors = filtered.filter((w) => w.severity === "error").length;
    const warns = filtered.filter((w) => w.severity === "warning").length;
    const infos = filtered.filter((w) => w.severity === "info").length;
    const parts = [];
    if (errors > 0) parts.push(`${errors} error(s)`);
    if (warns > 0) parts.push(`${warns} warning(s)`);
    if (infos > 0) parts.push(`${infos} info`);
    new import_obsidian3.Notice(`md2do Diagnostics
${parts.join(", ")}`);
  }
  getWarningsForFile(filePath) {
    return this.plugin.warningsByFile.get(filePath) ?? [];
  }
  clearAll() {
    this.plugin.warningsByFile.clear();
  }
};

// src/providers/suggest-provider.ts
var import_obsidian4 = require("obsidian");
var TaskSuggestProvider = class extends import_obsidian4.EditorSuggest {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
  }
  onTrigger(cursor, editor, _file) {
    const line = editor.getLine(cursor.line);
    if (!line.match(/^\s*-\s*\[[ xX]\]/)) {
      return null;
    }
    const textUpToCursor = line.substring(0, cursor.ch);
    const newDueMatch = textUpToCursor.match(/#due\/$/);
    if (newDueMatch && newDueMatch.index !== void 0) {
      return {
        start: {
          line: cursor.line,
          ch: newDueMatch.index + newDueMatch[0].length
        },
        end: cursor,
        query: "date:"
      };
    }
    const newDueValueMatch = textUpToCursor.match(/#due\/(\d[\d-]*)$/);
    if (newDueValueMatch && newDueValueMatch.index !== void 0 && newDueValueMatch[1]) {
      return {
        start: {
          line: cursor.line,
          ch: newDueValueMatch.index + newDueValueMatch[0].indexOf(newDueValueMatch[1])
        },
        end: cursor,
        query: `dateValue:${newDueValueMatch[1]}`
      };
    }
    const newCompletedMatch = textUpToCursor.match(/\{completed:\s*\}?$/i);
    if (newCompletedMatch && newCompletedMatch.index !== void 0) {
      return {
        start: {
          line: cursor.line,
          ch: newCompletedMatch.index + newCompletedMatch[0].length
        },
        end: cursor,
        query: "date:"
      };
    }
    const newCompletedValueMatch = textUpToCursor.match(
      /\{completed:(\d[\d-]*)\}?$/i
    );
    if (newCompletedValueMatch && newCompletedValueMatch.index !== void 0 && newCompletedValueMatch[1]) {
      return {
        start: {
          line: cursor.line,
          ch: newCompletedValueMatch.index + newCompletedValueMatch[0].indexOf(newCompletedValueMatch[1])
        },
        end: cursor,
        query: `dateValue:${newCompletedValueMatch[1]}`
      };
    }
    const dateMatch = textUpToCursor.match(/\[(due|completed):\s*\]?$/i);
    if (dateMatch && dateMatch.index !== void 0) {
      return {
        start: { line: cursor.line, ch: dateMatch.index + dateMatch[0].length },
        end: cursor,
        query: "date:"
      };
    }
    const dateValueMatch = textUpToCursor.match(
      /\[(due|completed):\s+(\d[\d-]*)\]?$/i
    );
    if (dateValueMatch && dateValueMatch.index !== void 0 && dateValueMatch[2]) {
      return {
        start: {
          line: cursor.line,
          ch: dateValueMatch.index + dateValueMatch[0].indexOf(dateValueMatch[2])
        },
        end: cursor,
        query: `dateValue:${dateValueMatch[2]}`
      };
    }
    const assigneeMatch = textUpToCursor.match(/@(\w*)$/);
    if (assigneeMatch) {
      return {
        start: { line: cursor.line, ch: assigneeMatch.index + 1 },
        end: cursor,
        query: `assignee:${assigneeMatch[1]}`
      };
    }
    const tagMatch = textUpToCursor.match(/#(?!due\/)(\w*)$/);
    if (tagMatch) {
      return {
        start: { line: cursor.line, ch: tagMatch.index + 1 },
        end: cursor,
        query: `tag:${tagMatch[1]}`
      };
    }
    const priorityMatch = textUpToCursor.match(/\s(!{1,3})$/);
    if (priorityMatch) {
      return {
        start: { line: cursor.line, ch: priorityMatch.index + 1 },
        end: cursor,
        query: `priority:${priorityMatch[1]}`
      };
    }
    return null;
  }
  getSuggestions(context) {
    const query = context.query;
    if (query === "date:") {
      return this.getDateSuggestions();
    }
    if (query.startsWith("dateValue:")) {
      const partial = query.slice("dateValue:".length);
      return this.getProgressiveDateSuggestions(partial);
    }
    if (query.startsWith("assignee:")) {
      const partial = query.slice("assignee:".length);
      return this.getAssigneeSuggestions(partial);
    }
    if (query.startsWith("tag:")) {
      const partial = query.slice("tag:".length);
      return this.getTagSuggestions(partial);
    }
    if (query.startsWith("priority:")) {
      return this.getPrioritySuggestions();
    }
    return [];
  }
  renderSuggestion(suggestion, el) {
    const container = el.createDiv({ cls: "md2do-suggestion" });
    container.createDiv({
      cls: "md2do-suggestion-label",
      text: suggestion.label
    });
    if (suggestion.detail) {
      container.createDiv({
        cls: "md2do-suggestion-detail",
        text: suggestion.detail
      });
    }
  }
  selectSuggestion(suggestion) {
    if (!this.context) return;
    const editor = this.context.editor;
    const start = this.context.start;
    const end = this.context.end;
    editor.replaceRange(suggestion.replacement, start, end);
  }
  formatDate(date) {
    return date.toISOString().split("T")[0];
  }
  getDateSuggestions() {
    const today = /* @__PURE__ */ new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonday = new Date(today);
    const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    const endOfWeek = new Date(today);
    const currentDay = today.getDay();
    const daysUntilFriday = currentDay <= 5 ? 5 - currentDay : 7 - currentDay + 5;
    endOfWeek.setDate(
      endOfWeek.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday)
    );
    return [
      {
        label: `Today (${this.formatDate(today)})`,
        replacement: this.formatDate(today),
        detail: "Due today"
      },
      {
        label: `Tomorrow (${this.formatDate(tomorrow)})`,
        replacement: this.formatDate(tomorrow),
        detail: "Due tomorrow"
      },
      {
        label: `Next Monday (${this.formatDate(nextMonday)})`,
        replacement: this.formatDate(nextMonday),
        detail: "Due next Monday"
      },
      {
        label: `End of week (${this.formatDate(endOfWeek)})`,
        replacement: this.formatDate(endOfWeek),
        detail: "Due Friday"
      },
      {
        label: `Next week (${this.formatDate(nextWeek)})`,
        replacement: this.formatDate(nextWeek),
        detail: "Due in 7 days"
      },
      {
        label: `Next month (${this.formatDate(nextMonth)})`,
        replacement: this.formatDate(nextMonth),
        detail: "Due in 1 month"
      }
    ];
  }
  getProgressiveDateSuggestions(partial) {
    const today = /* @__PURE__ */ new Date();
    const currentYear = today.getFullYear();
    if (/^\d{1,4}$/.test(partial) && !partial.includes("-")) {
      const suggestions = [];
      if (partial.length <= 3) {
        for (let y = currentYear; y <= currentYear + 2; y++) {
          if (String(y).startsWith(partial)) {
            suggestions.push({
              label: `${y}-`,
              replacement: `${y}-`,
              detail: `Year ${y}`
            });
          }
        }
      } else if (partial.length === 4) {
        suggestions.push({
          label: `${partial}-`,
          replacement: `${partial}-`,
          detail: `Year ${partial}`
        });
      }
      return suggestions;
    }
    const yearMonthMatch = partial.match(/^(\d{4})-(\d{0,2})$/);
    if (yearMonthMatch?.[1]) {
      const year = yearMonthMatch[1];
      const monthPartial = yearMonthMatch[2] || "";
      const suggestions = [];
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      for (let m = 1; m <= 12; m++) {
        const monthStr = m.toString().padStart(2, "0");
        if (monthPartial && !monthStr.startsWith(monthPartial)) continue;
        suggestions.push({
          label: `${year}-${monthStr}-`,
          replacement: `${year}-${monthStr}-`,
          detail: monthNames[m - 1]
        });
      }
      return suggestions;
    }
    const fullDateMatch = partial.match(/^(\d{4})-(\d{2})-(\d{0,2})$/);
    if (fullDateMatch?.[1] && fullDateMatch[2]) {
      const year = parseInt(fullDateMatch[1], 10);
      const month = parseInt(fullDateMatch[2], 10);
      const dayPartial = fullDateMatch[3] || "";
      const daysInMonth = new Date(year, month, 0).getDate();
      const suggestions = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = d.toString().padStart(2, "0");
        if (dayPartial && !dayStr.startsWith(dayPartial)) continue;
        const date = new Date(year, month - 1, d);
        const dayOfWeek = date.toLocaleDateString("en-US", {
          weekday: "short"
        });
        suggestions.push({
          label: `${fullDateMatch[1]}-${fullDateMatch[2]}-${dayStr}`,
          replacement: `${fullDateMatch[1]}-${fullDateMatch[2]}-${dayStr}`,
          detail: dayOfWeek
        });
      }
      return suggestions;
    }
    return [];
  }
  getAssigneeSuggestions(partial) {
    const assignees = /* @__PURE__ */ new Set();
    for (const task of this.plugin.tasks) {
      if (task.assignee) assignees.add(task.assignee);
    }
    return Array.from(assignees).filter(
      (a) => !partial || a.toLowerCase().startsWith(partial.toLowerCase())
    ).sort().map((a) => ({
      label: a,
      replacement: a,
      detail: "Assignee"
    }));
  }
  getTagSuggestions(partial) {
    const tagCounts = /* @__PURE__ */ new Map();
    for (const task of this.plugin.tasks) {
      for (const tag of task.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    return Array.from(tagCounts.entries()).filter(
      ([tag]) => !partial || tag.toLowerCase().startsWith(partial.toLowerCase())
    ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag, count]) => ({
      label: tag,
      replacement: tag,
      detail: `Used ${count}x`
    }));
  }
  getPrioritySuggestions() {
    return [
      { label: "!!!", replacement: "!!!", detail: "Urgent" },
      { label: "!!", replacement: "!!", detail: "High" },
      { label: "!", replacement: "!", detail: "Normal" }
    ];
  }
};

// src/utils/scanner.ts
async function scanVault(app, settings) {
  const scanner = new MarkdownScanner();
  const allTasks = [];
  const allWarnings = [];
  const markdownFiles = app.vault.getMarkdownFiles();
  const filesToScan = markdownFiles.filter((file) => {
    for (const excluded of settings.excludeFolders) {
      if (file.path.startsWith(excluded + "/") || file.path === excluded) {
        return false;
      }
    }
    return true;
  });
  for (const file of filesToScan) {
    try {
      const content = await app.vault.cachedRead(file);
      const result = scanner.scanFile(file.path, content);
      allTasks.push(...result.tasks);
      allWarnings.push(...result.warnings);
    } catch (error) {
      const message2 = `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`;
      allWarnings.push({
        severity: "error",
        source: "md2do",
        ruleId: "file-read-error",
        file: file.path,
        line: 0,
        message: message2
      });
    }
  }
  return {
    tasks: allTasks,
    warnings: allWarnings,
    metadata: {
      filesScanned: filesToScan.length,
      totalTasks: allTasks.length
    }
  };
}

// src/commands/index.ts
var import_obsidian5 = require("obsidian");
function registerCommands(plugin) {
  plugin.addCommand({
    id: "toggle-task",
    name: "Toggle task completion",
    editorCallback: async (editor, ctx) => {
      const cursor = editor.getCursor();
      const lineNumber = cursor.line + 1;
      const file = ctx.file;
      if (!file) {
        new import_obsidian5.Notice("No file open");
        return;
      }
      const line = editor.getLine(cursor.line);
      if (!TASK_CHECKBOX.test(line)) {
        new import_obsidian5.Notice("Current line is not a task");
        return;
      }
      const result = await toggleTaskCompletion(plugin.app, file, lineNumber);
      if (result.success) {
        const content = await plugin.app.vault.read(file);
        const lines = content.split("\n");
        const updatedLine = lines[cursor.line];
        if (updatedLine !== void 0) {
          editor.setLine(cursor.line, updatedLine);
        }
        await plugin.refreshTasks();
      } else {
        new import_obsidian5.Notice(`Failed to toggle task: ${result.error}`);
      }
    }
  });
  plugin.addCommand({
    id: "refresh-tasks",
    name: "Refresh task list",
    callback: async () => {
      await plugin.refreshTasks();
      new import_obsidian5.Notice("md2do: Tasks refreshed");
    }
  });
  plugin.addCommand({
    id: "show-task-list",
    name: "Show task list",
    callback: async () => {
      await plugin.activateView();
    }
  });
  plugin.addCommand({
    id: "show-overdue",
    name: "Show overdue tasks",
    callback: () => {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const overdueTasks = plugin.tasks.filter(
        (t) => !t.completed && t.dueDate && t.dueDate < today
      );
      if (overdueTasks.length === 0) {
        new import_obsidian5.Notice("No overdue tasks!");
      } else {
        new import_obsidian5.Notice(`${overdueTasks.length} overdue task(s)`);
      }
    }
  });
  plugin.addCommand({
    id: "show-diagnostics",
    name: "Show diagnostics summary",
    callback: () => {
      const warnings = plugin.warnings;
      if (warnings.length === 0) {
        new import_obsidian5.Notice("md2do: No warnings found");
        return;
      }
      const errors = warnings.filter((w) => w.severity === "error").length;
      const warns = warnings.filter((w) => w.severity === "warning").length;
      const infos = warnings.filter((w) => w.severity === "info").length;
      const parts = [];
      if (errors > 0) parts.push(`${errors} error(s)`);
      if (warns > 0) parts.push(`${warns} warning(s)`);
      if (infos > 0) parts.push(`${infos} info`);
      new import_obsidian5.Notice(`md2do Diagnostics
${parts.join("\n")}`);
    }
  });
  plugin.addCommand({
    id: "show-stats",
    name: "Show task statistics",
    callback: () => {
      const total = plugin.tasks.length;
      const completed = plugin.tasks.filter((t) => t.completed).length;
      const incomplete = total - completed;
      const statsNow = /* @__PURE__ */ new Date();
      const statsToday = new Date(
        statsNow.getFullYear(),
        statsNow.getMonth(),
        statsNow.getDate()
      );
      const overdue = plugin.tasks.filter(
        (t) => !t.completed && t.dueDate && t.dueDate < statsToday
      ).length;
      const lines = [
        `Total: ${total}`,
        `Completed: ${completed}`,
        `Incomplete: ${incomplete}`
      ];
      if (overdue > 0) {
        lines.push(`Overdue: ${overdue}`);
      }
      new import_obsidian5.Notice(`md2do Stats
${lines.join("\n")}`);
    }
  });
}

// src/main.ts
var Md2doPlugin = class extends import_obsidian6.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.tasks = [];
    this.warnings = [];
    this.warningsByFile = /* @__PURE__ */ new Map();
    this.statusBarEl = null;
    this.taskListView = null;
    this.diagnosticProvider = null;
    this.suggestProvider = null;
  }
  async onload() {
    await this.loadSettings();
    this.registerView(TASK_LIST_VIEW_TYPE, (leaf) => {
      this.taskListView = new TaskListView(leaf, this);
      return this.taskListView;
    });
    this.addSettingTab(new Md2doSettingTab(this.app, this));
    registerCommands(this);
    this.diagnosticProvider = new DiagnosticProvider(this);
    this.suggestProvider = new TaskSuggestProvider(this);
    this.registerEditorSuggest(this.suggestProvider);
    this.addRibbonIcon("check-square", "md2do Tasks", async () => {
      await this.activateView();
    });
    this.statusBarEl = this.addStatusBarItem();
    this.statusBarEl.addClass("md2do-status-bar");
    this.statusBarEl.setText("md2do: Loading...");
    const debouncedRefresh = (0, import_obsidian6.debounce)(
      () => void this.refreshTasks(),
      1e3,
      true
    );
    const onFileChange = (file) => {
      if (!this.settings.autoScan) return;
      if (file instanceof import_obsidian6.TFile && file.extension === "md") {
        debouncedRefresh();
      }
    };
    this.registerEvent(this.app.vault.on("modify", onFileChange));
    this.registerEvent(this.app.vault.on("create", onFileChange));
    this.registerEvent(this.app.vault.on("delete", onFileChange));
    this.registerEvent(this.app.vault.on("rename", onFileChange));
    this.app.workspace.onLayoutReady(() => {
      void this.refreshTasks();
    });
  }
  onunload() {
    this.taskListView = null;
  }
  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
  }
  async saveSettings() {
    await this.saveData(this.settings);
    await this.refreshTasks();
  }
  async refreshTasks() {
    try {
      const result = await scanVault(this.app, this.settings);
      this.tasks = result.tasks;
      this.warnings = result.warnings;
      this.updateStatusBar();
      if (this.diagnosticProvider) {
        this.diagnosticProvider.updateDiagnostics(this.warnings);
      }
      if (this.taskListView) {
        this.taskListView.refresh();
      }
    } catch (error) {
      console.error("md2do: Error scanning vault:", error);
      if (this.statusBarEl) {
        this.statusBarEl.setText("md2do: Error");
      }
    }
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(TASK_LIST_VIEW_TYPE);
    if (existing.length > 0) {
      await this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: TASK_LIST_VIEW_TYPE,
        active: true
      });
      await this.app.workspace.revealLeaf(leaf);
    }
  }
  updateStatusBar() {
    if (!this.statusBarEl) return;
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const incomplete = total - completed;
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const overdue = this.tasks.filter(
      (t) => !t.completed && t.dueDate && t.dueDate < today
    ).length;
    this.statusBarEl.empty();
    const text = `md2do: ${incomplete} tasks`;
    this.statusBarEl.createSpan({ text });
    if (overdue > 0) {
      this.statusBarEl.createSpan({
        cls: "md2do-status-overdue",
        text: ` (${overdue} overdue)`
      });
    }
    this.statusBarEl.setAttribute(
      "aria-label",
      `md2do Tasks
Total: ${total}
Completed: ${completed}
Incomplete: ${incomplete}${overdue > 0 ? `
Overdue: ${overdue}` : ""}`
    );
  }
};
