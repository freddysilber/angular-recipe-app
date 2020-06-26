import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core'

@Directive({
	selector: '[appDropdown]',
	exportAs: 'appDropdown'
})
export class DropdownDirective {
	// Bind to the open class on the element
	@HostBinding('class.open') isOpen = false
	// ! this adds dropdown closing from outside the template (aka other directive placements??)
	// @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
	// 	this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
	// }
	// Toggle the open thing
	@HostListener('click') toggleOpen() {
		this.isOpen = !this.isOpen
	}

	constructor(private elRef: ElementRef) { }

}