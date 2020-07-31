// META: global=dedicatedworker,sharedworker
setup({ allow_uncaught_exception:true });

const t0 = async_test("WorkerGlobalScope error event: error");
const t1 = async_test("WorkerGlobalScope error event: message");
const t2 = async_test("WorkerGlobalScope error event: filename");
const t3 = async_test("WorkerGlobalScope error event: lineno");

self.addEventListener("error", e => {
    t0.step_func_done(() => {
      assert_true(e.error instanceof DOMException, "DOMException",
          "e.error should be a DOMException");
      assert_equals(e.error.name, "NetworkError");
    })();

    t1.step_func_done(() => {
      assert_not_equals(e.message, "Script error.",
          "e.message should not be muted to 'Script error.'");
    })();

    // filename, lineno etc. should NOT point to the location within
    // `syntax-error.js` (otherwise parse errors to be muted are
    // leaked to JavaScript).
    // we expect they point to the caller of `importScripts()`,
    // while this is not explicitly stated in the spec.
    t2.step_func_done(() => {
      assert_equals(e.filename, self.location.origin +
          '/workers/interfaces/WorkerUtils/importScripts/report-error-cross-origin.sub.any.js');
    })();
    t3.step_func_done(() => {
      assert_equals(e.lineno, 39);
    })();

    // Because importScripts() throws, we call done() here.
    done();
  });

const crossOrigin = "https://{{hosts[alt][]}}:{{ports[https][0]}}";
importScripts(crossOrigin + "/workers/modules/resources/syntax-error.js");
