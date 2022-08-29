import { toPascalCase } from "../helpers";

export const createGetterAndSetter = (properties: string[]): string => {
  let generatedCode = `
`;
  for (let p of properties) {
    while (p.startsWith(" ")) p = p.substr(1);
    while (p.startsWith("\t")) p = p.substr(1);

    let words = p.split(" ").map((x) => x.replace(/\r?\n/, ""));
    let type,
      attribute,
      Attribute = "";
    let create = false;

    // if words == ["private", "String", "name"];
    if (words.length > 2) {
      type = words[1];
      attribute = words[2];
      Attribute = toPascalCase(words[2]);

      create = true;
    }
    // if words == ["String", "name"];
    else if (words.length == 2) {
      type = words[0];
      attribute = words[1];
      Attribute = toPascalCase(words[1]);

      create = true;
    }
    // if words == ["name"];
    else if (words.length) {
      type = "Object";
      attribute = words[0];
      Attribute = toPascalCase(words[0]);

      create = true;
    }

    if (create) {
      let code = `
    \tpublic ${type} ${type?.startsWith("bool") ? "is" : "get"}${Attribute}() {
    \t\treturn this.${attribute};
    \t}
    
    \tpublic void set${Attribute}(${type} ${attribute}) {
    \t\tthis.${attribute} = ${attribute};
    \t}
    `;
      generatedCode += code;
    }
  }
  return generatedCode;
};
