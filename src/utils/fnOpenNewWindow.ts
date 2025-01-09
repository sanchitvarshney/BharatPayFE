export function fnOpenNewWindow(link: string) {
  const margin = 50;
  const width = window.screen.width - margin * 2;
  const height = window.screen.height - margin * 2;
  const left = margin;
  const top = margin;
  window.open(link, "BharatPay", `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`);
}
