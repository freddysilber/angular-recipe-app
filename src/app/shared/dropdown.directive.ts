import { Directive, HostListener, HostBinding } from '@angular/core'

@Directive({
	selector: '[appDropdown]'
})
export class DropdownDirective {
	// Bind to the open class on the element
	@HostBinding('class.show') isOpen = false
	// Toggle the open thing
	@HostListener('click') toggleOpen() {
		this.isOpen = !this.isOpen
	}
}