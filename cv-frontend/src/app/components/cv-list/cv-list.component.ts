import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CvService, CV } from '../../services/cv.service';
import { CvFormComponent } from '../cv-form/cv-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cv-list',
  standalone: true,
  templateUrl: './cv-list.component.html',
  styleUrl: './cv-list.component.css'
})
export class CvListComponent implements OnInit {
  cvs: CV[] = [];
  private cvService = inject(CvService);
  private router = inject(Router);

  private dialog = inject(MatDialog);

  ngOnInit() {
    this.fetchCVs();
  }

  
  openAddCvDialog(cv?: CV) {
    console.log("edit", cv);
    
    const dialogRef = this.dialog.open(CvFormComponent, {
      width: '500px',
      height: '60%',
      data: cv || {}, // Ensure data is always an object, avoid null
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New CV Added or Updated:', result);
        this.fetchCVs();
      }
    });
  }
  
  editCV(cv: CV) { // Pass the full CV object    
    this.openAddCvDialog(cv); // Open dialog in edit mode
  }

  fetchCVs() {
    this.cvService.getAllCVs().subscribe((data) => (this.cvs = data));
  }


  

  deleteCV(id: number) {
    this.cvService.deleteCV(id).subscribe(() => this.fetchCVs());
  }

  generatePDF(id: number) {
    this.cvService.generatePDF(id);
  }
}
