import { Component, OnInit } from '@angular/core'
import { AuthService } from './auth/auth.service';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService // not in the course!!
  ) { }

  ngOnInit() {
    this.authService.autoLogin()
    this.dataStorageService.fetchRecipes().subscribe() // not in the couse!!
  }
}
