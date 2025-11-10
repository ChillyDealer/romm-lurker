#include <WiFi.h>
#include <WiFiUdp.h>
#include <coap-simple.h>
#include <esp_wpa2.h>
#include "sound.h"

// Der kommer deprecated besked om wifi ved compile, bare ignorer
// Hvis EMQX svarer 400 error, prøv at comment packet.addOption(COAP_URI_HOST... i coap-simple.cpp i librariet under user/documents/arduino. Det kan også være mange andre ting.

const char* ssid = "ohhhhhh";
const char* password = "123burger";


IPAddress server(192, 168, 137, 154);
int port = 5683;

WiFiUDP udp;
Coap coap(udp);

void response_callback(CoapPacket& packet, IPAddress ip, int port) {
  Serial.println("[CoAP Response Received]");
  Serial.println("Msg ID:");
  Serial.println(packet.messageid);
  Serial.println("Code:");
  Serial.println(packet.code);
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
}

void loop() {
  coap.loop();

  int soundReading = readSound();
  if (soundReading > 0) {
    Serial.println("Sound detected, sending CoAP post.");

    char payload[20];
    itoa(soundReading, payload, 10);
    coap.send(
      server, port, "ps/sensor/sound?clientid=esp32",
      COAP_NONCON,
      COAP_POST,
      NULL, 0,
      (uint8_t*)payload, strlen(payload));
  }

  delay(10);
}