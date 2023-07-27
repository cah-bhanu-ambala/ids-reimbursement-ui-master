import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHideShowPass]'
})
export class HideShowPassDirective {

  private show = false;

  constructor(private elRef: ElementRef) {
    this.appendSpan();
  }

  private appendSpan(): void {
    const parentNode: Node = this.elRef.nativeElement.parentNode;
    const spanElement = document.createElement('span');

    spanElement.classList.add('material-icons', 'eye');
    spanElement.innerText = 'visibility';
    spanElement.onclick = e => {
      this.toggle(spanElement);
    };

    parentNode.appendChild(spanElement);
    parentNode.childNodes.forEach((child: HTMLElement) => {
      if (child.nodeName === 'INPUT') {
        child.style.paddingRight = '36px';
      }
    })
  }

  private toggle(span: HTMLElement): void {
    this.show = !this.show;

    if (this.show) {
      this.elRef.nativeElement.setAttribute('type', 'text');
      span.innerText = 'visibility_off';
    } else {
      this.elRef.nativeElement.setAttribute('type', 'password');
      span.innerText = 'visibility'
    }
  }

}
