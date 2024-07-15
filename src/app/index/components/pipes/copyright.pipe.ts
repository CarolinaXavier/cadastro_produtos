import { Pipe, PipeTransform } from "@angular/core";

export type TCopyright = {
  since: number | null;
  description: string | null;
};

@Pipe({
  name: "copyright",
})
export class CopyrightPipe implements PipeTransform {
  transform(copyright: TCopyright, ...args: unknown[]): any {
    if (copyright) {
      let currentTime = new Date();
      let year = currentTime.getFullYear();
      if (!copyright.since) {
        return `© – ${copyright.description}`;
      } else if (copyright.since && copyright.description) {
        return copyright.since === year
          ? `© ${year} – ${copyright.description}`
          : `© ${copyright.since}-${year} – ${copyright.description}`;
      }
    }
  }
}
