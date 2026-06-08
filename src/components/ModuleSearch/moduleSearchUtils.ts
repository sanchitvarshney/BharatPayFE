import { Menu } from "@/features/menu/menuType";

export type ModuleSearchOption = {
  key: string;
  value: string;
  label: string;
  breadcrumb: string;
  searchIndex: string;
  searchLabel: string;
  searchBreadcrumb: string;
  searchAliases?: string[];
};
export const extractQueryWords = (queryRaw:any) =>
  normalizeSearchToken(queryRaw).split(/\s+/).filter(Boolean);
const normalizeSearchToken = (value = "") =>
  String(value).toLowerCase().trim().replace(/\s+/g, " ");

export function buildIndexedModuleOptionsFromMenu(
  items: Menu[] | null | undefined,
  parentIndex: number[] = [],
  ancestors: string[] = [],
): ModuleSearchOption[] {
  if (!items?.length) return [];

  const visibleItems = items
    .filter((item) => item.is_active !== 0)
    .sort((a, b) => a.order - b.order);

  const result: ModuleSearchOption[] = [];

  visibleItems.forEach((item:any, idx) => {
    const currentIndex = [...parentIndex, idx + 1];
    const currentIndexText = currentIndex.join("");
    const currentLabel = item.name ? String(item.name) : "";
    const currentAncestors = currentLabel ? [...ancestors, currentLabel] : ancestors;

    if (item.url) {
      const breadcrumb = currentAncestors.join(" > ");
        const aliases:any = Array.isArray(item.aliases) ? item.aliases : [];
      result.push({
        key: `${item.menu_key}-${currentIndexText}`,
        value: item.url,
        label: currentLabel,
        breadcrumb,
        aliases,
        searchIndex: currentIndexText,
        searchLabel: normalizeSearchToken(currentLabel),
        searchBreadcrumb: normalizeSearchToken(breadcrumb),
          searchAliases: aliases.map(normalizeSearchToken),
      });
    }

    if (item.children?.length) {
      result.push(
        ...buildIndexedModuleOptionsFromMenu(item.children, currentIndex, currentAncestors),
      );
    }
  });

  return result;
}

export function filterModuleOptions(options: ModuleSearchOption[], queryRaw: string) {
   const words = extractQueryWords(queryRaw);
   if (!words.length) return [];



  return options
    .filter((option:any) =>
      words.every((word) => {
        const byLabel = option.searchLabel.includes(word);
        const byBreadcrumb = option.searchBreadcrumb.includes(word);
        const byPath = option.value?.toLowerCase().includes(word);
        const byAlias = option.searchAliases?.some((a:any) => a.includes(word));
        const byIndex = /^\d+$/.test(word) && option.searchIndex.includes(word);
        return byLabel || byBreadcrumb || byPath || byAlias || byIndex;
      }),
    )
    .slice(0, 10);
}
