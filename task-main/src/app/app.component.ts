import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedFile: File | undefined;
  convertedScreenplay: any;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  convertAndDisplayScreenplay() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('https://stage.app.studiovity.com/ai/script/import', formData)
      .subscribe(response => {
        console.log("Conversion successful");
        // console.log(response);
        this.convertedScreenplay = response;
        // console.log(this.convertedScreenplay); // Assuming response is the converted screenplay
        this.downloadScreenplay();
      }, error => {
        console.error('Conversion failed:', error);
      });
  }

  downloadScreenplay() {
    if (!this.convertedScreenplay || !this.convertedScreenplay.title_page || !this.convertedScreenplay.content) {
      console.error('Invalid converted screenplay');
      return;
    }
    
    const formData = {
      title_page: this.convertedScreenplay.title_page,
      content: this.convertedScreenplay.content
    };
     console.log(formData);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('https://stage.app.studiovity.com/ai/script/export?type=fdx', formData, { responseType: 'blob' })
      .subscribe(blob => {
        console.log('Download successful');
        saveAs(blob, 'screenplay.fdx');
      }, error => {
        console.error('Download failed:', error);
      });
  }
}
