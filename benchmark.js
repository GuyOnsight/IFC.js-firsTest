/*import { IFCLoader } from "web-ifc-three/IFCLoader";

const ifcLoader = new IFCLoader();
ifcLoader.load(
    "models/Omrix_R21_07032022_1.ifc",
    (ifcModel) => scene.add(ifcModel));

const modelID = ifcModel.modelID;
const id = ifcLoader.ifcManager.getExpressId(mesh, index);

await ifcLoader.IfcManager.useJSONData(true);*/
import * as fs from "fs";
import * as path from "path";

const BENCHMARK_FILES_DIR = "./models";

import * as NewWebIFC from '../dist/web-ifc-api-node';
import { ms } from '../dist/web-ifc-api-node';

import * as OldWebIFC from 'web-ifc/web-ifc-api-node';

let newIfcAPI = new NewWebIFC.IfcAPI();
let oldIfcAPI = new OldWebIFC.IfcAPI();

class FileResult
{
    filename;
    fileSize;
    numOfIfcEntities;
    numOfProdMeshes;
    numOfPolygons;
    timeTaken;
}

class BenchMarkResult
{
    results;
}

async function BenchmarkIfcFile(module, filename)
{
    let result = new FileResult();
    result.filename = filename;

    let data = fs.readFileSync(filename);

    let startTime = ms();

    let modelID = module.OpenModel("Omrix_R21_07032022_1.ifc", new Uint8Array(data));
    
    result.numOfIfcEntities =  newIfcAPI.IfcPropertySetTemplate(modelID, ApplicableEntity);
    result.numOfProdMeshes = newIfcAPI.getSubset(modelID);
    result.numOfPolygons = newIfcAPI.IfcPolyLoop(modelID, polygon);

    module.CloseModel(modelID);

    let endTime = ms();
    result.timeTaken = endTime - startTime;

    console.log(`Parsed model ${result.filename} in ${result.timeTaken}`);

    return result;
}

async function BenchmarkWebIFC(module, files)
{
    await module.Init();

    let result = new BenchMarkResult();
    result.results = new Map();

    for (let file in files)
    {
        let filename = files[file];
        result.results.set(filename, await BenchmarkIfcFile(module, filename));
    }

    return result;
}

function combine(oldResult, newResult)
{
    console.log("");
    console.log("");
    console.log("");
    console.log("*******************");
    oldResult.results.forEach((r) => {
        let filename = r.filename;
        let oldFileResult = oldResult.results.get(filename);
        let newFileResult = newResult.results.get(filename);

        console.log(`${filename}: ${oldFileResult.timeTaken}\t->\t${newFileResult.timeTaken}`);
    });
    console.log("*******************");
}

async function GetBenchmarkFiles()
{
    return fs.readdirSync(BENCHMARK_FILES_DIR).filter((f) => f.endsWith(".ifc")).map((f) => path.join(BENCHMARK_FILES_DIR, f)).slice(0, 8);
}

async function RunBenchmark()
{
    let files = await GetBenchmarkFiles();

    console.log(`Previous version...`);
    console.log(``);

    let oldResult = await BenchmarkWebIFC(oldIfcAPI, files);

    console.log(``);
    console.log(`New version...`);
    console.log(``);

    let newResult = await BenchmarkWebIFC(newIfcAPI, files);

    combine(oldResult, newResult);
}

RunBenchmark();