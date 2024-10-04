export function replaceBrWithNewLine(str:string) {
    return str.replace(/<br\s*\/?>/gi, '\n');
  }
   
  