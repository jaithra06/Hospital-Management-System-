import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-profile.html',
  styleUrls: ['./doctor-profile.css']
})
export class DoctorProfileComponent implements OnInit {

  profileData: any = {};
  profileKeys: string[] = [];

  token: string | null = localStorage.getItem("token");
  role: string | null = localStorage.getItem("role");

  loading = true;
  errorMessage = "";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    if (!this.token || this.role !== "DOCTOR") {
      alert("Unauthorized Access");
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile() {

    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.token
    });

    this.http.get<any>(
      "https://localhost:7256/api/v1/profile/me",
      { headers }
    ).subscribe({
      next: (res) => {
        console.log("Doctor Profile Response:", res);
        console.log("Profile Keys:", Object.keys(res));

        this.profileData = res;
        this.profileKeys = Object.keys(res);

        this.loading = false;
      },
      error: (err) => {
        console.error("Profile Error:", err);
        this.errorMessage = "Failed to load profile data";
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
