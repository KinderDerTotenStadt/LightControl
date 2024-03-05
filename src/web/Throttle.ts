declare interface Function {
   throttle: (minimumDistance: number) => this;
}

Function.prototype.throttle = function(minimumDistance) {
   let timeout: number | null,
       lastCalled = 0,
       throttledFunction = this;

   function throttleCore(this: any) {
      let context = this;

      function callThrottledFunction(args: any) {
         lastCalled = Date.now();
         throttledFunction.apply(context, args);
      }
      // Wartezeit bis zum nächsten Aufruf bestimmen
      let timeToNextCall = minimumDistance - (Date.now() - lastCalled);
      // Egal was kommt, einen noch offenen alten Call löschen
      cancelTimer();
      // Aufruf direkt durchführen oder um offene Wartezeit verzögern
      if (timeToNextCall < 0) {
         callThrottledFunction(arguments);
      } else {
         timeout = setTimeout(callThrottledFunction, timeToNextCall, arguments) as unknown as number;
      }
   }
   function cancelTimer() {
      if (timeout) {
         clearTimeout(timeout);
         timeout = null;
      }
   }
   // Aufsperre aufheben und gepeicherte Rest-Aufrufe löschen
   throttleCore.reset = function() {
      cancelTimer();
      lastCalled = 0;
   }
   return throttleCore;
};
