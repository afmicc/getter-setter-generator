import * as vscode from "vscode";
import { createGetterAndSetter as java } from "./languages/java";
import { createGetterAndSetter as typescript } from "./languages/typescript";

function activate(context: any) {
  let disposable = vscode.commands.registerCommand(
    "extension.generateGetterAndSetters",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const languageId = editor.document.languageId;

      if (text.length < 1) {
        vscode.window.showErrorMessage("No selected properties.");
        return;
      }

      try {
        const getterAndSetter = createGetterAndSetter(text, languageId);

        editor.edit((edit) =>
          editor.selections.forEach((selection) => {
            edit.insert(selection.end, getterAndSetter);
          })
        );

        // format getterAndSetter
        vscode.commands.executeCommand("editor.action.formatSelection");
      } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(
          "Something went wrong! Try that the properties are in this format: 'private String name;'"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

function createGetterAndSetter(
  textPorperties: string,
  languageId: string
): string {
  const properties = textPorperties
    .split(/\r?\n/)
    .filter((x) => x.length > 2)
    .map((x) => x.replace(";", "").replace(":", ""));

  console.log(languageId);
  switch (languageId) {
    case "java":
      return java(properties);
    case "typescript":
      return typescript(properties);
    default:
      throw "Language not supported...yet!";
  }
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

exports.deactivate = deactivate;
