import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

export class SideColIcons {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral(
      'devices',
      sanitizer.bypassSecurityTrustHtml(devices)
    );
  }
}

export const devices = `<svg width="19" height="10" viewBox="0 0 19 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3567 5.83333H7.86234V7.5H11.3567V5.83333Z" fill="#004FC4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.11515 5.83333C7.08009 5.83333 7.86234 5.08714 7.86234 4.16667C7.86234 3.24619 7.08009 2.5 6.11515 2.5C5.15021 2.5 4.36796 3.24619 4.36796 4.16667C4.36796 5.08714 5.15021 5.83333 6.11515 5.83333ZM6.11515 4.58333C6.35639 4.58333 6.55195 4.39678 6.55195 4.16667C6.55195 3.93655 6.35639 3.75 6.11515 3.75C5.87391 3.75 5.67835 3.93655 5.67835 4.16667C5.67835 4.39678 5.87391 4.58333 6.11515 4.58333Z" fill="#004FC4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.8511 4.16667C14.8511 5.08714 14.0688 5.83333 13.1039 5.83333C12.1389 5.83333 11.3567 5.08714 11.3567 4.16667C11.3567 3.24619 12.1389 2.5 13.1039 2.5C14.0688 2.5 14.8511 3.24619 14.8511 4.16667ZM13.5407 4.16667C13.5407 4.39678 13.3451 4.58333 13.1039 4.58333C12.8627 4.58333 12.6671 4.39678 12.6671 4.16667C12.6671 3.93655 12.8627 3.75 13.1039 3.75C13.3451 3.75 13.5407 3.93655 13.5407 4.16667Z" fill="#004FC4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.41826 7.22188C2.27588 8.86842 4.05698 10 6.11515 10H13.1039C15.2355 10 17.0699 8.78624 17.889 7.04372C18.5611 6.59111 19 5.84445 19 5C19 4.15555 18.5611 3.40889 17.889 2.95628C17.0699 1.21376 15.2355 0 13.1039 0H6.11515C4.05698 0 2.27588 1.13158 1.41826 2.77812C0.575801 3.19386 0 4.03278 0 5C0 5.96722 0.575801 6.80614 1.41826 7.22188ZM6.11515 1.66667H13.1039C14.3125 1.66667 15.3777 2.25195 16.0052 3.14159C16.2465 3.7161 16.3792 4.34326 16.3792 5C16.3792 5.65674 16.2465 6.2839 16.0052 6.85841C15.3777 7.74805 14.3125 8.33333 13.1039 8.33333H6.11515C4.18526 8.33333 2.62078 6.84095 2.62078 5C2.62078 3.15905 4.18526 1.66667 6.11515 1.66667Z" fill="#004FC4"/>
</svg>`;
