const taskTitles: Record<string, string> = {
  "vim-bar-kena": "ভিম বার কেনা",
  "dustbin-polythene-kena": "ডাস্টবিনের পলিথিন কেনা",
  "washroom-clean": "বাথরুম পরিষ্কার",
  "harpic-kena": "হারপিক কেনা",
  "jharu-kena": "ঝাড়ু কেনা",
};

const taskCategories: Record<string, string> = {
  Shopping: "কেনাকাটা",
  Cleaning: "পরিষ্কার-পরিচ্ছন্নতা",
};

const memberNames: Record<string, string> = {
  Raju: "রাজু",
  Rubel: "রুবেল",
  Arefin: "আরেফিন",
  Real: "রিয়েল",
  Radin: "রাদিন",
  "Hamim Islam Raju": "হামিম ইসলাম রাজু",
  "Rubel Ahmed": "রুবেল আহমেদ",
  "Sowad Arefin": "সওয়াদ আরেফিন",
  "Real Hossain": "রিয়েল হোসেন",
  "ATR Radin": "এটিআর রাদিন",
};

const knownErrors: Array<[RegExp, string]> = [
  [/please sign in|sign in to manage|authorized flatmate/i, "অনুগ্রহ করে অনুমোদিত সদস্যের অ্যাকাউন্ট দিয়ে প্রবেশ করুন।"],
  [/already exists|user already|email.*taken/i, "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।"],
  [/invalid.*(email|password|credential)|incorrect.*password/i, "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।"],
  [/rotation cycle has already completed/i, "এই কাজের পালা ইতিমধ্যে শেষ হয়েছে।"],
  [/not your turn/i, "এখন আপনার এই কাজের পালা নয়।"],
  [/already been completed/i, "কাজটি ইতিমধ্যে সম্পন্ন হয়েছে।"],
  [/already skipped/i, "আপনি এই পালাটি ইতিমধ্যে এড়িয়ে গেছেন; কাজটি সম্পন্ন করার দায়িত্ব আপনারই আছে।"],
  [/rotation cycle changed|task changed|refresh and try again/i, "কাজের তালিকা বদলে গেছে। পৃষ্ঠা রিফ্রেশ করে আবার চেষ্টা করুন।"],
  [/expense.*not found|could not be found/i, "খরচটি খুঁজে পাওয়া যায়নি।"],
  [/do not have a share/i, "এই খরচে আপনার কোনো অংশ নেই।"],
  [/valid whole amount|valid amount/i, "সঠিক পূর্ণ সংখ্যার পরিমাণ লিখুন।"],
];

export function formatBnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

export function formatBnDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
) {
  return new Date(value).toLocaleDateString("bn-BD", options);
}

export function formatBnDateTime(value: string | Date) {
  return new Date(value).toLocaleString("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function translateTaskTitle(key: string, fallback: string) {
  return taskTitles[key] ?? fallback;
}

export function translateTaskCategory(category: string) {
  return taskCategories[category] ?? category;
}

export function translateMemberName(name: string) {
  return memberNames[name] ?? name;
}

export function banglaError(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  if (/[\u0980-\u09FF]/.test(error.message)) return error.message;
  return knownErrors.find(([pattern]) => pattern.test(error.message))?.[1] ?? fallback;
}
