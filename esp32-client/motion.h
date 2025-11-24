#define MOTION_SENSOR_PIN 13

void initMotion() {
  pinMode(MOTION_SENSOR_PIN, INPUT);
}

bool readMotion() {
  return digitalRead(MOTION_SENSOR_PIN) == 1;
}