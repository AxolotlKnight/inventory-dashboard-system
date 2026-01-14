import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


declare global {
  interface Window {
    electronAPI: any;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pos-electron');
  minimize() {
    window.electronAPI.minimize();
  }

  maximizeRestore() {
    window.electronAPI.maximizeRestore();
  }

  close() {
    window.electronAPI.close();
  }
}
