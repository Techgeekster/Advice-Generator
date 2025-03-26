import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adviceIndex',
})
export class AdviceIndexPipe implements PipeTransform {
  transform(selectedIndex: number, total: number): string {
    if (total > 1) {
      return `${selectedIndex + 1} / ${total}`;
    }
    return '';
  }
}
