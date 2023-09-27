export const parseOptions = (
  optionsObject: Record<string, string> | string[],
) => {
  if (Array.isArray(optionsObject)) {
    return optionsObject.map((option) => ({
      title: option,
      value: option,
    }))
  }

  return Object.entries(optionsObject).map(([value, title]) => ({
    title,
    value,
  }))
}
