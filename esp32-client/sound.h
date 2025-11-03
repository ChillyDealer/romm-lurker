#define SOUND_SENSOR_PIN 34
#define SOUND_THRESHOLD 1000

const int numReadings = 10;
int readings[numReadings];
int readIndex = 0;
int total = 0;
int average = 0;

unsigned long lastTriggerTime = 0;
const unsigned long triggerCooldown = 1000;

void initSound() {
  pinMode(SOUND_SENSOR_PIN, INPUT);
  
  for (int i = 0; i < numReadings; i++) {
    readings[i] = 0;
  }
}

bool readSound() {
  int rawSoundValue = analogRead(SOUND_SENSOR_PIN);
  Serial.println(rawSoundValue);
  
  total = total - readings[readIndex];
  readings[readIndex] = rawSoundValue;
  total = total + readings[readIndex];
  readIndex = (readIndex + 1) % numReadings;
  average = total / numReadings;

  if (rawSoundValue > SOUND_THRESHOLD) {
    unsigned long currentTime = millis();
    
    if (currentTime - lastTriggerTime > triggerCooldown) {
      // Gør noget her
      lastTriggerTime = currentTime;

      return true;
    }
  }

  return false;
}