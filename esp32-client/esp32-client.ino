#include <WiFi.h>
#include <WiFiUdp.h>
#include <coap-simple.h>
#include <esp_wpa2.h>
#include "sound.h"
#include "light.h"
#include "motion.h"
#include "coap-helper.h"

// Der kommer deprecated besked om wifi ved compile, bare ignorer
// Hvis EMQX svarer 400 error, prøv at comment packet.addOption(COAP_URI_HOST... i coap-simple.cpp i librariet under user/documents/arduino. Det kan også være mange andre ting.

const char* ssid = "ohhhhhh";
const char* password = "123burger";

IPAddress server(192, 168, 137, 154);
int port = 5683;

WiFiUDP udp;
Coap coap(udp);

int ticker = 0;
bool isEmpty = true;
bool gotSoundInInterval = false;
bool gotMotionInInterval = false;

void response_callback(CoapPacket& packet, IPAddress ip, int port) {
  Serial.println("[CoAP Response Received]");
  Serial.println("Msg ID:");
  Serial.println(packet.messageid);

  uint8_t codeClass = packet.code >> 5;
  uint8_t codeDetail = packet.code & 0x1F;

  Serial.println("Code class:");
  Serial.println(codeClass);
  Serial.println("Code detail:");
  Serial.println(codeDetail);
  Serial.println("");
}

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 started. Using CoAP-Simple library");

  WiFi.disconnect(true);
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".:");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  coap.response(response_callback);

  coap.start();

  initSound();
  initLight();
  initMotion();
}

void loop() {
  // Stuff to do every 10 ms ---------------------------

  coap.loop();

  if (readSound() > 0) gotSoundInInterval = true;
  if (readMotion()) gotMotionInInterval = true;

  delay(10);

  if (ticker < 1000) {
    ticker++;
    return;
  }

  // Stuff to do every 10 seconds ----------------------

  bool detected = gotSoundInInterval || gotMotionInInterval || readLight();
  char payload[64];

  if (detected && isEmpty) {  // If occupied
    snprintf(payload, sizeof(payload), "{\"isEmpty\": false}");
    sendValueCoap(coap, server, port, "rooms/Eksamenshus/emptyStatus", payload);
    Serial.println("Occupied, sending CoAP post.");
    isEmpty = false;
  } else if (!detected && !isEmpty) {  // If empty
    snprintf(payload, sizeof(payload), "{\"isEmpty\": true}");
    sendValueCoap(coap, server, port, "rooms/Eksamenshus/emptyStatus", payload);
    Serial.println("Empty, sending CoAP post.");
    isEmpty = true;
  }

  gotSoundInInterval = false;
  gotMotionInInterval = false;

  ticker = 0;
}