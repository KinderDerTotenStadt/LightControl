declare interface Function {
   throttle: <T extends Array<any>>(this: (data: Array<T>) => any ,minimumDistance: number) => ((...args: T) => any);
}

Function.prototype.throttle = function(minimumDistance) {
   let timeout: number | null,
       lastCalled = 0,
       throttledFunction = this,
       argumentStack: Array<any> = [];

   function throttleCore(this: any) {
      let context = this;
      argumentStack.push(arguments);
      function callThrottledFunction() {
         lastCalled = Date.now();
         throttledFunction.apply(context, [argumentStack]);
         argumentStack = [];
      }
      // Wartezeit bis zum nächsten Aufruf bestimmen
      let timeToNextCall = minimumDistance - (Date.now() - lastCalled);
      // Egal was kommt, einen noch offenen alten Call löschen
      cancelTimer();
      // Aufruf direkt durchführen oder um offene Wartezeit verzögern
      if (timeToNextCall < 0) {
         callThrottledFunction();
      } else {
         timeout = setTimeout(callThrottledFunction, timeToNextCall) as unknown as number;
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
