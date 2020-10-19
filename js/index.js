const init = async () => {
  const version = document.getElementById("openfin-version");
  if (window.fin) {
    const runtimeVersion = await window.fin.System.getVersion();
    version.innerText = runtimeVersion;
  } else {
    version.innerText = "Not Applicable (you are running a browser)";
  }
};

const main = () => {
  window.fin.desktop.main(async (args) => {
    const win = fin.Window.getCurrentSync();
    // handles subsequent launches
    registerRunRequested();

    if (args.url) {
      const { url } = args.userAppConfigArgs;

      let win = await fin.Window.create({
        name: `openfin-template-window-${Date.now()}`,
        url,
        autoShow: true,
      });

      return await win.setAsForeground();
    }

    // if no args, it's a regular launch just show the window
    return await win.show();
  });
};

function registerRunRequested() {
  const app = window.fin.Application.getCurrentSync();
  if (app.listenerCount("run-requested") < 1) {
    app
      .addListener("run-requested", async (event) => {
        if (event.userAppConfigArgs.url) {
          const { url } = event.userAppConfigArgs;

          let win = await fin.Window.create({
            name: `openfin-template-window-${Date.now()}`,
            url,
            autoShow: true,
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
  main();
  await init();

  const urlInput = document.getElementById("url-param-input");
  const launchBtn = document.getElementById("launch-with-url");

  // launchBtn.addEventListener("click", (e) => {
  //   e.preventDefault();

  //   launchBtn.href = `${location.href}?$$url=${encodeURIComponent(
  //     urlInput.value
  //   )}`;
  //   urlInput.value = "";
  // });
});
