export const toPascalCase = (str: string) => {
  return str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1));
};
