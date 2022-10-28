export type Option<T> = {
  label: string;
  value: T;
};

export function createNumberOptions(length: number, option: { start?: number; suffix?: string } = {}) {
  const { start = 1, suffix = '' } = option;
  return Array.from<any, Option<number>>({ length }, (_, index) => {
    const value = index + start;
    return { label: value + suffix, value };
  });
}

export function createOptions<T>(dict: Record<string, T> | Array<T>) {
  return Object.entries(dict).map<Option<T>>(([label, value]) => ({ label, value }));
}

export function createEnums<T extends string | number>(values: T[]) {
  return values.reduce((enums, value) => {
    enums[value] = value;
    return enums;
  }, {} as { [K in T]: K });
}

export function createOptionEnums<T extends string | number>(dict: Record<string, T>) {
  const options = createOptions(dict);
  const enums = createEnums(Object.values(dict));
  return [options, enums] as const;
}
