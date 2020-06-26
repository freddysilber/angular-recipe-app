import { Directive, HostListener, HostBinding } from '@angular/core'

@Directive({
	selector: '[appDropdown]',
	exportAs: 'appDropdown'
})
export class DropdownDirective {
	// Bind to the open class on the element
	@HostBinding('class.open') isOpen = false
	// Toggle the open thing
	@HostListener('click') toggleOpen() {
		this.isOpen = !this.isOpen
	}
}