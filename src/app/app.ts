import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginCompents } from './Paginas/publicas/login-compents/login-compents';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pagina_api');
}
