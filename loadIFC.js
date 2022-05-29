import { IFCLoader } from "web-ifc-three/IFCLoader";

// Sets up the IFC loading
const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("static/wasm/");

const input = document.getElementById("file-input");
input.addEventListener(
  "change",
  (changed) => {
    const file = changed.target.files[0];
    var ifcURL = URL.createObjectURL(file);
    ifcLoader.load(
          ifcURL,
          (ifcModel) => scene.add(ifcModel));
  },
  false
);