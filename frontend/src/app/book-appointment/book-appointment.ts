import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css']
})
export class BookAppointment implements OnInit {

  doctors: any[] = [];
  slots: string[] = [];

  doctorId = '';
  date = '';
  timeSlot = '';
  problem = '';

  message = '';
  token = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDoctors();
  }

  loadDoctors() {
    this.http.get<any[]>(
      'https://localhost:7256/api/v1/doctors',
      { headers: { Authorization: 'Bearer ' + this.token } }
    ).subscribe(res => this.doctors = res);
  }

  loadSlots() {
    if (!this.doctorId || !this.date) return;

    this.http.get<string[]>(
      `https://localhost:7256/api/v1/appointments/slots/${this.doctorId}?date=${this.date}`,
      { headers: { Authorization: 'Bearer ' + this.token } }
    ).subscribe(res => this.slots = res);
  }

  bookAppointment() {
    if (!this.doctorId || !this.date || !this.timeSlot || !this.problem) {
      alert('Please fill all fields');
      return;
    }

    const body = {
      doctorId: this.doctorId,
      appointmentDate: `${this.date}T${this.timeSlot}:00`,
      problemDescription: this.problem
    };

    this.http.post(
      'https://localhost:7256/api/v1/appointments/book',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        }
      }
    ).subscribe({
      next: () => {
        this.message = 'Appointment booked successfully. Await admin approval.';
        this.problem = '';
        this.timeSlot = '';
      },
      error: err => alert(err.error)
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
