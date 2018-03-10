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
    return str.replace(/\w+/g,w => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function createGetterAndSetter(textPorperties)
{
    var properties = textPorperties.split('\r\n').filter(x => x.length > 2).map(x => x.replace(';', ''));

    var generatedCode = `
`;
    for (let p of properties) 
    {
        while (p.startsWith(" ")) p = p.substr(1);
        while (p.startsWith("\t")) p = p.substr(1);

        let words = p.split(" ").map(x => x.replace('\r\n', ''));
        let type, attribute, Attribute = "";
        let create = false;
        
        // if words == ["private", "String", "name"];
        if (words.length > 2)
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
\tpublic ${type} get${Attribute}()
\t{
\t\treturn this.${attribute};
\t}

\tpublic void ${type == "Boolean" || type == "bool" ? "is" : "set"}${Attribute}(${type} ${attribute})
\t{
\t\tthis.${attribute} = ${attribute};
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