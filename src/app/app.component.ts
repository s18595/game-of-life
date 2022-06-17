import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  configurationForm!: FormGroup;
  matrix: number[][] = [];
  steps = 0;
  start = false;

  makeAlive = new FormControl("3");
  keepAlive = new FormControl("2,3");

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initGenerateForm();

    setInterval(() => {
      if (this.start) {
        this.step();
      }
    }, 200);
  }

  generate(): void {
    this.steps = 0;
    this.matrix = [];
    const formValue = this.configurationForm.value;

    for (let i = 0; i < formValue.x; i++) {
      this.matrix.push(new Array(formValue.y).fill(0));
    }
  }

  step(): void {
    this.steps++;
    const newMatrix = [...this.matrix.map(x => [...x])];
    this.matrix.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const neighbours = [];
        const formValue = this.configurationForm.value;

        if (cellIndex == 0) {
          neighbours.push(this.matrix[rowIndex][formValue.y - 1]) // left
          neighbours.push(this.matrix[rowIndex][0]) // right
        } else {
          neighbours.push(this.matrix[rowIndex][cellIndex - 1]) // left
          neighbours.push(this.matrix[rowIndex][cellIndex + 1]) // right
        }

        if (rowIndex == 0) {
          neighbours.push(this.matrix[formValue.x - 1][cellIndex]) // top
          if (cellIndex == 0) {
            neighbours.push(this.matrix[formValue.x - 1][formValue.y - 1]); // top left
          } else {
            neighbours.push(this.matrix[formValue.x - 1][cellIndex - 1]); // top left
          }
          if (cellIndex == formValue.y - 1) { // top right corner
            neighbours.push(this.matrix[formValue.x - 1][0]); // top right
          } else {
            neighbours.push(this.matrix[formValue.x - 1][cellIndex + 1]); // top right

          }
        } else if (rowIndex == formValue.x - 1) {
          neighbours.push(this.matrix[0][cellIndex]); // bottom
          if (cellIndex == 0) {
            neighbours.push(this.matrix[0][formValue.y - 1]); // bottom left
          } else {
            neighbours.push(this.matrix[0][cellIndex - 1]); // bottom left
          }
          if (cellIndex == formValue.y - 1) { // bottom right corner
            neighbours.push(this.matrix[0][0]); // bottom right
          } else {
            neighbours.push(this.matrix[0][cellIndex + 1]); // bottom right

          }
        } else {
          neighbours.push(this.matrix[rowIndex + 1][cellIndex]); // bottom
          neighbours.push(this.matrix[rowIndex - 1][cellIndex]) // top
          if (cellIndex == 0) {
            neighbours.push(this.matrix[rowIndex - 1][formValue.y - 1]); // top left
            neighbours.push(this.matrix[rowIndex + 1][formValue.y - 1]); // bottom left
          } else {
            neighbours.push(this.matrix[rowIndex - 1][cellIndex - 1]); // top left
            neighbours.push(this.matrix[rowIndex + 1][cellIndex - 1]); // bottom left
          }
          if (cellIndex == formValue.y - 1) { // right column
            neighbours.push(this.matrix[rowIndex - 1][0]); // top right
            neighbours.push(this.matrix[rowIndex + 1][0]); // bottom right
          } else {
            neighbours.push(this.matrix[rowIndex - 1][cellIndex + 1]) // top right
            neighbours.push(this.matrix[rowIndex + 1][cellIndex + 1]) // top right
          }
        }

        const aliveNeighbours = neighbours.filter(v => v === 1).length;

        if (cell == 1) { // alive cell
          if (!this.keepAlive.value.split(',').map((x: string) => Number(x)).includes(aliveNeighbours)) {
            newMatrix[rowIndex][cellIndex] = 0;
          }
        } else { // dead cell
          if (this.makeAlive.value.split(',').map((x: string) => Number(x)).includes(aliveNeighbours)) {
            newMatrix[rowIndex][cellIndex] = 1;
          }
        }
      });
    });

    this.matrix = newMatrix;
  }

  private initGenerateForm(): void {
    this.configurationForm = this.fb.group({
      x: [ 30, Validators.required ],
      y: [ 30, Validators.required ],
    })
  }
}
