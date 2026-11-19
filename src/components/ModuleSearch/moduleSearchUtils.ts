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
  aliases?: string[]
  
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

type SubPage = { path: string; name: string; title: string };


export function appendSubPageOptions(
  options: ModuleSearchOption[],
  parentPathPrefix: string,
  subPages: SubPage[],
): ModuleSearchOption[] {
  const prefixNoSlash = parentPathPrefix.replace(/\/+$/, "");

  const parent = options.find(
    (o) => o.value === prefixNoSlash || o.value?.startsWith(parentPathPrefix),
  );
  const parentBreadcrumb = parent?.breadcrumb || "Reports";
  const parentKey = parent?.key || `static${prefixNoSlash.replace(/\//g, "-")}`;

  const subOptions: ModuleSearchOption[] = subPages
    .filter((page) => !options.some((o) => o.value === page.path))
    .map((page) => {
      const label = `${page.name} - ${page.title}`;
      const breadcrumb = `${parentBreadcrumb} > ${page.name}`;
      return {
        key: `${parentKey}-${page.name}`,
        value: page.path,
        label,
        breadcrumb,
        searchIndex: parent?.searchIndex ?? "",
        searchLabel: normalizeSearchToken(label),
        searchBreadcrumb: normalizeSearchToken(breadcrumb),
      };
    });

  return [...options, ...subOptions];
}

type StaticPage = { path: string; label: string; breadcrumb?: string; aliases?: string[] };

/** Adds frontend-only pages (not returned by the menu API) to the search options. */
export function appendStaticOptions(
  options: ModuleSearchOption[],
  pages: StaticPage[],
): ModuleSearchOption[] {
  const extra: ModuleSearchOption[] = pages
    .filter((page) => !options.some((o) => o.value === page.path))
    .map((page) => {
      const breadcrumb = page.breadcrumb ?? page.label;
      const aliases = page.aliases ?? [];
      return {
        key: `static-${page.path}`,
        value: page.path,
        label: page.label,
        breadcrumb,
        aliases,
        searchIndex: "",
        searchLabel: normalizeSearchToken(page.label),
        searchBreadcrumb: normalizeSearchToken(breadcrumb),
        searchAliases: aliases.map(normalizeSearchToken),
      };
    });

  return [...options, ...extra];
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
