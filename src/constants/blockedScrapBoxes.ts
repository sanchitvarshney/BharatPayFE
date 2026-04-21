const BLOCKED_SCRAP_BOXES = new Set([
  "0WXZRR0CDM1023",
  "5NLUEUXUDG1017",
  "5XYXLFQQXR1035",
  "CY1MWI5VSZ1033",
  "E1YRZTNIBH1024",
  "ELNM7NEGGK1000",
  "J0SV07ZIXA1027",
  "M6DK65SAFP1019",
  "MBVOSUBVZ51006",
  "OPNZXGYVPN1022",
  "P9GA9HSK311009",
  "RMKHVG26EV1008",
  "SZ8QCHBWLK1002",
  "U8IAFLQKRI1015",
  "UXRV6QS4ML1004",
  "YP31LSNKO31031",
  "ZDX7ASAMTF1014",
  "ZWSSEG0CHP1010",
]);

export const isBlockedScrapBox = (boxNo: string): boolean =>
  BLOCKED_SCRAP_BOXES.has((boxNo || "").trim().toUpperCase());

export const blockedScrapMessage = (boxNo: string): string =>
  `Restrict the box number ${boxNo} for scrap dispatch`;

