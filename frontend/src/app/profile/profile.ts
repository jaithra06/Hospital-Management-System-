import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  profileData: any = {};
  token: string | null = localStorage.getItem("token");

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.token) {
      alert("Please login again");
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>(
      "https://localhost:7256/api/v1/profile/me",
      {
        headers: {
          Authorization: "Bearer " + this.token
        }
      }
    ).subscribe({
      next: (res) => {
        console.log("Profile Loaded:", res);
        this.profileData = res;
      },
      error: (err) => {
        console.error(err);
        alert("Failed to load profile");
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
