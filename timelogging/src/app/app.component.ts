import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  key = "log"

  title = 'timelogging'
  task: string
  timeFormatted: string
  tasks: string[]

  ngOnInit(): void {
    this.tasks = this.getLogFromLocalStorage().tasks
  }

  submit() {
    if (!this.task || !this.timeFormatted) return
    let minutes = this.getMinutes(this.timeFormatted)
    console.log(this.task)
    console.log(this.timeFormatted)
    console.log(minutes)
    this.addOrUpdateLocalStorage({ task: this.task, time: minutes })
    this.task = null
    this.timeFormatted = null
  }

  newTask() {
    const task = prompt("add task")
    if (!task) return
    if (task === " ") {
      throw new Error("invalid task name")
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
    localStorage.clear()
    this.tasks = []
    this.task = null
    this.timeFormatted = null
  }

  getMinutes(timeFormatted: string) {
    let split = timeFormatted.split(":")
    let temp = split.length >= 2 ? +split[0] * 60 + +split[1] : +split[0]
    if (isNaN(temp)) {
      throw new Error("error converting time string to minutes")
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