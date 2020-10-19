const init = async () => {
  const version = document.getElementById("openfin-version");
  if (window.fin) {
    const runtimeVersion = await window.fin.System.getVersion();
    version.innerText = runtimeVersion;
    main();
  } else {
    version.innerText = "Not Applicable (you are running a browser)";
  }
};

function main() {
  window.fin.desktop.main(async (args) => {
    const win = window.fin.Window.getCurrentSync();
    // handles subsequent launches
    registerRunRequested();
    if (args) {
      const { url } = args;

      let win = await window.fin.Window.create({
        name: `openfin-template-window-${Date.now()}`,
        url,
        autoShow: true
      });

      return await win.setAsForeground();
    }

    // if no args, it's a regular launch just show the window
    return await win.show();
  });
}

function registerRunRequested() {
  const app = window.fin.Application.getCurrentSync();
  if (app.listenerCount("run-requested") < 1) {
    app
      .addListener("run-requested", async (event) => {
        if (event.userAppConfigArgs.url) {
          const { url } = event.userAppConfigArgs;

          let win = await window.fin.Window.create({
            name: `openfin-template-window-${Date.now()}`,
            url,
            autoShow: true
          });

          return await win.setAsForeground();
        } else {
          return (await app.getWindow()).show();
        }
      })
      .then(() => console.log("run-requested listener registered"))
      .catch((err) => console.log("error registering listener:", err));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
});
