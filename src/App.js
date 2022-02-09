import {
  ArcRotateCamera,
  Vector3,
  SceneLoader,
  Color3,
  CubeTexture,
  SineEase,
  Animation,
  EasingFunction,
  HighlightLayer,
  ExecuteCodeAction,
  ActionManager,
} from "@babylonjs/core";
import SceneComponent from "./components/SceneComponent"; // uses above component in same directory
import "@babylonjs/loaders";
function App() {
  const Mystyle = { width: "100%", height: "100%" };

  const onSceneReady = (scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    var camera = new ArcRotateCamera(
      "Camera",

      new Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, true);
    var hdrTexture = CubeTexture.CreateFromPrefilteredData(
      "/assets/environmentSpecular.env",
      scene
    );

    scene.createDefaultSkybox(hdrTexture, true);

    SceneLoader.ImportMesh(
      "",
      "assets/",
      "206003.glb",
      scene,
      function (meshes) {
        scene.createDefaultCameraOrLight(true, true, true);

        var hl = new HighlightLayer("hl1", scene);
        var vitreMobile = scene.getMeshByName("Vitre mobile");
        vitreMobile.actionManager = new ActionManager(scene);
        //ON MOUSE ENTER
        vitreMobile.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function (
            ev
          ) {
            scene.hoverCursor = "pointer";
            hl.addMesh(vitreMobile, Color3.Teal());
          })
        );
        //ON MOUSE EXIT
        vitreMobile.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, function (
            ev
          ) {
            hl.removeMesh(vitreMobile);
          })
        );
        //ON MOUSE CLICK
        vitreMobile.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (ev) {
            var porteMobile = scene.getMeshByName("Porte Mobile");
            var theCurrentRotation = porteMobile.rotation;
            var theTargetRotation = theCurrentRotation.clone();
            theTargetRotation.y = -Math.PI / 2;
            var easeInOutSine = new SineEase();
            easeInOutSine.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
            Animation.CreateAndStartAnimation(
              "rot1",
              porteMobile,
              "rotation",
              10,
              30,
              theCurrentRotation,
              theTargetRotation,
              0,
              easeInOutSine,
              function () {
                alert("finished !");
              }
            );
          })
        );
      }
    );
  };

  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      id="my-canvas"
      style={Mystyle}
    />
  );
}

export default App;
