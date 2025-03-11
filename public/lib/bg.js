async function run() {
    // Polyfill za requestAnimationFrame
    if (window.requestAnimationFrame === undefined) {
        window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    }

    // Polyfill za: https://drafts.css-houdini.org/css-paint-api/
    await import("./polyfill/houdini.js");

    // Inject a tiny tranpiler to make IE11+ behave nicely:
    try {
        eval('class F {}');
    }
    catch(e) {
        await import("./polyfill/transpilerLite.js");
        CSS.paintWorklet.transpile = window.transpilerLite;
    }
    
    function loadModule(name) {
        var p = CSS.paintWorklet.addModule(
          `/multimedijski-sustavi/lib/${name}.js`
        );
        if (p) {
            p
            .then(() => console.info(`Houdini '${name}' registered.`))
            .catch((err) => {
                console.error(`Houdini '${name}' errored!`, err)
            });
        } else {
        }
    }
    
    // TODO: Firefox ne podržava CSS Typed OM: https://bugzilla.mozilla.org/show_bug.cgi?id=1278697
    // Props su stringovi do tada.
    loadModule("grid");
    loadModule("bevel");
}

run();

// https://bugzilla.mozilla.org/show_bug.cgi?id=1877751
// Promjena DOMa kako bi Firefox nacrtao pozadine
setTimeout(() => {
    let manuallyInvalidate = document.querySelectorAll(".bevel-bg");
    for (const el of manuallyInvalidate) {
        el.setAttribute("style", "");
    }
}, 100);