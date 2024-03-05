declare interface Function {
   debounce: (wait: number) => this;
}

Function.prototype.debounce = function (wait) {
   let timeout: number | null,
      debouncedFunc = this;
   return function (this: any) {
      let context = this;
      function later(args: any) {
         timeout = null;
         debouncedFunc.apply(context, args);
      };
      if (timeout)
         clearTimeout(timeout);
      timeout = setTimeout(later, wait, arguments) as unknown as number;
   };
};