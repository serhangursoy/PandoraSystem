import os
import json


configArr = []

def walklevel(some_dir, level=1):
    some_dir = some_dir.rstrip(os.path.sep)
    assert os.path.isdir(some_dir)
    num_sep = some_dir.count(os.path.sep)
    for root, dirs, files in os.walk(some_dir):
        yield root, dirs, files
        num_sep_this = root.count(os.path.sep)
        if num_sep + level <= num_sep_this:
            del dirs[:]

for root, subFolders,files in walklevel("./src/Games"):
    for folder in subFolders:
        if(os.path.isdir(root+"/"+folder)):
            for root2 , subFolders2, files2 in walklevel(root+"/"+folder):
               for file in files2:
                    if(file == "config.json"):
                        path = root2 + "/" + file
                        with open(path ,"r") as json_data:
                            d = json.load(json_data)
                            json_data.close()
                            configArr.append(d)





with open("./src/Games/games.js" , "w") as config_file:
    for i in range(0, len(configArr)):
        name = "comp" + str(i)
        config_file.write("import " + name + " from \"./" + configArr[i]["name"] +"/"+configArr[i]["entryClass"]+"\"")
        config_file.write("\n")
    config_file.write("import React from 'react'")
    config_file.write("\n")
    config_file.write("export const games =")
    config_file.write(json.dumps(configArr, indent=4))
    config_file.write(";")
    config_file.write("\n")
    config_file.close()


template = {'content': ""}

with open("./src/Games/InitializerTemplate", "r") as template_file:
    content = template_file.read()
    template['content'] = content


with open("./src/Games/Initializer.js", "w") as init_file:

    init_file.write("import React from \"react\";\n");
    init_file.write("import {games} from \"./games\";\n");
    init_file.write("import {Route} from \"react-router-dom\";\n");

    for i in range(0, len(configArr)):
        name = configArr[i]["name"]
        line = "import " + name + " from \"./" + configArr[i]["name"] +"/"+configArr[i]["entryClass"]+ "\";"
        init_file.write(line.rstrip('\r\n') + '\n')

    init_file.write("const g = {")
    for i in range(0, len(configArr)):
        init_file.write("\""+ configArr[i]["name"]+ "\": " + "" + configArr[i]["name"]  + ",")



    init_file.write("};\n")
    init_file.write("\n")
    init_file.write(template['content'])
    init_file.close()