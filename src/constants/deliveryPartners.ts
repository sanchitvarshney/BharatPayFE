export const DELIVERY_PARTNERS = [
  { value: "eCOM", text: "eCommerce" },
  { value: "eKart", text: "eKart" },
  { value: "dVery", text: "Delhivery" },
  { value: "DTDC", text: "DTDC" },
  { value: "F1", text: "F1" },
  { value: "PLADA", text: "PLADA" },
  { value: "BILLBOX", text: "BILLBOX" },
  { value: "XPRESSBEES", text: "XPRESSBEES" },
  { value: "DARTX", text: "DARTX" },
  { value: "NANDAN", text: "NANDAN" },
  { value: "MARK", text: "MARK" },
  { value: "ShipRocket", text: "ShipRocket" },
  { value: "DSKCargo", text: "DSK Cargo and Logistics" },
  { value: "ShadowFox", text: "ShadowFox" },
  { value: "GMS", text: "GMS" },
  { value: "BLUEDART", text: "BLUEDART" },
  { value: "Trackon", text: "TrackOn" },
];


export const getAWBLengthRange = (
  partnerId: string,
): { min: number; max: number } | null => {
  switch (partnerId) {
    case "eCOM":
      return { min: 9, max: 12 };
    case "eKart":
      return { min: 10, max: 16 };
    case "dVery":
      return { min: 12, max: 14 };
    case "DTDC":
      return { min: 8, max: 14 };
    case "F1":
      return { min: 3, max: 10 };
    case "PLADA":
      return { min: 8, max: 10 };
    case "BILLBOX":
      return { min: 8, max: 10 };
    case "XPRESSBEES":
      return { min: 14, max: 15 };
    case "DARTX":
      return { min: 8, max: 10 };
    case "NANDAN":
      return { min: 8, max: 13 };
    case "DSKCargo":
      return { min: 7, max: 13 };
    case "ShipRocket":
      return { min: 7, max: 13 };
    case "ShadowFox":
      return { min: 12, max: 18 };
    case "GMS":
      return { min: 9, max: 10 };
    case "BLUEDART":
      return { min: 11, max: 13 };
    case "Trackon":
      return { min: 12, max: 14 };
    default:
      return null;
  }
};
