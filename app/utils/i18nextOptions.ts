/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
export default {
  debug: process.env.NODE_ENV !== "production",
  fallbackLng: "en",
  supportedLngs: [
    "en",
    "de",
    "pl",
    "ar",
    "pt-BR",
    "uk",
    "ru",
    "el",
    "ko",
    "es",
    "zh-CN",
    "zh-TW",
  ],
  defaultNS: "common",
  react: { useSuspense: false },
};
