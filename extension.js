const vscode = require('vscode');

function activate(context) 
{

    let disposable = vscode.commands.registerCommand('extension.generateGetterAndSetters', function () 
    {
        var editor = vscode.window.activeTextEditor;
        if (!editor)
            return; // No open text editor

        var selection = editor.selection;
        var text = editor.document.getText(selection);

        if (text.length < 1)
        {
            vscode.window.showErrorMessage('No selected properties.');
            return;
        }

        try 
        {
            var getterAndSetter = createGetterAndSetter(text);

            editor.edit(
                edit => editor.selections.forEach(
                  selection => 
                  {
                    edit.insert(selection.end, getterAndSetter);
                  }
                )
              );

            // format getterAndSetter
            vscode.commands.executeCommand('editor.action.formatSelection');
        } 
        catch (error) 
        {
            console.log(error);
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "private String name;"');
        }
    });

    context.subscriptions.push(disposable);
}

function toPascalCase(str) 
{
    return str.replace(/\w+/g,w => w[0].toUpperCase() + w.slice(1));
}

function createGetterAndSetter(textPorperties)
{
    var properties = textPorperties.split(/\r?\n/).filter(x => x.length > 2).map(x => x.replace(';', ''));

    var generatedCode = `
`;
    for (let p of properties) 
    {
        while (p.startsWith(" ")) p = p.substr(1);
        while (p.startsWith("\t")) p = p.substr(1);

        let words = p.split(" ").map(x => x.replace(/\r?\n/, ''));
        let type, attribute, Attribute = "";
        let create = false;
        let isStatic = false;
        
        // if words == ["private", "static", "String", "name"]
        if (words.length > 3) {
            type = words[2]
            attribute = words[3]
            Attribute = toPascalCase(words[3])

            create = true
            if (words[1] == 'static') {
                isStatic = true;
            }
        }
        // if words == ["private", "String", "name"];
        else if (words.length > 2)
        {
            type = words[1];
            attribute = words[2];
            Attribute = toPascalCase(words[2]);

            create = true;
        }
        // if words == ["String", "name"];
        else if (words.length == 2)
        {
            type = words[0];
            attribute = words[1];
            Attribute = toPascalCase(words[1]);
            
            create = true;            
        }
        // if words == ["name"];
        else if (words.length)
        {
            type = "Object";
            attribute = words[0];
            Attribute = toPascalCase(words[0]);
            
            create = true;            
        }

        if (create)
        {

            let code = 
`
\tpublic ${isStatic ? 'static' : ''} ${type} ${type.startsWith('bool') ? 'is' : 'get'}${Attribute}() {
\t\treturn ${isStatic ? '' : 'this.'}${attribute};
\t}

\tpublic ${isStatic ? 'static' : ''} void set${Attribute}(${type} ${isStatic ? `new${Attribute}` : attribute}) {
\t\t${isStatic ? attribute : `this.${attribute}`} = ${isStatic ? `new${Attribute}` : attribute};
\t}
`;
            generatedCode += code;
        }
    }

    return generatedCode;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

exports.deactivate = deactivate;