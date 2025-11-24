#define LIGHT_SENSOR_PIN 32
#define LIGHT_THRESHOLD 1500

void initLight() {
  pinMode(LIGHT_SENSOR_PIN, INPUT);
}

int readLight() {
  int lightValue = analogRead(LIGHT_SENSOR_PIN);

  if (lightValue > LIGHT_THRESHOLD) {
    return lightValue;
  }

  return 0;
}