import { Component, OnInit, NgZone, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Motion } from "@capacitor/motion";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "WiiMotionPlus"
  isSynchronizing = false
  isSynchronized = false
  syncProgress = 0
  syncInterval: any

  // Sensor data
  accelData = { x: 0, y: 0, z: 0 }
  gyroData = { x: 0, y: 0, z: 0 }

  constructor(@Inject(NgZone) private ngZone: NgZone) {}

  ngOnInit() {
    // No need to request permissions here
    // Permissions are handled at the platform level
  }

  startSync() {
    if (this.isSynchronizing) return

    this.isSynchronizing = true
    this.syncProgress = 0

    // Simulate 4 second loading
    this.syncInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.syncProgress += 25

        if (this.syncProgress >= 100) {
          clearInterval(this.syncInterval)
          this.completeSync()
        }
      })
    }, 1000)
  }

  completeSync() {
    this.isSynchronizing = false
    this.isSynchronized = true

    // Start listening to motion data
    this.startAccelerometer()
    this.startGyroscope()
  }

  async startAccelerometer() {
    try {
      // Listen for accelerometer changes
      await Motion.addListener("accel", (event) => {
        this.ngZone.run(() => {
          this.accelData = {
            x: Number.parseFloat(event.acceleration.x.toFixed(2)),
            y: Number.parseFloat(event.acceleration.y.toFixed(2)),
            z: Number.parseFloat(event.acceleration.z.toFixed(2)),
          }
        })
      })
    } catch (e) {
      console.error("Error starting accelerometer", e)
    }
  }

  async startGyroscope() {
    try {
      // Listen for gyroscope changes
      await Motion.addListener("orientation", (event) => {
        this.ngZone.run(() => {
          this.gyroData = {
            x: Number.parseFloat(event.alpha.toFixed(2)),
            y: Number.parseFloat(event.beta.toFixed(2)),
            z: Number.parseFloat(event.gamma.toFixed(2)),
          }
        })
      })
    } catch (e) {
      console.error("Error starting gyroscope", e)
    }
  }

  resetSync() {
    // Remove listeners when resetting
    Motion.removeAllListeners()
    this.isSynchronized = false
    this.accelData = { x: 0, y: 0, z: 0 }
    this.gyroData = { x: 0, y: 0, z: 0 }
  }
}

