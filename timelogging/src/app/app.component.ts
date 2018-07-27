import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  key = "log"

  title = 'timelogging'
  task = "none"
  timeFormatted: string
  tasks: string[]

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.tasks = this.getLogFromLocalStorage().tasks
  }

  ngModelChange(event) {
    if (event != "addNew") return
    this.newTask();
  }

  submit() {
    if (!this.task || this.task == "none" || !this.timeFormatted) {
      this.snackBar.open("please fill out all fields", "OK", { duration: 5000 })
      return
    }
    let minutes = this.getMinutes(this.timeFormatted)
    if (minutes < 0) {
      this.snackBar.open("error converting time string to minutes", "OK", { duration: 5000 })
      return
    }
    console.log(this.task)
    console.log(this.timeFormatted)
    console.log(minutes)
    this.addOrUpdateLocalStorage({ task: this.task, time: minutes })
    this.timeFormatted = null
  }

  debug() {
    // const snackRef = this.snackBar.open("message", "action", { duration: 10000 })
    this.snackBar.open("message", "OK", { duration: 5000 })
    // snackRef.onAction().subscribe(v => {
    //   console.log("action clicked")
    // })
  }


  newTask() {
    const task = prompt("add task")
    if (!task) return
    if (task === " ") {
      this.snackBar.open("invalid task name", "OK", { duration: 5000 })
    }
    const log = this.getLogFromLocalStorage()
    log.tasks.push(task)
    this.tasks = log.tasks
    this.task = task
    this.updateLocalStorage(log)
    console.log(log)
  }

  list() {
    const log = this.getLogFromLocalStorage()
    console.log(log)
  }

  addOrUpdateLocalStorage(newItem: LogItem) {
    const log = this.getLogFromLocalStorage()
    log.logItems.push(newItem)
    console.log(log)
    this.updateLocalStorage(log)
  }

  updateLocalStorage(log: Log) {
    localStorage.setItem(this.key, JSON.stringify(log))
  }

  getLogFromLocalStorage() {
    let logJson = localStorage.getItem(this.key)
    let log: Log = logJson ? JSON.parse(logJson) : { tasks: [], logItems: [] }
    return log
  }

  reset() {
    if (!confirm("Are you sure you want to delete all task information?")) return
    localStorage.clear()
    this.tasks = []
    this.task = "none"
    this.timeFormatted = null
  }

  getMinutes(timeFormatted: string) {
    let split = timeFormatted.split(":")
    let temp = split.length >= 2 ? +split[0] * 60 + +split[1] : +split[0]
    if (isNaN(temp)) {
      return -1
    }
    return temp
  }
}

export interface LogItem {
  task: string
  time: number
}

export interface Log {
  tasks: string[]
  logItems: LogItem[]
}