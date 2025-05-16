export const transformUomSelectData = (data: any[] | null) => {
  if (data === null) {
    return undefined;
  } else {
    return data.map((item) => {
      return { label: item.units_name, value: item.units_id };
    });
  }
};
export const transformGroupSelectData = (data: any[] | null) => {
  if (data === null) {
    return undefined;
  } else {
    return data.map((item) => {
      return { label: item.text, value: item.id };
    });
  }
};
export const transformSkuCode = (data: any[] | null) => {
  if (data === null) {
    return undefined;
  } else {
    return data.map((item) => {
      return { label: item.text, value: item.id };
    });
  }
};

export const transformPartCode = (data: any[] | null) => {
  if (data === null) {
    return undefined;
  } else {
    return data.map((item) => {
      return { label: item.text, value: item.id };
    });
  }
};
export const transformBothComponentCode = (data: any[] | null) => {
  if (data === null) {
    return undefined;
  } else {
    return data.map((item) => {
      return { label: item.text, value: item.id };
    });
  }
};

export const transformBranchList = (data: any[] | null) => {
  if (data === null) {
    return undefined;
  } else {
    return data.map((item) => {
      return { text: item.branch_name, id: item.branch_code , address:item.address };
    });
  }
};
